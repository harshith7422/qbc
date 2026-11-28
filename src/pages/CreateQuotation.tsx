import React, { useState, useEffect } from 'react';
import { Quotation, QuotationRoom, QuotationSummary } from '../types/quotation';
import { CustomerDetails } from '../types/customer';
import { MasterPricingCatalog } from '../types/pricing';
import { CustomerDetailsForm } from '../components/quotation/CustomerDetailsForm';
import { RoomCard } from '../components/quotation/RoomCard';
import { QuotationSummaryBar } from '../components/quotation/QuotationSummaryBar';
import { 
  recalculateQuotationSummary, 
  generateQuotationReference, 
  generateId, 
  calculateBasePrice 
} from '../utils/calculations';
import { Plus, Home, Sparkles, AlertCircle, ArrowLeft, Check } from 'lucide-react';

interface CreateQuotationProps {
  catalog: MasterPricingCatalog;
  onSaveQuotation: (quotation: Quotation) => void;
  onPreviewQuotation: (quotation: Quotation) => void;
  editingQuotation?: Quotation | null;
  onCancelEdit?: () => void;
  existingQuotationsCount: number;
}

export const CreateQuotation: React.FC<CreateQuotationProps> = ({
  catalog,
  onSaveQuotation,
  onPreviewQuotation,
  editingQuotation,
  onCancelEdit,
  existingQuotationsCount,
}) => {
  // Initialize customer details
  const [customer, setCustomer] = useState<CustomerDetails>(() => {
    if (editingQuotation) {
      return editingQuotation.customer;
    }
    return {
      customerName: '',
      contactNumber: '',
      email: '',
      projectName: '',
      projectLocation: 'HSR Layout, Bengaluru',
      quotationDate: new Date().toISOString().split('T')[0],
      referenceNumber: generateQuotationReference(existingQuotationsCount),
    };
  });

  // Initialize rooms
  const [rooms, setRooms] = useState<QuotationRoom[]>(() => {
    if (editingQuotation && editingQuotation.rooms.length > 0) {
      return editingQuotation.rooms;
    }
    // Default with Kitchen prepopulated
    const kitchenCatalog = catalog.rooms.find((r) => r.name.toLowerCase() === 'kitchen') || catalog.rooms[0];
    const initialItem = kitchenCatalog?.categories[0]?.subCategories[0];
    const area = 30;
    const rate = initialItem?.rate || 1950;
    const base = calculateBasePrice(rate, area);

    return [
      {
        id: generateId('qroom'),
        roomId: kitchenCatalog?.id || 'room-kitchen',
        roomName: kitchenCatalog?.name || 'Kitchen',
        roomArea: area,
        items: initialItem
          ? [
              {
                id: generateId('item'),
                categoryId: kitchenCatalog.categories[0].id,
                categoryName: kitchenCatalog.categories[0].name,
                subCategoryId: initialItem.id,
                subCategoryName: initialItem.name,
                pricingType: initialItem.pricingType || 'fixed',
                ratePerSqFt: rate,
                height: 6,
                width: 5,
                area: area,
                basePrice: base,
                finalPrice: base + 3000, // sample prefilled quoted price
                notes: initialItem.description || 'BWR grade marine carcass with seamless edge banding',
              },
            ]
          : [],
      },
    ];
  });

  const [gstEnabled, setGstEnabled] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<string | null>(null);

  // Calculate summary dynamically
  const summary: QuotationSummary = recalculateQuotationSummary(
    rooms,
    0,
    gstEnabled ? 18 : 0
  );

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Add room dropdown / selector
  const [selectedCatalogRoomId, setSelectedCatalogRoomId] = useState<string>(
    catalog.rooms[0]?.id || ''
  );

  const handleAddRoom = () => {
    const targetCatalogRoom = catalog.rooms.find((r) => r.id === selectedCatalogRoomId);
    if (!targetCatalogRoom) return;

    // Check how many of this room already exist
    const count = rooms.filter((r) => r.roomId === targetCatalogRoom.id).length;
    const roomDisplayName = count > 0 ? `${targetCatalogRoom.name} (${count + 1})` : targetCatalogRoom.name;

    const newRoom: QuotationRoom = {
      id: generateId('qroom'),
      roomId: targetCatalogRoom.id,
      roomName: roomDisplayName,
      roomArea: 35, // default 35 sq.ft
      items: [],
    };

    setRooms([...rooms, newRoom]);
    showToast(`Added ${roomDisplayName} to quotation.`);
  };

  const handleUpdateRoom = (index: number, updatedRoom: QuotationRoom) => {
    const updated = [...rooms];
    updated[index] = updatedRoom;
    setRooms(updated);
  };

  const handleRemoveRoom = (index: number) => {
    if (rooms.length <= 1) {
      alert('Quotation must contain at least one room.');
      return;
    }
    const target = rooms[index];
    if (window.confirm(`Remove ${target.roomName} from this quotation?`)) {
      setRooms(rooms.filter((_, i) => i !== index));
    }
  };

  // Validation
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!customer.customerName.trim()) errs.customerName = 'Customer name is required';
    if (!customer.contactNumber.trim()) errs.contactNumber = 'Contact number is required';
    if (!customer.projectName.trim()) errs.projectName = 'Project name is required';
    if (!customer.projectLocation.trim()) errs.projectLocation = 'Project location is required';

    const totalItems = rooms.reduce((acc, r) => acc + r.items.length, 0);
    if (totalItems === 0) {
      alert('Please add at least one material/finish item to your quotation before proceeding.');
      return false;
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Construct Quotation Object
  const buildQuotationObject = (status: 'draft' | 'generated'): Quotation => {
    return {
      id: editingQuotation ? editingQuotation.id : generateId('quot'),
      referenceNumber: customer.referenceNumber,
      customer: {
        ...customer,
      },
      rooms,
      summary,
      status,
      validityDays: 15,
      createdAt: editingQuotation ? editingQuotation.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const handleSaveDraft = () => {
    if (!customer.customerName.trim()) {
      setFormErrors({ customerName: 'Please specify customer name to save draft' });
      alert('Please enter a customer name to save as draft.');
      return;
    }
    const draft = buildQuotationObject('draft');
    onSaveQuotation(draft);
    showToast(`Quotation ${customer.referenceNumber} saved as Draft.`);
  };

  const handlePreview = () => {
    if (!validate()) return;
    const quot = buildQuotationObject('draft');
    onPreviewQuotation(quot);
  };

  const handleGenerate = () => {
    if (!validate()) return;
    const generated = buildQuotationObject('generated');
    onSaveQuotation(generated);
    onPreviewQuotation(generated);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-brand-900 text-white text-xs font-semibold shadow-modal border border-accent-gold/40 animate-slideUp">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{notification}</span>
        </div>
      )}

      {/* Editing Banner if modifying an existing proposal */}
      {editingQuotation && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span>
              Editing existing proposal: <strong>{editingQuotation.referenceNumber}</strong> ({editingQuotation.customer.customerName})
            </span>
          </div>
          {onCancelEdit && (
            <button
              onClick={onCancelEdit}
              className="text-xs text-amber-900 font-semibold underline underline-offset-4"
            >
              Cancel Edit
            </button>
          )}
        </div>
      )}

      {/* Customer & Project Details Form */}
      <CustomerDetailsForm
        customer={customer}
        onChange={(partial) => {
          setCustomer((prev) => ({ ...prev, ...partial }));
          setFormErrors({});
        }}
        errors={formErrors}
      />

      {/* Room Scope Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold font-serif text-brand-950 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-gold" />
              Room Specifications & Measurements
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Add rooms, specify sq.ft area, and select material finishes from the pricing catalog.
            </p>
          </div>

          {/* Add Room to Quote Dropdown + Button */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <select
              value={selectedCatalogRoomId}
              onChange={(e) => setSelectedCatalogRoomId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-border bg-white text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:ring-1 focus:ring-brand-900"
            >
              {catalog.rooms.map((cr) => (
                <option key={cr.id} value={cr.id}>
                  {cr.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddRoom}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5 text-accent-gold" />
              <span>+ Add Room</span>
            </button>
          </div>
        </div>

        {/* Room Cards List */}
        <div className="space-y-5">
          {rooms.map((room, index) => (
            <RoomCard
              key={room.id}
              room={room}
              roomIndex={index}
              catalogRooms={catalog.rooms}
              globalBaseRate={catalog.globalBaseRate}
              onUpdateRoom={(updated) => handleUpdateRoom(index, updated)}
              onRemoveRoom={() => handleRemoveRoom(index)}
            />
          ))}
        </div>
      </div>

      {/* Quotation Summary Bar */}
      <QuotationSummaryBar
        summary={summary}
        onSaveDraft={handleSaveDraft}
        onPreview={handlePreview}
        onGenerate={handleGenerate}
        gstEnabled={gstEnabled}
        onToggleGst={setGstEnabled}
      />
    </div>
  );
};
