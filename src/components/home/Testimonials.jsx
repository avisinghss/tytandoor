import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import testimonials from "../../data/testimonials";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Slider controls for Mobile/Tab
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  // Touch handlers for swipe support
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 70) nextSlide(); // Swipe Left
    if (touchStartX.current - touchEndX.current < -70) prevSlide(); // Swipe Right
  };

  return (
    <section className="relative bg-[#F8F7F4] dark:bg-zinc-950 py-28 font-sans flex flex-col items-center overflow-hidden transition-colors duration-500">
      
      {/* Premium Topographic Contour Lines Background Element (Half Screen) */}
      <div className="absolute inset-y-0 right-0 w-full md:w-1/2 pointer-events-none z-0 overflow-hidden opacity-25 dark:opacity-10 transition-all duration-500 flex items-center justify-end">
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
          </g>
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl w-full px-6">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="uppercase tracking-[0.35em] text-[#b31919] dark:text-red-500 font-bold text-sm">
            Testimonials
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-black text-black dark:text-white transition-colors">
            What Our Clients Say
          </h2>
          <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-600 dark:text-gray-400 text-sm md:text-base transition-colors">
            Trusted by homeowners, architects, builders, and interior designers across India.
          </p>
        </motion.div>

        {/* ------------------------------------------------------------- */}
        {/* VIEWPORT 1: MOBILE & TAB RESPONSIVE SLIDER (Visible on < lg) */}
        {/* ------------------------------------------------------------- */}
        <div className="block lg:hidden max-w-xl mx-auto">
          <div 
            className="relative w-full overflow-hidden px-2 py-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
                className="relative rounded-3xl bg-white dark:bg-zinc-900 p-8 shadow-md border border-gray-100 dark:border-zinc-800 flex flex-col min-h-[320px] justify-between transition-colors duration-300"
              >
                {/* Large Decorative Quotation Mark */}
                <span className="absolute right-6 top-2 text-7xl font-serif text-[#b31919]/10 dark:text-red-500/10 pointer-events-none select-none">
                  “
                </span>

                <div>
                  {/* Rating Stars */}
                  <div className="mb-5 flex">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="leading-7 text-sm md:text-base text-gray-700 dark:text-gray-300 transition-colors">
                    "{testimonials[currentIndex].review}"
                  </p>
                </div>

                {/* Profile Information */}
                <div className="mt-6 flex items-center gap-4 border-t border-gray-100 dark:border-zinc-800/85 pt-4">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-[#b31919]/20"
                  />
                  <div>
                    <h4 className="font-extrabold text-base text-black dark:text-white transition-colors">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                      {testimonials[currentIndex].company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider Controls (Circles & Dots Indicator) */}
          <div className="mt-8 flex items-center justify-between px-4">
            {/* Left Button */}
            <button
              onClick={prevSlide}
              type="button"
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-white p-3 rounded-full shadow-sm active:scale-90 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            {/* Pagination Dots */}
            <div className="flex space-x-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? "w-6 bg-[#b31919] dark:bg-red-500" : "w-2 bg-gray-300 dark:bg-zinc-700"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Right Button */}
            <button
              onClick={nextSlide}
              type="button"
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-white p-3 rounded-full shadow-sm active:scale-90 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* VIEWPORT 2: DESKTOP GRID LAYOUT (Visible on >= lg)            */}
        {/* ------------------------------------------------------------- */}
        <div className="hidden lg:grid gap-8 grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-3xl bg-white dark:bg-zinc-900 p-8 shadow-sm hover:shadow-xl border border-transparent dark:border-zinc-800/60 flex flex-col justify-between transition-all duration-300 group"
            >
              {/* Large Decorative Quotation Mark */}
              <span className="absolute right-6 top-2 text-8xl font-serif text-[#b31919]/5 dark:text-red-500/10 transition-colors group-hover:text-[#b31919]/15 pointer-events-none select-none">
                “
              </span>

              <div>
                <div className="mb-6 flex">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="leading-8 text-gray-600 dark:text-gray-300 transition-colors">
                  "{item.review}"
                </p>
              </div>

              <div className="mt-8 flex items-center gap-4 border-t border-gray-100 dark:border-zinc-800/80 pt-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#b31919]/20 transition-all"
                />

                <div>
                  <h4 className="font-bold text-lg text-black dark:text-white transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">
                    {item.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}