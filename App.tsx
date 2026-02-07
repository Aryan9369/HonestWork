
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CompanyDetail from './pages/CompanyDetail';
import CollegeDetail from './pages/CollegeDetail';
import SchoolDetail from './pages/SchoolDetail';
import GovDetail from './pages/GovDetail';
import AddReview from './pages/AddReview';
import AddCompany from './pages/AddCompany';
import AddInterview from './pages/AddInterview';
import AddSalary from './pages/AddSalary';
import AddMentor from './pages/AddMentor';
import Verification from './pages/Verification';
import PaymentGateway from './pages/PaymentGateway';
import ChatRoom from './pages/ChatRoom';
import AdminDashboard from './pages/AdminDashboard';

const NavigationHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const perfEntries = performance.getEntriesByType("navigation");
    const isModernReload = perfEntries.length > 0 && (perfEntries[0] as PerformanceNavigationTiming).type === 'reload';
    const isLegacyReload = window.performance && window.performance.navigation && window.performance.navigation.type === 1;

    if (isModernReload || isLegacyReload) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <NavigationHandler />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-new" element={<AddCompany />} />
          <Route path="/verification" element={<Verification />} />
          
          <Route path="/admin" element={<AdminDashboard />} />
          
          <Route path="/company/:id" element={<CompanyDetail />} />
          <Route path="/college/:id" element={<CollegeDetail />} />
          <Route path="/school/:id" element={<SchoolDetail />} />
          <Route path="/gov/:id" element={<GovDetail />} />

          {/* Generic Add Routes based on ID */}
          <Route path="/company/:id/review" element={<AddReview />} />
          <Route path="/company/:id/interview" element={<AddInterview />} />
          <Route path="/company/:id/salary" element={<AddSalary />} />
          
          <Route path="/add-mentor/:entityId" element={<AddMentor />} />
          
          <Route path="/payment/:sessionId" element={<PaymentGateway />} />
          <Route path="/chat/:sessionId" element={<ChatRoom />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
