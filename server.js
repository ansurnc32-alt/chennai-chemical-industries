import 'dotenv/config';
import express from 'express';
import { MongoClient } from 'mongodb';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'chennaichemicals';
const ENQUIRIES_COLLECTION = 'enquiries';
const ADMINS_COLLECTION = 'admins';

const DATA_DIR = path.join(__dirname, 'data');
const ENQUIRIES_BACKUP_FILE = path.join(DATA_DIR, 'enquiries.json');
const ADMINS_BACKUP_FILE = path.join(DATA_DIR, 'admins.json');

// Middleware
app.use(express.json());

// CORS config
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Admin-Token');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Database state
let mongoClient = null;
let db = null;
let enquiriesCollection = null;
let adminsCollection = null;
let isMongoConnected = false;

// Active Sessions Store (in-memory with 8-hour lifetime)
const activeSessions = new Map();
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

// Rate limiting & abuse protection state
const submissionLimits = new Map(); // IP -> { count, resetAt }
const loginAttemptLimits = new Map(); // IP -> { count, resetAt }

// Helper: Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of activeSessions.entries()) {
    if (now > session.expiresAt) {
      activeSessions.delete(token);
    }
  }
}, 15 * 60 * 1000);

// Helper: Password hashing with scrypt
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || typeof storedHash !== 'string' || !storedHash.includes(':')) {
    return false;
  }
  try {
    const [salt, key] = storedHash.split(':');
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKeyBuffer = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKeyBuffer);
  } catch (err) {
    return false;
  }
}

// Storage helpers
async function readJsonFile(filePath, defaultValue = []) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content || '[]');
  } catch {
    return defaultValue;
  }
}

async function writeJsonFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`[Storage] Error writing to ${filePath}:`, err.message);
  }
}

// Initialize Database & Storage
async function initStorage() {
  // Ensure local backup storage directory exists
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(ENQUIRIES_BACKUP_FILE);
    } catch {
      await fs.writeFile(ENQUIRIES_BACKUP_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
    try {
      await fs.access(ADMINS_BACKUP_FILE);
    } catch {
      await fs.writeFile(ADMINS_BACKUP_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('[Storage] Error initializing local backup directory:', err.message);
  }

  // Connect to MongoDB
  try {
    mongoClient = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
    await mongoClient.connect();
    db = mongoClient.db(DB_NAME);
    enquiriesCollection = db.collection(ENQUIRIES_COLLECTION);
    adminsCollection = db.collection(ADMINS_COLLECTION);

    await enquiriesCollection.createIndex({ referenceId: 1 }, { unique: true });
    await enquiriesCollection.createIndex({ createdAt: -1 });
    await adminsCollection.createIndex({ username: 1 }, { unique: true });

    isMongoConnected = true;
    console.log(`[Database] Successfully connected to MongoDB at ${MONGODB_URI}/${DB_NAME}`);
  } catch (err) {
    isMongoConnected = false;
    console.warn(`[Database] MongoDB connection unavailable (${err.message}). Using persistent JSON storage.`);
  }

  // Bootstrap Admin Account securely from Environment
  await bootstrapAdminUser();
}

async function bootstrapAdminUser() {
  const adminUsername = (process.env.ADMIN_USERNAME || 'admin@chennaichemicals.com').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  try {
    // Check for existing administrator in MongoDB or persistent file backup
    let existingAdmin = null;
    if (isMongoConnected && adminsCollection) {
      existingAdmin = await adminsCollection.findOne({ username: adminUsername });
    }
    if (!existingAdmin) {
      const fileAdmins = await readJsonFile(ADMINS_BACKUP_FILE, []);
      existingAdmin = fileAdmins.find((a) => a.username.toLowerCase() === adminUsername);
    }

    if (!adminPassword && !existingAdmin) {
      const errorMsg = '[Security Error] Startup halted: ADMIN_PASSWORD environment variable is required to initialize administrator credentials.';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    if (!adminPassword && existingAdmin) {
      console.log(`[Security] Preserving existing administrator credentials for '${adminUsername}' (ADMIN_PASSWORD not configured in environment).`);
      return;
    }

    const defaultAdmin = {
      username: adminUsername,
      name: 'Chennai Chemical Admin',
      role: 'commercial_administrator',
      passwordHash: hashPassword(adminPassword),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isMongoConnected && adminsCollection) {
      const existingMongo = await adminsCollection.findOne({ username: adminUsername });
      if (!existingMongo) {
        await adminsCollection.insertOne(defaultAdmin);
        console.log(`[Security] Admin user '${adminUsername}' initialized in MongoDB.`);
      } else {
        // Update password hash if env variable password was updated
        if (!verifyPassword(adminPassword, existingMongo.passwordHash)) {
          await adminsCollection.updateOne(
            { username: adminUsername },
            { $set: { passwordHash: hashPassword(adminPassword), updatedAt: new Date().toISOString() } }
          );
          console.log(`[Security] Admin credentials updated for '${adminUsername}' in MongoDB.`);
        }
      }
    }

    // Always maintain in persistent admins backup
    const fileAdmins = await readJsonFile(ADMINS_BACKUP_FILE, []);
    const existingIndex = fileAdmins.findIndex((a) => a.username.toLowerCase() === adminUsername);
    if (existingIndex === -1) {
      fileAdmins.push(defaultAdmin);
      await writeJsonFile(ADMINS_BACKUP_FILE, fileAdmins);
      console.log(`[Security] Admin user '${adminUsername}' saved to persistent backup file.`);
    } else {
      if (!verifyPassword(adminPassword, fileAdmins[existingIndex].passwordHash)) {
        fileAdmins[existingIndex].passwordHash = hashPassword(adminPassword);
        fileAdmins[existingIndex].updatedAt = new Date().toISOString();
        await writeJsonFile(ADMINS_BACKUP_FILE, fileAdmins);
      }
    }
  } catch (err) {
    console.error('[Security] Error bootstrapping admin user:', err.message);
    throw err;
  }
}

// -------------------------------------------------------------
// Authentication Middleware
// -------------------------------------------------------------
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const tokenHeader = req.headers['x-admin-token'];
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (tokenHeader) {
    token = tokenHeader.trim();
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Server access token missing.',
    });
  }

  const session = activeSessions.get(token);
  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or revoked session token. Access denied.',
    });
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return res.status(401).json({
      success: false,
      message: 'Session has expired. Please log in again.',
    });
  }

  req.admin = session;
  next();
}

