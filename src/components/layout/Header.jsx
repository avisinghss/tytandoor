import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
// If you are using react-router-dom, import Link:
// import { Link } from "react-router-dom"; 
import ThemeToggle from "../common/ThemeToggle";

// Convert items into objects with proper routes
const navItems = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Contact", path: "/contact" },
  { label: "About", path: "/about" },
];

export default function Header() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-zinc-950/95 shadow-lg backdrop-blur-md"
          : "bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

        {/* Logo Section */}
        <a href="/" className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Company Logo" 
            className="w-12 h-12 object-contain" 
          />
          <div>
            <h1 className="font-cinzel text-2xl font-black tracking-wide text-black dark:text-white">
              TYTAN
            </h1>
            <p className="font-cinzel text-xs uppercase tracking-[4px] text-red-700 dark:text-red-500">
              —DOOR—
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-gray-800 dark:text-gray-200">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.path} /* 👈 Updated path */
              className="font-medium hover:text-red-700 dark:hover:text-red-500 transition"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Right Side Area */}
        <div className="hidden lg:flex items-center gap-6">
          <ThemeToggle />
          <button className="bg-red-700 hover:bg-black dark:hover:bg-zinc-800 transition text-white px-6 py-3 rounded-full font-semibold shadow-lg">
            Enquire Now
          </button>
        </div>

        {/* Mobile Action Controls */}
        <div className="flex items-center gap-4 lg:hidden">
          <ThemeToggle />
          <button
            className="text-black dark:text-white focus:outline-none"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenu && (
        <div className="lg:hidden bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 shadow-xl transition-colors">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.path} /* 👈 Updated path */
              onClick={() => setMobileMenu(false)} /* Closes drawer on link click */
              className="block px-6 py-4 border-b border-gray-100 dark:border-zinc-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
            >
              {item.label}
            </a>
          ))}

          <div className="p-6">
            <button className="w-full bg-red-700 text-white py-3 rounded-xl hover:bg-black dark:hover:bg-zinc-800 transition font-semibold">
              Enquire Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}