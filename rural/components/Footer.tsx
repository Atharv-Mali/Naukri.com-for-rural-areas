
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-green mt-auto">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-brand-brown">
        <p>&copy; {new Date().getFullYear()} Rural Roots Jobs. All rights reserved.</p>
        <p className="text-sm mt-1">Connecting communities, one job at a time.</p>
      </div>
    </footer>
  );
};

export default Footer;
