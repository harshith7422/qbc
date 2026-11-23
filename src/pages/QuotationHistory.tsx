import React, { useState, useMemo } from 'react';
import { Quotation, QuotationStatus } from '../types/quotation';
import { formatINR } from '../utils/formatCurrency';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Send, 
  XCircle, 
  Calendar,
  Building,
  User,
  PlusCircle,
  Download
} from 'lucide-react';

interface QuotationHistoryProps {
  quotations: Quotation[];
  onViewQuotation: (quotation: Quotation) => void;
  onEditQuotation: (quotation: Quotation) => void;
  onDuplicateQuotation: (id: string) => void;
  onDeleteQuotation: (id: string) => void;
  onUpdateStatus: (id: string, status: QuotationStatus) => void;
  onNewQuotation: () => void;
}

export const QuotationHistory: React.FC<QuotationHistoryProps> = ({
  quotations,
  onViewQuotation,
  onEditQuotation,
  onDuplicateQuotation,
  onDeleteQuotation,
  onUpdateStatus,
  onNewQuotation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'value-desc' | 'value-asc'>('date-desc');

  // Filter and sort quotations
  const filteredQuotations = useMemo(() => {
    return quotations
      .filter((q) => {
        // Status filter
        if (statusFilter !== 'all' && q.status !== statusFilter) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const qStr = searchQuery.toLowerCase();
          const matchCustomer = q.customer.customerName.toLowerCase().includes(qStr);
          const matchRef = q.referenceNumber.toLowerCase().includes(qStr);
          const matchProject = q.customer.projectName.toLowerCase().includes(qStr);
          const matchLocation = q.customer.projectLocation.toLowerCase().includes(qStr);
          if (!matchCustomer && !matchRef && !matchProject && !matchLocation) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'date-asc') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'value-desc') {
          return b.summary.grandTotal - a.summary.grandTotal;
        }
        if (sortBy === 'value-asc') {
          return a.summary.grandTotal - b.summary.grandTotal;
        }
        return 0;
      });
  }, [quotations, searchQuery, statusFilter, sortBy]);

  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case 'accepted':
        return {
          label: 'Accepted',
          icon: CheckCircle2,
          classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'sent':
        return {
          label: 'Sent to Client',
          icon: Send,
          classes: 'bg-blue-50 text-blue-800 border-blue-200',
        };
      case 'generated':
        return {
          label: 'Generated',
          icon: FileText,
          classes: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        };
      case 'draft':
        return {
          label: 'Draft',
          icon: Clock,
          classes: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'rejected':
        return {
          label: 'Declined',
          icon: XCircle,
          classes: 'bg-rose-50 text-rose-800 border-rose-200',
        };
      default:
        return {
          label: status,
          icon: Clock,
          classes: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-brand-950 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-gold" />
            Quotation Records & History
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Archived client proposals, active revisions, and generated contracts.
          </p>
        </div>

        <button
          onClick={onNewQuotation}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold shadow-sm transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-accent-gold" />
          <span>Create New Quotation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-border/80 p-4 shadow-card flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client, ID, project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-stone-border bg-stone-warm/50 text-xs font-medium text-brand-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-900"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-stone-border bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-900"
            >
              <option value="all">All Statuses ({quotations.length})</option>
              <option value="accepted">Accepted</option>
              <option value="sent">Sent</option>
              <option value="generated">Generated</option>
              <option value="draft">Draft</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-stone-border bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-900"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="value-desc">Highest Valuation</option>
              <option value="value-asc">Lowest Valuation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-2xl border border-stone-border/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100/75 border-b border-stone-border text-slate-600 font-semibold tracking-wider uppercase text-[11px]">
                <th className="py-3.5 px-5">Quotation Ref</th>
                <th className="py-3.5 px-5">Customer & Project</th>
                <th className="py-3.5 px-5">Created Date</th>
                <th className="py-3.5 px-5 text-right">Quoted Total</th>
                <th className="py-3.5 px-5 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {filteredQuotations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <p className="text-sm">No quotations found matching your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredQuotations.map((q) => {
                  const statusInfo = getStatusBadge(q.status);
                  const StatusIcon = statusInfo.icon;
                  const dateFormatted = new Date(q.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr
                      key={q.id}
                      className="hover:bg-stone-50/70 transition-colors group cursor-pointer"
                      onClick={() => onViewQuotation(q)}
                    >
                      {/* Quotation ID */}
                      <td className="py-4 px-5 font-mono font-bold text-brand-950">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-accent-gold shrink-0" />
                          <span>{q.referenceNumber}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                          {q.rooms.length} {q.rooms.length === 1 ? 'Room' : 'Rooms'} • {q.summary.totalItems} Items
                        </div>
                      </td>

                      {/* Customer & Project */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 group-hover:text-brand-900 transition-colors">
                          {q.customer.customerName}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          <span>{q.customer.projectName}</span>
                          <span className="text-slate-300">•</span>
                          <span>{q.customer.projectLocation}</span>
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-5 text-slate-600">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{dateFormatted}</span>
                        </div>
                      </td>

                      {/* Total Quotation Amount */}
                      <td className="py-4 px-5 text-right font-mono font-bold text-sm text-brand-950">
                        {formatINR(q.summary.grandTotal)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-block relative">
                          <select
                            value={q.status}
                            onChange={(e) => onUpdateStatus(q.id, e.target.value as QuotationStatus)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${statusInfo.classes} focus:outline-none`}
                          >
                            <option value="draft">Draft</option>
                            <option value="generated">Generated</option>
                            <option value="sent">Sent</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Preview */}
                          <button
                            onClick={() => onViewQuotation(q)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-900 hover:bg-stone-100 transition"
                            title="View Customer Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => onEditQuotation(q)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-900 hover:bg-stone-100 transition"
                            title="Edit Quotation"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Duplicate */}
                          <button
                            onClick={() => onDuplicateQuotation(q.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-accent-gold hover:bg-amber-50 transition"
                            title="Duplicate as new draft"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Are you sure you want to delete quotation ${q.referenceNumber} (${q.customer.customerName})?`
                                )
                              ) {
                                onDeleteQuotation(q.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-4 bg-stone-50 border-t border-stone-border/80 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {filteredQuotations.length} of {quotations.length} total proposals
          </span>
          <span className="font-mono font-semibold text-slate-700">
            Total Valuation: {formatINR(filteredQuotations.reduce((sum, q) => sum + q.summary.grandTotal, 0))}
          </span>
        </div>
      </div>
    </div>
  );
};
