import React from 'react';

const CTABanner = () => {
  return (
    <div className="bg-gray-50 border-b font-['Manrope']">
      <div className="mx-auto max-w-6xl px-6 py-3">
        <p className="text-sm text-gray-700 text-center md:text-left">
          We are preparing our first public release. Want early access to datasets/models? 
          <a href="#join" className="ml-1 font-medium text-black hover:underline">
            Join the newsletter →
          </a>
        </p>
      </div>
    </div>
  );
};

export default CTABanner;