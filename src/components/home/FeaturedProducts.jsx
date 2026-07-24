import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard"; 
import { getProducts } from "../../services/productService"; // Dynamic Supabase Service

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 1. Fetch Live Products from Supabase
  useEffect(() => {
    async function loadFeaturedProducts() {
      setLoading(true);
      const data = await getProducts();
      setProducts(data || []);
      setLoading(false);
    }
    loadFeaturedProducts();
  }, []);

  // 2. Theme state track karne ke liye explicit state setup
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const currentProduct = products[currentIndex];
  const bgImage = isDarkMode ? "/images/dark-marbel-bg.png" : "/images/marbel-bg.jpg";

  // Loading Skeleton State
  if (loading) {
    return (
      <section className="py-20 flex flex-col items-center justify-center bg-[#F8F7F4] dark:bg-zinc-950">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-zinc-500 font-medium text-sm">Loading featured collection...</p>
      </section>
    );
  }

  // Fallback if no products exist
  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center text-zinc-500 font-semibold bg-[#F8F7F4] dark:bg-zinc-950">
        No featured products available at the moment.
      </div>
    );
  }

  return (
    <section 
      className="relative min-h-screen py-16 font-sans flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat bg-[#F8F7F4] dark:bg-zinc-950 transition-colors duration-500"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      {/* FADE OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#F8F7F4] via-[#F8F7F4]/40 to-transparent dark:from-zinc-950 dark:via-zinc-950/40 pointer-events-none z-0 transition-all duration-500" />

      {/* MAIN CONTAINER */}
      <div className="relative z-10 max-w-7xl w-full px-6 md:px-12">
        
        {/* Headline & Subtitle */}
        <div className="mb-12 text-center md:text-left max-w-2xl">
          <span className="text-[#b31919] dark:text-red-500 font-bold text-lg tracking-wide block mb-2">
            Recommend for you
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white leading-tight mb-4 transition-colors">
            Best Selling Doors
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed transition-colors">
            Discover our most popular premium doors designed for modern architecture and luxury living.
          </p>
        </div>

        {/* VIEWPORT 1: MOBILE SLIDER (Mobile Only) */}
        {currentProduct && (
          <div className="block md:hidden max-w-md mx-auto">
            <div className="relative w-full h-[520px] rounded-[24px] overflow-hidden shadow-lg bg-gray-100 dark:bg-zinc-900 border border-transparent dark:border-zinc-800 transition-colors">
              
              {/* Animated Image */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={currentProduct.image || "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600"}
                  alt={currentProduct.name}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600";
                  }}
                />
              </AnimatePresence>

              {/* Dots */}
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-10">
                {products.map((_, index) => (
                  <span
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                      currentIndex === index ? "w-6 bg-white" : "w-2 bg-white/50"
                    }`}
                  />
                ))}
              </div>

              {/* Left Button */}
              <button
                onClick={prevSlide}
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 dark:bg-zinc-800 text-[#b31919] dark:text-red-400 p-2.5 rounded-full shadow-md z-10 active:scale-95 transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 transform rotate-180">
                  <path d="M13.1716 12.0001L8.2218 7.05032L9.63602 5.63611L16 12.0001L9.63602 18.364L8.2218 16.9498L13.1716 12.0001Z" />
                </svg>
              </button>

              {/* Right Button */}
              <button
                onClick={nextSlide}
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 p-2.5 rounded-full shadow-md z-10 active:scale-95 transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M13.1716 12.0001L8.2218 7.05032L9.63602 5.63611L16 12.0001L9.63602 18.364L8.2218 16.9498L13.1716 12.0001Z" />
                </svg>
              </button>

              {/* Mobile Glassmorphic Bottom Panel */}
              <div className="absolute bottom-0 left-0 w-full p-6 pt-8 pb-5 bg-black/40 backdrop-blur-md border-t border-white/20 dark:border-zinc-800/40 flex flex-col justify-end">
                <h3 className="text-2xl font-black text-white tracking-tight mb-0.5">{currentProduct.name}</h3>
                <p className="text-zinc-300 font-semibold text-xs tracking-wider uppercase mb-5">{currentProduct.category}</p>
                <button 
                  type="button" 
                  className="self-start px-7 py-3 bg-red-600/90 hover:bg-red-600 text-white font-bold text-sm rounded-full tracking-wide transition-all border border-red-500/30 active:scale-95 shadow-md cursor-pointer"
                >
                  Enquiry Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEWPORT 2: TAB & PC GRID */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} /> 
          ))}
        </div>

      </div>
    </section>
  );
}