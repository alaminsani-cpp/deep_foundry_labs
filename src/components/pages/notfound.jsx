import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="font-[Manrope] font-medium text-gray-100 bg-gradient-to-b from-[#02081a] to-[#0a1025] min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Error Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-900/30 border border-red-700 mb-6">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          
          {/* Error Code */}
          <h1 className="text-8xl md:text-9xl font-bold text-white mb-4">
            404
          </h1>
          
          {/* Error Title */}
          <h2 className="text-3xl md:text-4xl font-medium text-white mb-4">
            Page Not Found
          </h2>
          
          {/* Error Message */}
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            It might have been renamed, deleted, or perhaps you mistyped the URL.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-6 py-3 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-all group shadow-lg hover:shadow-xl"
            >
              <Home className="h-5 w-5" />
              Go to Homepage
              <ArrowLeft className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            <Link
              to="/projects"
              className="px-6 py-3 border border-gray-600 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 hover:text-white transition"
            >
              Browse Projects
            </Link>
          </div>
          
          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">
              Popular Pages You Might Be Looking For:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { name: 'Models', path: '/models', desc: 'AI Models' },
                { name: 'Publications', path: '/publications', desc: 'Research Papers' },
                { name: 'People', path: '/people', desc: 'Our Team' },
                { name: 'Datasets', path: '/datasets', desc: 'Open Datasets' },
                { name: 'Projects', path: '/projects', desc: 'Research Projects' },
                { name: 'Contact', path: '/contact', desc: 'Get in Touch' },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="p-4 bg-gray-800/30 border border-gray-700 rounded-xl hover:border-cyan-600/50 hover:bg-gray-800/50 transition-all group"
                >
                  <div className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                    {link.name}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {link.desc}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Search Suggestion */}
          <div className="mt-12 p-6 bg-gray-800/30 border border-gray-700 rounded-2xl max-w-2xl mx-auto">
            <h4 className="text-lg font-medium text-white mb-3">
              Can't find what you're looking for?
            </h4>
            <p className="text-gray-300 mb-4">
              Try using the search bar on any page, or contact us directly for assistance.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Contact Support →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;