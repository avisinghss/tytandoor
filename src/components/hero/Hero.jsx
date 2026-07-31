import HeroSlider from "./HeroSlider";
import ScrollIndicator from "./ScrollIndicator";

export default function Hero() {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden md:h-screen">
      <HeroSlider />
      <ScrollIndicator />
    </section>
  );
}
