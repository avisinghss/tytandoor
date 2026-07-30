import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { 
  Phone, Mail, Clock, Send, Building2, Factory, 
  CheckCircle2, MessageSquare, ChevronDown, FileText, 
  ShieldCheck, ArrowRight, Loader2, Check 
} from 'lucide-react';

const INQUIRY_OPTIONS = [
  'Homeowner / Retail Purchase',
  'Architect / Interior Designer',
  'Commercial Developer / Contractor',
  'Distributor / Dealer Inquiry',
  'Warranty Claim',
];

// Reusable Custom Select Component to prevent Mobile Native Radio Popup
function CustomSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Select Inquiry Topic',
  disabled = false,
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
        className={`w-full flex items-center justify-between text-left text-sm px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer ${
          disabled
            ? 'bg-slate-100 dark:bg-zinc-800 text-slate-400 border-slate-300 dark:border-zinc-700 cursor-not-allowed'
            : 'bg-white dark:bg-zinc-950 text-slate-900 dark:text-white border-slate-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-600'
        } ${isOpen ? 'ring-2 ring-red-600 border-red-600' : ''}`}
      >
        <span className={value ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-400'}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-400 dark:text-zinc-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-red-600 dark:text-red-500' : ''
          }`}
        />
      </button>

      {/* Dropdown Options List */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl max-h-56 overflow-y-auto py-1 text-sm animate-in fade-in zoom-in-95 duration-150">
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
                className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold'
                    : 'text-slate-700 dark:text-zinc-200'
                }`}
              >
                <span className="truncate">{option}</span>
                {isSelected && <Check size={16} className="text-red-600 dark:text-red-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Contact() {
  // ✅ FIX: Place React Router hook inside top-level of component body
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Homeowner / Retail Purchase',
    message: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const { error } = await supabase.from('contact_submissions').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          inquiry_type: formData.inquiryType,
          message: formData.message,
          status: 'NEW',
        },
      ]);

      if (error) throw error;

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'Homeowner / Retail Purchase',
        message: '',
      });
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setErrorMessage('Failed to send message. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCustomSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, inquiryType: value }));
  };

  const faqs = [
    {
      q: "What warranty coverage do Tytan Doors come with?",
      a: "Tytan Doors offers robust long-term protection: doors in the Membrane category come with a 10-Year Limited Warranty, while all other door categories are backed by our full 20-Year Warranty."
    },
    {
      q: "Do you offer custom door dimensions for architectural projects?",
      a: "Yes! As a manufacturing brand under Anil Interio, we specialize in custom height, width, and thickness engineered to your exact architectural specifications."
    },
    {
      q: "Can I request physical material samples or a product catalog?",
      a: "Optionally select 'Architect / Interior Designer' as your role in the contact form or call our team directly to request an architectural sample kit."
    },
    {
      q: "What is the typical lead time for bulk orders?",
      a: "Standard door models ship within 5-7 business days. Custom bulk orders generally take 2-3 weeks."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 font-sans transition-colors duration-300">
      
      {/* Header */}
      <section className="relative bg-slate-900 dark:bg-zinc-900 text-white py-14 sm:py-20 px-6 text-center overflow-hidden">
        <div className="relative max-w-3xl mx-auto space-y-3">
          <span className="inline-block px-3.5 py-1 bg-red-600/20 text-red-400 rounded-full text-xs font-semibold uppercase tracking-wider">
            Tytan Doors • Powered by Anil Interio
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Let's Build Your Project Together
          </h1>
          <p className="text-sm sm:text-lg text-slate-300 font-light max-w-xl mx-auto">
            Have a question, need custom sizing, or looking to claim your 20-Year Warranty? Contact our team today.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Form */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200 dark:border-zinc-800">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
                Fill out the form below and an engineer or technical expert will respond within 24 hours.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-lg">
                {errorMessage}
              </div>
            )}

            {submitted ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 text-center space-y-3 my-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                  Message Received!
                </h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  Thank you for reaching out. Our team is reviewing your details and will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@domain.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                    />
                  </div>

                  {/* Inquiry Topic Custom Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                      Inquiry Topic
                    </label>
                    <CustomSelect
                      options={INQUIRY_OPTIONS}
                      value={formData.inquiryType}
                      onChange={handleCustomSelectChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Project Details or Warranty Serial No. *
                  </label>
                  <textarea
                    required
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about door quantity, required dimensions, or warranty details..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Inquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Info Side Bar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 dark:border-amber-500/20 p-5 rounded-2xl relative overflow-hidden">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                    Guaranteed Protection
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Need to Claim Your Warranty?
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                    Up to <strong>20-Year Warranty</strong> coverage. Have your invoice or serial code ready for instant help.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, inquiryType: 'Warranty Claim' }));
                        navigate('/help');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      Redirect to Claim Warranty
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4 shadow-xs">
              <h3 className="text-lg font-bold border-b border-slate-800 pb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-red-500" />
                Direct Communication
              </h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-red-500 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Call / WhatsApp</p>
                    <a href="tel:+919876543210" className="font-medium hover:text-white transition-colors">+91 98765 43210</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-red-500 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Email Us</p>
                    <a href="mailto:info@tytandoor.com" className="font-medium hover:text-white transition-colors">info@tytandoor.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-red-500 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Business Hours</p>
                    <p className="font-medium">Mon - Sat: 9:00 AM - 7:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-100 dark:bg-zinc-900/50 py-12 px-4 sm:px-6 border-t border-slate-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
              Quick answers to common inquiries regarding warranties, sizing, and orders.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                      {faq.q}
                    </h3>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-red-500' : ''}`} />
                  </div>
                  {isOpen && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-2.5 pt-2 border-t border-slate-100 dark:border-zinc-800 leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}