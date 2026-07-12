import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import AdminPanel from "../pages/AdminPanel";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admintytandoor" element={<AdminPanel />} />
    </Routes>
  );
}