import React, { useState } from 'react';
import { Phone, Trash2, CheckCircle2, Clock, Package, AlertCircle } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

export default function CallsTab({ 
  callRequests = [], 
  selectedCallIds = [], 
  onToggleSelect, 
  onDeleteSelected,
  onCallsUpdated 
}) {
  const [updatingId, setUpdatingId] = useState(null);

  // Toggle call status between PENDING and RESOLVED directly in Supabase
  const handleStatusToggle = async (id, currentStatus) => {
    setUpdatingId(id);
    const newStatus = currentStatus === 'RESOLVED' ? 'PENDING' : 'RESOLVED';
    
    try {
      // Attempt update on 'call_requests' table first
      let { error } = await supabase
        .from('call_requests')
        .update({ status: newStatus })
        .eq('id', id);

      // Fallback attempt on 'calls' table if needed
      if (error) {
        await supabase
          .from('calls')
          .update({ status: newStatus })
          .eq('id', id);
      }

      if (onCallsUpdated) onCallsUpdated();
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Call Back Requests</h2>
          <p className="text-xs text-zinc-400 mt-1">Directly contact customers requesting expert call assistance</p>
        </div>

        {selectedCallIds.length > 0 && (
          <button
            onClick={onDeleteSelected}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-lg active:scale-95"
          >
            <Trash2 size={16} />
            <span>Delete Selected ({selectedCallIds.length})</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {callRequests.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="font-bold text-white text-sm">No Call Requests Yet</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            When users click "Confused? Get Call From Experts" on a product detail page, their request will appear here.
          </p>
        </div>
      ) : (
        /* Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {callRequests.map((c) => {
            const isResolved = c.status === 'RESOLVED';

            return (
              <div 
                key={c.id} 
                className={`bg-zinc-900 border rounded-2xl p-5 space-y-4 relative transition-all duration-200 ${
                  isResolved ? 'border-zinc-800/60 opacity-75' : 'border-zinc-800 shadow-md'
                }`}
              >
                {/* Header Row: Checkbox, Name, Address & Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedCallIds.includes(c.id)}
                      onChange={() => onToggleSelect(c.id)}
                      className="rounded accent-red-600 w-4 h-4 cursor-pointer mt-1"
                    />
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight">{c.name}</h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {c.address || c.city || 'Location not specified'}
                      </p>
                    </div>
                  </div>

                  {/* Status Toggle Button */}
                  <button
                    disabled={updatingId === c.id}
                    onClick={() => handleStatusToggle(c.id, c.status)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition cursor-pointer ${
                      isResolved
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                    }`}
                  >
                    {isResolved ? (
                      <>
                        <CheckCircle2 size={12} />
                        <span>Resolved</span>
                      </>
                    ) : (
                      <>
                        <Clock size={12} />
                        <span>Pending</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Product Reference */}
                {c.product_name && (
                  <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-2.5 flex items-center gap-2 text-xs text-zinc-300">
                    <Package size={14} className="text-red-500 shrink-0" />
                    <span className="truncate font-medium">
                      Inquired for: <strong className="text-white">{c.product_name}</strong>
                    </span>
                  </div>
                )}

                {/* Footer Action Bar */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {c.created_at
                      ? new Date(c.created_at).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Recently'}
                  </span>

                  <a
                    href={`tel:${c.phone}`}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-md"
                  >
                    <Phone size={14} />
                    <span>Call Now ({c.phone})</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}