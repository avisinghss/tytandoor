import React, { useState, useEffect } from 'react';
import { X, Loader2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

export default function EditProductModal({ isOpen, product, onClose, onProductUpdated }) {
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    categorySlug: product?.category_slug || product?.categorySlug || '',
    image: product?.image || '',
    description: product?.description || '',
    features: product?.features?.length > 0 ? product.features : [''],
  });

  useEffect(() => {
    if (isOpen && product) {
      fetchCategories();
      setFormData({
        name: product.name || '',
        category: product.category || '',
        categorySlug: product.category_slug || product.categorySlug || '',
        image: product.image || '',
        description: product.description || '',
        features: product.features?.length > 0 ? product.features : [''],
      });
    }
  }, [isOpen, product]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    if (data) setCategories(data);
  };

  const handleCategoryChange = (categoryName) => {
    const selected = categories.find((c) => c.name === categoryName);
    setFormData((prev) => ({
      ...prev,
      category: categoryName,
      categorySlug: selected ? (selected.slug || selected.category_slug || '') : '',
    }));
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...formData.features];
    updated[index] = value;
    setFormData({ ...formData, features: updated });
  };

  const addFeatureInput = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeatureInput = (index) => {
    const updated = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updated });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const generatedSlug = formData.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

      const cleanedFeatures = formData.features.filter((f) => f.trim() !== '');

      const payload = {
        name: formData.name,
        slug: generatedSlug,
        category: formData.category,
        category_slug: formData.categorySlug,
        image: formData.image,
        description: formData.description,
        features: cleanedFeatures,
      };

      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', product.id);

      if (error) throw error;

      if (onProductUpdated) onProductUpdated();
      onClose();
    } catch (err) {
      alert('Error updating product: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-2xl p-6 shadow-2xl relative text-white my-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
          <h3 className="text-lg font-black uppercase tracking-wide text-white">Edit Product</h3>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          
          {/* Select Category */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Product Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Image URL</label>
            <input
              type="url"
              required
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 resize-none"
            />
          </div>

          {/* Features */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-400 uppercase">Product Features</label>
              <button
                type="button"
                onClick={addFeatureInput}
                className="text-xs font-bold text-red-500 hover:text-red-400 flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Add Feature
              </button>
            </div>

            <div className="space-y-2">
              {formData.features.map((feat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeatureInput(index)}
                      className="p-2 text-zinc-500 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-zinc-800 text-xs font-bold text-zinc-400 hover:bg-zinc-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              <span>Update Product</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}