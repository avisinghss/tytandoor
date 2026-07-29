import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService'; // Live Supabase Service
import { supabase } from '../services/supabaseClient';
import ProductFeatures from '../components/home/ProductFeatures';
import { CheckCircle2, Loader2, PhoneCall, Send, User, Phone, X, ShieldCheck } from 'lucide-react';

function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Data States
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // State to manage visible similar products ("See More" feature)
  const [visibleCount, setVisibleCount] = useState(2);

  // Form States
  const [activeForm, setActiveForm] = useState(null); // 'inquiry' | 'expert' | null
  const [inquiryData, setInquiryData] = useState({ name: '', phone: '' });
  const [expertData, setExpertData] = useState({ name: '', phone: '' });

  // Submission States
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Expert Call Loading Bar States
  const [isSubmittingExpert, setIsSubmittingExpert] = useState(false);
  const [expertProgress, setExpertProgress] = useState(0);
  const [expertStatusText, setExpertStatusText] = useState('Initiating request...');
  const [expertSubmitted, setExpertSubmitted] = useState(false);

  // Fetch products from Supabase
  useEffect(() => {
    async function fetchLiveProducts() {
      setLoading(true);
      const data = await getProducts();
      setProductsList(data || []);
      setLoading(false);
    }
    fetchLiveProducts();
  }, [slug]);

  // Match product by slug OR String/Number ID from live data
  const product = productsList.find(
    (p) => p.slug === slug || String(p.id) === slug
  );

  // Handle Product Inquiry Submit
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryData.name || !inquiryData.phone) return;

    setIsSubmittingInquiry(true);
    try {
      const { error } = await supabase.from('enquiries').insert([
        {
          name: inquiryData.name,
          phone: inquiryData.phone,
          product_name: product?.name || 'Unknown Product',
          category: product?.category || 'General',
          inquiry_type: 'PRODUCT',
          status: 'NEW',
        },
      ]);

      if (error) throw error;

      setInquirySubmitted(true);
      setInquiryData({ name: '', phone: '' });
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      alert('Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  // Animated Expert Call Submit with Custom Progress Bar Loading UI
  const handleExpertSubmit = async (e) => {
    e.preventDefault();
    if (!expertData.name || !expertData.phone) return;

    setIsSubmittingExpert(true);
    setExpertProgress(15);
    setExpertStatusText('Sending request details...');

    try {
      // Step 1: Save to database
      const { error } = await supabase.from('call_requests').insert([
        {
          name: expertData.name,
          phone: expertData.phone,
          product_name: product?.name || 'Unknown Product',
          status: 'PENDING',
        },
      ]);

      if (error) throw error;

      // Step 2: Animated progress loading sequence
      setExpertProgress(45);
      setExpertStatusText('Assigning product expert...');
      await new Promise((res) => setTimeout(res, 600));

      setExpertProgress(80);
      setExpertStatusText('Finalizing call priority...');
      await new Promise((res) => setTimeout(res, 600));

      setExpertProgress(100);
      setExpertStatusText('Request sent!');
      await new Promise((res) => setTimeout(res, 400));

      setExpertSubmitted(true);
      setExpertData({ name: '', phone: '' });
    } catch (err) {
      console.error('Error submitting call request:', err);
      alert('Failed to schedule call. Please try again.');
    } finally {
      setIsSubmittingExpert(false);
      setExpertProgress(0);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-500 text-sm font-semibold">Loading product details...</p>
      </div>
    );
  }

  // Not Found State
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-2">
          Product Not Found
        </h2>
        <p className="text-zinc-500 mb-6 text-sm">
          The door design you are looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#b31919] hover:bg-red-700 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition cursor-pointer"
        >
          ← Back to Collection
        </button>
      </div>
    );
  }

  // Filter similar products
  const similarProducts = productsList.filter(
    (p) =>
      (p.category === product.category || p.categorySlug === product.categorySlug) &&
      p.slug !== product.slug &&
      p.id !== product.id
  );

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Top Navigation */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 px-4 py-2 rounded-full font-semibold text-xs md:text-sm shadow-sm hover:border-zinc-400 dark:hover:border-zinc-600 active:scale-95 transition cursor-pointer"
          >
            ← Back
          </button>
        </div>

        {/* Hero Section: Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12">
          
          {/* Left Column: Image Container */}
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 md:p-10 flex items-center justify-center shadow-sm relative group overflow-hidden">
              <div className="w-full aspect-[3/4] max-h-[550px] flex items-center justify-center">
                <img
                  src={product.image || "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600"}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Product Specs & Actions */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between">
            <div>
              {/* Category Tag */}
              {product.category && (
                <span className="inline-block text-[#b31919] dark:text-red-500 font-bold text-xs uppercase tracking-wider mb-2">
                  {product.category}
                </span>
              )}

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-6 leading-tight">
                {product.name}
              </h1>

              {/* Dynamic Interactive Action Buttons & Small Inline Forms */}
              <div className="flex flex-col gap-4 mb-8">
                
                {/* 1. INQUIRE ABOUT THIS PRODUCT BUTTON / INLINE FORM */}
                {activeForm !== 'inquiry' ? (
                  <button
                    onClick={() => {
                      setActiveForm('inquiry');
                      setInquirySubmitted(false);
                    }}
                    className="w-full bg-[#b31919] hover:bg-red-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm text-center shadow-md hover:shadow-lg transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Inquire About This Product
                  </button>
                ) : (
                  <div className="bg-white dark:bg-zinc-900 border-2 border-red-600/30 dark:border-red-600/40 p-4 sm:p-5 rounded-2xl shadow-lg transition-all animate-in fade-in zoom-in-95 duration-200 relative">
                    <button
                      onClick={() => setActiveForm(null)}
                      className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-white p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {inquirySubmitted ? (
                      <div className="text-center py-4 space-y-2">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                        <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
                          Inquiry Sent Successfully!
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          We received your inquiry regarding <strong>{product.name}</strong>. Our team will contact you soon.
                        </p>
                        <button
                          onClick={() => setInquirySubmitted(false)}
                          className="mt-2 text-xs font-semibold text-red-600 dark:text-red-400 underline cursor-pointer"
                        >
                          Send another inquiry
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleInquirySubmit} className="space-y-3">
                        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#b31919] dark:text-red-500">
                            Quick Product Inquiry
                          </h4>
                        </div>

                        <div className="relative">
                          <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            placeholder="Your Name *"
                            value={inquiryData.name}
                            onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                          />
                        </div>

                        <div className="relative">
                          <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            placeholder="Phone Number *"
                            value={inquiryData.phone}
                            onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingInquiry}
                          className="w-full bg-[#b31919] hover:bg-red-700 disabled:opacity-50 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                        >
                          {isSubmittingInquiry ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            'Submit Inquiry'
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* 2. GET CALL FROM EXPERTS BUTTON / INLINE FORM WITH PROGRESS BAR LOADING */}
                {activeForm !== 'expert' ? (
                  <button
                    onClick={() => {
                      setActiveForm('expert');
                      setExpertSubmitted(false);
                      setExpertProgress(0);
                    }}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm text-center shadow-md transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Confused? Get Call From Experts
                  </button>
                ) : (
                  <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-700/40 p-4 sm:p-5 rounded-2xl shadow-lg transition-all animate-in fade-in zoom-in-95 duration-200 relative">
                    <button
                      onClick={() => setActiveForm(null)}
                      className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-white p-1 z-10"
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
                          Sending expert assistance request for {product.name}...
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
                          Thank you! Our expert advisor will call you back on your registered phone number shortly.
                        </p>
                        <button
                          onClick={() => {
                            setExpertSubmitted(false);
                            setActiveForm(null);
                          }}
                          className="mt-2 text-xs font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-4 py-1.5 rounded-lg transition"
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
                          className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm active:scale-98"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          Request Call Back
                        </button>
                      </form>
                    )}
                  </div>
                )}

              </div>

              {/* Description Section */}
              <section className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 md:p-6 shadow-sm mb-6">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Product Overview
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  {product.description ||
                    "Engineered with premium architectural materials designed to offer superior acoustic isolation, durability, and modern structural aesthetics for high-end residential and commercial developments."}
                </p>
              </section>

              {/* Dynamic Feature Badges */}
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Key Features
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700"
                      >
                        ✓ {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Features Section */}
        <div className="my-12">
          <ProductFeatures features={product.features} />
        </div>

        <hr className="border-t border-zinc-200 dark:border-zinc-800 my-12" />

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[#b31919] dark:text-red-500 font-bold text-xs uppercase tracking-wider block">
                  Recommendations
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold">
                  Similar Doors You Might Like
                </h2>
              </div>
            </div>

            {/* Grid layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {similarProducts.slice(0, visibleCount).map((item) => (
                <Link
                  to={`/products/${item.slug || item.id}`}
                  key={item.id}
                  className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="bg-slate-50 dark:bg-zinc-950 rounded-xl p-3 mb-3 aspect-[3/4] flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600"}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600";
                      }}
                    />
                  </div>
                  <h4 className="text-xs md:text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#b31919] dark:group-hover:text-red-500 transition-colors line-clamp-2">
                    {item.name}
                  </h4>
                </Link>
              ))}
            </div>

            {/* Interactive "See More" Button */}
            {similarProducts.length > visibleCount && (
              <div className="flex justify-center mt-10">
                <button
                  type="button"
                  onClick={handleSeeMore}
                  className="px-8 py-3 bg-zinc-900 hover:bg-[#b31919] dark:bg-zinc-800 dark:hover:bg-red-700 text-white text-xs md:text-sm font-bold rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  See More ({similarProducts.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;