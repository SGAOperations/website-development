import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';

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

export default function RoutesComponent() {
  return (
    <Router>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />

          <Route path="/edit-mode" element={<EditMode />} />

          <Route path="/" element={<Home />} />

          <Route path="/ex-branch-temp" element = {<ExBranchTemp />} />
          <Route path="/office-of-the-president" element={<OfficeOfThePresident />} />
          <Route path="/academic-affairs" element={<AcademicAffairs />} />
          <Route path="/campus-affairs" element={<CampusAffairs />} />
          <Route path="/diversity-equity-inclusion" element={<DiversityEquityInclusion />} />
          <Route path="/external-affairs" element={<ExternalAffairs />} />
          <Route path="/student-involvement" element={<StudentInvolvement />} />
          <Route path="/student-success" element={<StudentSuccess />} />
          <Route path="/operational-affairs" element={<OperationalAffairs />} />
        </Routes>
    </Router>
  );
}