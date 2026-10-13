export interface EnquiryPayload {
  name: string;
  company: string;
  email: string;
  phone: string;
  productNameOrCas: string;
  quantity?: string;
  message?: string;
  source?: 'contact_form' | 'product_modal';
}

export interface EnquiryResponse {
  success: boolean;
  referenceId?: string;
  message?: string;
  errors?: Record<string, string>;
  enquiry?: {
    referenceId: string;
    name: string;
    company: string;
    email: string;
    productNameOrCas: string;
    quantity: string;
    createdAt: string;
  };
}

export type EnquiryStatus = 'new' | 'reviewed' | 'contacted' | 'quoted' | 'closed';

export interface AdminEnquiry {
  _id?: string;
  referenceId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  productNameOrCas: string;
  quantity: string;
  message: string;
  source: string;
  status: EnquiryStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
  clientIp?: string;
}

export interface AdminUser {
  username: string;
  name: string;
  role: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  expiresAt?: string;
  admin?: AdminUser;
}

const TOKEN_KEY = 'cci_admin_session_token';

export function getAdminToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string, remember: boolean = true): void {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  } catch (e) {
    console.error('Failed to persist admin token:', e);
  }
}

export function clearAdminToken(): void {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error('Failed to clear admin token:', e);
  }
}

/**
 * Submit an official quotation enquiry to the public backend API.
 * Never fabricates success: returns structured error details on validation or network issues.
 */
export async function submitEnquiry(payload: EnquiryPayload): Promise<EnquiryResponse> {
  try {
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || `Server returned error status (${res.status}).`,
        errors: data?.errors,
      };
    }

    if (!data || !data.success || !data.referenceId) {
      return {
        success: false,
        message: 'The server response did not include a valid confirmation reference.',
      };
    }

    return data;
  } catch {
    return {
      success: false,
      message:
        'Unable to connect to the quotation processing server. Please check your connection or contact our commercial desk directly at 7619431029.',
    };
  }
}

/**
 * Authenticate administrator with server-side credentials
 */
export async function adminLogin(username: string, password: string): Promise<AdminLoginResponse> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      return {
        success: false,
        message: data?.message || 'Authentication failed. Please verify credentials.',
      };
    }

    if (data.token) {
      setAdminToken(data.token);
    }

    return data;
  } catch {
    return {
      success: false,
      message: 'Network error connecting to administrative authentication service.',
    };
  }
}

/**
 * Verify active admin session
 */
export async function verifyAdminSession(): Promise<{ success: boolean; admin?: AdminUser }> {
  const token = getAdminToken();
  if (!token) return { success: false };

  try {
    const res = await fetch('/api/admin/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      clearAdminToken();
      return { success: false };
    }

    const data = await res.json().catch(() => null);
    if (res.ok && data?.success) {
      return { success: true, admin: data.admin };
    }
    return { success: false };
  } catch {
    return { success: false };
  }
}

/**
 * Logout administrator and invalidate server session
 */
export async function adminLogout(): Promise<void> {
  const token = getAdminToken();
  if (token) {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Ignore network errors on logout
    }
  }
  clearAdminToken();
}

/**
 * Fetch all saved enquiries with authentication and optional filters
 */
export async function fetchAdminEnquiries(params?: {
  status?: string;
  search?: string;
}): Promise<{ success: boolean; enquiries: AdminEnquiry[]; count?: number; message?: string }> {
  const token = getAdminToken();
  if (!token) {
    return {
      success: false,
      message: 'Administrative authentication required. Please log in.',
      enquiries: [],
    };
  }

  try {
    const urlParams = new URLSearchParams();
    if (params?.status && params.status !== 'all') {
      urlParams.set('status', params.status);
    }
    if (params?.search && params.search.trim()) {
      urlParams.set('search', params.search.trim());
    }

    const url = `/api/enquiries${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      clearAdminToken();
      return {
        success: false,
        message: 'Your administrative session has expired. Please sign in again.',
        enquiries: [],
      };
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Failed to retrieve enquiries.',
        enquiries: [],
      };
    }

    return {
      success: true,
      count: data.count || data.enquiries?.length || 0,
      enquiries: data.enquiries || [],
    };
  } catch {
    return {
      success: false,
      message: 'Network error communicating with the administration server.',
      enquiries: [],
    };
  }
}

/**
 * Update enquiry status and admin notes (protected)
 */
export async function updateEnquiryStatus(
  referenceId: string,
  status?: EnquiryStatus,
  adminNotes?: string
): Promise<{ success: boolean; message?: string; enquiry?: AdminEnquiry }> {
  const token = getAdminToken();
  if (!token) {
    return {
      success: false,
      message: 'Administrative authentication required. Please log in.',
    };
  }

  try {
    const res = await fetch(`/api/enquiries/${encodeURIComponent(referenceId)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, adminNotes }),
    });

    if (res.status === 401) {
      clearAdminToken();
      return {
        success: false,
        message: 'Your administrative session has expired. Please sign in again.',
      };
    }

    const data = await res.json();
    return data;
  } catch {
    return {
      success: false,
      message: 'Failed to update enquiry status due to network error.',
    };
  }
}

/**
 * Download authorized CSV of all enquiries
 */
export async function downloadEnquiriesCsv(): Promise<{ success: boolean; message?: string }> {
  const token = getAdminToken();
  if (!token) {
    return { success: false, message: 'Authentication required to export data.' };
  }

  try {
    const res = await fetch('/api/admin/enquiries/export', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      clearAdminToken();
      return { success: false, message: 'Session expired. Please log in again.' };
    }

    if (!res.ok) {
      return { success: false, message: 'Server failed to generate CSV export.' };
    }

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `chennai-chemical-enquiries-${dateStr}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    a.remove();

    return { success: true };
  } catch {
    return { success: false, message: 'Network error downloading CSV export.' };
  }
}
