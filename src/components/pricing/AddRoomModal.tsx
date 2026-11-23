import React, { useState } from 'react';
import { X, Plus, Home } from 'lucide-react';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRoom: (roomName: string) => void;
  existingRoomNames: string[];
}

export const AddRoomModal: React.FC<AddRoomModalProps> = ({
  isOpen,
  onClose,
  onAddRoom,
  existingRoomNames,
}) => {
  const [roomName, setRoomName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = roomName.trim();
    if (!trimmed) return;

    if (existingRoomNames.some((n) => n.toLowerCase() === trimmed.toLowerCase())) {
      alert(`A room named "${trimmed}" already exists.`);
      return;
    }

    onAddRoom(trimmed);
    setRoomName('');
    onClose();
  };

  const suggestions = [
    'Pooja Room',
    'Foyer / Entryway',
    'Study & Home Office',
    'Balcony Deck',
    'Dining Area',
    'Utility & Laundry',
    'Guest Bedroom',
    'Kids Bedroom',
    'Entertainment Lounge',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-modal border border-stone-border">
        <div className="flex items-center justify-between pb-4 border-b border-stone-border/80">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-accent-gold" />
            <h3 className="text-lg font-bold font-serif text-brand-950">Add New Room</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-stone-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Room / Zone Name
            </label>
            <input
              type="text"
              placeholder="e.g. Balcony Deck, Study Room, Pooja Room"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-border bg-stone-warm/50 text-sm font-semibold text-brand-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-900/20 focus:border-brand-900"
            />
          </div>

          {/* Quick Suggestions */}
          <div>
            <div className="text-[11px] font-semibold text-slate-500 mb-2">
              Common Interior Spaces:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setRoomName(sug)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-700 font-medium transition"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>

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
              <span>Create Room</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
