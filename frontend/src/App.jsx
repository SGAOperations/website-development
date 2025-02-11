import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Pages
import Home from './pages/Home';

import AcademicAffairs from './pages/executive-branch/AcademicAffairs';
import CampusAffairs from './pages/executive-branch/CampusAffairs';
import StudentSuccess from './pages/executive-branch/StudentSuccess';
import DiversityEquityInclusion from './pages/executive-branch/DiversityEquityInclusion';

export default function App() {
  return (
    <Router>
        <div className="min-hs-screen w-full">
          <Routes>
            <Route path="/" element={<Home />} />
          
            <Route path="/academic-affairs" element={<AcademicAffairs />} />
            <Route path="/campus-affairs" element={<CampusAffairs />} />
            <Route path="/student-success" element={<StudentSuccess />} />
            <Route path="/diversity-equity-inclusion" element={<DiversityEquityInclusion />} />

          </Routes>
        </div>
    </Router>
  );
}