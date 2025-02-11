import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import AcademicAffairs from './pages/AcademicAffairs';

export default function App() {
  return (
    <Router>
        <div className="min-hs-screen w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/academic-affairs" element={<AcademicAffairs />} />
          </Routes>
        </div>
    </Router>
  );
}