import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function ScrollIndicator() {
  const scrollNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <motion.button
      onClick={scrollNext}
      initial={{ opacity: 0, y: -10 }}
      animate={{
        opacity: 1,
        y: [0, 8, 0],
      }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
      }}
      className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-white"
      aria-label="Scroll Down"
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs uppercase tracking-[0.35em] text-white/80">
          Scroll
        </span>

        <div className="flex h-12 w-7 items-start justify-center rounded-full border border-white/50 p-1">
          <motion.div
            animate={{
              y: [0, 16, 0],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
            }}
            className="h-2 w-2 rounded-full bg-white"
          />
        </div>

        <ChevronDown size={18} />
      </div>
    </motion.button>
  );
}