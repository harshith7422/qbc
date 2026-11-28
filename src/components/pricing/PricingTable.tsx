import React, { useState } from 'react';
import { RoomCatalog, CategoryItem, SubCategoryItem, PricingType } from '../../types/pricing';
import { Plus, Trash2, Edit3, Check, X, Sparkles, Layers } from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';

interface PricingTableProps {
  room: RoomCatalog;
  globalBaseRate: number;
  onUpdateRoomCategories: (categories: CategoryItem[]) => void;
  onOpenAddModal: () => void;
  onSaveAllChanges: () => void;
  isSaving?: boolean;
}

interface FlatPricingRow {
  categoryId: string;
  categoryName: string;
  subCategoryId: string;
  subCategoryName: string;
  pricingType?: PricingType;
  rate: number;
  description?: string;
}

export const PricingTable: React.FC<PricingTableProps> = ({
  room,
  globalBaseRate,
  onUpdateRoomCategories,
  onOpenAddModal,
  onSaveAllChanges,
  isSaving = false,
}) => {
  // Editing state for an individual row
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState<string>('');
  const [editSubName, setEditSubName] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editRate, setEditRate] = useState<number>(0);

  // Flatten categories & subcategories into a clean list for the table
  const rows: FlatPricingRow[] = [];
  room.categories.forEach((cat) => {
    cat.subCategories.forEach((sub) => {
      rows.push({
        categoryId: cat.id,
        categoryName: cat.name,
        subCategoryId: sub.id,
        subCategoryName: sub.name,
        pricingType: sub.pricingType,
        rate: sub.rate,
        description: sub.description,
      });
    });
  });

  const startEdit = (row: FlatPricingRow) => {
    setEditingSubId(row.subCategoryId);
    setEditCategoryName(row.categoryName);
    setEditSubName(row.subCategoryName);
    setEditDescription(row.description || '');
    setEditRate(row.rate);
  };

  const cancelEdit = () => {
    setEditingSubId(null);
  };

  const saveEdit = (row: FlatPricingRow) => {
    const updatedCats = room.categories.map((cat) => {
      let updatedCatName = cat.name;
      if (cat.id === row.categoryId && editCategoryName.trim()) {
        updatedCatName = editCategoryName.trim();
      }

      const updatedSubs = cat.subCategories.map((sub) => {
        if (sub.id === row.subCategoryId) {
          return {
            ...sub,
            name: editSubName.trim() || sub.name,
            description: editDescription.trim() || undefined,
            rate: Number(editRate) || 0,
          };
        }
        return sub;
      });

      return {
        ...cat,
        name: updatedCatName,
        subCategories: updatedSubs,
      };
    });

    onUpdateRoomCategories(updatedCats);
    setEditingSubId(null);
  };

  const deleteRow = (row: FlatPricingRow) => {
    if (
      !window.confirm(
        `Are you sure you want to remove "${row.subCategoryName}" from ${row.categoryName}?`
      )
    ) {
      return;
    }

    const updatedCats = room.categories
      .map((cat) => {
        if (cat.id === row.categoryId) {
          const remainingSubs = cat.subCategories.filter((s) => s.id !== row.subCategoryId);
          return {
            ...cat,
            subCategories: remainingSubs,
          };
        }
        return cat;
      })
      .filter((cat) => cat.subCategories.length > 0); // Remove empty categories

    onUpdateRoomCategories(updatedCats);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-border/80 shadow-card overflow-hidden">
      {/* Table Header Bar */}
      <div className="p-5 border-b border-stone-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-warm/30">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent-gold" />
            <h3 className="text-base font-bold font-serif text-brand-950">
              {room.name} — Category and Subcategory Pricing
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pricing rules applied when this room is selected inside the quotation generator.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-accent-gold" />
          <span>+ Add Category / Finish</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-100/75 border-b border-stone-border text-slate-600 font-semibold tracking-wider uppercase text-[11px]">
              <th className="py-3.5 px-5 w-1/5">Category</th>
              <th className="py-3.5 px-5 w-1/4">Sub-Category / Finish</th>
              <th className="py-3.5 px-5 w-1/3">Description</th>
              <th className="py-3.5 px-5 w-36 text-right">Rate (₹ / sq.ft)</th>
              <th className="py-3.5 px-5 w-24 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-sans">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <p className="text-sm">No finishes configured for this room yet.</p>
                  <button
                    onClick={onOpenAddModal}
                    className="mt-3 text-xs text-brand-900 font-semibold underline underline-offset-4"
                  >
                    + Add the first category / finish
                  </button>
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const isEditing = editingSubId === row.subCategoryId;

                return (
                  <tr
                    key={`${row.categoryId}-${row.subCategoryId}`}
                    className={`transition-colors ${
                      isEditing
                        ? 'bg-amber-50/60'
                        : 'hover:bg-stone-50/60'
                    }`}
                  >
                    {/* Column 1: Category */}
                    <td className="py-3.5 px-5 font-medium text-brand-950 align-top">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white font-medium text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-900"
                        />
                      ) : (
                        <span className="font-semibold">{row.categoryName}</span>
                      )}
                    </td>

                    {/* Column 2: Sub-Category / Finish */}
                    <td className="py-3.5 px-5 text-slate-700 align-top">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editSubName}
                          onChange={(e) => setEditSubName(e.target.value)}
                          placeholder="Sub-category name"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-900"
                        />
                      ) : (
                        <div className="font-semibold text-slate-900">{row.subCategoryName}</div>
                      )}
                    </td>

                    {/* Column 3: Description (Separate Column) */}
                    <td className="py-3.5 px-5 text-slate-600 align-top">
                      {isEditing ? (
                        <textarea
                          rows={2}
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Material specification / description note (optional)..."
                          className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-900 resize-none"
                        />
                      ) : (
                        <div className="text-xs text-slate-600 leading-relaxed">
                          {row.description || <span className="text-slate-300 italic">—</span>}
                        </div>
                      )}
                    </td>

                    {/* Column 4: Rate (₹) */}
                    <td className="py-3.5 px-5 text-right font-mono text-sm align-top">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-slate-400">₹</span>
                          <input
                            type="number"
                            min="0"
                            value={editRate}
                            onChange={(e) => setEditRate(Number(e.target.value))}
                            className="w-24 px-2 py-1 text-right rounded-lg border border-amber-300 bg-white font-bold font-mono focus:outline-none focus:ring-1 focus:ring-brand-900"
                          />
                        </div>
                      ) : (
                        <div className="font-bold text-brand-950">
                          {formatINR(row.rate)}
                          <span className="text-[10px] text-slate-400 font-sans font-normal ml-0.5">
                            /sq.ft
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Column 5: Actions */}
                    <td className="py-3.5 px-5 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => saveEdit(row)}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                            title="Apply changes"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-stone-100 transition"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => startEdit(row)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-900 hover:bg-stone-100 transition"
                            title="Edit Category or Rate"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteRow(row)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete this finish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Save All Changes */}
      <div className="p-4 bg-stone-50 border-t border-stone-border/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Sparkles className="w-4 h-4 text-accent-gold" />
          <span>
            {rows.length} materials configured for {room.name}.
          </span>
        </div>

        <button
          onClick={onSaveAllChanges}
          disabled={isSaving}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 disabled:opacity-50 text-white text-xs font-bold tracking-wide transition shadow-sm"
        >
          {isSaving ? 'Saving Changes...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
};
