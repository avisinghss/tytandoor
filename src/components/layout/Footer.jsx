import { Mail, MapPin, Phone } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Company */}
          <div>
            <h2 className="text-3xl font-black">
              TYTAN DOOR
            </h2>

            <p className="mt-6 leading-7 text-gray-400">
              Premium flush doors crafted for luxury homes,
              architects, builders and commercial projects.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-6 text-xl font-bold">
              Quick Links
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-white cursor-pointer">Home</li>
              <li className="hover:text-white cursor-pointer">Products</li>
              <li className="hover:text-white cursor-pointer">Gallery</li>
              <li className="hover:text-white cursor-pointer">About</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-xl font-bold">
              Contact
            </h3>

            <div className="space-y-4 text-gray-400">
              <div className="flex items-center gap-3">
                <MapPin size={18} />
                <span>Ahmedabad, Gujarat</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} />
                <span>+91 XXXXX XXXXX</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>info@tytandoor.com</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-6 text-xl font-bold">
              Follow Us
            </h3>

            <div className="flex gap-4 text-2xl">
              <FaFacebookF className="cursor-pointer transition hover:text-red-600" />
              <FaInstagram className="cursor-pointer transition hover:text-red-600" />
              <FaLinkedinIn className="cursor-pointer transition hover:text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-sm text-gray-500">
        © 2026 Tytan Door. All Rights Reserved.
        <p className="text-center text-sm text-gray-500">
  Web Design &amp; Development |{" "}
  <a
    href="#"
    className="font-small text-gray hover:text-green-600 transition-colors"
  >
    Anubhav Codes
  </a>
</p>
      </div>
      
    </footer>
  );
}