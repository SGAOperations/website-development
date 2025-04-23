import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
//import { isAuthenticated } from './services/authService';

// Pages
import Home from './pages/Home';
import WhatIsSGA from './pages/about/WhatIsSGA';
import Structure from './pages/about/Structure';
import ExBranchTemp from './pages/executive-branch/ExBranchTemp';
import OfficeOfThePresident from './pages/executive-branch/OfficeOfThePresident';
import AcademicAffairs from './pages/executive-branch/AcademicAffairs';
import CampusAffairs from './pages/executive-branch/CampusAffairs';
import DiversityEquityInclusion from './pages/executive-branch/DiversityEquityInclusion';
import ExternalAffairs from './pages/executive-branch/ExternalAffairs';
import StudentInvolvement from './pages/executive-branch/StudentInvolvement';
import StudentSuccess from './pages/executive-branch/StudentSuccess';
import OperationalAffairs from './pages/executive-branch/OperationalAffairs';
import EditMode from './pages/EditMode.jsx';
import SignIn from './pages/SignIn.jsx';
import Template from './pages/Template.jsx';

export default function App() {
  return (
    <Router>
      <div className="min-hs-screen w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />

          <Route path="/about" element={<WhatIsSGA />} />
          <Route path="/structure" element={<Structure />} />

          <Route path="/office-of-the-president" element={<OfficeOfThePresident />} />
          <Route path="/academic-affairs" element={<AcademicAffairs />} />
          <Route path="/campus-affairs" element={<CampusAffairs />} />
          <Route path="/diversity-equity-inclusion" element={<DiversityEquityInclusion />} />
          <Route path="/external-affairs" element={<ExternalAffairs />} />
          <Route path="/student-involvement" element={<StudentInvolvement />} />
          <Route path="/student-success" element={<StudentSuccess />} />
          <Route path="/operational-affairs" element={<OperationalAffairs />} />

            <Route path="/edit-mode" element={<EditMode />} />
            <Route path="/sign-in" element={<SignIn />} />

          <Route path="/ex-branch-temp" element={<ExBranchTemp />} />
          <Route path="/template" element={<Template />} />
        </Routes>
      </div>
    </Router>
  );
}