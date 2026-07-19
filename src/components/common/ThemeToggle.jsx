import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  // Check local storage or system preference on mount
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  // Toggle classes inside <html> element
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={() => setIsDark(!isDark)}
      className="relative flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900 text-black dark:text-white shadow-sm hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ y: -10, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 10, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? (
            <Moon size={19} className="text-yellow-400 fill-yellow-400" />
          ) : (
            <Sun size={19} className="text-amber-600 fill-amber-500" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}