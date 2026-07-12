import { ArrowRight } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Premium Flush Door",
    code: "TD-101",
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800",
  },
  {
    id: 2,
    name: "Designer Veneer Door",
    code: "TD-102",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
  },
  {
    id: 3,
    name: "Luxury Laminate Door",
    code: "TD-103",
    image: "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800",
  },
  {
    id: 4,
    name: "Fire Rated Door",
    code: "TD-104",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="uppercase tracking-[4px] text-red-700 font-semibold">
              Featured Collection
            </span>

            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              Our Best Selling Doors
            </h2>
          </div>

          <button className="hidden md:flex items-center gap-2 text-red-700 font-semibold">
            View All
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-8">

          {products.map((product) => (

            <div
              key={product.id}
              className="group rounded-3xl overflow-hidden shadow-lg bg-[#fafafa] hover:shadow-2xl transition"
            >

              <div className="overflow-hidden h-72">

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

              </div>

              <div className="p-6">

                <p className="text-red-700 text-sm font-semibold">
                  {product.code}
                </p>

                <h3 className="text-xl font-bold mt-2">
                  {product.name}
                </h3>

                <button className="mt-6 w-full rounded-full bg-red-700 py-3 text-white hover:bg-black transition">
                  View Details
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}