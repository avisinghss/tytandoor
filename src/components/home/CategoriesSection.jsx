import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getCategories, getProducts } from "../../services/productService";

export default function CategoriesSection() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);

  // Fetch Live Data from Supabase
  useEffect(() => {
    async function loadLiveData() {
      setLoading(true);
      try {
        const [catsData, prodsData] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);
        setCategories(catsData || []);
        setProducts(prodsData || []);
      } catch (error) {
        console.error("Error loading categories or products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadLiveData();
  }, []);

  // Fisher-Yates Random Shuffle function for 'ALL' tab
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Shuffle products whenever products array updates
  const randomizedProducts = useMemo(() => {
    if (!products.length) return [];
    return shuffleArray(products);
  }, [products]);

  // Robust Category Filtering Logic (Handles NULLs, slugs, & raw category names)
  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") {
      return randomizedProducts;
    }

    // Helper to normalize strings for comparison ("Amez Door" -> "amez door", "amez-door" -> "amez door")
    const normalize = (str) =>
      String(str || "")
        .toLowerCase()
        .replace(/[-_]/g, " ")
        .trim();

    // Active Category ki Details find karo (e.g. name = "Amez Door", slug = "amez-door")
    const currentCatObj = categories.find((c) => {
      const slugVal = c.slug || c.name || c.id;
      return normalize(slugVal) === normalize(activeCategory);
    });

    // Match targets: [activeCategory, category.slug, category.name, category.id]
    const searchTargets = [
      activeCategory,
      currentCatObj?.slug,
      currentCatObj?.name,
      currentCatObj?.id,
    ]
      .filter(Boolean)
      .map(normalize);

    return products.filter((product) => {
      // Collect all potential category fields from Supabase row
      const productCategoryFields = [
        product.category,         // Holds "Amez Door"
        product.category_slug,    // Holds "amez-door" (can be NULL)
        product.categorySlug,     // Alternative property (can be NULL)
        product.category_id,
      ]
        .filter(Boolean)
        .map(normalize);

      if (!productCategoryFields.length) return false;

      // Check if ANY field in the product row matches ANY search target
      return productCategoryFields.some((pVal) =>
        searchTargets.some(
          (sVal) => pVal === sVal || pVal.includes(sVal) || sVal.includes(pVal)
        )
      );
    });
  }, [activeCategory, randomizedProducts, products, categories]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const handleCategoryChange = (slug) => {
    setActiveCategory(slug);
    setVisibleCount(6);
  };

  const handleProductClick = (product) => {
    const targetSlug = product.slug || product.id;
    navigate(`/products/${targetSlug}`);
  };

  return (
    <section className="relative py-24 bg-[#FAF9F5] dark:bg-zinc-950 font-sans flex flex-col items-center overflow-hidden transition-colors duration-500">
      {/* Background SVG Wave */}
      <div className="absolute inset-y-0 right-0 w-full md:w-1/2 pointer-events-none z-0 overflow-hidden opacity-30 dark:opacity-15 transition-all duration-500 flex items-center justify-end">
        <svg
          className="h-full w-auto min-w-[300px] md:min-w-[500px] object-right"
          viewBox="0 0 500 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g stroke="#b31919" strokeWidth="1.5" strokeLinecap="round" opacity="0.85">
            <path d="M500 100 C350 200 200 250 150 400 C100 550 250 650 200 750 C160 830 250 900 500 950" />
            <path d="M500 130 C380 220 240 270 190 410 C140 550 280 640 240 740 C200 820 280 890 500 930" />
            <path d="M500 160 C410 240 280 290 230 420 C180 550 310 630 280 730 C240 810 310 880 500 910" />
            <path d="M500 190 C440 260 320 310 270 430 C220 550 340 620 320 720 C280 800 340 870 500 890" />
            <path d="M500 220 C470 280 360 330 310 440 C260 550 370 610 360 710 C320 790 370 860 500 870" />
            <path d="M500 250 C490 300 400 350 350 450 C300 550 400 600 400 700 C360 780 400 850 500 850" />
            <path d="M500 280 C500 320 440 370 390 460 C340 550 430 590 440 690 C400 770 430 840 500 830" />
          </g>
        </svg>
      </div>

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
          <span className="text-[#b31919] dark:text-red-500 font-bold text-lg tracking-wide block mb-1">
            Our Collection
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white leading-tight mb-4">
            Explore Door Categories
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
            Browse our premium range of architectural doors designed for luxury homes and commercial spaces.
          </p>
        </motion.div>

        {/* Categories Slider */}
        <div className="flex space-x-6 overflow-x-auto pb-6 mb-14 scrollbar-none snap-x">
          {/* ALL Tab */}
          <div
            onClick={() => handleCategoryChange("all")}
            className="flex flex-col items-center cursor-pointer min-w-[130px] md:min-w-[150px] snap-start select-none group"
          >
            <div
              className={`w-[120px] h-[150px] rounded-[18px] bg-white dark:bg-zinc-900 border-2 overflow-hidden flex flex-col items-center justify-center transition-all duration-300 ${
                activeCategory === "all"
                  ? "border-[#b31919] dark:border-red-500 shadow-lg scale-105"
                  : "border-gray-200 dark:border-zinc-800 group-hover:border-gray-400 dark:group-hover:border-zinc-600"
              }`}
            >
             <img src="/logo.png" alt="Logo" className="h-14 w-auto object-contain transition-opacity group-hover:opacity-80" 
/>
            </div>
            <span
              className={`mt-3 text-xs md:text-sm font-black tracking-wide text-center transition-colors ${
                activeCategory === "all"
                  ? "text-[#b31919] dark:text-red-500"
                  : "text-gray-900 dark:text-gray-100"
              }`}
            >
              ALL DOORS
            </span>
          </div>

          {/* Dynamic Category Cards */}
          {categories.map((cat) => {
            const catSlug = cat.slug || cat.id || cat.name;
            const isActive = activeCategory === catSlug;
            return (
              <div
                key={cat.id || catSlug}
                onClick={() => handleCategoryChange(catSlug)}
                className="flex flex-col items-center cursor-pointer min-w-[130px] md:min-w-[150px] snap-start select-none group"
              >
                <div
                  className={`w-[120px] h-[150px] rounded-[18px] bg-white dark:bg-zinc-900 border-2 overflow-hidden p-2 flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "border-[#b31919] dark:border-red-500 shadow-lg scale-105"
                      : "border-gray-200 dark:border-zinc-800 group-hover:border-gray-400 dark:group-hover:border-zinc-600"
                  }`}
                >
                  <img
                    src={cat.image || cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-[12px]"
                  />
                </div>
                <span
                  className={`mt-3 text-xs md:text-sm font-black tracking-wide text-center transition-colors ${
                    isActive
                      ? "text-[#b31919] dark:text-red-500"
                      : "text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Loading Skeleton / Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse space-y-3">
                <div className="w-full aspect-[4/5] bg-gray-200 dark:bg-zinc-800 rounded-[22px]"></div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded-md w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
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
                  onClick={() => handleProductClick(product)}
                  className="flex flex-col cursor-pointer group"
                >
                  <div className="w-full aspect-[4/5] rounded-[22px] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm group-hover:shadow-xl dark:group-hover:shadow-zinc-950/50 transition-all duration-300 p-2">
                    <img
                      src={product.image || product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-[16px] transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <h3 className="mt-4 text-sm md:text-base font-extrabold text-black dark:text-white group-hover:text-[#b31919] dark:group-hover:text-red-500 transition-colors pl-1">
                    {product.name}
                  </h3>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-zinc-400">
            No products found in this category.
          </div>
        )}

        {/* See More Button */}
        {!loading && filteredProducts.length > visibleCount && (
          <div className="w-full flex justify-center mt-16">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-8 py-3.5 bg-black dark:bg-zinc-800 hover:bg-[#b31919] dark:hover:bg-red-700 text-white font-bold text-sm md:text-base rounded-full tracking-wide shadow-md hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer"
            >
              See More Collection
            </button>
          </div>
        )}
      </div>
    </section>
  );
}