import React, { useState } from 'react';

import { Header, CTABanner, Footer } from "./components/layout";
import { Home, Projects, People, Publications, Models, Datasets, Join, Contact, FAQ } from "./components/pages";


function App() {
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
        return <div className="text-center py-20 font-['Manrope']">Blog Page - Coming Soon</div>;
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
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-['Manrope']">
      <Header currentTab={currentTab} onTabChange={setCurrentTab} />
      <CTABanner />
      
      <main className="mx-auto max-w-6xl px-6 pt-4 pb-10 flex-grow w-full">
        {renderPage()}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;