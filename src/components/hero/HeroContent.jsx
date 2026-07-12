import { motion } from "framer-motion";

export default function HeroContent({ slide }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
        <div className="max-w-3xl">

          {/* Subtitle */}
          <motion.span
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-block tracking-[0.4em] uppercase text-sm font-semibold text-red-500"
          >
            Premium Door Manufacturer
          </motion.span>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="text-5xl md:text-7xl xl:text-8xl font-black uppercase leading-none text-white"
          >
            {slide.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-3 text-3xl md:text-5xl font-light text-white/95"
          >
            {slide.subtitle}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="mt-8 max-w-xl text-base md:text-lg leading-8 text-gray-200"
          >
            {slide.description}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <button className="rounded-full bg-red-700 px-8 py-4 text-white font-semibold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-red-800">
              {slide.primary}
            </button>

            <button className="rounded-full border border-white/70 bg-white/10 px-8 py-4 text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-black">
              {slide.secondary}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}