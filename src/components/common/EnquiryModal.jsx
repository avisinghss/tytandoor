import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, AlertCircle, ChevronDown, Check } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { supabase } from '../../services/supabaseClient';
import { notifyAdmins } from '../../services/notificationService';

const INITIAL_STATE = {
  name: '',
  phone: '',
  email: '',
  state: 'Uttar Pradesh',
  city: '',
  inquiryType: 'Homeowner / Retail Purchase *',
  message: '',
};

const CITY_OPTIONS = [
  'Ballia',
  'Gorakhpur',
  'Mau',
  'Deoria',
  'Azamgarh',
  'Other',
];

const INQUIRY_TYPE_OPTIONS = [
  'Homeowner / Retail Purchase *',
  'Architect / Interior Designer',
  'Commercial Developer / Contractor',
  'Distributor / Dealer Inquiry',
];

// Reusable Custom Select Component to prevent Mobile Native Radio Popup
function CustomSelect({
  options = [],
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between text-left text-xs sm:text-sm px-2.5 py-2 border rounded-lg transition-all ${
          disabled
            ? 'bg-zinc-100 text-zinc-500 border-zinc-300 cursor-not-allowed'
            : 'bg-white text-zinc-900 border-zinc-300 focus:outline-none focus:border-[#e11d23] focus:ring-1 focus:ring-[#e11d23] cursor-pointer'
        } ${isOpen ? 'border-[#e11d23] ring-1 ring-[#e11d23]' : ''}`}
      >
        <span className={value ? 'text-zinc-900' : 'text-zinc-500'}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`text-zinc-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-[#e11d23]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu List */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-xl max-h-48 overflow-y-auto py-1 text-xs sm:text-sm animate-in fade-in zoom-in-95 duration-150">
          {options.map((option, idx) => {
            const isSelected = option === value;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-red-50 hover:text-[#e11d23] transition-colors ${
                  isSelected
                    ? 'bg-red-50 text-[#e11d23] font-bold'
                    : 'text-zinc-800'
                }`}
              >
                <span className="truncate">{option}</span>
                {isSelected && <Check size={14} className="text-[#e11d23] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function EnquiryModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMessage('');
    setFormData(INITIAL_STATE);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (errorMessage) setErrorMessage('');
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomSelectChange = (field, value) => {
    if (errorMessage) setErrorMessage('');
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.city) {
      setErrorMessage('Please select a city.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const { error } = await supabase.from('enquiries').insert([
        {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          state: formData.state,
          city: formData.city,
          inquiry_type: formData.inquiryType,
          message: formData.message.trim(),
        },
      ]);

      if (error) throw error;

      void notifyAdmins({
        title: 'New product enquiry',
        body: `${formData.name.trim() || 'A customer'} submitted an enquiry.`,
        targetTab: 'enquiries',
      });

      setIsSuccess(true);

      // Automatically reset & close modal after 2.5 seconds
      setTimeout(() => {
        handleClose();
      }, 2500);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={handleClose} // Close when clicking backdrop
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-[360px] sm:max-w-[400px] bg-white rounded-2xl p-5 shadow-2xl transition-all duration-300 max-h-[90vh] overflow-y-auto scrollbar-none"
        onClick={(e) => e.stopPropagation()} // Prevent close on modal content click
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 bg-[#e11d23] hover:bg-red-700 text-white p-1.5 rounded-full shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10"
          aria-label="Close Enquiry Modal"
        >
          <X size={16} strokeWidth={3} />
        </button>

        {/* SUCCESS VIEW */}
        {isSuccess ? (
          <div className="py-6 text-center space-y-3 animate-fade-in">
            <div className="flex justify-center">
              <CheckCircle className="text-emerald-500 w-14 h-14 animate-bounce" />
            </div>
            <h3 className="text-xl font-black text-zinc-900">Enquiry Received!</h3>
            <p className="text-xs text-zinc-600 leading-relaxed max-w-[260px] mx-auto">
              Thank you for reaching out. Our team will get back to you shortly.
            </p>
            <button
              onClick={handleClose}
              className="mt-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold px-6 py-2 rounded-xl transition cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          /* FORM VIEW */
          <>
            {/* Modal Heading */}
            <h2
              id="modal-title"
              className="text-xl font-black text-zinc-900 mb-3 tracking-tight pr-6"
            >
              Enquire Now
            </h2>

            {/* Error Message Banner */}
            {errorMessage && (
              <div className="mb-3 flex items-center gap-2 p-2.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Compact Form */}
            <form onSubmit={handleSubmit} className="space-y-2.5">
              {/* Name */}
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name *"
                  required
                  aria-label="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white text-zinc-900 text-xs sm:text-sm placeholder-zinc-500 border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e11d23] focus:ring-1 focus:ring-[#e11d23] transition"
                />
              </div>

              {/* Grid Row 1: Phone & Email */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  title="Please enter a valid 10-digit mobile number"
                  aria-label="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-white text-zinc-900 text-xs sm:text-sm placeholder-zinc-500 border border-zinc-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#e11d23] focus:ring-1 focus:ring-[#e11d23] transition"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email (Optional)"
                  aria-label="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white text-zinc-900 text-xs sm:text-sm placeholder-zinc-500 border border-zinc-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#e11d23] focus:ring-1 focus:ring-[#e11d23] transition"
                />
              </div>

              {/* Grid Row 2: State & City Custom Select */}
              <div className="grid grid-cols-2 gap-2">
                <CustomSelect
                  options={['Uttar Pradesh']}
                  value={formData.state}
                  disabled={true}
                  placeholder="Uttar Pradesh"
                />

                <CustomSelect
                  options={CITY_OPTIONS}
                  value={formData.city}
                  placeholder="Select City *"
                  required={true}
                  onChange={(val) => handleCustomSelectChange('city', val)}
                />
              </div>

              {/* Inquiry Type Custom Select */}
              <div>
                <CustomSelect
                  options={INQUIRY_TYPE_OPTIONS}
                  value={formData.inquiryType}
                  placeholder="Select Inquiry Type *"
                  onChange={(val) => handleCustomSelectChange('inquiryType', val)}
                />
              </div>

              {/* Message */}
              <div>
                <textarea
                  name="message"
                  rows="2"
                  placeholder="Message"
                  aria-label="Message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-white text-zinc-900 text-xs sm:text-sm placeholder-zinc-500 border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e11d23] focus:ring-1 focus:ring-[#e11d23] transition resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#e11d23] hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm py-2.5 rounded-xl transition shadow-md active:scale-98 cursor-pointer mt-1 uppercase tracking-wide flex items-center justify-center gap-2"
              >
                {loading ? 'Submitting...' : 'Send An Enquiry'}
              </button>
            </form>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-1">
              <a
                href="https://wa.me/917268052110"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 border border-emerald-500 text-emerald-600 font-bold text-[11px] py-1.5 px-2 rounded-lg hover:bg-emerald-50 transition"
              >
                <FaWhatsapp size={15} className="text-emerald-500 shrink-0" />
                <span>Talk to us</span>
              </a>

              <a
                href="tel:+917268052110"
                className="flex items-center justify-center gap-1 border border-zinc-300 bg-zinc-50 text-zinc-900 font-bold text-[10px] sm:text-[11px] py-1.5 px-2 rounded-lg hover:bg-zinc-100 transition"
              >
                <span className="text-[#e11d23]">Instant Help</span>
                <span className="text-zinc-600 font-normal">Call Now</span>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
