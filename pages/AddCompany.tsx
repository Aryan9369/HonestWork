
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';

const AddEntity: React.FC = () => {
  const navigate = useNavigate();
  const [entityType, setEntityType] = useState<'company' | 'college' | 'school' | 'gov' | null>(null);
  
  const [companyData, setCompanyData] = useState({ name: '', domain: '', industry: '', description: '', logo: '' });
  const [collegeData, setCollegeData] = useState({ name: '', city: '', state: '', website: '', description: '', logo: '' });
  const [schoolData, setSchoolData] = useState({ name: '', city: '', state: '', board: '', website: '', description: '', logo: '' });
  const [govData, setGovData] = useState({ name: '', type: 'PSU', website: '', description: '', logo: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newCompany = { ...companyData, id: `custom-comp-${Math.random().toString(36).substr(2, 9)}`, logo: companyData.logo || `https://picsum.photos/seed/${companyData.name}/200` };
    storageService.addCompany(newCompany);
    setTimeout(() => { setIsSubmitting(false); navigate(`/company/${newCompany.id}`); }, 800);
  };

  const handleCollegeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const domain = collegeData.website.toLowerCase().replace(/https?:\/\/(www\.)?/, '').split('/')[0];
    const newCollege = { ...collegeData, id: `custom-coll-${Math.random().toString(36).substr(2, 9)}`, allowedEmailDomains: [domain], logo: collegeData.logo || `https://picsum.photos/seed/${collegeData.name}/200` };
    storageService.addCollege(newCollege);
    setTimeout(() => { setIsSubmitting(false); navigate(`/college/${newCollege.id}`); }, 800);
  };

  const handleSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const domain = schoolData.website.toLowerCase().replace(/https?:\/\/(www\.)?/, '').split('/')[0];
    const newSchool = { ...schoolData, id: `custom-school-${Math.random().toString(36).substr(2, 9)}`, allowedEmailDomains: [domain], logo: schoolData.logo || `https://picsum.photos/seed/${schoolData.name}/200` };
    storageService.addSchool(newSchool);
    setTimeout(() => { setIsSubmitting(false); navigate(`/school/${newSchool.id}`); }, 800);
  };

  const handleGovSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const domain = govData.website.toLowerCase().replace(/https?:\/\/(www\.)?/, '').split('/')[0];
    const newGov = { ...govData, id: `custom-gov-${Math.random().toString(36).substr(2, 9)}`, allowedEmailDomains: [domain], logo: govData.logo || `https://picsum.photos/seed/${govData.name}/200` } as any;
    storageService.addGovOrg(newGov);
    setTimeout(() => { setIsSubmitting(false); navigate(`/gov/${newGov.id}`); }, 800);
  };

  // --- VIEW: SELECTION ---
  if (!entityType) {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-indigo-600 mb-12 flex items-center gap-2"><span>←</span> Back</button>
            <h1 className="text-4xl font-extrabold text-center mb-16">Add New Entity</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['company', 'college', 'school', 'gov'].map((type) => (
                    <button key={type} onClick={() => setEntityType(type as any)} className="p-8 border-2 border-gray-100 rounded-3xl hover:border-indigo-600 transition-all bg-white text-center capitalize font-bold text-xl">
                        {type === 'gov' ? 'Gov / PSU' : type}
                    </button>
                ))}
            </div>
        </div>
    );
  }

  // --- GENERIC FORM WRAPPER ---
  const renderForm = (title: string, content: React.ReactNode, submit: (e:React.FormEvent)=>void) => (
      <div className="max-w-2xl mx-auto px-6 py-12">
          <button onClick={() => setEntityType(null)} className="text-sm text-gray-400 mb-8">← Back</button>
          <h1 className="text-4xl font-extrabold mb-10">{title}</h1>
          <form onSubmit={submit} className="space-y-6 animate-fade-in">{content}</form>
      </div>
  );

  if (entityType === 'company') {
      return renderForm('Add Company', <>
        <input required placeholder="Company Name" className="w-full p-4 border rounded-xl" value={companyData.name} onChange={e => setCompanyData({...companyData, name: e.target.value})} />
        <input required placeholder="Website (e.g. acme.com)" className="w-full p-4 border rounded-xl" value={companyData.domain} onChange={e => setCompanyData({...companyData, domain: e.target.value})} />
        <input required placeholder="Industry" className="w-full p-4 border rounded-xl" value={companyData.industry} onChange={e => setCompanyData({...companyData, industry: e.target.value})} />
        <textarea required placeholder="Description" className="w-full p-4 border rounded-xl" value={companyData.description} onChange={e => setCompanyData({...companyData, description: e.target.value})} />
        <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl">{isSubmitting ? 'Adding...' : 'Add Company'}</button>
      </>, handleCompanySubmit);
  }

  if (entityType === 'college') {
      return renderForm('Add College', <>
        <input required placeholder="College Name" className="w-full p-4 border rounded-xl" value={collegeData.name} onChange={e => setCollegeData({...collegeData, name: e.target.value})} />
        <div className="grid grid-cols-2 gap-4"><input required placeholder="City" className="w-full p-4 border rounded-xl" value={collegeData.city} onChange={e => setCollegeData({...collegeData, city: e.target.value})} /><input required placeholder="State" className="w-full p-4 border rounded-xl" value={collegeData.state} onChange={e => setCollegeData({...collegeData, state: e.target.value})} /></div>
        <input required placeholder="Website" className="w-full p-4 border rounded-xl" value={collegeData.website} onChange={e => setCollegeData({...collegeData, website: e.target.value})} />
        <textarea required placeholder="Description" className="w-full p-4 border rounded-xl" value={collegeData.description} onChange={e => setCollegeData({...collegeData, description: e.target.value})} />
        <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl">{isSubmitting ? 'Adding...' : 'Add College'}</button>
      </>, handleCollegeSubmit);
  }

  if (entityType === 'school') {
      return renderForm('Add School', <>
        <input required placeholder="School Name" className="w-full p-4 border rounded-xl" value={schoolData.name} onChange={e => setSchoolData({...schoolData, name: e.target.value})} />
        <input required placeholder="Board (CBSE, IB, etc.)" className="w-full p-4 border rounded-xl" value={schoolData.board} onChange={e => setSchoolData({...schoolData, board: e.target.value})} />
        <div className="grid grid-cols-2 gap-4"><input required placeholder="City" className="w-full p-4 border rounded-xl" value={schoolData.city} onChange={e => setSchoolData({...schoolData, city: e.target.value})} /><input required placeholder="State" className="w-full p-4 border rounded-xl" value={schoolData.state} onChange={e => setSchoolData({...schoolData, state: e.target.value})} /></div>
        <input required placeholder="Website" className="w-full p-4 border rounded-xl" value={schoolData.website} onChange={e => setSchoolData({...schoolData, website: e.target.value})} />
        <textarea required placeholder="Description" className="w-full p-4 border rounded-xl" value={schoolData.description} onChange={e => setSchoolData({...schoolData, description: e.target.value})} />
        <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl">{isSubmitting ? 'Adding...' : 'Add School'}</button>
      </>, handleSchoolSubmit);
  }

  if (entityType === 'gov') {
      return renderForm('Add Gov Org', <>
        <input required placeholder="Organization Name" className="w-full p-4 border rounded-xl" value={govData.name} onChange={e => setGovData({...govData, name: e.target.value})} />
        <select className="w-full p-4 border rounded-xl bg-white" value={govData.type} onChange={e => setGovData({...govData, type: e.target.value})}>
            <option value="PSU">PSU</option><option value="Ministry">Ministry</option><option value="Bank">Bank</option><option value="Defense">Defense</option>
        </select>
        <input required placeholder="Website" className="w-full p-4 border rounded-xl" value={govData.website} onChange={e => setGovData({...govData, website: e.target.value})} />
        <textarea required placeholder="Description" className="w-full p-4 border rounded-xl" value={govData.description} onChange={e => setGovData({...govData, description: e.target.value})} />
        <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl">{isSubmitting ? 'Adding...' : 'Add Gov Org'}</button>
      </>, handleGovSubmit);
  }

  return null;
};

export default AddEntity;
