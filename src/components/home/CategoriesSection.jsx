import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import categories from "../../data/categories";

export default function CategoriesSection() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="uppercase tracking-[0.35em] text-red-700 font-semibold">
            Our Collection
          </span>

          <h2 className="text-5xl font-black mt-4">
            Explore Door Categories
          </h2>

          <p className="mt-5 text-gray-600 max-w-2xl mx-auto leading-8">
            Browse our premium range of architectural doors designed
            for luxury homes and commercial spaces.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">

          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * .1 }}
              className="relative rounded-3xl overflow-hidden group cursor-pointer h-[420px]"
            >

              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute bottom-10 left-10">

                <h3 className="text-white text-3xl font-bold">
                  {category.name}
                </h3>

                <p className="text-gray-200 mt-3 max-w-sm">
                  {category.description}
                </p>

                <button className="mt-6 flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-red-700 hover:text-white transition">

                  Explore

                  <ArrowRight size={18} />

                </button>

              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}