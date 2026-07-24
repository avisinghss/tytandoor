import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // Twitter (X) Icon

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-zinc-800">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 lg:py-20">
        
        {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          
          {/* Column 1: Company Info */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black tracking-wider text-white">
              TYTAN DOOR
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              Premium flush doors crafted for luxury homes, architects, builders, and commercial projects.
            </p>
          </div>

          {/* Column 2: Quick Links (Help & Terms) */}
          <div>
            <h3 className="mb-4 sm:mb-6 text-base sm:text-lg font-bold text-white tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-zinc-400">
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

          {/* Column 3: Contact */}
          <div>
            <h3 className="mb-4 sm:mb-6 text-base sm:text-lg font-bold text-white tracking-wide">
              Contact Us
            </h3>
            <div className="space-y-3 text-sm text-zinc-400">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-red-600 shrink-0" />
                <a
                  href="tel:+91XXXXXXXXXX"
                  className="hover:text-white transition-colors"
                >
                  +91 XXXXX XXXXX
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-red-600 shrink-0" />
                <a
                  href="mailto:info@tytandoor.com"
                  className="hover:text-white transition-colors break-all"
                >
                  info@tytandoor.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Social */}
          <div>
            <h3 className="mb-4 sm:mb-6 text-base sm:text-lg font-bold text-white tracking-wide">
              Follow Us
            </h3>
            <div className="flex items-center gap-4 text-xl">
              <a
                href="#facebook"
                aria-label="Facebook"
                className="p-2.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-red-600 transition-all duration-300"
              >
                <FaFacebookF size={18} />
              </a>
              <a
                href="#instagram"
                aria-label="Instagram"
                className="p-2.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-red-600 transition-all duration-300"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="#twitter"
                aria-label="Twitter X"
                className="p-2.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-red-600 transition-all duration-300"
              >
                <FaXTwitter size={18} />
              </a>
              <a
                href="#linkedin"
                aria-label="LinkedIn"
                className="p-2.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-red-600 transition-all duration-300"
              >
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-zinc-900 bg-zinc-950/50 py-6 text-center text-xs sm:text-sm text-zinc-500 px-4 space-y-1">
        <p>© 2026 Tytan Door. All Rights Reserved.</p>
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