import React from 'react';

const CTABanner = () => {
  return (
    <div className="bg-gray-800/30 border-b border-gray-700 font-['Manrope']">
      <div className="mx-auto max-w-6xl px-6 py-3">
        <p className="text-sm text-gray-300 text-center md:text-left">
          We are preparing our first public release. Want early access to datasets/models? 
          <a href="#join" className="ml-1 font-medium text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">
            Join the newsletter →
          </a>
        </p>
      </div>
    </div>
  );
};

export default CTABanner;