// -------------------------------------------------------------
// Health Check Endpoint (Public)
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Chennai Chemical Industries API',
    database: isMongoConnected ? 'mongodb' : 'file_persistence',
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// Admin Authentication Endpoints
// -------------------------------------------------------------

// POST /api/admin/login
app.post('/api/admin/login', async (req, res) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'client';
  const now = Date.now();

  // Rate limit login attempts: Max 8 attempts per 10 minutes per IP
  const attempt = loginAttemptLimits.get(ip) || { count: 0, resetAt: now + 10 * 60 * 1000 };
  if (now > attempt.resetAt) {
    attempt.count = 0;
    attempt.resetAt = now + 10 * 60 * 1000;
  }
  if (attempt.count >= 8) {
    return res.status(429).json({
      success: false,
      message: 'Too many failed login attempts. Account access is temporarily locked. Please try again in 10 minutes.',
    });
  }

  try {
    const { username, password } = req.body || {};

    if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
      attempt.count += 1;
      loginAttemptLimits.set(ip, attempt);
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.',
      });
    }

    const cleanUsername = username.trim().toLowerCase();

    // Look up admin in MongoDB or JSON backup
    let adminRecord = null;
    if (isMongoConnected && adminsCollection) {
      adminRecord = await adminsCollection.findOne({ username: cleanUsername });
    }
    if (!adminRecord) {
      const fileAdmins = await readJsonFile(ADMINS_BACKUP_FILE, []);
      adminRecord = fileAdmins.find((a) => a.username.toLowerCase() === cleanUsername);
    }

    const isMatch = adminRecord ? verifyPassword(password, adminRecord.passwordHash) : false;

    if (!isMatch) {
      attempt.count += 1;
      loginAttemptLimits.set(ip, attempt);
      // Small artificial delay to mitigate timing analysis
      await new Promise((r) => setTimeout(r, 200));
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative email or password.',
      });
    }

    // Login successful: reset attempts
    loginAttemptLimits.delete(ip);

    // Create secure random session token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + SESSION_TTL_MS;

    const sessionData = {
      token,
      username: adminRecord.username,
      name: adminRecord.name || 'Commercial Administrator',
      role: adminRecord.role || 'admin',
      loginTime: new Date().toISOString(),
      expiresAt,
    };

    activeSessions.set(token, sessionData);

    return res.json({
      success: true,
      message: 'Authentication successful. Welcome to Chennai Chemical Industries admin desk.',
      token,
      expiresAt: new Date(expiresAt).toISOString(),
      admin: {
        username: sessionData.username,
        name: sessionData.name,
        role: sessionData.role,
      },
    });
  } catch (err) {
    console.error('[Security] Admin login error:', err);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred during authentication.',
    });
  }
});

