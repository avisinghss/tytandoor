import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import Contact from "../pages/Contact";
import Terms from "../pages/Terms";
import Help from "../pages/Help";
import Admin from "../pages/Admin";

export default function AppRoutes() {
  const isAdminHost = window.location.hostname === "admin.tytandoor.com";

  if (isAdminHost) {
    return (
      <Routes>
        {/* Using /* allows nested routes inside <Admin /> to match properly */}
        <Route path="/*" element={<Admin />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:slug" element={<ProductDetail />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/help" element={<Help />} /> 
    </Routes>
  );
}
