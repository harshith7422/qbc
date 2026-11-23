import React, { useState } from 'react';
import { QuotationRoom, QuotationLineItem } from '../../types/quotation';
import { RoomCatalog } from '../../types/pricing';
import { AddItemModal } from './AddItemModal';
import { 
  Home, 
  Plus, 
  Trash2, 
  Sliders, 
  Sparkles, 
  Maximize2,
  Lock,
  Edit2
} from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';
import { calculateBasePrice } from '../../utils/calculations';

interface RoomCardProps {
  room: QuotationRoom;
  roomIndex: number;
  catalogRooms: RoomCatalog[];
  globalBaseRate: number;
  onUpdateRoom: (updatedRoom: QuotationRoom) => void;
  onRemoveRoom: (roomIndex: number) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  roomIndex,
  catalogRooms,
  globalBaseRate,
  onUpdateRoom,
  onRemoveRoom,
}) => {
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingItemNotesId, setEditingItemNotesId] = useState<string | null>(null);

  // Find matching catalog configuration for available categories
  const currentCatalogRoom = catalogRooms.find(
    (c) => c.id === room.roomId || c.name.toLowerCase() === room.roomName.toLowerCase()
  ) || catalogRooms[0];

  // Update room measurements (sq.ft)
  const handleAreaChange = (newArea: number) => {
    const validArea = Math.max(1, newArea);
    // Optionally recalculate base prices for items that haven't been customized separately
    const updatedItems = room.items.map((item) => {
      const newBase = calculateBasePrice(item.ratePerSqFt, validArea);
      // If finalPrice was equal to old basePrice, update finalPrice to newBase
      const wasUntouched = item.finalPrice === item.basePrice;
      return {
        ...item,
        area: validArea,
        basePrice: newBase,
        finalPrice: wasUntouched ? newBase : item.finalPrice,
      };
    });

    onUpdateRoom({
      ...room,
      roomArea: validArea,
      items: updatedItems,
    });
  };

  // Update line item final quoted price
  const handleItemFinalPriceChange = (itemId: string, newPrice: number) => {
    const updatedItems = room.items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          finalPrice: Math.max(0, newPrice),
        };
      }
      return item;
    });

    onUpdateRoom({
      ...room,
      items: updatedItems,
    });
  };

  // Add line item
  const handleAddItem = (newItem: QuotationLineItem) => {
    onUpdateRoom({
      ...room,
      items: [...room.items, newItem],
    });
  };

  // Remove line item
  const handleRemoveItem = (itemId: string) => {
    onUpdateRoom({
      ...room,
      items: room.items.filter((item) => item.id !== itemId),
    });
  };

  // Calculate room-level totals
  const roomBaseTotal = room.items.reduce((sum, item) => sum + (Number(item.basePrice) || 0), 0);
  const roomFinalTotal = room.items.reduce((sum, item) => sum + (Number(item.finalPrice) || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-stone-border/80 shadow-card overflow-hidden">
      {/* Room Header Banner */}
      <div className="p-4 sm:p-5 bg-stone-warm/50 border-b border-stone-border/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Room Title & Measurement Input */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-9 h-9 rounded-xl bg-brand-900 text-accent-gold flex items-center justify-center font-serif font-bold text-sm shadow-sm">
            0{roomIndex + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-serif text-brand-950">
                {room.roomName}
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-200 text-slate-700 font-medium">
                {room.items.length} {room.items.length === 1 ? 'material' : 'materials'}
              </span>
            </div>
          </div>

          {/* Room Area Measurement Input */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-stone-border shadow-xs ml-0 md:ml-4">
            <Maximize2 className="w-3.5 h-3.5 text-accent-gold" />
            <span className="text-xs font-semibold text-slate-600">Room Total Area:</span>
            <input
              type="number"
              min="1"
              value={room.roomArea}
              onChange={(e) => handleAreaChange(Number(e.target.value))}
              className="w-16 px-1.5 py-0.5 font-mono font-bold text-brand-950 text-sm border-b border-brand-800 focus:outline-none"
            />
            <span className="text-xs text-slate-400 font-medium">sq.ft</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={() => setIsAddItemOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5 text-accent-gold" />
            <span>+ Add Material</span>
          </button>

          <button
            onClick={() => onRemoveRoom(roomIndex)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Delete Room"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quotation Calculation Table with EXACT 4 Primary Columns */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-100/70 border-b border-stone-border text-slate-600 font-semibold tracking-wider uppercase text-[11px]">
              <th className="py-3 px-4 w-1/4">Category</th>
              <th className="py-3 px-4 w-1/3">Subcategory / Finish</th>
              <th className="py-3 px-4 w-1/5 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Base Price (₹)</span>
                </div>
                <div className="text-[9px] text-slate-400 normal-case font-normal">
                  Internal Calculation
                </div>
              </th>
              <th className="py-3 px-4 w-1/4 text-right">
                <span className="text-brand-950 font-bold">Final Quoted Price (₹)</span>
                <div className="text-[9px] text-emerald-700 normal-case font-medium">
                  Editable Customer Price
                </div>
              </th>
              <th className="py-3 px-3 w-12 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-sans">
            {room.items.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  <p className="text-xs">No materials added to {room.roomName} yet.</p>
                  <button
                    onClick={() => setIsAddItemOpen(true)}
                    className="mt-2 text-xs text-brand-900 font-semibold underline underline-offset-4"
                  >
                    + Add materials from catalog
                  </button>
                </td>
              </tr>
            ) : (
              room.items.map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                    {/* Column 1 – Category */}
                    <td className="py-3 px-4 font-semibold text-brand-950 align-top">
                      <div>{item.categoryName}</div>
                      {item.notes && (
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5 max-w-xs">
                          {item.notes}
                        </div>
                      )}
                    </td>

                    {/* Column 2 – Subcategory / Finish */}
                    <td className="py-3 px-4 text-slate-700 align-top">
                      <div className="font-medium text-slate-900">{item.subCategoryName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {item.pricingType === 'variable' ? (
                          <span className="inline-flex items-center gap-1 text-indigo-700 font-medium">
                            <Sliders className="w-2.5 h-2.5" />
                            Variable ({formatINR(item.ratePerSqFt)}/sq.ft) × {item.area} sq.ft
                          </span>
                        ) : (
                          <span>
                            {formatINR(item.ratePerSqFt)}/sq.ft × {item.area} sq.ft
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Column 3 – Base Price (₹) [Internal Reference] */}
                    <td className="py-3 px-4 text-right align-top">
                      <div className="font-mono font-bold text-slate-600 bg-stone-100/80 px-2.5 py-1 rounded-lg inline-block border border-stone-200/60">
                        {formatINR(item.basePrice)}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">
                        Internal Only
                      </div>
                    </td>

                    {/* Column 4 – Final Quoted Price (₹) [Manually Editable] */}
                    <td className="py-3 px-4 text-right align-top">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <span className="text-slate-400 font-semibold">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={item.finalPrice}
                          onChange={(e) =>
                            handleItemFinalPriceChange(item.id, Number(e.target.value))
                          }
                          className="w-28 px-2.5 py-1.5 text-right font-mono font-bold text-sm text-brand-950 bg-amber-50/50 border border-stone-border rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-brand-900 transition"
                        />
                      </div>
                      {/* Margin pill */}
                      {item.finalPrice !== item.basePrice && (
                        <div className="text-[10px] text-emerald-700 font-medium mt-0.5 text-right">
                          {item.finalPrice > item.basePrice
                            ? `+₹${(item.finalPrice - item.basePrice).toLocaleString('en-IN')} margin`
                            : `-₹${(item.basePrice - item.finalPrice).toLocaleString('en-IN')} disc`}
                        </div>
                      )}
                    </td>

                    {/* Action: Delete line item */}
                    <td className="py-3 px-3 text-center align-top">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Room Subtotal Summary */}
      {room.items.length > 0 && (
        <div className="p-3.5 bg-stone-50/80 border-t border-stone-border/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
            <span>{room.roomName} Subtotal</span>
          </div>

          <div className="flex items-center gap-6">
            {/* Internal Base Subtotal */}
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider mr-2">
                Base Cost:
              </span>
              <span className="font-mono font-semibold text-slate-500 line-through">
                {formatINR(roomBaseTotal)}
              </span>
            </div>

            {/* Quoted Subtotal */}
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-700 mr-2">
                Room Quoted Price:
              </span>
              <span className="font-mono font-bold text-brand-950 text-sm">
                {formatINR(roomFinalTotal)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        roomCatalog={currentCatalogRoom}
        roomArea={room.roomArea}
        globalBaseRate={globalBaseRate}
        onAddItem={handleAddItem}
      />
    </div>
  );
};
