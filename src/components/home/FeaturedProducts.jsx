import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import products from "../../data/products";

export default function FeaturedProducts() {
  return (
    <section className="py-28 bg-[#F8F7F4]">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="uppercase tracking-[0.35em] text-red-700 font-semibold">
            Featured Products
          </span>

          <h2 className="mt-4 text-5xl font-black">
            Best Selling Doors
          </h2>

          <p className="mt-6 text-gray-600 max-w-2xl mx-auto leading-8">
            Discover our most popular premium doors designed for modern
            architecture and luxury living.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-500"
            >

              <div className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-80 w-full object-cover transition duration-700 group-hover:scale-110"
                />
              </div>

              <div className="p-6">

                <span className="text-sm uppercase tracking-widest text-red-700">
                  {product.category}
                </span>

                <h3 className="mt-3 text-2xl font-bold">
                  {product.name}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  {product.description}
                </p>

                <button className="mt-6 flex items-center gap-2 font-semibold text-red-700 hover:gap-3 transition-all">
                  View Details
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