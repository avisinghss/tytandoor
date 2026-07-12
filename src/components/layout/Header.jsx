import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  "Home",
  "About",
  "Products",
  "Gallery",
  "Blogs",
  "Contact",
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
          ? "bg-white/95 shadow-lg backdrop-blur-md"
          : "bg-white/70 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

        {/* Logo */}

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-red-700 text-white flex items-center justify-center text-2xl font-bold">
            T
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-wide">
              TYTAN
            </h1>

            <p className="text-xs uppercase tracking-[4px] text-red-700">
              Premium Doors
            </p>
          </div>

        </div>

        {/* Desktop Navigation */}

        <nav className="hidden lg:flex items-center gap-8">

          {navItems.map((item) => (
            <a
              key={item}
              href="/"
              className="font-medium hover:text-red-700 transition"
            >
              {item}
            </a>
          ))}

        </nav>

        {/* Enquiry Button */}

        <div className="hidden lg:block">

          <button className="bg-red-700 hover:bg-black transition text-white px-6 py-3 rounded-full font-semibold shadow-lg">
            Enquire Now
          </button>

        </div>

        {/* Mobile Button */}

        <button
          className="lg:hidden"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {mobileMenu && (
        <div className="lg:hidden bg-white shadow-xl">

          {navItems.map((item) => (
            <a
              key={item}
              href="/"
              className="block px-6 py-4 border-b hover:bg-gray-50"
            >
              {item}
            </a>
          ))}

          <div className="p-6">
            <button className="w-full bg-red-700 text-white py-3 rounded-xl">
              Enquire Now
            </button>
          </div>

        </div>
      )}
    </header>
  );
}