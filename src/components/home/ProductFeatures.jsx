import React from 'react';
import { Wrench, ShieldAlert, Volume2, CloudSun, Award, Bug } from 'lucide-react';

const features = [
  {
    icon: Wrench,
    title: '70mins Nail-free Installation',
  },
  {
    icon: ShieldAlert,
    title: 'No Masonry required - Completely Modular',
  },
  {
    icon: Volume2,
    title: 'Sound Reduction Technology',
  },
  {
    icon: CloudSun,
    title: 'Extreme Weather Tested',
  },
  {
    icon: Award,
    title: 'Tested for Strength & Durability',
  },
  {
    icon: Bug,
    title: '100% Termite & Bug Proof',
  },
];

export function ProductFeatures() {
  return (
    <section className="py-6 sm:py-12 bg-zinc-50 dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <h3 className="text-center text-sm sm:text-2xl font-bold text-zinc-900 dark:text-white mb-4 sm:mb-8 tracking-wide uppercase sm:normal-case">
          Key Product Features
        </h3>

        {/* Grid: 2 cols (mobile), 3 cols (tablet/desktop) for a balanced 2x3 layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-6 justify-center">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center text-center p-2.5 sm:p-4 bg-white dark:bg-zinc-950 rounded-xl sm:rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:shadow-md transition-all duration-300 group"
              >
                {/* Scaled Down Red Icon Badge */}
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border sm:border-2 border-[#b31919] dark:border-red-500 flex items-center justify-center mb-1.5 sm:mb-3 group-hover:scale-105 transition-transform shrink-0 bg-red-50/40 dark:bg-red-950/20">
                  <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-[#b31919] dark:text-red-500" />
                </div>

                <p className="text-[11px] sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 leading-tight sm:leading-snug line-clamp-2 sm:line-clamp-none">
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ProductFeatures;