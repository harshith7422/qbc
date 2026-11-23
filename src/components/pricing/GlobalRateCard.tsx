import React, { useState } from 'react';
import { IndianRupee, Check, Save, Info } from 'lucide-react';

interface GlobalRateCardProps {
  currentRate: number;
  onSaveRate: (newRate: number) => void;
}

export const GlobalRateCard: React.FC<GlobalRateCardProps> = ({
  currentRate,
  onSaveRate,
}) => {
  const [rateInput, setRateInput] = useState<number>(currentRate);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Sync if parent updates
  React.useEffect(() => {
    setRateInput(currentRate);
  }, [currentRate]);

  const handleSave = () => {
    onSaveRate(rateInput);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-border/80 p-5 shadow-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-gold" />
            <h2 className="text-base font-bold font-serif text-brand-950">
              Global Base Sq.Ft Rate
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            This benchmark rate applies across all materials configured as <span className="font-semibold text-slate-700">Variable Pricing</span> (such as countertops, specialized stone slabs, or bespoke carpentry).
          </p>
        </div>

        {/* Input & Action */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
              ₹
            </span>
            <input
              type="number"
              min="100"
              step="50"
              value={rateInput}
              onChange={(e) => setRateInput(Math.max(0, Number(e.target.value)))}
              className="w-36 pl-8 pr-3 py-2.5 rounded-xl border border-stone-border bg-stone-warm/50 text-brand-950 font-bold font-mono text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900/20 focus:border-brand-900 transition"
              placeholder="1500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-medium pointer-events-none">
              /sq.ft
            </span>
          </div>

          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm ${
              isSaved
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-brand-900 hover:bg-brand-800 text-white'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Rate Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-accent-gold" />
                <span>Save Global Rate</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2 text-[11px] text-slate-500">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>
          Currently in effect: <strong className="text-brand-900 font-mono">₹{currentRate.toLocaleString('en-IN')}/sq.ft</strong>. Changing this updates the base rate calculated for all items linked to Variable pricing in new quotes.
        </span>
      </div>
    </div>
  );
};
