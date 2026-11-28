import React, { useState } from 'react';
import { CategoryItem, PricingType } from '../../types/pricing';
import { X, Plus, Sparkles } from 'lucide-react';
import { generateId } from '../../utils/calculations';

interface AddFinishModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  existingCategories: CategoryItem[];
  onAddFinish: (newCategoryName: string, subCategory: {
    id: string;
    name: string;
    pricingType?: PricingType;
    rate: number;
    description?: string;
  }) => void;
  globalBaseRate: number;
}

export const AddFinishModal: React.FC<AddFinishModalProps> = ({
  isOpen,
  onClose,
  roomName,
  existingCategories,
  onAddFinish,
  globalBaseRate,
}) => {
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState(
    existingCategories[0]?.name || ''
  );
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [subCategoryName, setSubCategoryName] = useState('');
  const [rate, setRate] = useState<number>(1800);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategoryName = isNewCategory ? customCategoryName.trim() : selectedCategoryName.trim();

    if (!finalCategoryName) {
      alert('Please enter or select a category.');
      return;
    }
    if (!subCategoryName.trim()) {
      alert('Please enter a finish or subcategory name.');
      return;
    }

    onAddFinish(finalCategoryName, {
      id: generateId('sub'),
      name: subCategoryName.trim(),
      pricingType: 'fixed',
      rate: Number(rate) || 0,
      description: description.trim() || undefined,
    });

    // Reset & close
    setSubCategoryName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-modal border border-stone-border animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-border/80">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-gold" />
              <h3 className="text-lg font-bold font-serif text-brand-950">
                Add Finish to {roomName}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure a new material option for room specifications.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-stone-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Category Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Category
              </label>
              <button
                type="button"
                onClick={() => setIsNewCategory(!isNewCategory)}
                className="text-[11px] text-brand-900 font-semibold hover:underline"
              >
                {isNewCategory ? '← Select existing category' : '+ Create new category'}
              </button>
            </div>

            {isNewCategory ? (
              <input
                type="text"
                placeholder="e.g. Wall Paneling, Backsplash, Vanity"
                value={customCategoryName}
                onChange={(e) => setCustomCategoryName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-border bg-stone-warm/50 text-sm font-medium text-brand-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900/20 focus:border-brand-900"
              />
            ) : (
              <select
                value={selectedCategoryName}
                onChange={(e) => setSelectedCategoryName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-border bg-stone-warm/50 text-sm font-medium text-brand-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900/20 focus:border-brand-900"
              >
                {existingCategories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Sub-Category / Finish */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Sub-Category / Finish Name
            </label>
            <input
              type="text"
              placeholder="e.g. Acrylic, PU Finish, Tinted Glass, Fluted Laminate"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-border bg-stone-warm/50 text-sm font-medium text-brand-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900/20 focus:border-brand-900"
            />
          </div>

          {/* Description (In place of Pricing Type) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Description
            </label>
            <input
              type="text"
              placeholder="e.g. 1mm anti-fingerprint matte with 2mm PVC edgeband"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-border bg-stone-warm/50 text-sm font-normal text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900/20 focus:border-brand-900"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Optional material specification note displayed on quotations.
            </span>
          </div>

          {/* Rate Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Rate (₹ / sq.ft)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="50"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                required
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-stone-border bg-stone-warm/50 text-sm font-mono font-bold text-brand-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900/20 focus:border-brand-900"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-stone-border/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-stone-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4 text-accent-gold" />
              <span>Add to Room Catalog</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