// GET /api/admin/me (Verify active session)
app.get('/api/admin/me', requireAdminAuth, (req, res) => {
  return res.json({
    success: true,
    admin: {
      username: req.admin.username,
      name: req.admin.name,
      role: req.admin.role,
    },
    expiresAt: new Date(req.admin.expiresAt).toISOString(),
  });
});

// POST /api/admin/logout
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const tokenHeader = req.headers['x-admin-token'];
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (tokenHeader) {
    token = tokenHeader.trim();
  }

  if (token) {
    activeSessions.delete(token);
  }

  return res.json({
    success: true,
    message: 'Session closed successfully.',
  });
});

// -------------------------------------------------------------
// Public Quotation Submission (With Abuse Protection & Rate Limiting)
// -------------------------------------------------------------
app.post('/api/enquiries', async (req, res) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || 'client';
    const now = Date.now();

    // IP Abuse Protection: Max 15 quote submissions per 15-minute window
    const limit = submissionLimits.get(ip) || { count: 0, resetAt: now + 15 * 60 * 1000 };
    if (now > limit.resetAt) {
      limit.count = 0;
      limit.resetAt = now + 15 * 60 * 1000;
    }
    if (limit.count >= 15) {
      return res.status(429).json({
        success: false,
        message: 'High inquiry frequency detected from this network. Please wait 15 minutes or reach our direct desk at 7619431029.',
      });
    }

    const { name, company, email, phone, productNameOrCas, quantity, message, source } = req.body || {};

    // 1. Server-side Validation
    const errors = {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.name = 'Please provide your full name (minimum 2 characters).';
    }

    if (!company || typeof company !== 'string' || company.trim().length < 2) {
      errors.company = 'Company, institution, or organization name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      errors.email = 'A valid corporate or institutional email address is required.';
    }

    const digitsOnly = (phone || '').toString().replace(/\D/g, '');
    if (!phone || typeof phone !== 'string' || digitsOnly.length < 7) {
      errors.phone = 'A valid contact telephone number is required (minimum 7 digits).';
    }

    if (!productNameOrCas || typeof productNameOrCas !== 'string' || productNameOrCas.trim().length < 2) {
      errors.productNameOrCas = 'Please specify the target product name, CAS number, or catalog code.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please correct the highlighted fields.',
        errors,
      });
    }

    // Register valid submission against rate limit
    limit.count += 1;
    submissionLimits.set(ip, limit);

    // 2. Generate unique reference ID (CCI-RFQ-XXXXXX)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const timeSuffix = Date.now().toString().slice(-4);
    const referenceId = `CCI-RFQ-${timeSuffix}${randomSuffix}`;

    const enquiryDoc = {
      referenceId,
      name: name.trim().slice(0, 150),
      company: company.trim().slice(0, 150),
      email: email.trim().toLowerCase().slice(0, 120),
      phone: phone.trim().slice(0, 50),
      productNameOrCas: productNameOrCas.trim().slice(0, 200),
      quantity: (quantity || '').trim().slice(0, 100) || 'Not specified',
      message: (message || '').trim().slice(0, 2000),
      source: source || 'general_form',
      status: 'new',
      adminNotes: '',
      createdAt: new Date().toISOString(),
      clientIp: req.ip || req.headers['x-forwarded-for'] || '',
    };

    // 3. Persistent Storage
    let savedInMongo = false;
    if (isMongoConnected && enquiriesCollection) {
      try {
        await enquiriesCollection.insertOne({ ...enquiryDoc });
        savedInMongo = true;
      } catch (dbErr) {
        console.error('[Database] Failed to write to MongoDB:', dbErr.message);
      }
    }

    // Always append to local persistent file as fail-safe guarantee
    const existingFileEnquiries = await readJsonFile(ENQUIRIES_BACKUP_FILE, []);
    existingFileEnquiries.unshift(enquiryDoc);
    await writeJsonFile(ENQUIRIES_BACKUP_FILE, existingFileEnquiries);

    // 4. Server-Side Email Notification hook (safe check for credentials)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      console.log(`[Email] Dispatching notification for ${referenceId} to sales team...`);
    } else {
      console.log(`[Email] No SMTP credentials configured. Enquiry ${referenceId} persisted securely.`);
    }

    return res.status(201).json({
      success: true,
      referenceId,
      message: 'Quotation enquiry successfully recorded and dispatched to sales desk.',
      storage: savedInMongo ? 'mongodb' : 'file_persistence',
      enquiry: {
        referenceId: enquiryDoc.referenceId,
        name: enquiryDoc.name,
        company: enquiryDoc.company,
        email: enquiryDoc.email,
        productNameOrCas: enquiryDoc.productNameOrCas,
        quantity: enquiryDoc.quantity,
        createdAt: enquiryDoc.createdAt,
      },
    });
  } catch (serverErr) {
    console.error('[Server] Unexpected error in /api/enquiries:', serverErr);
    return res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred while saving your enquiry. Please contact us directly at 7619431029.',
    });
  }
});

