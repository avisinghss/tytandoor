import { motion } from "framer-motion";
import {
  ShieldCheck,
  Award,
  Factory,
  Layers,
  Wrench,
  CloudSun,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "10 Years Warranty",
    description: "Complete peace of mind backed by premium quality.",
  },
  {
    icon: Award,
    title: "4 Decades Experience",
    description: "Over 40 years of industry leadership in engineering.",
  },
  {
    icon: Factory,
    title: "In-House Production",
    description: "Designed & manufactured using state-of-the-art machinery.",
  },
  {
    icon: Layers,
    title: "End-to-End Solutions",
    description: "Support covered seamlessly from design to installation.",
  },
  {
    icon: Wrench,
    title: "Nail-Free Setup",
    description: "Modular setup engineered for fast, clean assembly.",
  },
  {
    icon: CloudSun,
    title: "Weather & Strength Tested",
    description: "Tested for extreme weather and sound reduction.",
  },
];

export default function WhyChooseUs() {
  const duplicatedFeatures = [...features, ...features];

  return (
    <section className="bg-[#F8F7F4] dark:bg-zinc-950 py-12 md:py-24 overflow-hidden transition-colors duration-500">
      {/* Inline styles for the pure CSS marquee animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 18s linear infinite;
        }
        /* Pauses animation instantly when hovering, holding, or touching on mobile */
        .marquee-container:hover .animate-marquee,
        .marquee-container:active .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Heading Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-8 md:mb-16 max-w-3xl text-center px-2"
        >
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#b31919] dark:text-red-500">
            Why Tytan Door
          </span>

          <h2 className="mt-2 text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            How We Make A Difference
          </h2>

          <div className="mt-3 mx-auto w-16 md:w-20 h-1 bg-[#b31919] dark:bg-red-500 rounded-full" />

          <p className="mt-3 text-xs sm:text-base leading-relaxed text-gray-600 dark:text-zinc-400 hidden sm:block">
            Combining innovation, strength, and elegant design to create doors
            that leave a lasting impression.
          </p>
        </motion.div>

        {/* --- MOBILE: Continuous Auto-Looping Scroll --- */}
        <div className="block sm:hidden w-full overflow-hidden marquee-container [mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)]">
          <div className="animate-marquee gap-3 py-2 select-none">
            {duplicatedFeatures.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="w-[210px] shrink-0 flex flex-col items-center text-center rounded-xl bg-white dark:bg-zinc-900 p-4 shadow-xs border border-gray-200/80 dark:border-zinc-800 transition-colors mr-3"
                >
                  <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full border border-[#b31919] dark:border-red-500 bg-red-50/50 dark:bg-red-950/30 text-[#b31919] dark:text-red-500 shrink-0">
                    <Icon className="w-5 h-5" strokeWidth={1.75} />
                  </div>

                  <h3 className="mb-1 text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-[10px] leading-relaxed text-gray-600 dark:text-zinc-400 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- DESKTOP / TABLET: Grid View --- */}
        <div className="hidden sm:grid gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="group flex flex-col items-center text-center rounded-2xl bg-white dark:bg-zinc-900 p-7 shadow-xs border border-gray-200/80 dark:border-zinc-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-zinc-950/50"
              >
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#b31919] dark:border-red-500 bg-red-50/50 dark:bg-red-950/30 text-[#b31919] dark:text-red-500 transition-transform duration-300 group-hover:scale-105 shrink-0">
                  <Icon className="w-8 h-8" strokeWidth={1.75} />
                </div>

                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-gray-600 dark:text-zinc-400">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}