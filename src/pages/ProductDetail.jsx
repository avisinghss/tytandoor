import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';

function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // State to manage visible similar products ("See More" feature)
  const [visibleCount, setVisibleCount] = useState(2);

  // Match product by slug OR String/Number ID
  const product = products.find(
    (p) => p.slug === slug || String(p.id) === slug
  );

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

  // Filter similar products by category or categorySlug
  const similarProducts = products.filter(
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          
          {/* Left Column: Image Container (Responsive Span) */}
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 md:p-10 flex items-center justify-center shadow-sm relative group overflow-hidden">
              <div className="w-full aspect-[3/4] max-h-[550px] flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-105"
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mb-8">
                <button className="w-full bg-[#b31919] hover:bg-red-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm text-center shadow-md hover:shadow-lg transition active:scale-98 cursor-pointer">
                  Inquire About This Product
                </button>
                <button className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm text-center shadow-md transition active:scale-98 cursor-pointer">
                  Confused? Get Call From Experts
                </button>
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

              {/* Dynamic Feature Badges (Rendered if available in data) */}
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

            {/* Grid layout: 2 cols on Mobile, 3 on Tablet, 4 on Desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {similarProducts.slice(0, visibleCount).map((item) => (
                <Link
                  to={`/products/${item.slug || item.id}`}
                  key={item.id}
                  className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="bg-slate-50 dark:bg-zinc-950 rounded-xl p-3 mb-3 aspect-[3/4] flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
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