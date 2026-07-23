import React from 'react';
import { Phone, MessageCircleCode } from 'lucide-react'; // Elegant React Icons

export default function StickyActions() {
  // Aap yahan apne actual details fill kar sakte hain
  const phoneNumber = "+918318886379"; 
  const whatsAppNumber = "918318886379";
  const whatsAppMessage = encodeURIComponent("Hello! I am interested in your premium doors collection.");

  return (
    <div className="fixed left-0 bottom-[20%] z-50 flex flex-col space-y-2 lg:hidden">
      
      {/* 1. Phone Call Action Button */}
      <a
        href={`tel:${phoneNumber}`}
        className="flex items-center justify-center w-12 h-12 bg-[#b31919]/40 hover:bg-[#911414]/80 text-white shadow-lg transition-all duration-300 active:scale-95 rounded-r-[24px] border-y border-r border-white/10"
        aria-label="Call Us"
      >
        <Phone size={24}/>
      </a>

      {/* 2. WhatsApp Direct Chat Button */}
      {/* <a
        href={`https://wa.me/${whatsAppNumber}?text=${whatsAppMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14  bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-lg transition-all duration-300 active:scale-95 rounded-r-[24px] border-y border-r border-white/10"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircleCode size={26} />
      </a> */}
<a
  href={`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(whatsAppMessage)}`}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center justify-center w-12 h-12 bg-[#25D366]/40 hover:bg-[#20ba5a]/80 text-white shadow-lg transition-all duration-300 active:scale-95 rounded-r-[24px] border-y border-r border-white/10 backdrop-blur-sm"
  aria-label="Chat on WhatsApp"
>
  <img 
    src="../public/images/wa-icon.png" // Replace with your image URL or import path
    alt="WhatsApp" 
    className="w-7 h-7 object-contain" 
  />
</a>

    </div>
  );
}