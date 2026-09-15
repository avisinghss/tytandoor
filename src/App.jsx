// src/App.jsx

import React, { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import AppRoutes from "./routes/AppRoutes";
import { usePageTracker } from "./hooks/usePageTracker";

const SITE_URL = "https://tytandoor.com";
const pageMetadata = {
  "/": ["Tytan Door | Premium Doors Manufacturer in Ballia", "Premium wooden, membrane, flush and designer doors in Ballia, Uttar Pradesh."],
  "/about": ["About Tytan Door | Door Manufacturer in Ballia", "Learn about Tytan Door, a premium door manufacturer and supplier in Ballia."],
  "/products": ["Door Collection | Tytan Door", "Browse premium wooden, membrane, flush and designer doors from Tytan Door."],
  "/contact": ["Contact Tytan Door | Ballia", "Contact Tytan Door for premium doors and interior solutions in Ballia."],
  "/help": ["Help & Warranty | Tytan Door", "Get help, request a callback, or register your Tytan Door warranty."],
  "/terms": ["Terms & Conditions | Tytan Door", "Read Tytan Door's terms and conditions."],
};

function setMeta(selector, attribute, value) {
  const element = document.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

// Helper component inside App to check current path
function MainContent() {
  const location = useLocation();
  usePageTracker();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);
  
  // Check if current route is an Admin route
  const isAdminHost = window.location.hostname === "admin.tytandoor.com" || location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdminHost) {
      document.title = "Tytan Door Admin";
      setMeta('meta[name="robots"]', 'content', 'noindex, nofollow, noarchive');
      return;
    }

    const [title, description] = pageMetadata[location.pathname] || pageMetadata["/"];
    const canonical = `${SITE_URL}${location.pathname === "/" ? "/" : location.pathname}`;
    document.title = title;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', canonical);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);
  }, [isAdminHost, location.pathname]);

  // Migration cleanup: older releases registered the admin worker on the
  // customer site. Remove it so the public site can never remain installable.
  useEffect(() => {
    if (isAdminHost || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .catch((error) => console.error('Could not remove legacy public service worker:', error));
  }, [isAdminHost]);

  return (
    <>
      {/* Show Header ONLY if NOT on admin routes */}
      {!isAdminHost && <Header />}

      {/* Remove pt-20 padding when on Admin panel */}
      <main className={isAdminHost ? "" : "pt-20"}>
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
