import React from 'react';
import { Plus, Trash2, Package } from 'lucide-react';

export default function ProductsTab({ products, onOpenModal, onDeleteProduct }) {
  return (
    <div className="space-y-6">
      
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
            Products Directory
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your door catalog, upload new items & sync in real-time.
          </p>
        </div>

        {/* Trigger Add Product Modal */}
        <button
          onClick={onOpenModal}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg active:scale-95 cursor-pointer"
        >
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Grid Display */}
      {products.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="bg-zinc-800 p-4 rounded-full text-zinc-500 mb-4">
            <Package size={32} />
          </div>
          <h3 className="text-lg font-bold text-zinc-300">No Products Added Yet</h3>
          <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-6">
            Click the button above to add your first door model to the live catalogue.
          </p>
          <button
            onClick={onOpenModal}
            className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition"
          >
            + Add First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition duration-300 flex flex-col justify-between group shadow-md"
            >
              {/* Product Image */}
              <div className="relative aspect-[3/4] bg-zinc-950 overflow-hidden flex items-center justify-center p-2">
                <img
                  src={item.image || "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600"}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600";
                  }}
                />
                
                {/* Category Badge */}
                {item.category && (
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-red-400 border border-red-500/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {item.category}
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-white text-base line-clamp-1 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.description || "No description available."}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-mono">
                    ID: {String(item.id).substring(0, 8)}...
                  </span>

                  <button
                    onClick={() => onDeleteProduct(item.id, item.name)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded-lg transition cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}