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
        className="flex items-center justify-center w-14 h-14 bg-[#b31919] hover:bg-[#911414] text-white shadow-lg transition-all duration-300 active:scale-95 rounded-r-[24px] border-y border-r border-white/10"
        aria-label="Call Us"
      >
        <Phone size={24}/>
      </a>

      {/* 2. WhatsApp Direct Chat Button */}
      <a
        href={`https://wa.me/${whatsAppNumber}?text=${whatsAppMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14  bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-lg transition-all duration-300 active:scale-95 rounded-r-[24px] border-y border-r border-white/10"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircleCode size={26} />
      </a>

    </div>
  );
}