import HeroSlider from "./HeroSlider";
import ScrollIndicator from "./ScrollIndicator";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <HeroSlider />
      <ScrollIndicator />
    </section>
  );
}