import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from "./components/Header";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Placements from "./components/Placements";
import CampusLife from "./components/CampusLife";
import Departments from "./components/Departments";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import DynamicDepartmentPage from './pages/DynamicDepartmentPage';
import CentralLibrary from './pages/CentralLibrary';
import EmergingBranches from './pages/EmergingBranches';
import FloatingSidebar from "./components/FloatingSidebar";

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
                <Placements />
                <CampusLife />
                <Testimonials />
                <section id="footer"><Footer /></section>
              </>
            } />

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
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;