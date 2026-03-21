import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from "./components/Header";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Placements from "./components/Placements";
import CampusLife from "./components/CampusLife";
import Departments from "./components/Departments";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
<<<<<<< HEAD:client/src/App.jsx
import CSDepartment from './pages/CSDepartment';
import ECDepartment from './pages/ECDepartment';
import ITDepartment from './pages/ITDepartment';
import TapPage from './pages/TapPage';
import CentralLibrary from './pages/CentralLibrary';
import DepartmentPage from './pages/DepartmentPage';
import PACPage from './pages/PACPage';
=======
import DynamicDepartmentPage from './pages/DynamicDepartmentPage';
import CentralLibrary from './pages/CentralLibrary';
import EmergingBranches from './pages/EmergingBranches';
>>>>>>> 015696f26eba7f0d0c6bae8152b71148f06a5e40:src/App.jsx
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

<<<<<<< HEAD:client/src/App.jsx
            {/* DEPARTMENT ROUTES */}
            <Route path="/cs" element={<CSDepartment />} />
            <Route path="/ec" element={<ECDepartment />} />
            <Route path="/it" element={<ITDepartment />} />
            <Route path="/department" element={<DepartmentPage />} />

            {/* CLUBS ROUTES */}
            <Route path="/pac" element={<PACPage />} />

            {/* OTHER PAGE ROUTES */}
            <Route path="/tap" element={<TapPage />} />
            <Route path="/library" element={<CentralLibrary />} />
            <Route path="/admin/pac" element={<AdminPACEventForm />} />
=======
            {/* DYNAMIC DEPARTMENT & BRANCH ROUTES */}
            <Route path="/department/:deptId" element={<DynamicDepartmentPage />} />
            <Route path="/department/:deptId/:branchId" element={<DynamicDepartmentPage />} />

            {/* LEGACY REDIRECTS for consistency */}
            <Route path="/cs" element={<Navigate to="/department/cse" replace />} />
            <Route path="/it" element={<Navigate to="/department/it" replace />} />
            <Route path="/ece" element={<Navigate to="/department/ece" replace />} />
            <Route path="/ce" element={<Navigate to="/department/civil" replace />} />
            <Route path="/aiml" element={<Navigate to="/department/cse/aiml" replace />} />
            <Route path="/cyber-security" element={<Navigate to="/department/cse/cyber-security" replace />} />
            <Route path="/cloud-computing" element={<Navigate to="/department/cse/cloud-computing" replace />} />

            {/* OTHER PAGES */}
            <Route path="/central-library" element={<CentralLibrary />} />
            <Route path="/emerging-branches" element={<EmergingBranches />} />
>>>>>>> 015696f26eba7f0d0c6bae8152b71148f06a5e40:src/App.jsx
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
