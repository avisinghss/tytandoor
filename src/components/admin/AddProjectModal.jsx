import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../services/supabaseClient';
import { X, FolderPlus, Loader2, ChevronDown, Check } from 'lucide-react';

const STATUS_OPTIONS = [
  { label: 'RUNNING', value: 'RUNNING' },
  { label: 'COMPLETED', value: 'COMPLETED' },
];

// Reusable Custom Dropdown Component
function CustomSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Select Status',
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value || opt === value);
  const displayLabel = selectedOption
    ? typeof selectedOption === 'object'
      ? selectedOption.label
      : selectedOption
    : value;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between text-left text-sm px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
          disabled
            ? 'bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed'
            : 'bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:border-red-600'
        } ${isOpen ? 'border-red-600 ring-1 ring-red-600' : ''}`}
      >
        <span className={value ? 'text-white font-medium' : 'text-zinc-500'}>
          {displayLabel || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-zinc-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-red-500' : ''
          }`}
        />
      </button>

      {/* Dropdown Options List */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl max-h-56 overflow-y-auto py-1 text-sm animate-in fade-in zoom-in-95 duration-150">
          {options.map((option, idx) => {
            const optionValue = typeof option === 'object' ? option.value : option;
            const optionLabel = typeof option === 'object' ? option.label : option;
            const isSelected = optionValue === value;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(optionValue);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-red-950/40 hover:text-red-400 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-red-950/30 text-red-400 font-bold'
                    : 'text-zinc-200'
                }`}
              >
                <span className="truncate">{optionLabel}</span>
                {isSelected && <Check size={16} className="text-red-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AddProjectModal({ isOpen, onClose, onProjectAdded }) {
  const [formData, setFormData] = useState({ name: '', client: '', status: 'RUNNING' });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('projects').insert([formData]);
      if (error) throw error;

      setFormData({ name: '', client: '', status: 'RUNNING' });
      onProjectAdded();
      onClose();
    } catch (err) {
      alert('Error adding project: ' + err.message);
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
            <FolderPlus size={22} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-wide">Add New Project</h3>
            <p className="text-xs text-zinc-400">Track client installations and progress</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
              Project Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Villa Door Setup"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
              Client Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mr. Verma"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
              Status
            </label>
            <CustomSelect
              options={STATUS_OPTIONS}
              value={formData.status}
              onChange={(val) => setFormData({ ...formData, status: val })}
              placeholder="Select Status"
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
              {loading ? <Loader2 size={16} className="animate-spin" /> : <FolderPlus size={16} />}
              <span>Save Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}