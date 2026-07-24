import React from 'react';
import CategoriesSection from "../components/home/CategoriesSection";
import StickyActions from "../components/common/StickyActions";
import Footer from "../components/layout/Footer";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 font-sans transition-colors duration-500">
      <main>
        <CategoriesSection />
      </main>
      
      {/* Sticky Quick Contact / Actions */}
      <StickyActions /> 

      {/* Global Footer */}
      <Footer />
    </div>
  );
}