import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden py-28">
      {/* Background */}
      <div className="absolute inset-0 bg-[#111111]" />

      <div className="absolute inset-0 bg-gradient-to-r from-red-900/40 via-transparent to-black/50" />

      <div className="relative mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >

          <span className="uppercase tracking-[0.35em] text-red-500 font-semibold">
            Ready To Build?
          </span>

          <h2 className="mt-6 text-3xl sm:text-5xl md:text-6xl font-black text-white">
            Let's Create
            <br />
            Your Perfect Entrance
          </h2>

          <p className="mt-8 max-w-2xl mx-auto text-lg leading-8 text-gray-300">
            Whether you're designing a luxury residence or a commercial
            project, our experts are here to help you choose the perfect door.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-5">

            <button onClick={() => navigate('/products')} className="flex items-center gap-3 rounded-full bg-red-700 px-6 py-3 sm:px-8 sm:py-4 font-semibold text-white transition hover:-translate-y-1 hover:bg-red-800">

              Explore Collection

              <ArrowRight size={20} />

            </button>

            <a href="tel:+918318886379" className="flex items-center gap-3 rounded-full border border-white/40 px-6 py-3 sm:px-8 sm:py-4 font-semibold text-white transition hover:bg-white hover:text-black">

              <Phone size={18} />

              Call Now

            </a>

          </div>

        </motion.div>

      </div>
    </section>
  );
}
