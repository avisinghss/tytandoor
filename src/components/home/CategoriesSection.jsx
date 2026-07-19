import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories, products } from "../../data/categories";

export default function CategoriesSection() {
  // 1. States for filtering and pagination
  const [activeCategory, setActiveCategory] = useState("all"); // Default state sets to "all" for random shuffle
  const [visibleCount, setVisibleCount] = useState(6); // Initial count is 6 products

  // 2. Shuffle array logic to get randomized items on initial component mount
  const randomizedProducts = useMemo(() => {
    return [...products].sort(() => Math.random() - 0.5);
  }, []);

  // 3. Filter items based on active tabs (Randomized array if "all", regular filter if category slug)
  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") {
      return randomizedProducts;
    }
    return products.filter((product) => product.categorySlug === activeCategory);
  }, [activeCategory, randomizedProducts]);

  // Slice the array based on "See More" limit
  const displayedProducts = filteredProducts.slice(0, visibleCount);

  // Reset the product count back to 6 whenever user switches category tabs
  const handleCategoryChange = (slug) => {
    setActiveCategory(slug);
    setVisibleCount(6); 
  };

  const handleProductClick = (productId) => {
    window.location.href = `/products/${productId}`;
  };

  return (
    <section className="relative py-24 bg-[#FAF9F5] font-sans flex flex-col items-center overflow-hidden">
      
      {/* Lining Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 hidden md:block"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'linear-gradient(to bottom right, rgba(0,0,0,1), rgba(0,0,0,0.1))',
          WebkitMaskImage: 'linear-gradient(to bottom right, rgba(0,0,0,1), rgba(0,0,0,0.1))'
        }}
      />

      <div className="absolute left-[8%] top-0 w-[1px] h-full bg-gray-200 opacity-70 hidden xl:block" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl w-full px-6 xl:pl-24">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-left mb-12 relative"
        >
          <div className="absolute -left-5 top-2 w-1.5 h-7 bg-[#b31919] hidden xl:block" />
          <span className="text-[#b31919] font-bold text-lg tracking-wide block mb-1">
            Our Collection
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-black leading-tight mb-4">
            Explore Door Categories
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl leading-relaxed">
            Browse our premium range of architectural doors designed for luxury homes and commercial spaces.
          </p>
        </motion.div>

        {/* Categories Carousel/Slider Viewport */}
        <div className="flex space-x-6 overflow-x-auto pb-6 mb-14 scrollbar-none snap-x">
          
          {/* Naya Custom Tab: "ALL COLLECTION" to reset filters back to random state */}
          <div
            onClick={() => handleCategoryChange("all")}
            className="flex flex-col items-center cursor-pointer min-w-[130px] md:min-w-[150px] snap-start select-none group"
          >
            <div 
              className={`w-[120px] h-[150px] rounded-[18px] bg-white border-2 overflow-hidden flex flex-col items-center justify-center transition-all duration-300 ${
                activeCategory === "all" 
                  ? "border-[#b31919] shadow-lg scale-105" 
                  : "border-gray-200 group-hover:border-gray-400"
              }`}
            >
              <div className="font-extrabold text-2xl text-gray-300 group-hover:text-[#b31919] transition-colors">ALL</div>
            </div>
            <span className={`mt-3 text-xs md:text-sm font-black tracking-wide text-center transition-colors ${
              activeCategory === "all" ? "text-[#b31919]" : "text-gray-900"
            }`}>
              ALL DOORS
            </span>
          </div>

          {/* Dynamic Categories Cards */}
          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className="flex flex-col items-center cursor-pointer min-w-[130px] md:min-w-[150px] snap-start select-none group"
              >
                <div 
                  className={`w-[120px] h-[150px] rounded-[18px] bg-white border-2 overflow-hidden p-2 flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? "border-[#b31919] shadow-lg scale-105" 
                      : "border-gray-200 group-hover:border-gray-400"
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-[12px]"
                  />
                </div>
                <span className={`mt-3 text-xs md:text-sm font-black tracking-wide text-center transition-colors ${
                  isActive ? "text-[#b31919]" : "text-gray-900"
                }`}>
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Products Display Grid */}
        <motion.div 
          layout 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {displayedProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="flex flex-col cursor-pointer group"
              >
                <div className="w-full aspect-[4/5] rounded-[22px] bg-white border border-gray-100 overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300 p-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-[16px] transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <h3 className="mt-4 text-sm md:text-base font-extrabold text-black group-hover:text-[#b31919] transition-colors pl-1">
                  {product.name}
                </h3>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* 4. See More / Reveal Button Control */}
        {filteredProducts.length > visibleCount && (
          <div className="w-full flex justify-center mt-16">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 6)} // Reveals 6 more products on click
              className="px-8 py-3.5 bg-black hover:bg-[#b31919] text-white font-bold text-sm md:text-base rounded-full tracking-wide shadow-md hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              See More Collection
            </button>
          </div>
        )}

      </div>
    </section>
  );
}