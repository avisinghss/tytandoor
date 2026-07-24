import React from 'react';
import { Plus, Phone, Edit3, Trash2 } from 'lucide-react';

export default function StaffTab({ staffList, onOpenModal, onDeleteStaff }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black">Staff Management</h2>
          <p className="text-xs text-zinc-400">Track and contact site managers and carpenters</p>
        </div>

        <button
          onClick={() => onOpenModal()}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Staff Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.length === 0 ? (
          <p className="text-zinc-500 text-sm">No staff members found.</p>
        ) : (
          staffList.map((s) => (
            <div key={s.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-md">
              <div>
                <h3 className="font-bold text-white text-base">{s.name}</h3>
                <span className="inline-block bg-red-500/10 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-md mt-1">
                  {s.role}
                </span>
                <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1.5">
                  <Phone size={12} className="text-zinc-500" /> {s.phone}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${s.phone}`}
                  className="p-2.5 bg-zinc-800 hover:bg-emerald-600 text-white rounded-xl transition"
                  title="Call"
                >
                  <Phone size={15} />
                </a>
                <button
                  onClick={() => onOpenModal(s)}
                  className="p-2.5 bg-zinc-800 hover:bg-blue-600 text-zinc-300 hover:text-white rounded-xl transition cursor-pointer"
                  title="Edit"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => onDeleteStaff(s.id, s.name)}
                  className="p-2.5 bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white rounded-xl transition cursor-pointer"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}