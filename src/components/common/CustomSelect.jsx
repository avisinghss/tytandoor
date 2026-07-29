import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Select option...',
  label,
  required = false,
  className = '',
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

  const selectedOption = options.find((opt) =>
    typeof opt === 'object' ? opt.value === value : opt === value
  );

  const getLabel = (opt) => (typeof opt === 'object' ? opt.label : opt);
  const getValue = (opt) => (typeof opt === 'object' ? opt.value : opt);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border text-xs sm:text-sm rounded-xl transition-all cursor-pointer text-left ${
          isOpen
            ? 'border-red-600 ring-2 ring-red-600/20'
            : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={
            selectedOption
              ? 'text-zinc-900 dark:text-zinc-100 font-medium'
              : 'text-zinc-400'
          }
        >
          {selectedOption ? getLabel(selectedOption) : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-red-600' : ''
          }`}
        />
      </button>

      {/* Custom Options Menu (Renders seamlessly across all devices) */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl max-h-56 overflow-y-auto py-1 animate-in fade-in zoom-in-95 duration-150">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-xs text-zinc-400 text-center">
              No options available
            </div>
          ) : (
            options.map((option, index) => {
              const val = getValue(option);
              const lbl = getLabel(option);
              const isSelected = val === value;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelect(val)}
                  className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-colors ${
                    isSelected
                      ? 'bg-red-50/70 dark:bg-red-950/20 text-red-600 font-bold'
                      : 'text-zinc-700 dark:text-zinc-200'
                  }`}
                >
                  <span>{lbl}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-red-600" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}