import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import NAACLogo from "../assets/NAACLogo.png";
import Years29Logo from "../assets/29years.png";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [emergingOpen, setEmergingOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    return () => window.removeEventListener("scroll", handleScroll);
  }, [darkMode]);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "bg-white/95 dark:bg-[#020617]/95 backdrop-blur-2xl shadow-xl" : "bg-transparent"}`}>
      
      {/* 1. NEON UTILITY BAR */}
      <div className="hidden md:block bg-gradient-to-r from-[#3e0202] via-[#600000] to-[#3e0202] dark:from-black dark:via-[#1a0202] dark:to-black text-[11px] text-white/90 py-2 border-b border-white/10">
        <div className="max-w-[1500px] mx-auto px-10 flex justify-between items-center font-bold tracking-tight">
          <div className="flex gap-8 opacity-80 uppercase tracking-widest">
            <a href="#" className="hover:text-red-400 transition-colors">Anti-Ragging</a>
            <a href="#" className="hover:text-red-400 transition-colors">NIRF</a>
            <a href="#" className="hover:text-red-400 transition-colors">IQAC</a>
            <a href="#" className="hover:text-red-400 transition-colors">NAAC A+</a>
          </div>
          <div className="flex gap-6 items-center">
            <a href="#" className="hover:text-red-300 transition-colors">Online Payment</a>
            <div className="h-3 w-[1px] bg-white/20"></div>
            <a href="https://lms.itmgoi.in/" target="_blank" className="relative px-4 py-1 bg-cyan-500/20 border border-cyan-400/50 rounded-full text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              LMS Portal
            </a>
            <a href="http://mis.itmgoi.in/" target="_blank" className="relative px-4 py-1 bg-amber-500/20 border border-amber-400/50 rounded-full text-amber-400 hover:bg-amber-500 hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
              MIS Login
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <div className={`max-w-[1500px] mx-auto px-10 flex items-center transition-all duration-500 ${isScrolled ? 'py-3' : 'py-5'}`}>
        
        {/* LOGO GROUP */}
        <div className="flex items-center gap-8 shrink-0">
          <Link to="/" className="group cursor-pointer">
            <img 
              src={logo} 
              alt="ITM Logo" 
              className={`transition-all duration-500 group-hover:scale-105 object-contain ${isScrolled ? 'h-12' : 'h-20'}`} 
            />
          </Link>

          <div className="h-12 w-[1px] bg-gray-300/40 dark:bg-gray-700/40 hidden lg:block"></div>

          <div className="flex items-center gap-5">
            <img src={NAACLogo} alt="NAAC" className="h-10 md:h-12 w-auto object-contain" />
            <img src={Years29Logo} alt="29 Years" className="h-10 md:h-12 w-auto object-contain" />
          </div>
        </div>

        <div className="flex-grow"></div>

        {/* NAVIGATION LINKS */}
        <nav className="hidden xl:flex items-center gap-6">
          <div 
            className="flex items-center gap-1 text-[13px] font-black uppercase tracking-widest text-gray-800 dark:text-gray-200 relative"
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Home */}
            <Link
              to="/"
              onMouseEnter={() => setHoveredItem('Home')}
              className="relative px-5 py-2 transition-colors duration-300 z-10 hover:text-[#800000] dark:hover:text-red-400"
            >
              <AnimatePresence>
                {hoveredItem === 'Home' && (
                  <motion.span
                    layoutId="navbar-pill"
                    className="absolute inset-0 z-0 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-lg rounded-full border border-red-200/50 dark:border-red-800/30 shadow-sm"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              <span className="relative z-10">Home</span>
            </Link>

            {/* Admission */}
            <Link
              to="/"
              onMouseEnter={() => setHoveredItem('Admission')}
              className="relative px-5 py-2 transition-colors duration-300 z-10 hover:text-[#800000] dark:hover:text-red-400"
            >
              <AnimatePresence>
                {hoveredItem === 'Admission' && (
                  <motion.span
                    layoutId="navbar-pill"
                    className="absolute inset-0 z-0 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-lg rounded-full border border-red-200/50 dark:border-red-800/30 shadow-sm"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              <span className="relative z-10">Admission</span>
            </Link>

            {/* DEPARTMENTS DROPDOWN */}
            <div className="relative group" onMouseEnter={() => setHoveredItem('Departments')} onMouseLeave={() => setHoveredItem(null)}>
              <button className="relative flex items-center gap-1.5 px-5 py-2 hover:text-[#800000] dark:hover:text-red-400 cursor-pointer uppercase z-10 transition-colors duration-300">
                <AnimatePresence>
                  {hoveredItem === 'Departments' && (
                    <motion.span
                      layoutId="navbar-pill"
                      className="absolute inset-0 z-0 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-lg rounded-full border border-red-200/50 dark:border-red-800/30 shadow-sm"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
                <span className="relative z-10 flex items-center gap-1.5">
                  Department
                  <span className="text-[10px] transition-transform duration-300 group-hover:rotate-180 inline-block">▼</span>
                </span>
              </button>

              {/* Dropdown Panel */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 opacity-0 invisible translate-y-3 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-50">
                {/* Arrow pointer */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#0f0a0a] rotate-45 border-l border-t border-red-100/60 dark:border-red-900/40"></div>
                <div className="relative bg-white/98 dark:bg-[#0f0a0a]/98 backdrop-blur-2xl rounded-2xl shadow-[0_25px_60px_rgba(128,0,0,0.15)] border border-red-100/60 dark:border-red-900/30 overflow-hidden">
                  {/* Top accent bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-[#800000] via-red-500 to-[#800000]"></div>
                  <div className="p-2">
                    {/* Computer Science & Engineering */}
                    <div>
                      <Link
                        to="/department/cse"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[12.5px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-[#800000] dark:hover:text-red-400 transition-all duration-200 group/dept"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-300 dark:bg-red-700 group-hover/dept:bg-[#800000] dark:group-hover/dept:bg-red-400 transition-colors shrink-0"></span>
                        <span>Computer Science &amp; Engineering</span>
                        <span className="ml-auto opacity-0 group-hover/dept:opacity-100 text-[#800000] dark:text-red-400 transition-opacity text-xs">→</span>
                      </Link>
                      <div className="mx-4 h-[1px] bg-gray-100 dark:bg-gray-800/60"></div>
                    </div>

                    {/* Emerging Branches - Right after CS&E */}
                    <div
                      onMouseEnter={() => setEmergingOpen(true)}
                      onMouseLeave={() => setEmergingOpen(false)}
                    >
                      <Link
                        to="/emerging-branches"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[12.5px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-[#800000] dark:hover:text-red-400 transition-all duration-200 group/dept"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 dark:bg-amber-600 group-hover/dept:bg-[#800000] dark:group-hover/dept:bg-red-400 transition-colors shrink-0"></span>
                        <span className="flex-1">Emerging Branches</span>
                        <span className={`text-[10px] transition-transform duration-300 ${emergingOpen ? 'rotate-180' : ''}`}>▼</span>
                      </Link>

                      {/* Sub Branches */}
                      <AnimatePresence>
                        {emergingOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="ml-5 pl-3 border-l-2 border-red-200 dark:border-red-900/50 space-y-0.5 pb-1">
                              {[
                                { name: 'Data Science', icon: '📊', path: '/department/cse/data-science' },
                                { name: 'Internet of Things', icon: '🌐', path: '/department/cse/iot' },
                                { name: 'AI & Machine Learning', icon: '🤖', path: '/department/cse/aiml' },
                                { name: 'Cyber Security', icon: '🛡️', path: '/department/cse/cyber-security' },
                                { name: 'Cloud Computing', icon: '☁️', path: '/department/cse/cloud-computing' },
                              ].map((sub) => (
                                <Link
                                  key={sub.name}
                                  to={sub.path}
                                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11.5px] font-semibold text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-[#800000] dark:hover:text-red-400 transition-all duration-200 group/sub"
                                >
                                  <span className="text-sm">{sub.icon}</span>
                                  <span>{sub.name}</span>
                                  <span className="ml-auto opacity-0 group-hover/sub:opacity-100 text-[#800000] dark:text-red-400 transition-opacity text-[10px]">→</span>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="mx-4 h-[1px] bg-gray-100 dark:bg-gray-800/60"></div>
                    </div>

                    {/* Remaining departments */}
                    {[
                      { name: 'Electronics & Comm. Engineering', path: '/department/ece' },
                      { name: 'Mechanical Engineering', path: '/department/me' },
                      { name: 'Civil Engineering', path: '/department/civil' },
                      { name: 'Information Technology', path: '/department/it' },
                      { name: 'Master of Business Administration', path: '/department/mba' },
                      { name: 'Engineering Sciences & Humanities', path: '/department/esh' },
                      { name: 'Central Library', path: '/central-library' },
                    ].map((dept, i, arr) => (
                      <div key={dept.name}>
                        <Link
                          to={dept.path}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[12.5px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-[#800000] dark:hover:text-red-400 transition-all duration-200 group/dept"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-red-300 dark:bg-red-700 group-hover/dept:bg-[#800000] dark:group-hover/dept:bg-red-400 transition-colors shrink-0"></span>
                          <span>{dept.name}</span>
                          <span className="ml-auto opacity-0 group-hover/dept:opacity-100 text-[#800000] dark:text-red-400 transition-opacity text-xs">→</span>
                        </Link>
                        {i < arr.length - 1 && <div className="mx-4 h-[1px] bg-gray-100 dark:bg-gray-800/60"></div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* TAP */}
            <Link
              to="/"
              onMouseEnter={() => setHoveredItem('TAP')}
              className="relative px-5 py-2 transition-colors duration-300 z-10 hover:text-[#800000] dark:hover:text-red-400"
            >
              <AnimatePresence>
                {hoveredItem === 'TAP' && (
                  <motion.span
                    layoutId="navbar-pill"
                    className="absolute inset-0 z-0 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-lg rounded-full border border-red-200/50 dark:border-red-800/30 shadow-sm"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              <span className="relative z-10">TAP</span>
            </Link>

            {/* Research */}
            <Link
              to="/"
              onMouseEnter={() => setHoveredItem('Research')}
              className="relative px-5 py-2 transition-colors duration-300 z-10 hover:text-[#800000] dark:hover:text-red-400"
            >
              <AnimatePresence>
                {hoveredItem === 'Research' && (
                  <motion.span
                    layoutId="navbar-pill"
                    className="absolute inset-0 z-0 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-lg rounded-full border border-red-200/50 dark:border-red-800/30 shadow-sm"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              <span className="relative z-10">Research</span>
            </Link>
            
            {/* MORE DROPDOWN */}
            <div className="relative group">
              <button 
                onMouseEnter={() => setHoveredItem('more')}
                className="relative flex items-center gap-2 px-5 py-2 hover:text-[#800000] dark:hover:text-red-400 cursor-pointer uppercase z-10"
              >
                <AnimatePresence>
                  {hoveredItem === 'more' && (
                    <motion.span
                      layoutId="navbar-pill"
                      className="absolute inset-0 z-0 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-lg rounded-full border border-red-200/50 dark:border-red-800/30"
                    />
                  )}
                </AnimatePresence>
                <span className="relative z-10 flex items-center gap-2">
                    MORE <span className="text-[10px] transition-transform group-hover:rotate-180">▼</span>
                </span>
              </button>
              
              <div className="absolute top-full right-0 mt-2 w-72 bg-white/95 dark:bg-[#020617]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(128,0,0,0.1)] rounded-[2rem] p-8 border border-red-100/50 dark:border-gray-800 opacity-0 invisible translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-500">
                <div className="grid gap-5 text-[12px] font-black tracking-widest uppercase">
                  {['Clubs/Cell', 'Alumni', 'Gallery', 'IEEE'].map(subItem => (
                    <a key={subItem} href="#" className="flex justify-between items-center group/item hover:text-[#800000] dark:hover:text-red-400">
                      {subItem} <span className="opacity-0 group-hover/item:opacity-100 translate-x-[-10px] group-hover/item:translate-x-0 transition-all">→</span>
                    </a>
                  ))}
                  <div className="h-[1px] bg-gray-100 dark:bg-gray-800 my-2"></div>
                  <a href="#" className="text-red-600 hover:scale-105 transition-transform origin-left">Grievance Form</a>
                  <a href="#" className="text-blue-500 hover:scale-105 transition-transform origin-left">Contact Us</a>
                </div>
              </div>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-800/50 mx-2"></div>

          {/* Theme Toggle */}
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="relative w-14 h-7 flex items-center bg-gray-200 dark:bg-red-900/40 rounded-full p-1 cursor-pointer transition-colors duration-300 border border-gray-300 dark:border-red-700/50"
          >
            <div className={`absolute w-5 h-5 bg-white dark:bg-red-500 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${darkMode ? 'translate-x-7' : 'translate-x-0'}`}>
              {darkMode ? (
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-900"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              )}
            </div>
          </button>
          
          <button className="relative group shrink-0">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#800000] to-red-600 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-[#800000] dark:bg-red-700 text-white px-10 py-4 rounded-full font-black text-xs tracking-widest hover:bg-transparent transition-colors shadow-lg">
              APPLY NOW
            </div>
          </button>
        </nav>
      </div>
    </header>
  );
}