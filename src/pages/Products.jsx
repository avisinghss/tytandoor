import React from 'react';
import CategoriesSection from "../components/home/CategoriesSection";
import StickyActions from "../components/common/StickyActions";
import Footer from "../components/layout/Footer";


export default function product(){
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <CategoriesSection />
      <StickyActions /> 
      <Footer />
    </div>
  )
}