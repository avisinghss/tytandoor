import Hero from "../components/hero/Hero";
import WhyChooseUs from "../components/home/WhyChooseUs";
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import GallerySection from "../components/home/GallerySection";
import Testimonials from "../components/home/Testimonials";
import CTASection from "../components/home/CTASection";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <CategoriesSection />
      <FeaturedProducts />
      {/* <GallerySection /> */}
      <Testimonials />
      <CTASection />
      <Footer />
    </>
  );
}