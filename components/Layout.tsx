
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => (
  <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
    <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold tracking-tight text-indigo-600">
        HonestWork
      </Link>
      <div className="flex gap-6 items-center">
        <Link to="/" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Search</Link>
        <Link to="/" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Browse</Link>
      </div>
    </div>
  </nav>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="py-12 border-t border-gray-100 mt-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-400">© 2024 HonestWork. Radical Simplicity in Employer Reviews.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
