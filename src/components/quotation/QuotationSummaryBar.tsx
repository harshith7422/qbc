import React from 'react';
import { QuotationSummary } from '../../types/quotation';
import { formatINR } from '../../utils/formatCurrency';
import { 
  FileCheck, 
  Eye, 
  Save, 
  Lock, 
  Calculator,
  Percent,
  Receipt
} from 'lucide-react';

interface QuotationSummaryBarProps {
  summary: QuotationSummary;
  onSaveDraft: () => void;
  onPreview: () => void;
  onGenerate: () => void;
  isSaving?: boolean;
  onToggleGst?: (enabled: boolean) => void;
  gstEnabled?: boolean;
}

export const QuotationSummaryBar: React.FC<QuotationSummaryBarProps> = ({
  summary,
  onSaveDraft,
  onPreview,
  onGenerate,
  isSaving = false,
  onToggleGst,
  gstEnabled = false,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-border/80 shadow-card p-5 lg:p-6 space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-stone-border/80">
        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-5">
          {/* Total Rooms */}
          <div className="p-3.5 rounded-xl bg-stone-warm/80 border border-stone-border/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Total Rooms
            </span>
            <span className="text-xl font-bold font-serif text-brand-950 mt-0.5 block">
              {summary.totalRooms}
            </span>
          </div>

          {/* Total Items */}
          <div className="p-3.5 rounded-xl bg-stone-warm/80 border border-stone-border/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Configured Items
            </span>
            <span className="text-xl font-bold font-serif text-brand-950 mt-0.5 block">
              {summary.totalItems}
            </span>
          </div>

          {/* Total Base Cost [Internal Reference Only] */}
          <div className="p-3.5 rounded-xl bg-slate-100/90 border border-slate-200">
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <Lock className="w-2.5 h-2.5 text-slate-400" />
              <span>Base Cost (Internal)</span>
            </div>
            <span className="text-lg font-bold font-mono text-slate-600 mt-0.5 block">
              {formatINR(summary.totalBasePrice)}
            </span>
            <span className="text-[9px] text-slate-500 block">Hidden from customer</span>
          </div>

          {/* Total Final Quoted Amount */}
          <div className="p-3.5 rounded-xl bg-accent-goldMuted border border-accent-gold/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
              Quotation Value
            </span>
            <span className="text-xl font-bold font-mono text-brand-950 mt-0.5 block">
              {formatINR(summary.totalFinalPrice)}
            </span>
            <span className="text-[9px] text-amber-900/80 block">Sum of quoted prices</span>
          </div>
        </div>

        {/* GST / Tax Toggle (Optional) */}
        {onToggleGst && (
          <div className="flex items-center gap-3 self-end lg:self-center p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
            <Receipt className="w-4 h-4 text-accent-gold" />
            <div>
              <div className="font-semibold text-slate-800">Apply GST (18%)</div>
              <div className="text-[10px] text-slate-400">Include GST in quotation total</div>
            </div>
            <input
              type="checkbox"
              checked={gstEnabled}
              onChange={(e) => onToggleGst(e.target.checked)}
              className="w-4 h-4 text-brand-900 rounded accent-brand-900 cursor-pointer ml-2"
            />
          </div>
        )}
      </div>

      {/* Grand Total & Primary CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider font-bold text-slate-500">
            Final Quotation Amount:
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold font-serif text-brand-950 tracking-tight">
              {formatINR(summary.grandTotal)}
            </span>
            {gstEnabled && (
              <span className="text-xs text-slate-500 font-medium">
                (incl. 18% GST: {formatINR(summary.taxAmount)})
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Save as Draft */}
          <button
            onClick={onSaveDraft}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-border bg-white hover:bg-stone-100 text-slate-700 text-xs font-semibold shadow-xs transition"
          >
            <Save className="w-4 h-4 text-slate-500" />
            <span>Save as Draft</span>
          </button>

          {/* Preview Quotation */}
          <button
            onClick={onPreview}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-800 bg-brand-50 hover:bg-brand-100/70 text-brand-900 text-xs font-bold transition shadow-xs"
          >
            <Eye className="w-4 h-4 text-accent-gold" />
            <span>Preview Quotation</span>
          </button>

          {/* Generate Quotation */}
          <button
            onClick={onGenerate}
            disabled={isSaving || summary.totalItems === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-brand-950/20 transition hover:shadow-lg"
          >
            <FileCheck className="w-4 h-4 text-accent-gold" />
            <span>Generate Quotation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
