import { useState, useEffect } from "react"; // Added React hooks import here
import Hero from "../components/hero/Hero";
import WhyChooseUs from "../components/home/WhyChooseUs";
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import StickyActions from "./../components/common/StickyActions";
// import GallerySection from "../components/home/GallerySection"; will update in the future
import Testimonials from "../components/home/Testimonials";
import CTASection from "../components/home/CTASection";
import Footer from "../components/layout/Footer";
import EnquiryModal from "../components/common/EnquiryModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-trigger popup after 2.5 seconds on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Hero />
      <FeaturedProducts />
      <CategoriesSection />
      {/* <GallerySection /> will update in the future */}
      {/* Floating Interactive Controls */}
      <StickyActions />
      {/* Global Enquiry Popup Modal */}
      <EnquiryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      <Testimonials />
      <WhyChooseUs />
      <CTASection />
      <Footer />
    </>
  );
}