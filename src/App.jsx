// src/App.jsx

import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import AppRoutes from "./routes/AppRoutes";

// Helper component inside App to check current path
function MainContent() {
  const location = useLocation();
  
  // Check if current route is an Admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Show Header ONLY if NOT on admin routes */}
      {!isAdminRoute && <Header />}

      {/* Remove pt-20 padding when on Admin panel */}
      <main className={isAdminRoute ? "" : "pt-20"}>
        <AppRoutes />
      </main>
    </>
  );
}

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
        <MainContent />
      </div>
    </Router>
  );
}

export default App;