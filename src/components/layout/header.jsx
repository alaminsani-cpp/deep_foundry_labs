import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';

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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // load dark mode preference from localStorage
    return localStorage.getItem('theme') === 'dark';
  });

  // Update Tailwind's dark mode when the state changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

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
    <header className="border-b bg-white dark:bg-gray-900 sticky top-0 z-50 font-['Manrope'] transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="text-lg font-bold text-gray-900 dark:text-white">DeepFoundry Labs</div>
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex items-center gap-2 text-sm">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => onTabChange(item)}
                className={`rounded-md px-3 py-1 transition-colors ${
                  currentTab === item
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200'
                }`}
              >
                {item}
              </button>
            ))}
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="ml-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Moon className="h-5 w-5 text-yellow-400" />
              ) : (
                <Sun className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </nav>
        )}
        
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6 text-gray-800 dark:text-gray-200" /> : <Menu className="h-6 w-6 text-gray-800 dark:text-gray-200" />}
          </button>
        )}
      </div>
      
      {/* Mobile Dropdown Menu */}
      {isMobile && isMenuOpen && (
        <div className="border-t bg-white dark:bg-gray-900 px-6 py-4 transition-colors">
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
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200'
                }`}
              >
                {item}
              </button>
            ))}
            {/* Dark Mode Toggle (Mobile) */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="mt-2 flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-800 dark:text-gray-200"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Moon className="h-5 w-5 text-yellow-400" /> : <Sun className="h-5 w-5" />}
              <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
