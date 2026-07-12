import { motion } from "framer-motion";
import { Star } from "lucide-react";
import testimonials from "../../data/testimonials";

export default function Testimonials() {
  return (
    <section className="bg-[#F8F7F4] py-28">
      <div className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="uppercase tracking-[0.35em] text-red-700 font-semibold">
            Testimonials
          </span>

          <h2 className="mt-4 text-5xl font-black">
            What Our Clients Say
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-600">
            Trusted by homeowners, architects, builders and interior designers
            across India.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-3xl bg-white p-8 shadow-sm hover:shadow-xl transition"
            >
              <div className="mb-6 flex">
                {[...Array(item.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="leading-8 text-gray-600">
                "{item.review}"
              </p>

              <div className="mt-8 flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-full object-cover"
                />

                <div>
                  <h4 className="font-bold text-lg">
                    {item.name}
                  </h4>

                  <p className="text-gray-500">
                    {item.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}