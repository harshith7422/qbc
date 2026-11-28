import React, { useState, useEffect } from 'react';
import { RoomCatalog, CategoryItem, SubCategoryItem } from '../../types/pricing';
import { QuotationLineItem } from '../../types/quotation';
import { X, Plus, Calculator, Info, Sparkles } from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';
import { calculateBasePrice, generateId } from '../../utils/calculations';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomCatalog: RoomCatalog | undefined;
  roomArea?: number;
  globalBaseRate: number;
  onAddItem: (item: QuotationLineItem) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  roomCatalog,
  roomArea,
  globalBaseRate,
  onAddItem,
}) => {
  const categories = roomCatalog?.categories || [];

  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const [selectedSubId, setSelectedSubId] = useState<string>('');
  const [itemArea, setItemArea] = useState<number>(30);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [isFinalPriceManuallyChanged, setIsFinalPriceManuallyChanged] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  // Set initial selected category & subcategory when modal opens or roomCatalog changes
  useEffect(() => {
    if (categories.length > 0) {
      const firstCat = categories[0];
      setSelectedCatId(firstCat.id);
      if (firstCat.subCategories.length > 0) {
        setSelectedSubId(firstCat.subCategories[0].id);
      }
    }
    if (isOpen) {
      setItemArea(30);
      setIsFinalPriceManuallyChanged(false);
    }
  }, [isOpen, roomCatalog]);

  const currentCategory: CategoryItem | undefined = categories.find((c) => c.id === selectedCatId);
  const currentSubCategory: SubCategoryItem | undefined = currentCategory?.subCategories.find(
    (s) => s.id === selectedSubId
  );

  // When category changes, reset subcategory
  const handleCategoryChange = (catId: string) => {
    setSelectedCatId(catId);
    const cat = categories.find((c) => c.id === catId);
    if (cat && cat.subCategories.length > 0) {
      setSelectedSubId(cat.subCategories[0].id);
    } else {
      setSelectedSubId('');
    }
    setIsFinalPriceManuallyChanged(false);
  };

  // Determine rate directly from finish rate
  const effectiveRate = currentSubCategory?.rate || 0;

  // Calculate Base Price
  const calculatedBasePrice = calculateBasePrice(effectiveRate, itemArea);

  // Auto-sync final price if employee hasn't manually overridden it
  useEffect(() => {
    if (!isFinalPriceManuallyChanged) {
      setFinalPrice(calculatedBasePrice);
    }
  }, [calculatedBasePrice, isFinalPriceManuallyChanged]);

  if (!isOpen || !roomCatalog) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory || !currentSubCategory) {
      alert('Please select a category and finish.');
      return;
    }

    const newItem: QuotationLineItem = {
      id: generateId('item'),
      categoryId: currentCategory.id,
      categoryName: currentCategory.name,
      subCategoryId: currentSubCategory.id,
      subCategoryName: currentSubCategory.name,
      pricingType: currentSubCategory.pricingType || 'fixed',
      ratePerSqFt: effectiveRate,
      area: itemArea,
      basePrice: calculatedBasePrice,
      finalPrice: Number(finalPrice) || calculatedBasePrice,
      notes: notes.trim() || currentSubCategory.description || undefined,
      description: currentSubCategory.description || notes.trim() || undefined,
    };

    onAddItem(newItem);
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-modal border border-stone-border">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-border/80">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-gold" />
              <h3 className="text-lg font-bold font-serif text-brand-950">
                Add Material to {roomCatalog.name}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select category & finish from active pricing catalog.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-stone-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Select Category
            </label>
            <select
              value={selectedCatId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-border bg-stone-warm/50 text-sm font-semibold text-brand-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900/20 focus:border-brand-900"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory / Finish Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Subcategory / Finish
            </label>
            <select
              value={selectedSubId}
              onChange={(e) => {
                setSelectedSubId(e.target.value);
                setIsFinalPriceManuallyChanged(false);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-border bg-stone-warm/50 text-sm font-semibold text-brand-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900/20 focus:border-brand-900"
            >
              {currentCategory?.subCategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (₹{s.rate}/sq.ft)
                </option>
              ))}
            </select>
            {currentSubCategory?.description && (
              <p className="text-[11px] text-slate-500 mt-1 italic">
                {currentSubCategory.description}
              </p>
            )}
          </div>

          {/* Area & Calculated Base Price Row */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Applicable Area (Sq.Ft)
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={itemArea}
                onChange={(e) => {
                  setItemArea(Math.max(1, Number(e.target.value)));
                  setIsFinalPriceManuallyChanged(false);
                }}
                className="w-full px-3 py-2 rounded-lg border border-stone-border bg-white text-sm font-bold font-mono text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-900"
              />
              <span className="text-[10px] text-slate-400">Defaults to room area</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Calculator className="w-3 h-3 text-accent-gold" />
                Base Price (Internal)
              </label>
              <div className="px-3 py-2 rounded-lg bg-stone-200/60 font-mono font-bold text-slate-700 text-sm">
                {formatINR(calculatedBasePrice)}
              </div>
              <span className="text-[10px] text-slate-500">
                {formatINR(effectiveRate)} × {itemArea} sq.ft
              </span>
            </div>
          </div>

          {/* Column 4: Final Quoted Price (Manually Editable) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-brand-950 uppercase tracking-wide">
                Final Quoted Price (₹) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-emerald-700 font-medium">
                Customer Facing Amount
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="500"
                value={finalPrice}
                onChange={(e) => {
                  setFinalPrice(Number(e.target.value));
                  setIsFinalPriceManuallyChanged(true);
                }}
                required
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-brand-800 bg-amber-50/40 text-base font-bold font-mono text-brand-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-accent-gold shrink-0" />
              <span>
                Prefilled with base price (₹{calculatedBasePrice.toLocaleString('en-IN')}). Adjust to include labour, hardware, or markup.
              </span>
            </p>
          </div>

          {/* Item Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Item Notes / Hardware Specs <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Hettich soft-close hinges, bevelled profile handle"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-border bg-stone-warm/50 text-xs font-normal text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900/20 focus:border-brand-900"
            />
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
              <span>Add to Room Quote</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
