import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t bg-white font-['Manrope']">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-gray-600">
        <div className="grid gap-6 md:grid-cols-4">
          <div>
            <div className="font-semibold text-gray-900">DeepFoundry Labs</div>
            <p className="mt-2">Open & reproducible AI for Bangla and low-resource languages</p>
          </div>
          
          <div>
            <div className="font-semibold text-gray-900">Links</div>
            <ul className="mt-2 space-y-1">
              <li><a href="#" className="hover:text-gray-900 transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Hugging Face</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <div className="font-semibold text-gray-900">Community</div>
            <ul className="mt-2 space-y-1">
              <li><a href="#" className="hover:text-gray-900 transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Discussions</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Twitter</a></li>
            </ul>
          </div>
          
          <div>
            <div className="font-semibold text-gray-900">Legal</div>
            <ul className="mt-2 space-y-1">
              <li><a href="#" className="hover:text-gray-900 transition-colors">Code of Conduct</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">License</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t">
          © {new Date().getFullYear()} DeepFoundry Labs — All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;