import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header, Footer } from "./components/layout";
import { Home, Projects, People, Publications, Models, Datasets, Join, Contact, FAQ, NotFound } from "./components/pages";
import Admin from "./components/pages/admin.jsx";  // Fixed import
import { AuthProvider } from "./contexts/authcontext.jsx";  // Lowercase

function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#02081a] to-[#0a1025] text-gray-100 flex flex-col font-['Manrope']">
      <Header />
      <main className="mx-auto max-w-6xl px-6 pt-4 pb-10 flex-grow w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/people" element={<People />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/models" element={<Models />} />
          <Route path="/datasets" element={<Datasets />} />
          <Route path="/blog" element={<div className="text-center py-20 font-['Manrope'] text-white">Blog Page - Coming Soon</div>} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/join" element={<Join />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/*" element={<Admin />} />
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
