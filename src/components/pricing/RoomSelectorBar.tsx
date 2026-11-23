import React, { useState } from 'react';
import { RoomCatalog } from '../../types/pricing';
import { Plus, Edit2, Trash2, Home, Check, X } from 'lucide-react';

interface RoomSelectorBarProps {
  rooms: RoomCatalog[];
  selectedRoomId: string;
  onSelectRoom: (roomId: string) => void;
  onAddRoomClick: () => void;
  onRenameRoom: (roomId: string, newName: string) => void;
  onDeleteRoom: (roomId: string) => void;
}

export const RoomSelectorBar: React.FC<RoomSelectorBarProps> = ({
  rooms,
  selectedRoomId,
  onSelectRoom,
  onAddRoomClick,
  onRenameRoom,
  onDeleteRoom,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];
  const [tempName, setTempName] = useState(selectedRoom?.name || '');

  React.useEffect(() => {
    if (selectedRoom) {
      setTempName(selectedRoom.name);
    }
    setIsEditingName(false);
  }, [selectedRoomId, selectedRoom]);

  const handleSaveRename = () => {
    if (tempName.trim() && selectedRoom) {
      onRenameRoom(selectedRoom.id, tempName.trim());
      setIsEditingName(false);
    }
  };

  const handleDelete = () => {
    if (rooms.length <= 1) {
      alert('At least one room must remain in the catalog.');
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete the room "${selectedRoom?.name}" and all its category finishes?`
      )
    ) {
      onDeleteRoom(selectedRoom.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-border/80 p-5 shadow-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Dropdown or Rename Input */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Home className="w-4 h-4 text-accent-gold" />
            <span>Select Room to Configure:</span>
          </div>

          {!isEditingName ? (
            <div className="flex items-center gap-2">
              <select
                value={selectedRoomId}
                onChange={(e) => onSelectRoom(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-stone-border bg-stone-warm font-semibold text-brand-950 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900/20 focus:border-brand-900 cursor-pointer shadow-sm transition"
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} ({room.categories.reduce((acc, c) => acc + c.subCategories.length, 0)} finishes)
                  </option>
                ))}
              </select>

              {/* Action icons for current room */}
              <button
                onClick={() => setIsEditingName(true)}
                title="Rename this room"
                className="p-2 rounded-lg text-slate-500 hover:text-brand-900 hover:bg-stone-100 transition"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleDelete}
                title="Delete this room"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                autoFocus
                className="px-3 py-1.5 rounded-lg border border-brand-800 text-sm font-semibold text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-900"
              />
              <button
                onClick={handleSaveRename}
                className="p-1.5 rounded-lg bg-brand-900 text-white hover:bg-brand-800 transition"
                title="Save Name"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setTempName(selectedRoom?.name || '');
                  setIsEditingName(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-stone-100 transition"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right: + Add New Room CTA */}
        <div>
          <button
            onClick={onAddRoomClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-brand-800 text-brand-900 hover:bg-brand-50 text-xs font-semibold transition shadow-sm"
          >
            <Plus className="w-4 h-4 text-accent-gold" />
            <span>+ Add New Room</span>
          </button>
        </div>
      </div>
    </div>
  );
};
