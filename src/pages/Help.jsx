import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { getCategories, getProducts } from '../services/productService';
import { Upload, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function Help() {
  const [openFaq, setOpenFaq] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Dynamic Options State
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    categoryId: '',
    productId: '',
    dealerName: '',
    purchaseDate: '',
  });
  const [billFile, setBillFile] = useState(null);

  // Status & Animation States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Fetch Categories & Products using the exact same productService functions
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

  // 2. Robust Category Change Handler (Matches IDs, Names, or Slugs seamlessly)
  const handleCategoryChange = (e) => {
    const selectedCatId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      categoryId: selectedCatId,
      productId: '',
    }));

    if (!selectedCatId) {
      setFilteredProducts([]);
      return;
    }

    // Helper to normalize strings for matching
    const normalize = (str) =>
      String(str || '')
        .toLowerCase()
        .replace(/[-_]/g, ' ')
        .trim();

    // Find active category object from categories array
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

    // Filter products matching category foreign key, slug, name, or ID
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

  // Helper getters for robust label rendering
  const getCategoryName = (cat) => cat.name || cat.category_name || cat.title || 'Unnamed Category';
  const getProductName = (prod) => prod.name || prod.product_name || prod.title || 'Unnamed Product';

  // Image Upload Handling
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setErrorMessage('');

    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Only JPEG, JPG, or PNG files are supported.');
      e.target.value = null;
      return;
    }

    if (file.size > 500 * 1024) { // 500 KB Limit
      setErrorMessage('File size must be 500KB or smaller.');
      e.target.value = null;
      return;
    }

    setBillFile(file);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!billFile) {
      setErrorMessage('Please attach a copy of your purchase bill/receipt.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setProgress(15);

    try {
      // 1. Upload Bill File to Supabase Storage
      const fileExt = billFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      setProgress(40);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('warranty-bills')
        .upload(fileName, billFile);

      if (uploadError) throw uploadError;

      setProgress(70);

      // Get Public URL
      const { data: urlData } = supabase.storage
        .from('warranty-bills')
        .getPublicUrl(fileName);

      // 2. Insert record into warranty_claims table
      const { error: insertError } = await supabase.from('warranty_claims').insert([
        {
          full_name: formData.fullName,
          phone: formData.phone,
          category_id: formData.categoryId || null,
          product_id: formData.productId || null,
          dealer_name: formData.dealerName,
          purchase_date: formData.purchaseDate,
          bill_url: urlData.publicUrl,
          status: 'PENDING',
        },
      ]);

      if (insertError) throw insertError;

      setProgress(100);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 500);

    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({ fullName: '', phone: '', categoryId: '', productId: '', dealerName: '', purchaseDate: '' });
    setBillFile(null);
    setFilteredProducts([]);
    setIsSuccess(false);
    setIsSubmitting(false);
    setProgress(0);
    setErrorMessage('');
    setIsFormVisible(false);
  };

  const faqs = [
    { q: "How do I claim my 10-year product warranty?", a: "You can submit your original order ID along with photos of the installation through our online Warranty Claim form below." },
    { q: "What is the typical delivery timeframe for custom doors?", a: "Custom engineered doors typically require 14 to 21 business days for precision manufacturing and quality inspection." },
    { q: "Can an expert visit my site for measurements?", a: "Yes! Click the 'Request Expert Call' button above to schedule an architect site visit in eligible metro regions." }
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

          {/* Card 1: Warranty Form */}
          <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-all duration-300 ${isFormVisible ? 'md:col-span-2' : ''}`}>
            {!isFormVisible ? (
              <div>
                <div className="text-3xl mb-3">🛡️</div>
                <h3 className="text-lg font-bold mb-2">Avail Product Warranty</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                  Register your newly purchased doors or file a protection claim under our 10-year core guarantee.
                </p>
                <button
                  onClick={() => setIsFormVisible(true)}
                  className="w-full bg-[#b31919] hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition active:scale-95 cursor-pointer"
                >
                  Register / Claim Warranty
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={resetForm}
                  className="flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 mb-4 cursor-pointer"
                >
                  <ArrowLeft size={16} /> Back to options
                </button>

                {!isSuccess ? (
                  <>
                    <h2 className="text-xl font-bold mb-1">Claim Product Warranty</h2>
                    <p className="text-xs text-zinc-500 mb-6">Fill in the details below to register your 10-year protection guarantee.</p>

                    {errorMessage && (
                      <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
                        <AlertCircle size={16} /> <span>{errorMessage}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-1 font-bold">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="e.g. John Doe"
                            className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 outline-none focus:border-[#b31919]"
                          />
                        </div>

                        <div>
                          <label className="block mb-1 font-bold">Phone Number *</label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="e.g. +91 9876543210"
                            className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 outline-none focus:border-[#b31919]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-1 font-bold">Category</label>
                          <select
                            value={formData.categoryId}
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
                            value={formData.productId}
                            disabled={!formData.categoryId || filteredProducts.length === 0}
                            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                            className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 outline-none focus:border-[#b31919] disabled:opacity-50"
                          >
                            <option value="">
                              {!formData.categoryId
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
                            value={formData.dealerName}
                            onChange={(e) => setFormData({ ...formData, dealerName: e.target.value })}
                            placeholder="e.g. Apex Hardware Stores"
                            className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 outline-none focus:border-[#b31919]"
                          />
                        </div>

                        <div>
                          <label className="block mb-1 font-bold">Purchase Date *</label>
                          <input
                            type="date"
                            required
                            value={formData.purchaseDate}
                            onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                            className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 outline-none focus:border-[#b31919]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 font-bold">Attach Bill Receipt * (JPEG/JPG/PNG, max 500KB)</label>
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
                      {isSubmitting && (
                        <div className="space-y-1 pt-2">
                          <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#b31919] h-full transition-all duration-300 ease-out"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-center text-zinc-500">Submitting warranty claim request...</p>
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={resetForm}
                          className="w-1/3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold py-3 rounded-xl text-xs transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-2/3 bg-[#b31919] hover:bg-red-700 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
                        >
                          {isSubmitting ? 'Processing...' : 'Submit Claim Request'}
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
                      onClick={resetForm}
                      className="bg-zinc-900 dark:bg-zinc-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition hover:bg-zinc-800 cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card 2: Callback */}
          {!isFormVisible && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:border-zinc-500 transition">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="text-lg font-bold mb-2">Get Call From Experts</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Unsure about frame sizing or finishing styles? Request a prompt callback from our technical design engineers.
              </p>
              <button className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold py-2.5 rounded-xl text-xs transition active:scale-95 cursor-pointer">
                Request Callback
              </button>
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
                  className="w-full flex justify-between items-center text-left font-bold text-sm text-zinc-800 dark:text-zinc-200 hover:text-[#b31919] transition"
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