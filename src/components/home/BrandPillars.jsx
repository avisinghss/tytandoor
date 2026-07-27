import React, { useState } from 'react';
import { Cpu, Users, Leaf, ChevronDown } from 'lucide-react';

const pillars = [
  {
    icon: Cpu,
    title: 'Technology',
    desc: 'State-of-the-art machinery coupled with the latest manufacturing processes.',
  },
  {
    icon: Users,
    title: 'People',
    desc: 'We are committed to giving back to the community by creating opportunities to transform our nation.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    desc: 'Sustainably sourced with a healthy mix of global and local materials to reduce impact on the planet.',
  },
];

export function BrandPillars() {
  // Tracks which card is expanded on mobile (null if none are open)
  const [openIndex, setOpenIndex] = useState(null);

  const togglePillar = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-8 md:py-16 bg-zinc-50 dark:bg-zinc-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Our Brand Pillars
          </h2>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            The core values driving our engineering excellence.
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                onClick={() => togglePillar(idx)}
                className={`cursor-pointer md:cursor-default bg-white dark:bg-zinc-950 p-4 md:p-6 rounded-xl md:rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  isOpen
                    ? 'border-[#b31919] dark:border-red-500 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {/* Header (Icon + Title + Chevron) */}
                <div className="flex items-center md:flex-col md:text-center justify-between md:justify-center gap-3">
                  <div className="flex items-center md:flex-col md:text-center gap-3 w-full">
                    
                    {/* Icon Badge */}
                    <div className="p-2.5 md:p-4 bg-red-50 dark:bg-red-950/30 text-[#b31919] dark:text-red-500 rounded-full shrink-0 border border-red-100 dark:border-red-900/40">
                      <Icon className="w-5 h-5 md:w-8 md:h-8" />
                    </div>

                    {/* Title */}
                    <h3 className="text-sm md:text-xl font-bold text-zinc-900 dark:text-white text-left md:text-center flex-1">
                      {item.title}
                    </h3>
                  </div>

                  {/* Mobile Accordion Chevron Indicator */}
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 md:hidden transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#b31919] dark:text-red-500' : ''
                    }`}
                  />
                </div>

                {/* Description Body: Hidden on mobile unless clicked, always open on desktop */}
                <div
                  className={`mt-2.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 md:border-none md:pt-0 md:mt-3 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 md:text-center leading-relaxed transition-all ${
                    isOpen ? 'block' : 'hidden md:block'
                  }`}
                >
                  {item.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default BrandPillars;