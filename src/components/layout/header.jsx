import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/logo.svg'; // Import the image

const Header = ({ currentTab, onTabChange }) => {
  const navItems = [
    'Home',
    'Projects',
    'People',
    'Publications',
    'Models',
    'Datasets',
    'Blog',
    'FAQ',
    'Join',
    'Contact'
  ];
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive menu
  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 1060);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  return (
    <header className="bg-[#0a1025] sticky top-0 z-50 font-['Manrope'] transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src={logo} // Use the imported variable
            alt="DeepFoundry Labs Logo"
            className="h-14 w-auto" // Adjust height as needed
          />
        </div>
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex items-center gap-2 text-sm">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => onTabChange(item)}
                className={`rounded-md px-3 py-1 transition-colors ${
                  currentTab === item
                    ? 'bg-white text-[#0a1025]'
                    : 'hover:bg-[#1a2340] text-gray-300'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        )}
        
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            className="p-2 rounded-md hover:bg-[#1a2340] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>
        )}
      </div>
      
      {/* Mobile Dropdown Menu */}
      {isMobile && isMenuOpen && (
        <div className="bg-[#0a1025] px-6 py-4 transition-colors">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  onTabChange(item);
                  setIsMenuOpen(false);
                }}
                className={`text-left rounded-md px-3 py-2 transition-colors ${
                  currentTab === item
                    ? 'bg-white text-[#0a1025]'
                    : 'hover:bg-[#1a2340] text-gray-300'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;