import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Shield,
  LogOut,
  RefreshCw,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Building,
  ExternalLink,
  X,
  FileText,
  AlertCircle,
  Copy,
  Check,
  ArrowLeft,
  ChevronRight,
  Filter,
  MessageSquare,
} from 'lucide-react';
import {
  AdminEnquiry,
  AdminUser,
  EnquiryStatus,
  fetchAdminEnquiries,
  updateEnquiryStatus,
  downloadEnquiriesCsv,
  adminLogout,
} from '../../lib/api';

interface AdminDashboardProps {
  admin: AdminUser;
  onLogout: () => void;
  onBackToPublicSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  admin,
  onLogout,
  onBackToPublicSite,
}) => {
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdminEnquiry | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Detail Modal Edit State
  const [editingStatus, setEditingStatus] = useState<EnquiryStatus>('new');
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [isSavingDetails, setIsSavingDetails] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Fetch enquiries callback
  const loadEnquiries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAdminEnquiries();
      if (response.success) {
        setEnquiries(response.enquiries);
      } else {
        setError(response.message || 'Failed to retrieve enquiries.');
        if (response.message?.toLowerCase().includes('session has expired')) {
          onLogout();
        }
      }
    } catch {
      setError('Network communication failure. Please check connection.');
    } finally {
      setIsLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  // Sync selected enquiry into edit states
  useEffect(() => {
    if (selectedEnquiry) {
      setEditingStatus(selectedEnquiry.status || 'new');
      setEditingNotes(selectedEnquiry.adminNotes || '');
      setSaveSuccessMessage(null);
    }
  }, [selectedEnquiry]);

  // Filtered list
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      // Status filter
      if (statusFilter !== 'all' && e.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchRef = e.referenceId?.toLowerCase().includes(q);
        const matchName = e.name?.toLowerCase().includes(q);
        const matchCompany = e.company?.toLowerCase().includes(q);
        const matchEmail = e.email?.toLowerCase().includes(q);
        const matchPhone = e.phone?.toLowerCase().includes(q);
        const matchProduct = e.productNameOrCas?.toLowerCase().includes(q);
        return matchRef || matchName || matchCompany || matchEmail || matchPhone || matchProduct;
      }
      return true;
    });
  }, [enquiries, statusFilter, searchQuery]);

  // Statistics derived purely from real stored records
  const stats = useMemo(() => {
    const total = enquiries.length;
    const newCount = enquiries.filter((e) => e.status === 'new').length;
    const inProgress = enquiries.filter((e) => e.status === 'reviewed' || e.status === 'contacted').length;
    const quoted = enquiries.filter((e) => e.status === 'quoted').length;
    const closed = enquiries.filter((e) => e.status === 'closed').length;
    return { total, newCount, inProgress, quoted, closed };
  }, [enquiries]);

  const handleCopyReference = (refId: string) => {
    navigator.clipboard.writeText(refId);
    setCopiedId(refId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const res = await downloadEnquiriesCsv();
      if (!res.success && res.message?.toLowerCase().includes('session expired')) {
        onLogout();
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveEnquiryChanges = async () => {
    if (!selectedEnquiry) return;
    setIsSavingDetails(true);
    setSaveSuccessMessage(null);

    try {
      const res = await updateEnquiryStatus(selectedEnquiry.referenceId, editingStatus, editingNotes);
      if (res.success && res.enquiry) {
        setEnquiries((prev) =>
          prev.map((item) => (item.referenceId === selectedEnquiry.referenceId ? res.enquiry! : item))
        );
        setSelectedEnquiry(res.enquiry);
        setSaveSuccessMessage('Enquiry details updated successfully.');
        setTimeout(() => setSaveSuccessMessage(null), 3000);
      } else {
        alert(res.message || 'Failed to update enquiry.');
        if (res.message?.toLowerCase().includes('session has expired')) {
          onLogout();
        }
      }
    } catch {
      alert('Network error updating enquiry.');
    } finally {
      setIsSavingDetails(false);
    }
  };

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            New
          </span>
        );
      case 'reviewed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            Reviewed
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Contacted
          </span>
        );
      case 'quoted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            Quoted
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen bg-[#050b16] text-slate-100 flex flex-col selection:bg-teal-600 selection:text-white scientific-grid-dark">
      {/* 1. Header Bar */}
      <header className="bg-[#0a1324] border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/chennaichemicalindustries_favicon.png"
              alt="Chennai Chemical Industries"
              className="w-9 h-9 object-contain drop-shadow-[0_0_8px_rgba(20,184,166,0.4)]"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">
                  Chennai Chemical Industries
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-950 text-teal-400 border border-teal-800/80">
                  Admin Desk
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                B2B Quotation Management & Commercial Dispatch
              </div>
            </div>
          </div>

          {/* User & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-white">{admin.name}</span>
              <span className="text-[11px] font-mono text-slate-400">{admin.username}</span>
            </div>

            <button
              onClick={onBackToPublicSite}
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Public Website</span>
            </button>

            <button
              onClick={async () => {
                await adminLogout();
                onLogout();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 px-3 py-1.5 rounded-lg border border-rose-800/60 transition-colors cursor-pointer"
              title="End Administrative Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
              Total Inquiries
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">{stats.total}</div>
            <div className="text-[11px] text-slate-400 mt-1">Verified stored records</div>
          </div>

          <div className="bg-slate-900/90 border border-amber-900/30 rounded-xl p-4 shadow-sm">
            <div className="text-amber-400 text-xs font-medium uppercase tracking-wider mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              New / Pending
            </div>
            <div className="text-2xl font-bold text-amber-300 tracking-tight">{stats.newCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">Require initial review</div>
          </div>

          <div className="bg-slate-900/90 border border-sky-900/30 rounded-xl p-4 shadow-sm">
            <div className="text-sky-400 text-xs font-medium uppercase tracking-wider mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              In Progress
            </div>
            <div className="text-2xl font-bold text-sky-300 tracking-tight">{stats.inProgress}</div>
            <div className="text-[11px] text-slate-400 mt-1">Reviewed or contacted</div>
          </div>

          <div className="bg-slate-900/90 border border-teal-900/30 rounded-xl p-4 shadow-sm">
            <div className="text-teal-400 text-xs font-medium uppercase tracking-wider mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              Quoted
            </div>
            <div className="text-2xl font-bold text-teal-300 tracking-tight">{stats.quoted}</div>
            <div className="text-[11px] text-slate-400 mt-1">Commercial quote issued</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm col-span-2 lg:col-span-1">
            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              Closed
            </div>
            <div className="text-2xl font-bold text-slate-300 tracking-tight">{stats.closed}</div>
            <div className="text-[11px] text-slate-400 mt-1">Completed / archived</div>
          </div>
        </div>

        {/* Toolbar: Search, Filters, Refresh, CSV Export */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by buyer, company, email, phone, reference, or CAS..."
                className="w-full pl-9 pr-9 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={loadEnquiries}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
                title="Refresh enquiries list"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-400' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={handleExportCsv}
                disabled={isExporting || enquiries.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium rounded-lg shadow-sm shadow-teal-950 transition-colors disabled:opacity-50 cursor-pointer"
                title="Download authorized CSV report"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
              </button>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-slate-400" /> Filter:
            </span>
            {[
              { id: 'all', label: `All (${enquiries.length})` },
              { id: 'new', label: `New (${stats.newCount})` },
              { id: 'reviewed', label: 'Reviewed' },
              { id: 'contacted', label: 'Contacted' },
              { id: 'quoted', label: `Quoted (${stats.quoted})` },
              { id: 'closed', label: 'Closed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-teal-600 text-white font-medium'
                    : 'bg-slate-950/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Enquiries Table / View */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          {isLoading && enquiries.length === 0 ? (
            <div className="py-20 text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-teal-400 mx-auto mb-3" />
              <div className="text-sm font-semibold text-white">Loading Quotation Records...</div>
              <div className="text-xs text-slate-400 mt-1">Connecting to authenticated database</div>
            </div>
          ) : error ? (
            <div className="py-16 text-center px-4">
              <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-3" />
              <div className="text-sm font-semibold text-rose-300">{error}</div>
              <button
                onClick={loadEnquiries}
                className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-white"
              >
                Retry Connection
              </button>
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="py-16 text-center px-4">
              <FileText className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <div className="text-sm font-semibold text-slate-300">No quotation enquiries found</div>
              <div className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {searchQuery || statusFilter !== 'all'
                  ? 'No records match the active search query or filter. Try clearing your filters.'
                  : 'No quotation requests have been submitted yet.'}
              </div>
              {(searchQuery || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="mt-4 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-teal-300 border border-slate-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4">Buyer & Organization</th>
                    <th className="py-3 px-4">Product / CAS</th>
                    <th className="py-3 px-4">Qty</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs">
                  {filteredEnquiries.map((enquiry) => (
                    <tr
                      key={enquiry.referenceId}
                      className="hover:bg-slate-850/60 transition-colors group cursor-pointer"
                      onClick={() => setSelectedEnquiry(enquiry)}
                    >
                      {/* Reference */}
                      <td className="py-3.5 px-4 font-mono font-medium text-teal-300">
                        <div className="flex items-center gap-1.5">
                          <span>{enquiry.referenceId}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyReference(enquiry.referenceId);
                            }}
                            className="p-1 text-slate-500 hover:text-white rounded"
                            title="Copy Reference"
                          >
                            {copiedId === enquiry.referenceId ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{formatDate(enquiry.createdAt)}</span>
                        </div>
                      </td>

                      {/* Buyer */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{enquiry.name}</div>
                        <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{enquiry.company}</span>
                        </div>
                      </td>

                      {/* Product */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-200 max-w-[220px] truncate" title={enquiry.productNameOrCas}>
                          {enquiry.productNameOrCas}
                        </div>
                        {enquiry.adminNotes && (
                          <div className="text-[10px] text-teal-400 mt-0.5 truncate max-w-[200px]" title={enquiry.adminNotes}>
                            Note: {enquiry.adminNotes}
                          </div>
                        )}
                      </td>

                      {/* Quantity */}
                      <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                        {enquiry.quantity || '—'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(enquiry.status)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEnquiry(enquiry);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-teal-600 text-slate-200 hover:text-white transition-colors text-[11px] font-medium border border-slate-700"
                        >
                          <span>Manage</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* 4. Enquiry Detail Drawer / Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-950/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-teal-400">
                    {selectedEnquiry.referenceId}
                  </span>
                  {getStatusBadge(selectedEnquiry.status)}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Received on {formatDate(selectedEnquiry.createdAt)} • Source:{' '}
                  <span className="font-mono text-slate-300">{selectedEnquiry.source}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Buyer Contact Card */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
                <div className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
                  Contact Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Contact Name</span>
                    <span className="font-medium text-white">{selectedEnquiry.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Organization / Institution</span>
                    <span className="font-medium text-white">{selectedEnquiry.company}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Corporate Email</span>
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                      className="font-mono text-teal-400 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Mail className="w-3 h-3" />
                      <span>{selectedEnquiry.email}</span>
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Phone / WhatsApp</span>
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="font-mono text-teal-400 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{selectedEnquiry.phone}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Requirement Details */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
                <div className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
                  Quotation Specification
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[11px]">Product Name / CAS Number</span>
                    <span className="font-semibold text-white text-sm">{selectedEnquiry.productNameOrCas}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Requested Quantity</span>
                    <span className="font-mono font-bold text-teal-300">{selectedEnquiry.quantity || 'Unspecified'}</span>
                  </div>
                </div>

                {selectedEnquiry.message && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400 block text-[11px] mb-1">Customer Inquiry Notes</span>
                    <div className="bg-slate-900 p-3 rounded-lg text-slate-300 leading-relaxed font-mono text-[11px] whitespace-pre-wrap border border-slate-800">
                      {selectedEnquiry.message}
                    </div>
                  </div>
                )}
              </div>

              {/* Management Controls: Status Update & Admin Notes */}
              <div className="bg-slate-950/90 border border-teal-900/40 rounded-xl p-4 space-y-4">
                <div className="font-semibold text-teal-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Administrative Controls
                </div>

                {saveSuccessMessage && (
                  <div className="p-2.5 rounded-lg bg-teal-950 border border-teal-800 text-teal-200 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>{saveSuccessMessage}</span>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Status Selection */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                      Operational Status
                    </label>
                    <select
                      value={editingStatus}
                      onChange={(e) => setEditingStatus(e.target.value as EnquiryStatus)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="new">New (Awaiting initial review)</option>
                      <option value="reviewed">Reviewed (Specifications verified)</option>
                      <option value="contacted">Contacted (Commercial dialogue open)</option>
                      <option value="quoted">Quoted (Commercial proforma issued)</option>
                      <option value="closed">Closed (Supply fulfilled or archived)</option>
                    </select>
                  </div>

                  {/* Internal Notes */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                      Internal Commercial & Regulatory Notes
                    </label>
                    <textarea
                      rows={3}
                      value={editingNotes}
                      onChange={(e) => setEditingNotes(e.target.value)}
                      placeholder="e.g. Sent proforma invoice #CCI-841 via sales desk. Batch CoA attached..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div className="text-[11px] text-slate-400">
                {selectedEnquiry.updatedAt && `Last updated: ${formatDate(selectedEnquiry.updatedAt)}`}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEnquiryChanges}
                  disabled={isSavingDetails}
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSavingDetails ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
