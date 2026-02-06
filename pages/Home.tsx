
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_COMPANIES } from '../constants';

const Home: React.FC = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredCompanies = MOCK_COMPANIES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          Honest workplace reviews.
        </h1>
        <p className="text-xl text-gray-500 font-light">
          Real insights from verified employees. No fluff, just the truth.
        </p>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <svg className="h-6 w-6 text-gray-400 group-focus-within:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-14 pr-6 py-6 border border-gray-200 rounded-3xl text-lg focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-200 transition-all shadow-sm"
          placeholder="Search for a company (e.g. Stripe, Google...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        {search && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-10">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map(company => (
                <button
                  key={company.id}
                  onClick={() => navigate(`/company/${company.id}`)}
                  className="w-full text-left px-6 py-4 hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <img src={company.logo} alt={company.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <div className="font-semibold">{company.name}</div>
                      <div className="text-xs text-gray-400">{company.industry} • {company.domain}</div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">No companies found</div>
            )}
          </div>
        )}
      </div>

      <div className="mt-20">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-6 text-center">Popular on HonestWork</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MOCK_COMPANIES.slice(0, 4).map(company => (
            <button
              key={company.id}
              onClick={() => navigate(`/company/${company.id}`)}
              className="p-6 border border-gray-100 rounded-2xl hover:border-indigo-100 hover:bg-indigo-50/10 transition-all text-center"
            >
              <img src={company.logo} alt={company.name} className="w-12 h-12 rounded-xl mx-auto mb-3 object-cover shadow-sm" />
              <div className="font-bold text-gray-700">{company.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
