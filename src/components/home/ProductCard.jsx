import React from 'react';

export default function ProductCard({ product }) {
  return (
    <div className="relative w-full h-[520px] rounded-[24px] overflow-hidden shadow-md bg-white group hover:shadow-2xl transition-all duration-300">
      
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Glassmorphic Bottom Panel (Perfect Frosted Glass Blur Effect) */}
      <div className="absolute bottom-0 left-0 w-full p-6 pt-8 pb-3 bg-white/10 backdrop-blur-md border-t border-white/20 flex flex-col justify-end">
        <h3 className="text-2xl font-black text-black tracking-tight mb-1">
          {product.name}
        </h3>
        <p className="text-black font-semibold text-sm mb-5">
          {product.category}
        </p>

        {/* Enquiry Button */}
        <button
          type="button"
          className="self-start px-7 py-3 bg-black/40 hover:bg-black/60 text-white font-bold text-sm rounded-full tracking-wide transition-all border border-white/25 active:scale-95 shadow-sm"
        >
          Enquiry Now
        </button>
      </div>
      
    </div>
  );
}