import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from "./components/Header";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Placements from "./components/Placements";
import CampusLife from "./components/CampusLife";
import Departments from "./components/Departments";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import WhyITM from "./components/WhyITM";
import RecruiterMarquee from "./components/RecruiterMarquee";
import AdmissionCTA from "./components/AdmissionCTA";
import DirectorVision from "./components/DirectorVision";
import Distinctiveness from "./components/Distinctiveness";
import CSDepartment from './pages/CSDepartment';
import ECDepartment from './pages/ECDepartment';
import ITDepartment from './pages/ITDepartment';
import CEDepartment from './pages/CEDepartment';
import MEDepartment from './pages/MEDepartment';
import MBADepartment from './pages/MBADepartment';
import ESHDepartment from './pages/ESHDepartment';
import TapPage from './pages/TapPage';
import PACPage from './pages/PACPage';
import DynamicDepartmentPage from './pages/DynamicDepartmentPage';
import CentralLibrary from './pages/CentralLibrary';
import EmergingBranches from './pages/EmergingBranches';
import DepartmentPage from './pages/DepartmentPage';
import AIMLPage from './pages/AIMLPage';
import CloudComputingPage from './pages/CloudComputingPage';
import CyberSecurityPage from './pages/CyberSecurityPage';
import FloatingSidebar from "./components/FloatingSidebar";
import ClubsCells from "./components/ClubsCells";
import AdminPACEventForm from "./components/AdminPACEventForm";
import AdminEventForm from "./components/AdminEventForm";
import Admissions from "./pages/Admissions";
import UGCourses from "./pages/UGCourses";
import PGCourses from "./pages/PGCourses";
import SeekAdmission from "./pages/SeekAdmission";
import Research from "./pages/Research";
import ResearchRDCell from "./pages/ResearchRDCell";
import ResearchInnovation from "./pages/ResearchInnovation";
import ResearchJournal from "./pages/ResearchJournal";
import ResearchConference from "./pages/ResearchConference";
import ResearchFDP from "./pages/ResearchFDP";

function RouteShell({ children }) {
  const location = useLocation();
  // Home renders the hero edge-to-edge so the transparent navbar floats over the dark hero photo.
  // Every other page needs top padding to clear the fixed navbar.
  const isHome = location.pathname === '/';
  return (
    <div className={isHome ? '' : 'pt-[88px] md:pt-[140px]'}>
      {children}
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="bg-white dark:bg-[#020617] min-h-screen transition-colors duration-500">
        <Header />

        {/* Persistent Floating Sidebar */}
        <FloatingSidebar />

        <RouteShell>
          <Routes>
            {/* HOME PAGE ROUTE */}
            <Route path="/" element={
              <>
                <Hero />
                <Stats />
                <DirectorVision />
                <WhyITM />
                <section id="schools"><Departments /></section>
                <Distinctiveness />
                <RecruiterMarquee />
                <CampusLife />
                <section id="clubs"><ClubsCells /></section>
                <Placements />
                <Testimonials />
                <AdmissionCTA />
              </>
            } />

            {/* DYNAMIC DEPARTMENT & BRANCH ROUTES */}
            <Route path="/department/:deptId" element={<DynamicDepartmentPage />} />
            <Route path="/department/:deptId/:branchId" element={<DynamicDepartmentPage />} />

            {/* DIRECT DEPARTMENT ROUTES */}
            <Route path="/cs" element={<CSDepartment />} />
            <Route path="/it" element={<ITDepartment />} />
            <Route path="/ece" element={<ECDepartment />} />
            <Route path="/ce" element={<CEDepartment />} />
            <Route path="/me" element={<MEDepartment />} />
            <Route path="/mba" element={<MBADepartment />} />
            <Route path="/esh" element={<ESHDepartment />} />

            {/* EMERGING BRANCH ROUTES */}
            <Route path="/aiml" element={<AIMLPage />} />
            <Route path="/cyber-security" element={<CyberSecurityPage />} />
            <Route path="/cloud-computing" element={<CloudComputingPage />} />

            {/* DYNAMIC DEPARTMENT DEEP DIVE ROUTES */}
            <Route path="/department/cse/aiml" element={<AIMLPage />} />
            <Route path="/department/cse/cyber-security" element={<CyberSecurityPage />} />
            <Route path="/department/cse/cloud-computing" element={<CloudComputingPage />} />

            {/* LEGACY REDIRECTS for old deep-link consistency */}
            <Route path="/department/cse" element={<Navigate to="/cs" replace />} />
            <Route path="/department/it" element={<Navigate to="/it" replace />} />
            <Route path="/department/ece" element={<Navigate to="/ece" replace />} />
            <Route path="/department/civil" element={<Navigate to="/ce" replace />} />

            {/* ADMISSION ROUTES */}
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/admissions/ug" element={<UGCourses />} />
            <Route path="/admissions/pg" element={<PGCourses />} />
            <Route path="/admissions/how-to-apply" element={<SeekAdmission />} />

            {/* RESEARCH */}
            <Route path="/research" element={<Research />} />
            <Route path="/research/rd-cell" element={<ResearchRDCell />} />
            <Route path="/research/innovation-ecosystem" element={<ResearchInnovation />} />
            <Route path="/research/journal" element={<ResearchJournal />} />
            <Route path="/research/conference" element={<ResearchConference />} />
            <Route path="/research/fdp" element={<ResearchFDP />} />

            {/* CLUBS ROUTES */}
            <Route path="/pac" element={<PACPage />} />

            {/* OTHER PAGE ROUTES */}
            <Route path="/tap" element={<TapPage />} />
            <Route path="/library" element={<CentralLibrary />} />
            <Route path="/central-library" element={<CentralLibrary />} />
            <Route path="/emerging-branches" element={<EmergingBranches />} />
            <Route path="/admin/pac" element={<AdminPACEventForm />} />
            <Route path="/admin/tap" element={<AdminEventForm />} />
            <Route path="/department" element={<DepartmentPage />} />
          </Routes>
        </RouteShell>

        {/* Global Footer — appears on every page */}
        <section id="footer"><Footer /></section>
      </div>
    </Router>
  );
}

export default App;
