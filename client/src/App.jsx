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
import ECDepartment from './pages/ECDepartment';
import ITDepartment from './pages/ITDepartment';
import TapPage from './pages/TapPage';
import CentralLibrary from './pages/CentralLibrary';
import DepartmentPage from './pages/DepartmentPage';
import PACPage from './pages/PACPage';
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
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
