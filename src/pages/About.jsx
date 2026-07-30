import React from 'react';
// Works for both export default and named export
import BrandPillars from '../components/home/BrandPillars'; 

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 font-sans transition-colors duration-300">
      
      {/* --- HERO SECTION --- */}
      <section className="relative bg-slate-900 dark:bg-zinc-900 text-white py-16 sm:py-24 px-6 sm:px-12 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-4xl mx-auto space-y-4">
          <span className="inline-block px-3.5 py-1 bg-[#b31919]/20 dark:bg-red-500/20 text-red-400 rounded-full text-xs font-semibold uppercase tracking-wider">
            Premium Architectural Doors
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Engineering Strength. Crafting Elegance.
          </h1>
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-light">
            Built for lifetime durability and modern aesthetics, engineered to elevate every entrance.
          </p>
        </div>
      </section>

      {/* --- BRAND STORY --- */}
      <section className="max-w-6xl mx-auto py-12 sm:py-16 px-6 sm:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
        <div className="space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            About <span className="text-[#b31919] dark:text-red-500">Tytan Doors</span>
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
            At Tytan Doors, we believe a door is more than just an entryway—it is the frontline of security, aesthetics, and architectural character for any structure.
          </p>
          <p className="text-slate-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
            Established on <strong>August 1, 2012</strong>, Tytan Doors operates as a specialized manufacturing brand under <strong>Anil Interio</strong>. By fusing deep expertise in interior craftsmanship with advanced manufacturing standards, we deliver doors designed to withstand time and climate.
          </p>
          <div className="p-4 bg-red-50/60 dark:bg-red-950/20 border-l-4 border-[#b31919] dark:border-red-500 rounded-r-lg">
            <p className="text-xs sm:text-sm text-slate-800 dark:text-zinc-300 font-medium">
              Backed by Anil Interio — bringing design-first thinking to high-grade industrial production.
            </p>
          </div>
        </div>

        {/* Footprint / Location Card */}
        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 space-y-6">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-3">
            Our Operations & Footprint
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 rounded-lg font-bold text-xs sm:text-sm shrink-0">
                HQ
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">Headquarters</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">Ballia, Uttar Pradesh</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-950/50 text-[#b31919] dark:text-red-400 rounded-lg font-bold text-xs sm:text-sm shrink-0">
                MFG
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">Manufacturing Facility</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">Gurugram Industrial Belt</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- BRAND PILLARS SECTION --- */}
      <section className="py-6">
        <BrandPillars />
      </section>

      {/* --- CORE FEATURES --- */}
      <section className="bg-slate-100 dark:bg-zinc-900/50 py-12 sm:py-16 px-6 sm:px-12 border-y border-slate-200/80 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Why Choose Tytan Doors?</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-xl mx-auto">Engineered for quality, safety, and long-term performance.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { title: 'Heavy-Duty Core', desc: 'Built using high-density materials engineered for maximum structural integrity.' },
              { title: 'Termite & Weather Proof', desc: 'Advanced treatment ensures immunity against pests, moisture, and warping.' },
              { title: 'Precision Crafted', desc: 'Manufactured with state-of-the-art machinery in our Haryana plant.' },
              { title: 'Interior Firm Backed', desc: 'Seamlessly blends heavy structural strength with modern interior aesthetics.' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-xl shadow-xs border border-slate-200/80 dark:border-zinc-800 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/30 text-[#b31919] dark:text-red-500 flex items-center justify-center font-bold text-sm">
                  0{idx + 1}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="max-w-4xl mx-auto py-12 sm:py-16 px-6 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Ready to Upgrade Your Entrances?</h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-xl mx-auto">
          Explore our complete product range or get in touch with our technical sales team for custom project quotes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-2">
          <button className="w-full sm:w-auto px-6 py-3 bg-[#b31919] hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm cursor-pointer">
            Download Catalog
          </button>
          <button className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer">
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
}