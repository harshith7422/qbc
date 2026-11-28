import React, { useState } from 'react';
import { MasterPricingCatalog, CategoryItem } from '../types/pricing';
import { GlobalRateCard } from '../components/pricing/GlobalRateCard';
import { RoomSelectorBar } from '../components/pricing/RoomSelectorBar';
import { PricingTable } from '../components/pricing/PricingTable';
import { AddFinishModal } from '../components/pricing/AddFinishModal';
import { AddRoomModal } from '../components/pricing/AddRoomModal';
import { RotateCcw, Check, Sparkles } from 'lucide-react';

interface MasterPricingProps {
  catalog: MasterPricingCatalog;
  onUpdateCatalog: (newCatalog: MasterPricingCatalog) => void;
  onResetCatalog: () => void;
}

export const MasterPricing: React.FC<MasterPricingProps> = ({
  catalog,
  onUpdateCatalog,
  onResetCatalog,
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    catalog.rooms[0]?.id || ''
  );
  const [isAddFinishOpen, setIsAddFinishOpen] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Fallback if selected room got deleted
  const currentRoom =
    catalog.rooms.find((r) => r.id === selectedRoomId) || catalog.rooms[0];

  const showNotification = (msg: string) => {
    setSaveSuccessMessage(msg);
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  // 1. Save Global Base Rate
  const handleSaveGlobalRate = (newRate: number) => {
    const updated: MasterPricingCatalog = {
      ...catalog,
      globalBaseRate: newRate,
      lastUpdated: new Date().toISOString(),
    };
    onUpdateCatalog(updated);
    showNotification(`Global Base Rate updated to ₹${newRate.toLocaleString('en-IN')}/sq.ft`);
  };

  // 2. Room Management
  const handleAddRoom = (roomName: string) => {
    const newRoomId = `room-${Date.now()}`;
    const newRoom = {
      id: newRoomId,
      name: roomName,
      isCustom: true,
      categories: [
        {
          id: `cat-${Date.now()}`,
          name: 'Main Cabinetry',
          subCategories: [
            {
              id: `sub-${Date.now()}`,
              name: 'Laminate Finish',
              pricingType: 'fixed' as const,
              rate: 1500,
              description: 'Standard factory-pressed matte laminate finish',
            },
          ],
        },
      ],
    };

    const updated: MasterPricingCatalog = {
      ...catalog,
      rooms: [...catalog.rooms, newRoom],
      lastUpdated: new Date().toISOString(),
    };
    onUpdateCatalog(updated);
    setSelectedRoomId(newRoomId);
    showNotification(`Room "${roomName}" created and added to catalog.`);
  };

  const handleRenameRoom = (roomId: string, newName: string) => {
    const updatedRooms = catalog.rooms.map((r) =>
      r.id === roomId ? { ...r, name: newName } : r
    );
    const updated = { ...catalog, rooms: updatedRooms, lastUpdated: new Date().toISOString() };
    onUpdateCatalog(updated);
    showNotification(`Room renamed to "${newName}".`);
  };

  const handleDeleteRoom = (roomId: string) => {
    const target = catalog.rooms.find((r) => r.id === roomId);
    const updatedRooms = catalog.rooms.filter((r) => r.id !== roomId);
    const updated = { ...catalog, rooms: updatedRooms, lastUpdated: new Date().toISOString() };
    onUpdateCatalog(updated);
    if (updatedRooms.length > 0) {
      setSelectedRoomId(updatedRooms[0].id);
    }
    showNotification(`Room "${target?.name}" removed.`);
  };

  // 3. Update Categories for current room
  const handleUpdateRoomCategories = (updatedCategories: CategoryItem[]) => {
    const updatedRooms = catalog.rooms.map((r) => {
      if (r.id === currentRoom.id) {
        return {
          ...r,
          categories: updatedCategories,
        };
      }
      return r;
    });

    const updated: MasterPricingCatalog = {
      ...catalog,
      rooms: updatedRooms,
      lastUpdated: new Date().toISOString(),
    };
    onUpdateCatalog(updated);
  };

  // 4. Add finish to current room
  const handleAddFinish = (
    categoryName: string,
    subCategory: {
      id: string;
      name: string;
      pricingType?: 'fixed' | 'variable';
      rate: number;
      description?: string;
    }
  ) => {
    const existingCat = currentRoom.categories.find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase()
    );

    const finishToSave = {
      ...subCategory,
      pricingType: subCategory.pricingType || 'fixed',
    };

    let updatedCategories: CategoryItem[];

    if (existingCat) {
      updatedCategories = currentRoom.categories.map((c) => {
        if (c.id === existingCat.id) {
          return {
            ...c,
            subCategories: [...c.subCategories, finishToSave],
          };
        }
        return c;
      });
    } else {
      const newCategory: CategoryItem = {
        id: `cat-${Date.now()}`,
        name: categoryName,
        subCategories: [finishToSave],
      };
      updatedCategories = [...currentRoom.categories, newCategory];
    }

    handleUpdateRoomCategories(updatedCategories);
    showNotification(`Added "${subCategory.name}" under ${categoryName}.`);
  };

  const handleSaveAll = () => {
    onUpdateCatalog({
      ...catalog,
      lastUpdated: new Date().toISOString(),
    });
    showNotification('All pricing and room catalog configurations saved!');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Toast Notification */}
      {saveSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-brand-900 text-white text-xs font-semibold shadow-modal border border-accent-gold/40 animate-slideUp">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Admin Panel Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 text-white shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-accent-gold text-brand-950">
              Admin Panel
            </span>
            <span className="text-xs text-slate-300">Master Pricing Engine</span>
          </div>
          <h2 className="text-xl font-bold font-serif tracking-tight mt-1.5">
            Master Pricing & Room Catalog
          </h2>
          <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
            Configure default sq.ft material rates, finishes, and room scopes. The quotation maker dynamically pulls active rates from this catalog.
          </p>
        </div>

        <button
          onClick={() => {
            if (
              window.confirm(
                'Are you sure you want to reset the master catalog back to default studio rates?'
              )
            ) {
              onResetCatalog();
              showNotification('Catalog reset to default studio presets.');
            }
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition border border-white/10 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Section A: Global Base Sq.Ft Rate */}
      <GlobalRateCard
        currentRate={catalog.globalBaseRate}
        onSaveRate={handleSaveGlobalRate}
      />

      {/* Section B: Room Configuration */}
      <RoomSelectorBar
        rooms={catalog.rooms}
        selectedRoomId={currentRoom.id}
        onSelectRoom={setSelectedRoomId}
        onAddRoomClick={() => setIsAddRoomOpen(true)}
        onRenameRoom={handleRenameRoom}
        onDeleteRoom={handleDeleteRoom}
      />

      {/* Section C: Category and Subcategory Pricing Table */}
      <PricingTable
        room={currentRoom}
        globalBaseRate={catalog.globalBaseRate}
        onUpdateRoomCategories={handleUpdateRoomCategories}
        onOpenAddModal={() => setIsAddFinishOpen(true)}
        onSaveAllChanges={handleSaveAll}
      />

      {/* Modals */}
      <AddFinishModal
        isOpen={isAddFinishOpen}
        onClose={() => setIsAddFinishOpen(false)}
        roomName={currentRoom.name}
        existingCategories={currentRoom.categories}
        onAddFinish={handleAddFinish}
        globalBaseRate={catalog.globalBaseRate}
      />

      <AddRoomModal
        isOpen={isAddRoomOpen}
        onClose={() => setIsAddRoomOpen(false)}
        onAddRoom={handleAddRoom}
        existingRoomNames={catalog.rooms.map((r) => r.name)}
      />
    </div>
  );
};
