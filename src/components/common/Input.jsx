import React from 'react';

export default function Input({
  label,
  type = 'text',
  placeholder,
  error,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/60 dark:text-white/60">
          {label} {required && <span className="text-[#B91C1C]">*</span>}
        </label>
      )}
      
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className={`w-full px-5 py-4 text-sm bg-transparent border ${
          error ? 'border-[#B91C1C]' : 'border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'
        } text-black dark:text-white focus:outline-none focus:border-[#D4AF37] dark:focus:border-[#D4AF37] font-medium tracking-wide transition-all duration-300`}
        {...props}
      />

      {error && (
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#B91C1C]">
          {error}
        </span>
      )}
    </div>
  );
}