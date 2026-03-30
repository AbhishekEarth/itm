import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from "./components/Header";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Placements from "./components/Placements";
import CampusLife from "./components/CampusLife";
import Departments from "./components/Departments";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import CSDepartment from './pages/CSDepartment';
import ECDepartment from './pages/ECDepartment';
import ITDepartment from './pages/ITDepartment';
import CEDepartment from './pages/CEDepartment';
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

function App() {
  return (
    <Router>
      <div className="bg-white dark:bg-[#020617] min-h-screen transition-colors duration-500">
        <Header />
        
        {/* Persistent Floating Sidebar */}
        <FloatingSidebar /> 

        {/* FIX: Adjusted padding-top to match the height of the fixed header.
            Desktop: pt-[160px] (Utility bar ~40px + Main Nav ~120px)
            Mobile: pt-[120px] 
        */}
        <div className="pt-[120px] md:pt-[160px]">
          <Routes>
            {/* HOME PAGE ROUTE */}
            <Route path="/" element={
              <>
                <Hero />
                <Stats />
                <section id="schools"><Departments /></section>
                <section id="clubs"><ClubsCells /></section>           
                <Placements />
                <CampusLife />
                <Testimonials />
                <section id="footer"><Footer /></section>
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

            {/* CLUBS ROUTES */}
            <Route path="/pac" element={<PACPage />} />

            {/* OTHER PAGE ROUTES */}
            <Route path="/tap" element={<TapPage />} />
            <Route path="/library" element={<CentralLibrary />} />
            <Route path="/central-library" element={<CentralLibrary />} />
            <Route path="/emerging-branches" element={<EmergingBranches />} />
            <Route path="/admin/pac" element={<AdminPACEventForm />} />
            <Route path="/department" element={<DepartmentPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
