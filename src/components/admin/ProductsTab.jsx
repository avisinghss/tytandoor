import React, { useState } from 'react';
import { Plus, Trash2, Package, Heart, Edit2 } from 'lucide-react';
import EditProductModal from './EditProductModal';

export default function ProductsTab({ products, onOpenModal, onDeleteProduct, onToggleFeatured, onProductUpdated }) {
  const [editingProduct, setEditingProduct] = useState(null);

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-zinc-900 border border-zinc-800 p-4 sm:p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-wide uppercase">
            Products Directory
          </h2>
          <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 sm:mt-1">
            Manage your door catalog, upload new items & sync in real-time.
          </p>
        </div>

        {/* Trigger Add Product Modal */}
        <button
          onClick={onOpenModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 sm:py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Grid Display */}
      {products.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800 border-dashed rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center">
          <div className="bg-zinc-800/80 p-3.5 rounded-2xl text-zinc-500 mb-3">
            <Package size={28} />
          </div>
          <h3 className="text-base font-bold text-zinc-300">No Products Added Yet</h3>
          <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-5">
            Click the button above to add your first door model to the live catalogue.
          </p>
          <button
            onClick={onOpenModal}
            className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
          >
            + Add First Product
          </button>
        </div>
      ) : (
        /* Responsive Grid: 2 cols on mobile, 3 on tablet, 4-5 on desktop */
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl overflow-hidden hover:border-zinc-700 transition duration-300 flex flex-col justify-between group shadow-md"
            >
              {/* Product Image Container */}
              <div className="relative aspect-square sm:aspect-[4/3] bg-zinc-950 overflow-hidden flex items-center justify-center p-1.5 sm:p-2">
                <img
                  src={item.image || "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600"}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg sm:rounded-xl group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600";
                  }}
                />
                
                {/* Category Badge */}
                {item.category && (
                  <span className="absolute top-2 left-2 max-w-[70%] truncate bg-black/70 backdrop-blur-md text-red-400 border border-red-500/30 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                )}

                {/* Favorite Badge Button */}
                <button
                  type="button"
                  onClick={() => onToggleFeatured(item.id, item.is_featured)}
                  className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-full backdrop-blur-md border transition cursor-pointer active:scale-90 ${
                    item.is_featured
                      ? 'bg-red-600/90 text-white border-red-500 shadow-md shadow-red-600/40'
                      : 'bg-black/50 text-zinc-400 border-white/20 hover:text-white hover:bg-black/70'
                  }`}
                  title={item.is_featured ? "Remove from Featured" : "Mark as Featured"}
                >
                  <Heart size={13} className="sm:w-3.5 sm:h-3.5" fill={item.is_featured ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-1 group-hover:text-red-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-tight mt-0.5 sm:mt-1">
                    {item.description || "No description available."}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="mt-2.5 sm:mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[9px] sm:text-[10px] text-zinc-500 font-mono">
                    #{String(item.id).substring(0, 5)}
                  </span>

                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {/* EDIT BUTTON */}
                    <button
                      onClick={() => setEditingProduct(item)}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md sm:rounded-lg transition cursor-pointer"
                      title="Edit Product Details"
                    >
                      <Edit2 size={13} className="sm:w-3.5 sm:h-3.5" />
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => onDeleteProduct(item.id, item.name)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded-md sm:rounded-lg transition cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 size={13} className="sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Product Modal Component */}
      {editingProduct && (
        <EditProductModal
          isOpen={!!editingProduct}
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onProductUpdated={() => {
            if (onProductUpdated) onProductUpdated();
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}