
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storageService';

const Navbar: React.FC = () => {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkSession = () => {
        const session = storageService.getUserSession();
        setIsVerified(session.isVerified);
    };
    checkSession();
    window.addEventListener('storage', checkSession);
    return () => window.removeEventListener('storage', checkSession);
  }, []);

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight text-indigo-600">
            HonestWork
        </Link>
        <div className="flex gap-6 items-center">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Search</Link>
            {!isVerified ? (
                <Link to="/verification" className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                    Get Verified
                </Link>
            ) : (
                <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    Verified
                </span>
            )}
            <Link to="/add-new" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Add New +</Link>
        </div>
        </div>
    </nav>
  );
};

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
          <div className="mt-4">
            <Link to="/admin" className="text-xs text-gray-300 hover:text-indigo-500 transition-colors">Admin Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
