// 1. Exporting categories array explicitly as a named export
export const categories = [
  { id: 1, name: "AMEZ DOOR", slug: "amez", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=200" },
  { id: 2, name: "ICON GROOVING", slug: "icon-grooving", image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=200" },
  { id: 3, name: "DUSTY DOOR", slug: "dusty", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200" },
  { id: 4, name: "SIGNATURE", slug: "signature", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=200" }
];

// 2. Exporting products array explicitly as a named export
export const products = [
  { 
    id: "sm-101", 
    slug: "amezdoor-sm101", 
    name: "SM 101 - AMEZ DOOR", 
    category: "AMEZ DOOR",
    categorySlug: "amez", 
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=500",
    description: "This premium architectural door features high-grade natural wood finishes and dynamic inlay work designed for luxury interiors.",
    features: ["Solid Core Construction", "Moisture Resistant", "Termite Proof"]
  },
  { 
    id: "sm-102", 
    slug: "amezdoor-sm102", 
    name: "SM 102 - AMEZ DOOR", 
    category: "AMEZ DOOR",
    categorySlug: "amez", 
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=500",
    description: "Modern curved groove architectural door with dark walnut highlights and superior sound insulation.",
    features: ["Acoustic Soundproofing", "Natural Wood Veneer", "Scratch Resistant Finish"]
  },
  { 
    id: "sm-103", 
    slug: "amezdoor-sm103", 
    name: "SM 103 - AMEZ DOOR", 
    category: "AMEZ DOOR",
    categorySlug: "amez", 
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=500",
    description: "Sleek geometric line entry door ideal for master suites and executive spaces.",
    features: ["Heavy Duty Frame", "Precision CNC Cut", "10-Year Warranty"]
  },
  { 
    id: "icon-201", 
    slug: "ic-201-grooving-line", 
    name: "IC 201 - GROOVING LINE", 
    category: "ICON GROOVING",
    categorySlug: "icon-grooving", 
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=500",
    description: "Contemporary vertical groove door designed for sleek commercial and residential spaces.",
    features: ["Minimalist Inlay Design", "UV Topcoat Protection", "Eco-Friendly Material"]
  },
  { 
    id: "dusty-301", 
    slug: "ds-301-luxury-finish", 
    name: "DS 301 - LUXURY FINISH", 
    category: "DUSTY DOOR",
    categorySlug: "dusty", 
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=500",
    description: "Elegant textured finish designed for luxury living rooms and grand hotel suites.",
    features: ["Textured Matte Finish", "Fire-Rated Safety Core", "Custom Hardware Ready"]
  },
];