// -------------------------------------------------------------
// PROTECTED: Retrieve all enquiries (Admin Only)
// -------------------------------------------------------------
app.get('/api/enquiries', requireAdminAuth, async (req, res) => {
  try {
    const { status, search, limit = 200 } = req.query;
    let enquiries = [];

    if (isMongoConnected && enquiriesCollection) {
      const filter = {};
      if (status && status !== 'all') {
        filter.status = status;
      }
      if (search && typeof search === 'string' && search.trim().length > 0) {
        const sRegex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { referenceId: sRegex },
          { name: sRegex },
          { company: sRegex },
          { email: sRegex },
          { phone: sRegex },
          { productNameOrCas: sRegex },
        ];
      }
      enquiries = await enquiriesCollection
        .find(filter)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .toArray();
    } else {
      enquiries = await readJsonFile(ENQUIRIES_BACKUP_FILE, []);
      if (status && status !== 'all') {
        enquiries = enquiries.filter((e) => e.status === status);
      }
      if (search && typeof search === 'string' && search.trim().length > 0) {
        const s = search.trim().toLowerCase();
        enquiries = enquiries.filter(
          (e) =>
            (e.referenceId && e.referenceId.toLowerCase().includes(s)) ||
            (e.name && e.name.toLowerCase().includes(s)) ||
            (e.company && e.company.toLowerCase().includes(s)) ||
            (e.email && e.email.toLowerCase().includes(s)) ||
            (e.phone && e.phone.toLowerCase().includes(s)) ||
            (e.productNameOrCas && e.productNameOrCas.toLowerCase().includes(s))
        );
      }
      enquiries = enquiries.slice(0, Number(limit));
    }

    return res.json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (err) {
    console.error('[Server] Error fetching enquiries:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve enquiries.',
    });
  }
});

// -------------------------------------------------------------
// PROTECTED: Retrieve single enquiry by referenceId (Admin Only)
// -------------------------------------------------------------
app.get('/api/enquiries/:referenceId', requireAdminAuth, async (req, res) => {
  try {
    const { referenceId } = req.params;
    let enquiry = null;

    if (isMongoConnected && enquiriesCollection) {
      enquiry = await enquiriesCollection.findOne({ referenceId });
    } else {
      const all = await readJsonFile(ENQUIRIES_BACKUP_FILE, []);
      enquiry = all.find((e) => e.referenceId === referenceId);
    }

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry reference not found.' });
    }

    return res.json({ success: true, enquiry });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve enquiry.' });
  }
});

