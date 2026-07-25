import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { X, UserPlus, Loader2 } from 'lucide-react';

export default function AddStaffModal({ isOpen, onClose, onStaffAdded }) {
  const [formData, setFormData] = useState({ name: '', role: 'Site Manager', phone: '' });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('staff').insert([formData]);
      if (error) throw error;

      setFormData({ name: '', role: 'Site Manager', phone: '' });
      onStaffAdded();
      onClose();
    } catch (err) {
      alert('Error adding staff member: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative text-zinc-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-red-600/10 text-red-500 p-2.5 rounded-xl border border-red-500/20">
            <UserPlus size={22} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-wide">Add Staff Member</h3>
            <p className="text-xs text-zinc-400">Add site manager or carpenter details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 transition"
            >
              <option value="Site Manager">Site Manager</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Technician">Technician</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 transition"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white font-bold text-xs rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              <span>Save Staff</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}