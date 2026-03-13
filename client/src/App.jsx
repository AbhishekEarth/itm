import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Awards from './components/Awards';
import Events from './components/Events';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import TapPage from './pages/TapPage';

import ITMUSP from './components/ITMUSP';

const Home = () => (
  <main className="flex-grow">
    <Hero />
    <ITMUSP />
    <Events />
    <Awards />
    <Testimonials />
  </main>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tap" element={<TapPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
