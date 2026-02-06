
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CompanyDetail from './pages/CompanyDetail';
import AddReview from './pages/AddReview';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/company/:id" element={<CompanyDetail />} />
          <Route path="/company/:id/review" element={<AddReview />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
