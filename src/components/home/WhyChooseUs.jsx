import { motion } from "framer-motion";
import {
  ShieldCheck,
  Award,
  Hammer,
  Truck,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    description:
      "Manufactured using high-grade materials for exceptional durability and long-lasting performance.",
  },
  {
    icon: Award,
    title: "Luxury Finish",
    description:
      "Elegant designs and premium finishes that elevate every space with timeless appeal.",
  },
  {
    icon: Hammer,
    title: "Expert Craftsmanship",
    description:
      "Precision engineering backed by skilled workmanship and modern manufacturing.",
  },
  {
    icon: Truck,
    title: "Pan India Delivery",
    description:
      "Reliable supply and timely delivery for residential, commercial, and large-scale projects.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#F8F7F4] py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
            Why Tytan Door
          </span>

          <h2 className="mt-4 text-4xl font-black text-gray-900 md:text-5xl">
            Crafted For Modern Living
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Combining innovation, strength and elegant design to create doors
            that leave a lasting impression.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * .1 }}
                className="group rounded-3xl bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-700 text-white transition-all duration-300 group-hover:scale-110">
                  <Icon size={30} />
                </div>

                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="leading-7 text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}