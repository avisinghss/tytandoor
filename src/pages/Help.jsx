import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { notifyAdmins } from '../services/notificationService';
import { getCategories, getProducts } from '../services/productService';
import { 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Phone, 
  PhoneCall, 
  X, 
  ShieldCheck, 
  User 
} from 'lucide-react';

export default function Help() {
  const [openFaq, setOpenFaq] = useState(null);
  
  // Active Form View: null | 'WARRANTY' | 'expert'
  const [activeForm, setActiveForm] = useState(null);

  // Dynamic Options State
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Warranty Form State
  const [warrantyData, setWarrantyData] = useState({
    fullName: '',
    phone: '',
    categoryId: '',
    productId: '',
    dealerName: '',
    purchaseDate: '',
  });
  const [billFile, setBillFile] = useState(null);
  const [isSubmittingWarranty, setIsSubmittingWarranty] = useState(false);
  const [warrantyProgress, setWarrantyProgress] = useState(0);
  const [warrantySuccess, setWarrantySuccess] = useState(false);
  const [warrantyError, setWarrantyError] = useState('');

  // Expert Callback States matching your ProductDetail pattern
  const [expertData, setExpertData] = useState({ name: '', phone: '' });
  const [isSubmittingExpert, setIsSubmittingExpert] = useState(false);
  const [expertProgress, setExpertProgress] = useState(0);
  const [expertStatusText, setExpertStatusText] = useState('Connecting...');
  const [expertSubmitted, setExpertSubmitted] = useState(false);
  const [expertError, setExpertError] = useState('');

  // 1. Fetch Categories & Products
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [catsData, prodsData] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        if (isMounted) {
          setCategories(catsData || []);
          setProducts(prodsData || []);
        }
      } catch (error) {
        console.error("Error loading categories or products:", error);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Category Change Handler
  const handleCategoryChange = (e) => {
    const selectedCatId = e.target.value;

    setWarrantyData((prev) => ({
      ...prev,
      categoryId: selectedCatId,
      productId: '',
    }));

    if (!selectedCatId) {
      setFilteredProducts([]);
      return;
    }

    const normalize = (str) =>
      String(str || '')
        .toLowerCase()
        .replace(/[-_]/g, ' ')
        .trim();

    const selectedCatObj = categories.find(
      (c) =>
        String(c.id) === String(selectedCatId) ||
        normalize(c.slug) === normalize(selectedCatId) ||
        normalize(c.name) === normalize(selectedCatId)
    );

    const matchTargets = [
      selectedCatId,
      selectedCatObj?.id,
      selectedCatObj?.slug,
      selectedCatObj?.name,
    ]
      .filter(Boolean)
      .map(normalize);

    const matched = products.filter((p) => {
      const prodCatFields = [
        p.category_id,
        p.category,
        p.category_slug,
        p.categorySlug,
        p.category?.id,
        p.category?.name,
      ]
        .filter(Boolean)
        .map(normalize);

      return prodCatFields.some((pVal) =>
        matchTargets.some((tVal) => pVal === tVal || pVal.includes(tVal) || tVal.includes(pVal))
      );
    });

    setFilteredProducts(matched);
  };

  const getCategoryName = (cat) => cat.name || cat.category_name || cat.title || 'Unnamed Category';
  const getProductName = (prod) => prod.name || prod.product_name || prod.title || 'Unnamed Product';

  // Bill File Upload Handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setWarrantyError('');

    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setWarrantyError('Only JPEG, JPG, or PNG files are supported.');
      e.target.value = null;
      return;
    }

    // 2MB limit check (2 * 1024 * 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      setWarrantyError('File size must be 2MB or smaller.');
      e.target.value = null;
      return;
    }

    setBillFile(file);
  };

  // Submit Warranty Claim
  const handleWarrantySubmit = async (e) => {
    e.preventDefault();
    if (!billFile) {
      setWarrantyError('Please attach a copy of your purchase bill/receipt.');
      return;
    }

    setIsSubmittingWarranty(true);
    setWarrantyError('');
    setWarrantyProgress(15);

    try {
      const fileExt = billFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      setWarrantyProgress(40);
      const { error: uploadError } = await supabase.storage
        .from('warranty-bills')
        .upload(fileName, billFile);

      if (uploadError) throw uploadError;

      setWarrantyProgress(70);

      const { data: urlData } = supabase.storage
        .from('warranty-bills')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase.from('warranty_claims').insert([
        {
          full_name: warrantyData.fullName,
          phone: warrantyData.phone,
          category_id: warrantyData.categoryId || null,
          product_id: warrantyData.productId || null,
          dealer_name: warrantyData.dealerName,
          purchase_date: warrantyData.purchaseDate,
          bill_url: urlData.publicUrl,
          status: 'PENDING',
        },
      ]);

      if (insertError) throw insertError;

      void notifyAdmins({
        title: 'New warranty claim',
        body: `${warrantyData.fullName || 'A customer'} submitted a warranty claim.`,
        targetTab: 'warranty',
      });

      setWarrantyProgress(100);
      setTimeout(() => {
        setIsSubmittingWarranty(false);
        setWarrantySuccess(true);
      }, 500);

    } catch (err) {
      console.error(err);
      setIsSubmittingWarranty(false);
      setWarrantyError(err.message || 'Something went wrong. Please try again.');
    }
  };

  // Submit Call Back Request with Animated Progress Bar
  const handleExpertSubmit = async (e) => {
    e.preventDefault();
    if (!expertData.name.trim() || !expertData.phone.trim()) {
      setExpertError('Please fill in both name and phone number.');
      return;
    }

    setIsSubmittingExpert(true);
    setExpertError('');
    setExpertProgress(15);
    setExpertStatusText('Connecting to database...');

    try {
      // Step 1: Simulated Progress Update
      await new Promise((res) => setTimeout(res, 400));
      setExpertProgress(50);
      setExpertStatusText('Sending request...');

      // Step 2: Supabase Insert
      const { error } = await supabase.from('call_requests').insert([
        {
          name: expertData.name,
          phone: expertData.phone,
          product_name: 'General / Help Section',
          status: 'PENDING',
        },
      ]);

      if (error) throw error;

      void notifyAdmins({
        title: 'New callback request',
        body: `${expertData.name} requested a call from the help page.`,
        targetTab: 'calls',
      });

      // Step 3: Complete Progress
      setExpertProgress(90);
      setExpertStatusText('Finalizing...');
      await new Promise((res) => setTimeout(res, 300));
      setExpertProgress(100);

      setTimeout(() => {
        setIsSubmittingExpert(false);
        setExpertSubmitted(true);
      }, 400);

    } catch (err) {
      console.error('Error submitting call request:', err);
      setIsSubmittingExpert(false);
      setExpertError(err.message || 'Failed to submit request. Please try again.');
    }
  };

  const resetAllForms = () => {
    setActiveForm(null);
    setWarrantyData({ fullName: '', phone: '', categoryId: '', productId: '', dealerName: '', purchaseDate: '' });
    setBillFile(null);
    setFilteredProducts([]);
    setWarrantySuccess(false);
    setWarrantyError('');
    setWarrantyProgress(0);

    setExpertData({ name: '', phone: '' });
    setExpertSubmitted(false);
    setExpertProgress(0);
    setExpertError('');
  };

  const faqs = [
    { q: "How do I claim my 10-year product warranty?", a: "You can submit your original order ID along with photos of the installation through our online Warranty Claim form below." },
    { q: "What is the typical delivery timeframe for custom doors?", a: "Custom engineered doors typically require 14 to 21 business days for precision manufacturing and quality inspection." },
    { q: "Can an expert visit my site for measurements?", a: "Yes! Click the 'Get Call From Experts' button above to schedule an architect site visit in eligible metro regions." }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center">
          <span className="text-[#b31919] dark:text-red-500 font-bold text-xs uppercase tracking-wider block mb-1">Support Center</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">How Can We Help You?</h1>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          {/* CARD 1: WARRANTY FORM */}
          {(activeForm === null || activeForm === 'WARRANTY') && (
            <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-all duration-300 ${activeForm === 'WARRANTY' ? 'md:col-span-2' : ''}`}>
              {activeForm !== 'WARRANTY' ? (
                <div>
                  <div className="text-3xl mb-3">🛡️</div>
                  <h3 className="text-lg font-bold mb-2">Avail Product Warranty</h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                    Register your newly purchased doors or file a protection claim under our 10-year core guarantee.
                  </p>
                  <button
                    onClick={() => setActiveForm('WARRANTY')}
                    className="w-full bg-[#b31919] hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition active:scale-95 cursor-pointer"
                  >
                    Register / Claim Warranty
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={resetAllForms}
                    className="flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 mb-4 cursor-pointer"
                  >
                    <ArrowLeft size={16} /> Back to options
                  </button>

                  {!warrantySuccess ? (
                    <>
                      <h2 className="text-xl font-bold mb-1">Claim Product Warranty</h2>
                      <p className="text-xs text-zinc-500 mb-6">Fill in the details below to register your 10-year protection guarantee.</p>

                      {warrantyError && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
                          <AlertCircle size={16} /> <span>{warrantyError}</span>
                        </div>
                      )}

                      <form onSubmit={handleWarrantySubmit} className="space-y-4 text-xs font-medium">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-1 font-bold">Full Name *</label>
                            <input
                              type="text"
                              required
                              value={warrantyData.fullName}
                              onChange={(e) => setWarrantyData({ ...warrantyData, fullName: e.target.value })}
                              placeholder="e.g. John Doe"
                              className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 outline-none focus:border-[#b31919]"
                            />
                          </div>

                          <div>
                            <label className="block mb-1 font-bold">Phone Number *</label>
                            <input
                              type="tel"
                              required
                              value={warrantyData.phone}
                              onChange={(e) => setWarrantyData({ ...warrantyData, phone: e.target.value })}
                              placeholder="e.g. +91 9876543210"
                              className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 outline-none focus:border-[#b31919]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-1 font-bold">Category</label>
                            <select
                              value={warrantyData.categoryId}
                              onChange={handleCategoryChange}
                              className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 outline-none focus:border-[#b31919]"
                            >
                              <option value="">Select Category</option>
                              {categories.map((cat) => {
                                const catVal = cat.id || cat.slug || cat.name;
                                return (
                                  <option key={catVal} value={catVal}>
                                    {getCategoryName(cat)}
                                  </option>
                                );
                              })}
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1 font-bold font-sans">Model / Product</label>
                            <select
                              value={warrantyData.productId}
                              disabled={!warrantyData.categoryId || filteredProducts.length === 0}
                              onChange={(e) => setWarrantyData({ ...warrantyData, productId: e.target.value })}
                              className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 outline-none focus:border-[#b31919] disabled:opacity-50"
                            >
                              <option value="">
                                {!warrantyData.categoryId
                                  ? 'Select Category First'
                                  : filteredProducts.length === 0
                                  ? 'No Products Found'
                                  : 'Select Product'}
                              </option>
                              {filteredProducts.map((prod) => {
                                const prodVal = prod.id || prod.product_id || prod.slug || prod.name;
                                return (
                                  <option key={prodVal} value={prodVal}>
                                    {getProductName(prod)}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-1 font-bold">Dealer / Shop Name *</label>
                            <input
                              type="text"
                              required
                              value={warrantyData.dealerName}
                              onChange={(e) => setWarrantyData({ ...warrantyData, dealerName: e.target.value })}
                              placeholder="e.g. Apex Hardware Stores"
                              className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 outline-none focus:border-[#b31919]"
                            />
                          </div>

                          <div>
                            <label className="block mb-1 font-bold">Purchase Date *</label>
                            <input
                              type="date"
                              required
                              value={warrantyData.purchaseDate}
                              onChange={(e) => setWarrantyData({ ...warrantyData, purchaseDate: e.target.value })}
                              className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 outline-none focus:border-[#b31919]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block mb-1 font-bold">Attach Bill Receipt * (JPEG/JPG/PNG, max 2MB)</label>
                          <div className="relative border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl p-4 text-center hover:border-[#b31919] transition">
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png"
                              onChange={handleFileChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload className="mx-auto text-zinc-400 mb-1" size={20} />
                            <p className="text-zinc-500 font-semibold">{billFile ? billFile.name : 'Click or drop file here'}</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {isSubmittingWarranty && (
                          <div className="space-y-1 pt-2">
                            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-[#b31919] h-full transition-all duration-300 ease-out"
                                style={{ width: `${warrantyProgress}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-center text-zinc-500">Submitting warranty claim request...</p>
                          </div>
                        )}

                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            onClick={resetAllForms}
                            className="w-1/3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold py-3 rounded-xl text-xs transition cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmittingWarranty}
                            className="w-2/3 bg-[#b31919] hover:bg-red-700 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
                          >
                            {isSubmittingWarranty ? 'Processing...' : 'Submit Claim Request'}
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <div className="text-center py-8 space-y-4">
                      <CheckCircle2 size={56} className="text-emerald-500 mx-auto animate-bounce" />
                      <h3 className="text-xl font-bold">Request Submitted!</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto">
                        Thank you for submitting your claim. Our team has received your details and invoice receipt. We will contact you shortly regarding verification.
                      </p>
                      <button
                        onClick={resetAllForms}
                        className="bg-zinc-900 dark:bg-zinc-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition hover:bg-zinc-800 cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* CARD 2: EXPERT CALLBACK (Exact ProductDetail UI Pattern) */}
          {(activeForm === null || activeForm === 'expert') && (
            <div className={`transition-all duration-300 ${activeForm === 'expert' ? 'md:col-span-2' : ''}`}>
              {activeForm !== 'expert' ? (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:border-zinc-500 transition">
                  <div className="text-3xl mb-3">📞</div>
                  <h3 className="text-lg font-bold mb-2">Get Call From Experts</h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                    Unsure about frame sizing or finishing styles? Request a prompt callback from our technical design engineers.
                  </p>
                  <button
                    onClick={() => {
                      setActiveForm('expert');
                      setExpertSubmitted(false);
                      setExpertProgress(0);
                      setExpertError('');
                    }}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white px-6 py-3.5 rounded-xl font-bold text-xs text-center shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Confused? Get Call From Experts
                  </button>
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-700/40 p-4 sm:p-5 rounded-2xl shadow-lg transition-all animate-in fade-in zoom-in-95 duration-200 relative">
                  <button
                    onClick={() => setActiveForm(null)}
                    className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-white p-1 z-10 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* VIEW 1: LOADING PROGRESS BAR STATE */}
                  {isSubmittingExpert ? (
                    <div className="py-6 px-2 space-y-4 text-center animate-in fade-in duration-300">
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-200">
                        <span className="flex items-center gap-1.5">
                          <PhoneCall className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                          {expertStatusText}
                        </span>
                        <span className="text-[#b31919] dark:text-red-400">{expertProgress}%</span>
                      </div>

                      {/* Progress Bar Track */}
                      <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-200 dark:border-zinc-700 shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${expertProgress}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                        Sending expert assistance request...
                      </p>
                    </div>
                  ) : expertSubmitted ? (
                    /* VIEW 2: SUCCESS COMPLETED STATE */
                    <div className="text-center py-4 space-y-2.5 animate-in zoom-in-95 duration-300">
                      <CheckCircle2 className="w-11 h-11 text-emerald-500 mx-auto animate-bounce" />
                      <h4 className="font-extrabold text-zinc-900 dark:text-white text-base">
                        Request Sent!
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed px-2">
                        Thank you! Our expert advisor will call you back on <strong>{expertData.phone}</strong> shortly.
                      </p>
                      <button
                        onClick={() => {
                          setExpertSubmitted(false);
                          setActiveForm(null);
                        }}
                        className="mt-2 text-xs font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-4 py-1.5 rounded-lg transition cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    /* VIEW 3: INPUT FORM STATE */
                    <form onSubmit={handleExpertSubmit} className="space-y-3">
                      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          Request Expert Call Back
                        </h4>
                      </div>

                      {expertError && (
                        <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
                          <AlertCircle size={14} />
                          <span>{expertError}</span>
                        </div>
                      )}

                      <div className="relative">
                        <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="Your Name *"
                          value={expertData.name}
                          onChange={(e) => setExpertData({ ...expertData, name: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                        />
                      </div>

                      <div className="relative">
                        <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          placeholder="Phone Number *"
                          value={expertData.phone}
                          onChange={(e) => setExpertData({ ...expertData, phone: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-2 bg-[#b31919] hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-md"
                      >
                        Submit Request
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-extrabold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex justify-between items-center text-left font-bold text-sm text-zinc-800 dark:text-zinc-200 hover:text-[#b31919] transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span>{openFaq === index ? '−' : '+'}</span>
                </button>
                {openFaq === index && (
                  <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}