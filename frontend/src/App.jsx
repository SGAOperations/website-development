import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Pages
import Home from './pages/Home';

import ExBranchTemp from './pages/executive-branch/ExBranchTemp';
import OfficeOfThePresident from './pages/executive-branch/OfficeOfThePresident';
import AcademicAffairs from './pages/executive-branch/AcademicAffairs';
import CampusAffairs from './pages/executive-branch/CampusAffairs';
import StudentSuccess from './pages/executive-branch/StudentSuccess';
import DiversityEquityInclusion from './pages/executive-branch/DiversityEquityInclusion';
import ExternalAffairs from './pages/executive-branch/ExternalAffairs';
import OperationalAffairs from './pages/executive-branch/OperationalAffairs';
import EditMode from './pages/EditMode.jsx';
import SignIn from './pages/SignIn.jsx';

export default function App() {
  return (
    <Router>
        <div className="min-hs-screen w-full">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/ex-branch-temp" element = {<ExBranchTemp />} />
            <Route path="/office-of-the-president" element={<OfficeOfThePresident />} />
            <Route path="/academic-affairs" element={<AcademicAffairs />} />
            <Route path="/campus-affairs" element={<CampusAffairs />} />
            <Route path="/student-success" element={<StudentSuccess />} />
            <Route path="/diversity-equity-inclusion" element={<DiversityEquityInclusion />} />
            <Route path="/external-affairs" element={<ExternalAffairs />} />
            <Route path="/operational-affairs" element={<OperationalAffairs />} />
            <Route path="/edit-mode" element={<EditMode />} />
            <Route path="/sign-in" element={<SignIn />} />
          </Routes>
        </div>
    </Router>
  );
}