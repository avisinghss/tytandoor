import { motion } from "framer-motion";
import gallery from "../../data/gallery";

export default function GallerySection() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="uppercase tracking-[0.35em] text-red-700 font-semibold">
            Our Projects
          </span>

          <h2 className="mt-4 text-5xl font-black">
            Inspiration Gallery
          </h2>

          <p className="mt-6 text-gray-600 max-w-2xl mx-auto leading-8">
            Explore some of our premium installations across residential,
            commercial and luxury projects.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group relative overflow-hidden rounded-3xl"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-80 w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-1 text-gray-200">
                  {item.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}