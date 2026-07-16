import Hero from "../components/hero/Hero";
import WhyChooseUs from "../components/home/WhyChooseUs";
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
// import GallerySection from "../components/home/GallerySection"; will update in the future
import Testimonials from "../components/home/Testimonials";
import CTASection from "../components/home/CTASection";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <CategoriesSection />
      {/* <GallerySection /> will update in the future */}
      <Testimonials />
      <WhyChooseUs />
      <CTASection />
      <Footer />
    </>
  );
}