import React from 'react';
import { Quotation } from '../types/quotation';
import { MasterPricingCatalog } from '../types/pricing';
import { formatINR } from '../utils/formatCurrency';
import { 
  FileText, 
  FileClock, 
  FileCheck2, 
  IndianRupee, 
  PlusCircle, 
  ArrowUpRight, 
  Layers, 
  Sliders, 
  Clock, 
  Building, 
  User, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  quotations: Quotation[];
  catalog: MasterPricingCatalog;
  onNavigateCreate: () => void;
  onNavigateHistory: () => void;
  onNavigatePricing: () => void;
  onViewQuotation: (q: Quotation) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  quotations,
  catalog,
  onNavigateCreate,
  onNavigateHistory,
  onNavigatePricing,
  onViewQuotation,
}) => {
  // Metrics
  const totalQuotations = quotations.length;
  const draftQuotations = quotations.filter((q) => q.status === 'draft').length;
  const generatedQuotations = quotations.filter(
    (q) => q.status === 'generated' || q.status === 'sent' || q.status === 'accepted'
  ).length;
  const acceptedQuotations = quotations.filter((q) => q.status === 'accepted').length;
  const totalQuotationValue = quotations.reduce((acc, q) => acc + q.summary.grandTotal, 0);

  // Recent 4 Quotations
  const recentQuotations = [...quotations]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // Unique customers / projects
  const recentCustomers = quotations.slice(0, 4).map((q) => ({
    name: q.customer.customerName,
    project: q.customer.projectName,
    location: q.customer.projectLocation,
    date: q.customer.quotationDate,
    ref: q.referenceNumber,
    value: q.summary.grandTotal,
    status: q.status,
  }));

  const metrics = [
    {
      label: 'Total Quotations',
      value: totalQuotations,
      subtext: 'All lifetime proposals',
      icon: FileText,
      iconColor: 'text-brand-900',
      iconBg: 'bg-brand-50',
    },
    {
      label: 'Draft Quotations',
      value: draftQuotations,
      subtext: 'Under site evaluation',
      icon: FileClock,
      iconColor: 'text-amber-800',
      iconBg: 'bg-amber-50',
    },
    {
      label: 'Generated Proposals',
      value: generatedQuotations,
      subtext: `${acceptedQuotations} approved & signed`,
      icon: FileCheck2,
      iconColor: 'text-emerald-800',
      iconBg: 'bg-emerald-50',
    },
    {
      label: 'Total Quotation Value',
      value: formatINR(totalQuotationValue),
      subtext: 'Combined pipeline',
      icon: IndianRupee,
      iconColor: 'text-amber-900',
      iconBg: 'bg-accent-goldMuted',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Studio Welcome & Quick Action Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 text-white shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Blue Craft Studio Desk
            </span>
          </div>
          <h2 className="text-2xl font-bold font-serif tracking-tight mt-1">
            Interior Quotation Engine
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Configure room scopes, calculate base material pricing, adjust custom markups, and produce verified 3-column customer proposals.
          </p>
        </div>

        <button
          onClick={onNavigateCreate}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-accent-gold hover:bg-accent-goldLight text-brand-950 text-xs font-bold shadow-md transition self-start sm:self-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Create New Quotation</span>
        </button>
      </div>

      {/* Primary Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-border/80 p-5 shadow-card hover:border-brand-900/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {m.label}
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${m.iconBg} ${m.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="text-2xl font-bold font-serif text-brand-950 mt-3 tracking-tight">
                {m.value}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{m.subtext}</div>
            </div>
          );
        })}
      </div>

      {/* Two Column Grid: Recent Quotations & Active Pricing / Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Quotations Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-border/80 p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-border/70 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent-gold" />
                <h3 className="text-base font-bold font-serif text-brand-950">
                  Recent Quotations
                </h3>
              </div>
              <button
                onClick={onNavigateHistory}
                className="text-xs text-brand-900 hover:text-brand-700 font-semibold flex items-center gap-1 group"
              >
                <span>View all history</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {recentQuotations.map((q) => (
                <div
                  key={q.id}
                  onClick={() => onViewQuotation(q)}
                  className="py-3.5 flex items-center justify-between hover:bg-stone-50/80 px-2 rounded-xl transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 text-brand-950 flex items-center justify-center font-mono font-bold text-xs group-hover:bg-brand-900 group-hover:text-accent-gold transition-colors">
                      {q.rooms.length}R
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-brand-900 transition-colors">
                        {q.customer.customerName}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-slate-600">{q.referenceNumber}</span>
                        <span>•</span>
                        <span>{q.customer.projectName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-brand-950">
                      {formatINR(q.summary.grandTotal)}
                    </div>
                    <span
                      className={`inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full mt-0.5 ${
                        q.status === 'accepted'
                          ? 'bg-emerald-50 text-emerald-700'
                          : q.status === 'sent'
                          ? 'bg-blue-50 text-blue-700'
                          : q.status === 'draft'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-indigo-50 text-indigo-700'
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
            <span>Click any quotation row to inspect customer preview</span>
            <button
              onClick={onNavigateCreate}
              className="font-semibold text-brand-900 hover:underline"
            >
              + Create another
            </button>
          </div>
        </div>

        {/* Right Col: Active Pricing Catalog Overview & Master Benchmark */}
        <div className="space-y-6">
          {/* Master Pricing Benchmark Card */}
          <div className="bg-white rounded-2xl border border-stone-border/80 p-5 shadow-card">
            <div className="flex items-center justify-between pb-3 border-b border-stone-border/70 mb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-accent-gold" />
                <h3 className="text-sm font-bold font-serif text-brand-950">
                  Master Pricing Catalog
                </h3>
              </div>
              <button
                onClick={onNavigatePricing}
                className="text-xs text-brand-900 font-semibold hover:underline"
              >
                Configure
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-warm/80 border border-stone-border/60">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Global Base Sq.Ft Benchmark
              </div>
              <div className="text-xl font-bold font-mono text-brand-950 mt-1">
                {formatINR(catalog.globalBaseRate)}
                <span className="text-xs text-slate-500 font-normal"> /sq.ft</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Applies to materials marked as Variable (stone, countertop, custom millwork).
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Available Room Scopes ({catalog.rooms.length}):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {catalog.rooms.map((r) => (
                  <span
                    key={r.id}
                    className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 text-slate-700 font-medium"
                  >
                    {r.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Studio Info Card */}
          <div className="bg-stone-50 rounded-2xl border border-stone-border/80 p-5 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-bold text-brand-950 mb-2">
              <Sparkles className="w-4 h-4 text-accent-gold" />
              <span>Studio Data Policy</span>
            </div>
            <p className="leading-relaxed">
              All proposals and catalog adjustments are persisted in your local browser sandbox. You can reset to official studio defaults or export/import your JSON records from Settings at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
