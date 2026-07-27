import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { supabase } from '../../services/supabaseClient';

export default function EnquiryModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    state: '',
    city: '',
    product: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('enquiries').insert([
      {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        state: formData.state,
        city: formData.city,
        product: formData.product,
        message: formData.message,
      },
    ]);

    setLoading(false);

    if (error) {
      alert('Failed to submit enquiry: ' + error.message);
    } else {
      alert('Thank you for your enquiry! Our team will get back to you shortly.');
      setFormData({
        name: '',
        phone: '',
        email: '',
        state: '',
        city: '',
        product: '',
        message: '',
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fade-in">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-[360px] sm:max-w-[400px] bg-white rounded-2xl p-4 sm:p-5 shadow-2xl transition-all duration-300 max-h-[90vh] overflow-y-auto scrollbar-none">
        
        {/* Floating Red Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 bg-[#e11d23] hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10"
          aria-label="Close Enquiry Modal"
        >
          <X size={16} strokeWidth={3} />
        </button>

        {/* Modal Heading */}
        <h2 className="text-xl font-black text-zinc-900 mb-3 tracking-tight pr-6">
          Enquire Now
        </h2>

        {/* Compact Form */}
        <form onSubmit={handleSubmit} className="space-y-2.5">
          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
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
              placeholder="Phone Number"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-white text-zinc-900 text-xs sm:text-sm placeholder-zinc-500 border border-zinc-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#e11d23] focus:ring-1 focus:ring-[#e11d23] transition"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white text-zinc-900 text-xs sm:text-sm placeholder-zinc-500 border border-zinc-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#e11d23] focus:ring-1 focus:ring-[#e11d23] transition"
            />
          </div>

          {/* Grid Row 2: State & City */}
          <div className="grid grid-cols-2 gap-2">
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full bg-white text-zinc-800 text-xs sm:text-sm border border-zinc-300 rounded-lg px-2 py-2 focus:outline-none focus:border-[#e11d23] focus:ring-1 focus:ring-[#e11d23] transition"
            >
              <option value="">Select State</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Delhi">Delhi NCR</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Other">Other</option>
            </select>

            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full bg-white text-zinc-800 text-xs sm:text-sm border border-zinc-300 rounded-lg px-2 py-2 focus:outline-none focus:border-[#e11d23] focus:ring-1 focus:ring-[#e11d23] transition"
            >
              <option value="">Select City</option>
              <option value="Ballia">Ballia</option>
              <option value="Lucknow">Lucknow</option>
              <option value="Varanasi">Varanasi</option>
              <option value="Noida">Noida / Greater Noida</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Product */}
          <div>
            <input
              type="text"
              name="product"
              placeholder="Enquire For Product"
              value={formData.product}
              onChange={handleChange}
              className="w-full bg-white text-zinc-900 text-xs sm:text-sm placeholder-zinc-500 border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e11d23] focus:ring-1 focus:ring-[#e11d23] transition"
            />
          </div>

          {/* Message */}
          <div>
            <textarea
              name="message"
              rows="2"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-white text-zinc-900 text-xs sm:text-sm placeholder-zinc-500 border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e11d23] focus:ring-1 focus:ring-[#e11d23] transition resize-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e11d23] hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm py-2.5 rounded-xl transition shadow-md active:scale-98 cursor-pointer mt-1 uppercase tracking-wide"
          >
            {loading ? 'Submitting...' : 'Send An Enquiry'}
          </button>
        </form>

        {/* WhatsApp & Instant Help Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-1">
          <a
            href="https://wa.me/91XXXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 border border-emerald-500 text-emerald-600 font-bold text-[11px] py-1.5 px-2 rounded-lg hover:bg-emerald-50 transition"
          >
            <FaWhatsapp size={15} className="text-emerald-500 shrink-0" />
            <span>Talk to us</span>
          </a>

          <a
            href="tel:+9118005722122"
            className="flex items-center justify-center gap-1 border border-zinc-300 bg-zinc-50 text-zinc-900 font-bold text-[10px] sm:text-[11px] py-1.5 px-2 rounded-lg hover:bg-zinc-100 transition"
          >
            <span className="text-[#e11d23]">Instant Help</span>
            <span className="text-zinc-600 font-normal">1800-XXX</span>
          </a>
        </div>

      </div>
    </div>
  );
}