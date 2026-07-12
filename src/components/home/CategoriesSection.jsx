import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Flush Doors",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Laminate Doors",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Veneer Doors",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Fire Rated Doors",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "WPC Doors",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Designer Doors",
    image:
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?q=80&w=800&auto=format&fit=crop",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <span className="uppercase tracking-[4px] text-red-700 font-semibold">
            Our Collection
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mt-3">
            Explore Premium Door Categories
          </h2>

          <p className="text-gray-600 mt-5 max-w-2xl mx-auto">
            Discover beautifully crafted doors designed for every residential
            and commercial space.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((item) => (
            <div
              key={item.title}
              className="group relative h-[420px] rounded-3xl overflow-hidden shadow-xl cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="text-3xl font-bold">
                  {item.title}
                </h3>

                <button className="mt-5 flex items-center gap-2 text-sm uppercase tracking-wider">
                  Explore
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}