import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react"; 

const logo = "/images/ITMGOILogo.png";
const NAACLogo = "/images/NAACLogo.png";
const Years29Logo = "/images/29years.png";

const DEPT_LINKS = [
  { label: 'CS Department', path: '/cs' },
  { label: 'IT Department', path: '/it' },
  { label: 'EC Department', path: '/ece' },
  { label: 'Civil Engineering', path: '/ce' },
  { label: 'Emerging Branches', path: '/emerging-branches' },
  { label: 'Central Library', path: '/library' },
];

const CLUB_LINKS = [
  { label: 'Performing Arts Club (PAC)', path: '/pac' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deptOpen, setDeptOpen] = useState(false);
  const [mobileDeptOpen, setMobileDeptOpen] = useState(false);
  const [clubOpen, setClubOpen] = useState(false);
  const [mobileClubOpen, setMobileClubOpen] = useState(false);
  const deptRef = useRef(null);
  const clubRef = useRef(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`absolute top-0 w-full z-50 transition-all duration-500 ${isScrolled || mobileMenuOpen ? "bg-white/95 dark:bg-[#020617]/95 shadow-xl" : "bg-transparent"}`}>
      
      {/* 1. UTILITY BAR (Hidden on Mobile) */}
      <div className="hidden md:block bg-gradient-to-r from-[#3e0202] via-[#600000] to-[#3e0202] dark:from-white dark:via-[#1a0202] dark:to-white text-[11px] text-white/90 py-2 border-b border-white/10">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-10 flex justify-between items-center font-bold tracking-tight">
          <div className="flex gap-4 lg:gap-8 opacity-80 uppercase tracking-widest">
            <a href="#" className="hover:text-red-400">Anti-Ragging</a>
            <a href="#" className="hover:text-red-400">NIRF</a>
            <a href="#" className="hover:text-red-400">IQAC</a>
            <a href="#" className="hover:text-red-400">NAAC A+</a>
          </div>
          <div className="flex gap-4 lg:gap-6 items-center">
            <a href="#" className="hover:text-red-300">Online Payment</a>
            <div className="h-3 w-[1px] bg-white/20"></div>
            <a href="https://lms.itmgoi.in/" target="_blank" className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/50 rounded-full text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all">LMS Portal</a>
            <a href="http://mis.itmgoi.in/" target="_blank" className="px-3 py-1 bg-amber-500/20 border border-amber-400/50 rounded-full text-amber-400 hover:bg-amber-500 hover:text-black transition-all">MIS Login</a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <div className={`max-w-[1500px] mx-auto px-6 lg:px-10 flex items-center justify-between transition-all duration-500 ${isScrolled ? 'py-2' : 'py-4'}`}>
        
        {/* LOGO GROUP */}
        <div className="flex items-center gap-4 lg:gap-8 shrink-0">
          <Link to="/" className="group cursor-pointer">
            <img 
              src={logo} 
              alt="ITM Logo" 
              className={`transition-all duration-500 group-hover:scale-105 object-contain ${isScrolled ? 'h-10 lg:h-12' : 'h-14 lg:h-20'}`} 
            />
          </Link>
          <div className="h-10 w-[1px] bg-gray-300/40 hidden lg:block"></div>
          <div className="flex items-center gap-3 lg:gap-5">
            <img src={Years29Logo} alt="29 Years" className="h-8 lg:h-12 w-auto object-contain" />
            <img src={NAACLogo} alt="NAAC" className="h-8 lg:h-12 w-auto object-contain" />
          </div>
        </div>

        {/* DESKTOP LINKS (Hidden on XL screens and below) */}
        <nav className="hidden xl:flex items-center gap-4">
          <div className="flex items-center gap-1 text-[12px] font-black uppercase tracking-widest text-gray-800" onMouseLeave={() => setHoveredItem(null)}>
            {[
              { label: 'Home', path: '/' },
              { label: 'Admission', path: '#' },
              { label: 'Training & Placement', path: '/tap' },
              { label: 'Research', path: '#' }
            ].map((item) => (
              <Link key={item.label} to={item.path} onMouseEnter={() => setHoveredItem(item.label)} className="relative px-4 py-2 hover:text-[#800000] transition-colors z-10">
                {hoveredItem === item.label && (
                  <motion.span layoutId="navbar-pill" className="absolute inset-0 bg-red-50/80 rounded-full border border-red-200/50 -z-10" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                {item.label}
              </Link>
            ))}

            {/* Departments Dropdown */}
            <div className="relative" ref={deptRef} onMouseEnter={() => setDeptOpen(true)} onMouseLeave={() => setDeptOpen(false)}>
              <button className="flex items-center gap-1 px-4 py-2 hover:text-[#800000] transition-colors">
                Departments <ChevronDown size={12} className={`transition-transform ${deptOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {deptOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    {DEPT_LINKS.map((d) => (
                      <Link
                        key={d.path}
                        to={d.path}
                        onClick={() => setDeptOpen(false)}
                        className="block px-4 py-3 text-[11px] font-black uppercase tracking-widest text-gray-700 hover:bg-red-50 hover:text-[#800000] transition-colors"
                      >
                        {d.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Clubs & Cells Dropdown */}
            <div className="relative" ref={clubRef} onMouseEnter={() => setClubOpen(true)} onMouseLeave={() => setClubOpen(false)}>
              <button className="flex items-center gap-1 px-4 py-2 hover:text-[#800000] transition-colors">
                Clubs / Cells <ChevronDown size={12} className={`transition-transform ${clubOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {clubOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    {CLUB_LINKS.map((d) => (
                      <Link
                        key={d.path}
                        to={d.path}
                        onClick={() => setClubOpen(false)}
                        className="block px-4 py-3 text-[11px] font-black uppercase tracking-widest text-gray-700 hover:bg-red-50 hover:text-[#800000] transition-colors"
                      >
                        {d.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button className="bg-[#800000] text-white px-6 py-3 rounded-full font-black text-[10px] tracking-widest hover:shadow-lg transition-all ml-4">
            APPLY NOW
          </button>
        </nav>

        {/* MOBILE MENU BUTTON (Shown on screens < XL) */}
        <div className="xl:hidden flex items-center gap-4">
            <button className="bg-[#800000] text-white px-4 py-2 rounded-full font-black text-[10px] tracking-widest">
                APPLY
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-800">
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="xl:hidden bg-white border-t border-gray-100 overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col p-6 gap-6 font-black uppercase tracking-widest text-sm">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#800000]">Home</Link>
              <Link to="#" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#800000]">Admission</Link>
              <div>
                <button 
                  onClick={() => setMobileDeptOpen(!mobileDeptOpen)}
                  className="w-full flex items-center justify-between text-[#800000] mb-3 focus:outline-none"
                >
                  <span>Departments</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileDeptOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileDeptOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-3 pl-4 border-l-2 border-red-100 text-[11px] mb-3">
                        {DEPT_LINKS.map((d) => (
                          <Link 
                            key={d.path} 
                            to={d.path} 
                            onClick={() => { setMobileMenuOpen(false); setMobileDeptOpen(false); }} 
                            className="text-gray-600 hover:text-[#800000] py-1"
                          >
                            {d.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <button 
                  onClick={() => setMobileClubOpen(!mobileClubOpen)}
                  className="w-full flex items-center justify-between text-[#800000] mb-3 focus:outline-none"
                >
                  <span>Clubs / Cells</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileClubOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileClubOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-3 pl-4 border-l-2 border-red-100 text-[11px] mb-3">
                        {CLUB_LINKS.map((d) => (
                          <Link 
                            key={d.path} 
                            to={d.path} 
                            onClick={() => { setMobileMenuOpen(false); setMobileClubOpen(false); }} 
                            className="text-gray-600 hover:text-[#800000] py-1"
                          >
                            {d.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link to="/tap" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#800000]">Training &amp; Placement</Link>
              <Link to="#" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#800000]">Research</Link>
              <div className="h-[1px] bg-gray-100"></div>
              <div className="grid grid-cols-2 gap-4 text-[10px] opacity-70">
                 <a href="#">LMS Portal</a>
                 <a href="#">MIS Login</a>
                 <a href="#">Anti-Ragging</a>
                 <a href="#">Online Payment</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}