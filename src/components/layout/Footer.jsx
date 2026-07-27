import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-zinc-800">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 py-10 md:py-16 lg:py-20">
        
        {/* Main Grid: Stacked on mobile, 4-col on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* Column 1: Visible Logos Container & Company Info */}
          <div className="space-y-4">
            
            {/* Logos Showcase Area - White/Light Cards so dark logos display perfectly */}
            <div className="flex items-center gap-2.5 flex-wrap">
              
              {/* Primary Logo: Tytan Doors (In White Badge) */}
              <Link 
                to="/" 
                className="inline-flex items-center justify-center bg-white px-2.5 py-1.5 rounded-lg shadow-xs hover:bg-zinc-100 transition-colors"
              >
                <img
                  src="/logo.png" // Update this path to your Tytan Doors logo
                  alt="Tytan Doors Logo"
                  className="h-7 sm:h-8 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'block';
                  }}
                />
                <span className="hidden text-sm sm:text-base font-black text-zinc-900 tracking-wider">
                  TYTAN DOORS
                </span>
              </Link>

              {/* Divider Badge */}
              <span className="text-zinc-500 font-medium text-xs">by</span>

              {/* Secondary Logo: Anil Interior (In White Badge) */}
              <a 
                href="#anil-interior" 
                title="Anil Interior Firm"
                className="inline-flex items-center justify-center bg-white px-2.5 py-1.5 rounded-lg shadow-xs hover:bg-zinc-100 transition-colors"
              >
                <img
                  src="/anil-interior-logo.png" // Update this path to your Anil Interior logo
                  alt="Anil Interior Logo"
                  className="h-7 sm:h-8 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'inline-block';
                  }}
                />
                <span className="hidden text-xs font-bold text-amber-600 tracking-wide uppercase">
                  Anil Interior
                </span>
              </a>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-400">
              Premium architectural doors engineered for luxury homes, architects, builders, and commercial developments.
            </p>

            {/* Parent Company Badge */}
            <div className="pt-0.5">
              <span className="inline-block text-[11px] sm:text-xs text-zinc-400 bg-zinc-900/90 border border-zinc-800 px-2.5 py-1 rounded-md">
                A Brand Unit of <strong className="text-zinc-200 font-semibold">Anil Interior Firm</strong>
              </span>
            </div>
          </div>

          {/* Combined Wrapper for Side-by-Side Mobile Display (Quick Links + Contact Us) */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:contents">
            
            {/* Column 2: Quick Links */}
            <div>
              <h3 className="mb-3 sm:mb-6 text-sm sm:text-lg font-bold text-white tracking-wide">
                Quick Links
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-zinc-400">
                <li>
                  <Link
                    to="/help"
                    className="hover:text-red-500 transition-colors duration-200 inline-block py-0.5"
                  >
                    Help & Support
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-red-500 transition-colors duration-200 inline-block py-0.5"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-red-500 transition-colors duration-200 inline-block py-0.5"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Details */}
            <div>
              <h3 className="mb-3 sm:mb-6 text-sm sm:text-lg font-bold text-white tracking-wide">
                Contact Us
              </h3>
              <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-zinc-400">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <Phone className="w-4 h-4 text-red-600 shrink-0" />
                  <a
                    href="tel:+91XXXXXXXXXX"
                    className="hover:text-white transition-colors"
                  >
                    +91 XXXXX XXXXX
                  </a>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3">
                  <Mail className="w-4 h-4 text-red-600 shrink-0" />
                  <a
                    href="mailto:info@tytandoor.com"
                    className="hover:text-white transition-colors break-all"
                  >
                    info@tytandoor.com
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Column 4: Social Links */}
          <div className="pt-2 md:pt-0">
            <h3 className="mb-3 sm:mb-6 text-sm sm:text-lg font-bold text-white tracking-wide">
              Follow Us
            </h3>
            <div className="flex items-center gap-3 sm:gap-4 text-base sm:text-xl">
              <a
                href="#facebook"
                aria-label="Facebook"
                className="p-2 sm:p-2.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-red-600 transition-all duration-300"
              >
                <FaFacebookF className="w-4 h-4 sm:w-4 sm:h-4" />
              </a>
              <a
                href="#instagram"
                aria-label="Instagram"
                className="p-2 sm:p-2.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-red-600 transition-all duration-300"
              >
                <FaInstagram className="w-4 h-4 sm:w-4 sm:h-4" />
              </a>
              <a
                href="#twitter"
                aria-label="Twitter X"
                className="p-2 sm:p-2.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-red-600 transition-all duration-300"
              >
                <FaXTwitter className="w-4 h-4 sm:w-4 sm:h-4" />
              </a>
              <a
                href="#linkedin"
                aria-label="LinkedIn"
                className="p-2 sm:p-2.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-red-600 transition-all duration-300"
              >
                <FaLinkedinIn className="w-4 h-4 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-zinc-900 bg-zinc-950 py-5 text-center text-xs text-zinc-500 px-4 space-y-1">
        <p>© 2026 Tytan Doors. Operating under Anil Interior. All Rights Reserved.</p>
        <p>
          Web Design &amp; Development |{" "}
          <a
            href="https://anubhavcodes.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-green-500 font-medium transition-colors"
          >
            Anubhav Codes
          </a>
        </p>
      </div>
    </footer>
  );
}