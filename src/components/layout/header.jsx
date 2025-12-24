import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../public/assets/logo.svg'; // Import the image

const Header = () => {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'People', path: '/people' },
    { name: 'Publications', path: '/publications' },
    { name: 'Models', path: '/models' },
    { name: 'Datasets', path: '/datasets' },
    { name: 'Blog', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Join', path: '/join' },
    { name: 'Contact', path: '/contact' }
  ];
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Handle responsive menu
  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 1060);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="bg-[#0a1025] sticky top-0 z-50 font-['Manrope'] transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src={logo} // Use the imported variable
            alt="DeepFoundry Labs Logo"
            className="h-14 w-auto" // Adjust height as needed
          />
        </Link>
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex items-center gap-2 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`rounded-md px-3 py-1 transition-colors ${
                  location.pathname === item.path
                    ? 'bg-white text-[#0a1025]'
                    : 'hover:bg-[#1a2340] text-gray-300'
                }`}
              >
                {item.name}
              </Link>
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
              <Link
                key={item.name}
                to={item.path}
                className={`text-left rounded-md px-3 py-2 transition-colors ${
                  location.pathname === item.path
                    ? 'bg-white text-[#0a1025]'
                    : 'hover:bg-[#1a2340] text-gray-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;