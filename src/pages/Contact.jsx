import React from 'react';

export default function Contact() {
  return (
    <div className="relative min-h-screen bg-[#FAF9F5] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden transition-colors duration-300">
      
      {/* Background Nature Doodle SVG Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] dark:opacity-[0.05] flex justify-between items-center z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none">
          <pattern id="nature-doodle" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            {/* Tree doodle */}
            <path d="M30 50 C30 35, 15 35, 20 20 C25 10, 45 10, 45 20 C50 35, 35 35, 35 50 Z M32 50 L32 60" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Sun doodle */}
            <circle cx="90" cy="25" r="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
            {/* Leaf doodle */}
            <path d="M80 80 Q95 70 95 85 Q80 95 80 80 Z M80 80 L95 85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Cloud doodle */}
            <path d="M15 90 Q15 80 25 80 Q30 70 40 75 Q50 70 55 80 Q60 85 50 90 Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#nature-doodle)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 rounded-3xl shadow-xl">
        
        {/* Info Column */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-[#b31919] dark:text-red-500 font-bold text-xs uppercase tracking-wider block mb-1">Get In Touch</span>
            <h1 className="text-3xl font-extrabold tracking-tight mb-4">Let's Connect</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              Have a custom door order or want to consult with our interior design architects? Drop us a message!
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[#b31919]">📍</span>
              <span>123 Architectural Way, Design District</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[#b31919]">📞</span>
              <span>+1 (800) 555-DOOR</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[#b31919]">✉️</span>
              <span>support@doorcraft.com</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={(e) => e.preventDefault()} className="md:col-span-7 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-600 dark:text-zinc-400">Full Name</label>
            <input type="text" placeholder="John Doe" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#b31919] transition" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-600 dark:text-zinc-400">Email Address</label>
            <input type="email" placeholder="john@example.com" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#b31919] transition" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-600 dark:text-zinc-400">Message</label>
            <textarea rows="4" placeholder="Tell us about your project or inquiry..." className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#b31919] transition"></textarea>
          </div>
          <button type="submit" className="w-full bg-[#b31919] hover:bg-red-700 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-md active:scale-98 cursor-pointer">
            Send Message
          </button>
        </form>

      </div>
    </div>
  );
}