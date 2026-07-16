import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import products from "../../data/products";
import ProductCard from "./ProductCard"; // Naya component import kiya

export default function FeaturedProducts() {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center text-red-500 font-semibold">
        No products data found.
      </div>
    );
  }

  // Mobile slider controls
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const currentProduct = products[currentIndex];

  return (
    <section className="py-16 bg-[#F8F7F4] font-sans flex flex-col items-center min-h-screen">

      <div className="max-w-7xl w-full px-6 md:px-12">
        {/* 2. Headline & Subtitle */}
        <div className="mb-12 text-center md:text-left max-w-2xl">
          <span className="text-[#b31919] font-bold text-lg tracking-wide block mb-2">
            Recommend for you
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-black leading-tight mb-4">
            Best Selling Doors
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Discover our most popular premium doors designed for modern architecture and luxury living.
          </p>
        </div>

        {/* ----------------------------------------------------
            VIEWPORT 1: MOBILE SLIDER (Mobile Only)
         ------------------------------------------------------ */}
        <div className="block md:hidden max-w-md mx-auto">
          <div className="relative w-full h-[520px] rounded-[24px] overflow-hidden shadow-lg bg-gray-100">
            {/* Animated Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={currentProduct.image}
                alt={currentProduct.name}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.8 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
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
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 text-[#b31919] p-2.5 rounded-full shadow-md z-10 active:scale-95 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 transform rotate-180">
                <path d="M13.1716 12.0001L8.2218 7.05032L9.63602 5.63611L16 12.0001L9.63602 18.364L8.2218 16.9498L13.1716 12.0001Z" />
              </svg>
            </button>

            {/* Right Button */}
            <button
              onClick={nextSlide}
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 text-gray-700 p-2.5 rounded-full shadow-md z-10 active:scale-95 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M13.1716 12.0001L8.2218 7.05032L9.63602 5.63611L16 12.0001L9.63602 18.364L8.2218 16.9498L13.1716 12.0001Z" />
              </svg>
            </button>

            {/* Mobile Glassmorphic Bottom Panel */}
            <div className="absolute bottom-0 left-0 w-full p-6 pt-8 pb-3 bg-white/10 backdrop-blur-md border-t border-white/20 flex flex-col justify-end">
              <h3 className="text-2xl font-black text-black tracking-tight mb-1">{currentProduct.name}</h3>
              <p className="text-black font-semibold text-sm mb-5">{currentProduct.category}</p>
              <button type="button" className="self-start px-7 py-3 bg-black/45 text-white font-bold text-sm rounded-full tracking-wide border border-white/20 active:scale-95 shadow-sm">
                Enquiry Now
              </button>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------
            VIEWPORT 2: TAB & PC GRID (Tab & PC Only)
         ------------------------------------------------------ */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} /> // Reused card component
          ))}
        </div>

      </div>
    </section>
  );
}