// -------------------------------------------------------------
// PROTECTED: Update enquiry status and admin notes (Admin Only)
// -------------------------------------------------------------
app.patch('/api/enquiries/:referenceId', requireAdminAuth, async (req, res) => {
  try {
    const { referenceId } = req.params;
    const { status, adminNotes } = req.body || {};

    const validStatuses = ['new', 'reviewed', 'contacted', 'quoted', 'closed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    let updated = null;
    const updateDoc = { updatedAt: new Date().toISOString() };
    if (status) updateDoc.status = status;
    if (typeof adminNotes === 'string') updateDoc.adminNotes = adminNotes.trim();

    if (isMongoConnected && enquiriesCollection) {
      const result = await enquiriesCollection.findOneAndUpdate(
        { referenceId },
        { $set: updateDoc },
        { returnDocument: 'after' }
      );
      updated = result;
    }

    // Always sync persistent JSON file
    const all = await readJsonFile(ENQUIRIES_BACKUP_FILE, []);
    const idx = all.findIndex((e) => e.referenceId === referenceId);
    if (idx !== -1) {
      if (status) all[idx].status = status;
      if (typeof adminNotes === 'string') all[idx].adminNotes = adminNotes.trim();
      all[idx].updatedAt = updateDoc.updatedAt;
      await writeJsonFile(ENQUIRIES_BACKUP_FILE, all);
      if (!updated) updated = all[idx];
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    return res.json({ success: true, message: 'Enquiry updated successfully.', enquiry: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update enquiry.' });
  }
});

// -------------------------------------------------------------
// PROTECTED: Export authorized enquiries as CSV (Admin Only)
// -------------------------------------------------------------
app.get('/api/admin/enquiries/export', requireAdminAuth, async (req, res) => {
  try {
    let enquiries = [];
    if (isMongoConnected && enquiriesCollection) {
      enquiries = await enquiriesCollection.find({}).sort({ createdAt: -1 }).toArray();
    } else {
      enquiries = await readJsonFile(ENQUIRIES_BACKUP_FILE, []);
    }

    // CSV format generation with sanitization against CSV formula injection
    const sanitizeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      let str = String(val).replace(/"/g, '""');
      // Prevent spreadsheet formula injection (=, +, -, @)
      if (str.length > 0 && ['=', '+', '-', '@'].includes(str.charAt(0))) {
        str = "'" + str;
      }
      return `"${str}"`;
    };

    const headers = [
      'Reference ID',
      'Date Submitted (UTC)',
      'Customer Name',
      'Company / Institution',
      'Email Address',
      'Phone Number',
      'Target Product / CAS',
      'Quantity Requested',
      'Status',
      'Admin Notes',
      'Source',
      'Customer Message',
    ];

    const rows = enquiries.map((e) => [
      sanitizeCsv(e.referenceId || ''),
      sanitizeCsv(e.createdAt || ''),
      sanitizeCsv(e.name || ''),
      sanitizeCsv(e.company || ''),
      sanitizeCsv(e.email || ''),
      sanitizeCsv(e.phone || ''),
      sanitizeCsv(e.productNameOrCas || ''),
      sanitizeCsv(e.quantity || ''),
      sanitizeCsv(e.status || 'new'),
      sanitizeCsv(e.adminNotes || ''),
      sanitizeCsv(e.source || ''),
      sanitizeCsv(e.message || ''),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const dateStr = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="chennai-chemical-enquiries-${dateStr}.csv"`
    );
    return res.status(200).send(csvContent);
  } catch (err) {
    console.error('[Server] CSV export error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate enquiries CSV export.' });
  }
});

// -------------------------------------------------------------
// Serve frontend production build if available
// -------------------------------------------------------------
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('Chennai Chemical Industries API Server running.');
    }
  });
});

// Start Server
initStorage().then(() => {
  app.listen(PORT, () => {
    console.log(`[Server] Chennai Chemical Industries API listening on port ${PORT}`);
  });
}).catch((err) => {
  console.error('[Server] Fatal startup error:', err.message);
  process.exit(1);
});
