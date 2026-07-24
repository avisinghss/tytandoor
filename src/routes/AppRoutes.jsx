import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import AdminPanel from "../pages/AdminPanel";
import About from "../pages/About";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admintytandoor" element={<AdminPanel />} />
      <Route path="/about" element={<About />} />
      <Route path="/products" element={<Products />} />
      {/* Dynamic single product page */}
      <Route path="/products/:slug" element={<ProductDetail />} />
    </Routes>
  );
}