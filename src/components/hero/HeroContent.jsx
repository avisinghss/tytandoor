import { motion } from "framer-motion";

export default function HeroContent({ slide }) {
  console.log("HeroContent slide:", slide);

  return (
    <div key={slide.id} className="absolute inset-0 z-20 flex items-center">
      {/* Reduced padding on mobile (px-4 vs lg:px-12) */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="max-w-3xl">

          {/* Subtitle Accent */}
          <motion.span
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-2 sm:mb-4 inline-block tracking-[0.2em] sm:tracking-[0.4em] uppercase text-xs sm:text-sm font-semibold text-red-500"
          >
            Premium Door Manufacturer
          </motion.span>

          {/* Main Title - Starts at text-3xl for mobile, scales gracefully */}
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="text-3xl sm:text-5xl md:text-7xl xl:text-8xl font-black uppercase leading-tight text-white break-words"
          >
            {slide.title}
          </motion.h1>

          {/* Subtitle - Scaled down for mobile */}
          <motion.h2
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-1 sm:mt-3 text-xl sm:text-3xl md:text-5xl font-light text-white/95"
          >
            {slide.subtitle}
          </motion.h2>

          {/* Description - Scaled margins and text sizes */}
          <motion.p
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="mt-4 sm:mt-8 max-w-xl text-sm sm:text-base md:text-lg leading-relaxed text-gray-200"
          >
            {slide.description}
          </motion.p>

          {/* Buttons - Compact padding & margins on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-5 sm:mt-10 flex flex-wrap gap-3 sm:gap-4"
          >
            <button className="rounded-full bg-red-700 px-5 py-2.5 sm:px-8 sm:py-4 text-xs sm:text-base font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-red-800">
              {slide.primaryButton}
            </button>

            <button className="rounded-full border border-white/70 bg-white/10 px-5 py-2.5 sm:px-8 sm:py-4 text-xs sm:text-base font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-black">
              {slide.secondaryButton}
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}