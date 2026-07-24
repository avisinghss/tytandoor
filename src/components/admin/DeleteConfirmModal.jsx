import React from 'react';
import { X } from 'lucide-react';

export default function DeleteConfirmModal({ modalData, onClose, onConfirm }) {
  if (!modalData.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">{modalData.title}</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">{modalData.message}</p>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-1/2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}