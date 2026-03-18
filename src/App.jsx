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
import FloatingSidebar from "./components/FloatingSidebar";

function App() {
  return (
    <Router>
      <div className="bg-white dark:bg-[#020617] min-h-screen transition-colors duration-500">
        <Header />
        
        {/* Persistent Floating Sidebar */}
        <FloatingSidebar /> 

        <Routes>
          {/* HOME PAGE ROUTE - Groups all your sections together */}
          <Route path="/" element={
            <>
              <section id="home"><Hero /></section>
              <Stats />
              <section id="schools"><Departments /></section>           
              <Placements />
              <CampusLife />
              <Testimonials />
              <section id="footer"><Footer /></section>
            </>
          } />

          {/* CS DEPARTMENT PAGE ROUTE - Separate Page */}
          <Route path="/cs" element={<CSDepartment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;