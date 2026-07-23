import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* --- HERO SECTION --- */}
      <section className="relative bg-slate-900 text-white py-20 px-6 sm:px-12 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-4xl mx-auto space-y-4">
          <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-semibold uppercase tracking-wider">
            Premium Architectural Doors
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            Engineering Strength. Crafting Elegance.
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-light">
            Built for lifetime durability and modern aesthetics, engineered to elevate every entrance.
          </p>
        </div>
      </section>

      {/* --- BRAND STORY --- */}
      <section className="max-w-6xl mx-auto py-16 px-6 sm:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            About <span className="text-amber-600">Tytan Doors</span>
          </h2>
          <p className="text-slate-600 leading-relaxed">
            At Tytan Doors, we believe a door is more than just an entryway—it is the frontline of security, aesthetics, and architectural character for any structure.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Established on <strong>August 1, 2026</strong>, Tytan Doors operates as a specialized manufacturing brand under <strong>Anil Interior Firm</strong>. By fusing deep expertise in interior craftsmanship with advanced manufacturing standards, we deliver doors designed to withstand time and climate.
          </p>
          <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
            <p className="text-sm text-amber-900 font-medium">
              Backed by Anil Interior Firm — bringing design-first thinking to high-grade industrial production.
            </p>
          </div>
        </div>

        {/* Footprint / Location Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <h3 className="text-xl font-semibold text-slate-900 border-b border-slate-100 pb-3">
            Our Operations & Footprint
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-100 rounded-lg text-slate-700 font-bold text-sm">HQ</div>
              <div>
                <h4 className="font-semibold text-slate-900">Headquarters</h4>
                <p className="text-sm text-slate-600">Ballia, Uttar Pradesh</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 text-amber-800 rounded-lg font-bold text-sm">MFG</div>
              <div>
                <h4 className="font-semibold text-slate-900">Manufacturing Facility</h4>
                <p className="text-sm text-slate-600">Gurugram / Haryana Industrial Belt</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CORE FEATURES --- */}
      <section className="bg-slate-100 py-16 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose Tytan Doors?</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Engineered for quality, safety, and long-term performance.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Heavy-Duty Core', desc: 'Built using high-density materials engineered for maximum structural integrity.' },
              { title: 'Termite & Weather Proof', desc: 'Advanced treatment ensures immunity against pests, moisture, and warping.' },
              { title: 'Precision Crafted', desc: 'Manufactured with state-of-the-art machinery in our Haryana plant.' },
              { title: 'Interior Firm Backed', desc: 'Seamlessly blends heavy structural strength with modern interior aesthetics.' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-xs border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  0{idx + 1}
                </div>
                <h3 className="font-semibold text-slate-900 text-lg">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="max-w-4xl mx-auto py-16 px-6 text-center space-y-6">
        <h2 className="text-3xl font-bold text-slate-900">Ready to Upgrade Your Entrances?</h2>
        <p className="text-slate-600 max-w-xl mx-auto">
          Explore our complete product range or get in touch with our technical sales team for custom project quotes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          <button className="w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors shadow-sm">
            Download Catalog
          </button>
          <button className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors">
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
}