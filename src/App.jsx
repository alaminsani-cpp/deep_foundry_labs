import React, { useState } from 'react';
import { Header, Footer } from "./components/layout";
import { Home, Projects, People, Publications, Models, Datasets, Join, Contact, FAQ } from "./components/pages";
import { AuthProvider } from "./contexts/AuthContext.jsx";

function AppContent() {
  const [currentTab, setCurrentTab] = useState('Home');

  const renderPage = () => {
    switch (currentTab) {
      case 'Home':
        return <Home />;
      case 'Projects':
        return <Projects />;
      case 'People':
        return <People/>;
      case 'Publications':
        return <Publications/>;
      case 'Models':
        return <Models/>;
      case 'Datasets':
        return <Datasets/>;
      case 'Blog':
        return <div className="text-center py-20 font-['Manrope'] text-white">Blog Page - Coming Soon</div>;
      case 'FAQ':
        return <FAQ/>;
      case 'Join':
        return <Join/>;
      case 'Contact':
        return <Contact/>;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#02081a] to-[#0a1025] text-gray-100 flex flex-col font-['Manrope']">
      <Header currentTab={currentTab} onTabChange={setCurrentTab} />
      
      <main className="mx-auto max-w-6xl px-6 pt-4 pb-10 flex-grow w-full">
        {renderPage()}
      </main>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;