
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Company, College, School, GovOrg } from '../types';
import { storageService } from '../services/storageService';
import { searchCompaniesOnline } from '../services/geminiService';

const Home: React.FC = () => {
  const [search, setSearch] = useState('');
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [allSchools, setAllSchools] = useState<School[]>([]);
  const [allGovOrgs, setAllGovOrgs] = useState<GovOrg[]>([]);
  
  const [webResults, setWebResults] = useState<Company[]>([]);
  const [isWebSearching, setIsWebSearching] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = () => {
      setAllCompanies(storageService.getAllCompanies());
      setAllColleges(storageService.getAllColleges());
      setAllSchools(storageService.getAllSchools());
      setAllGovOrgs(storageService.getAllGovOrgs());
    };

    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const filteredCompanies = allCompanies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const filteredColleges = allColleges.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const filteredSchools = allSchools.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const filteredGovOrgs = allGovOrgs.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    if (search.length < 2) {
      setWebResults([]);
      setIsWebSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsWebSearching(true);
      try {
        const results = await searchCompaniesOnline(search);
        const newResults = results.filter(r => 
          !allCompanies.some(existing => existing.domain.toLowerCase() === r.domain.toLowerCase())
        );
        setWebResults(newResults);
      } catch (e) {
        console.error("Web search error", e);
      } finally {
        setIsWebSearching(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [search, allCompanies]);

  const handleAddFromWeb = (company: Company) => {
    storageService.addCompany(company);
    navigate(`/company/${company.id}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-mesh">
      {/* Animated Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-6xl font-extrabold tracking-tight mb-6 text-gray-900 drop-shadow-sm">
            Honest reviews.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">No clutter.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real experiences from employees and students. Zero noise. 100% Verified.
          </p>
        </div>

        {/* Search Section */}
        <div className="relative group z-20 mb-20 max-w-3xl mx-auto">
          <div className="absolute inset-0 bg-indigo-200 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <input
            type="text"
            className="glass-input block w-full pl-8 pr-6 py-6 rounded-3xl text-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 text-gray-800 placeholder-gray-400 transition-all"
            placeholder="Search companies, colleges, schools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          
          {(search.length > 0) && (
            <div className="absolute top-full left-0 w-full mt-4 glass-panel rounded-3xl overflow-hidden max-h-96 overflow-y-auto shadow-2xl">
              
              {filteredCompanies.length > 0 && (
                <div className="py-2">
                  <div className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider bg-white/50">Companies</div>
                  {filteredCompanies.map(c => (
                    <button key={c.id} onClick={() => navigate(`/company/${c.id}`)} className="w-full text-left px-6 py-4 hover:bg-white/60 flex items-center gap-4 transition-colors">
                      <img src={c.logo} alt={c.name} className="w-10 h-10 rounded-xl object-cover shadow-sm" />
                      <span className="font-bold text-gray-800">{c.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {filteredColleges.length > 0 && (
                <div className="py-2 border-t border-gray-100">
                   <div className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider bg-white/50">Colleges</div>
                   {filteredColleges.map(c => (
                     <button key={c.id} onClick={() => navigate(`/college/${c.id}`)} className="w-full text-left px-6 py-4 hover:bg-white/60 flex items-center gap-4 transition-colors">
                        <img src={c.logo} alt={c.name} className="w-10 h-10 rounded-xl object-cover shadow-sm" />
                        <span className="font-bold text-gray-800">{c.name}</span>
                     </button>
                   ))}
                 </div>
              )}

              {filteredSchools.length > 0 && (
                <div className="py-2 border-t border-gray-100">
                   <div className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider bg-white/50">Schools</div>
                   {filteredSchools.map(s => (
                     <button key={s.id} onClick={() => navigate(`/school/${s.id}`)} className="w-full text-left px-6 py-4 hover:bg-white/60 flex items-center gap-4 transition-colors">
                        <img src={s.logo} alt={s.name} className="w-10 h-10 rounded-xl object-cover shadow-sm" />
                        <span className="font-bold text-gray-800">{s.name}</span>
                     </button>
                   ))}
                 </div>
              )}

              {filteredGovOrgs.length > 0 && (
                <div className="py-2 border-t border-gray-100">
                   <div className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider bg-white/50">Government</div>
                   {filteredGovOrgs.map(g => (
                     <button key={g.id} onClick={() => navigate(`/gov/${g.id}`)} className="w-full text-left px-6 py-4 hover:bg-white/60 flex items-center gap-4 transition-colors">
                        <img src={g.logo} alt={g.name} className="w-10 h-10 rounded-xl object-cover shadow-sm" />
                        <span className="font-bold text-gray-800">{g.name}</span>
                     </button>
                   ))}
                 </div>
              )}

              {(webResults.length > 0 || isWebSearching) && (
                <div className="py-2 bg-indigo-50/30 border-t border-gray-100">
                  <div className="px-6 py-3 flex justify-between items-center bg-white/30">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Web Search Results</span>
                    {isWebSearching && <span className="text-xs font-medium text-indigo-500 animate-pulse">Searching AI...</span>}
                  </div>
                  {webResults.map(c => (
                    <div key={c.id} className="w-full text-left px-6 py-4 hover:bg-white/60 flex items-center justify-between transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-800">{c.name}</span>
                        <span className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded">{c.industry}</span>
                      </div>
                      <button onClick={() => handleAddFromWeb(c)} className="text-xs font-bold text-white bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-700 shadow-md transition-all">Add & Review</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Grids Container */}
        <div className="space-y-16">
          
          {/* Companies Grid */}
          <div>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
                  Companies
                </h2>
                <button onClick={() => navigate('/add-new')} className="text-sm font-bold text-indigo-600 bg-white/80 px-4 py-2 rounded-xl shadow-sm hover:bg-white hover:shadow-md transition-all">Add New +</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredCompanies.slice(0, 4).map(c => (
                <button key={c.id} onClick={() => navigate(`/company/${c.id}`)} className="glass-panel p-6 rounded-3xl hover:-translate-y-1 transition-transform duration-300 text-center group">
                  <img src={c.logo} alt={c.name} className="w-20 h-20 rounded-2xl mx-auto mb-5 object-cover shadow-lg group-hover:shadow-xl transition-shadow" />
                  <div className="font-bold text-gray-800 truncate text-lg">{c.name}</div>
                  <div className="text-xs text-gray-500 mt-1 truncate">{c.industry}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Colleges Grid */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8 flex items-center gap-2">
              <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
              Colleges
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredColleges.slice(0, 4).map(c => (
                <button key={c.id} onClick={() => navigate(`/college/${c.id}`)} className="glass-panel p-6 rounded-3xl hover:-translate-y-1 transition-transform duration-300 text-center group">
                  <img src={c.logo} alt={c.name} className="w-20 h-20 rounded-2xl mx-auto mb-5 object-cover shadow-lg group-hover:shadow-xl transition-shadow" />
                  <div className="font-bold text-gray-800 truncate text-lg">{c.name}</div>
                  <div className="text-xs text-gray-500 mt-1 truncate">{c.city}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Schools Grid */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8 flex items-center gap-2">
              <span className="w-2 h-8 bg-pink-600 rounded-full"></span>
              Schools (K-12)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredSchools.slice(0, 4).map(s => (
                <button key={s.id} onClick={() => navigate(`/school/${s.id}`)} className="glass-panel p-6 rounded-3xl hover:-translate-y-1 transition-transform duration-300 text-center group">
                  <img src={s.logo} alt={s.name} className="w-20 h-20 rounded-2xl mx-auto mb-5 object-cover shadow-lg group-hover:shadow-xl transition-shadow" />
                  <div className="font-bold text-gray-800 truncate text-lg">{s.name}</div>
                  <div className="text-xs text-gray-500 mt-1 truncate">{s.board}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Gov Orgs Grid */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8 flex items-center gap-2">
              <span className="w-2 h-8 bg-orange-600 rounded-full"></span>
              Government & PSUs
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredGovOrgs.slice(0, 4).map(g => (
                <button key={g.id} onClick={() => navigate(`/gov/${g.id}`)} className="glass-panel p-6 rounded-3xl hover:-translate-y-1 transition-transform duration-300 text-center group">
                  <img src={g.logo} alt={g.name} className="w-20 h-20 rounded-2xl mx-auto mb-5 object-cover shadow-lg group-hover:shadow-xl transition-shadow" />
                  <div className="font-bold text-gray-800 truncate text-lg">{g.name}</div>
                  <div className="text-xs text-gray-500 mt-1 truncate">{g.type}</div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
