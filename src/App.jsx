import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Placements from "./components/Placements";
import CampusLife from "./components/CampusLife";
import Departments from "./components/Departments";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import CSDepartment from './pages/CSDepartment';
import CentralLibrary from './pages/CentralLibrary';
import DepartmentPage from './pages/DepartmentPage';
import ITDepartment from './pages/ITDepartment';
import ECDepartment from './pages/ECDepartment';
import CEDepartment from './pages/CEDepartment';
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

            {/* CS DEPARTMENT PAGE ROUTE */}
            <Route path="/cs" element={<CSDepartment />} />

            {/* CENTRAL LIBRARY PAGE ROUTE */}
            <Route path="/central-library" element={<CentralLibrary />} />

            {/* OTHER DEPARTMENT PAGE ROUTES */}
            <Route path="/ece" element={<ECDepartment />} />
            <Route path="/me"  element={<DepartmentPage deptKey="me"  />} />
            <Route path="/ce"  element={<CEDepartment />} />
            <Route path="/it"  element={<ITDepartment />} />
            <Route path="/mba" element={<DepartmentPage deptKey="mba" />} />
            <Route path="/esh" element={<DepartmentPage deptKey="esh" />} />

            {/* EMERGING BRANCHES */}
            <Route path="/emerging-branches" element={<EmergingBranches />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;