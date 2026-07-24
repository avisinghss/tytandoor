import React from 'react';
import { Phone, Trash2 } from 'lucide-react';

export default function CallsTab({ callRequests, selectedCallIds, onToggleSelect, onDeleteSelected }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black">Call Back Requests</h2>
          <p className="text-xs text-zinc-400">Directly contact customers requesting expert calls</p>
        </div>

        {selectedCallIds.length > 0 && (
          <button
            onClick={onDeleteSelected}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <Trash2 size={16} />
            <span>Delete Selected ({selectedCallIds.length})</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {callRequests.map((c) => (
          <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedCallIds.includes(c.id)}
                  onChange={() => onToggleSelect(c.id)}
                  className="rounded accent-red-600 w-4 h-4 cursor-pointer"
                />
                <div>
                  <h3 className="font-bold text-white text-base">{c.name}</h3>
                  <p className="text-xs text-zinc-400">{c.address || 'Location not specified'}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500">
                {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>

              <a
                href={`tel:${c.phone}`}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                <Phone size={14} />
                <span>Call Now ({c.phone})</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}