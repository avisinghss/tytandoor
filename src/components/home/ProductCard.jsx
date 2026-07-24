import React from 'react';

export default function ProductCard({ product, onEnquire }) {
  // Safe Fallback image in case image path is missing
  const fallbackImage = "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600";

  return (
    <div className="relative w-full h-[520px] rounded-[24px] overflow-hidden shadow-md bg-zinc-900 group hover:shadow-2xl transition-all duration-300 border border-zinc-800">
      
      {/* Product Image */}
      <img
        src={product?.image || fallbackImage}
        alt={product?.name || "Door Product"}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => { e.target.src = fallbackImage; }} // Fallback if image URL breaks
      />

      {/* Glassmorphic Bottom Panel */}
      <div className="absolute bottom-0 left-0 w-full p-6 pt-8 pb-5 bg-black/40 backdrop-blur-md border-t border-white/10 flex flex-col justify-end">
        <h3 className="text-2xl font-black text-white tracking-tight mb-0.5 drop-shadow-sm">
          {product?.name}
        </h3>
        <p className="text-zinc-300 font-bold text-xs tracking-wider uppercase mb-5">
          {product?.category}
        </p>

        {/* Enquiry Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // Prevents navigating if card itself is clickable
            if (onEnquire) onEnquire(product);
          }}
          className="self-start px-7 py-3 bg-red-600/90 hover:bg-red-600 text-white font-bold text-sm rounded-full tracking-wide transition-all border border-red-500/30 active:scale-95 shadow-lg cursor-pointer"
        >
          Enquiry Now
        </button>
      </div>
      
    </div>
  );
}