// src/App.jsx

import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/layout/Header";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <Router>
      <div
        className="min-h-screen bg-[#F8F7F4] text-gray-900 antialiased"
        style={{
          backgroundImage: `
            radial-gradient(circle at top left, rgba(255,255,255,0.7), transparent 45%),
            radial-gradient(circle at bottom right, rgba(230,230,230,0.35), transparent 40%)
          `,
        }}
      >
        <Header />

        {/* Header height = 80px */}
        <main className="pt-20">
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;