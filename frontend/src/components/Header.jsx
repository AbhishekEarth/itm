import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";

const logo = "/images/ITMGOILogo.png";
const NAACLogo = "/images/NAACLogo.png";
const Years29Logo = "/images/29years.png";

const DEPT_LINKS = [
  { label: 'CS Engineering', path: '/cs' },
  { label: 'Information Technology', path: '/it' },
  { label: 'Electronics & Comm.', path: '/ece' },
  { label: 'Mechanical Engineering', path: '/me' },
  { label: 'Civil Engineering', path: '/ce' },
  { label: 'MBA · Management', path: '/mba' },
  { label: 'Engineering Sciences & Humanities', path: '/esh' },
  { label: 'Emerging Branches', path: '/emerging-branches' },
  { label: 'Central Library', path: '/library' },
];

const CLUB_LINKS = [
  { label: 'Performing Arts Club (PAC)', path: '/pac' },
  { label: 'Unnat Bharat Abhiyan (UBA)', path: '/uba' },
  { label: 'NSS Cell', path: '/nss' },
  { label: 'Sports Cell', path: '/sports' },
  { label: 'Women Empowerment Cell (WEC)', path: '/wec' },
];

const RESEARCH_LINKS = [
  { label: 'Research Overview', path: '/research' },
  { label: 'Research & Development Cell', path: '/research/rd-cell' },
  { label: 'Innovation Ecosystem', path: '/research/innovation-ecosystem' },
  { label: 'ITM International Journal', path: '/research/journal' },
  { label: 'ITM International Conference', path: '/research/conference' },
  { label: 'Faculty Development Program (FDP)', path: '/research/fdp' },
];

const ADMISSION_LINKS = [
  { label: 'Admissions Overview', path: '/admissions' },
  { label: 'UG Courses', path: '/admissions/ug' },
  { label: 'PG Courses', path: '/admissions/pg' },
  { label: 'How to Seek Admission', path: '/admissions/how-to-apply' },
  { label: 'Online Apply', href: 'http://itmgoi.in/OnlineApply_ITMGOI', external: true },
  { label: 'Online Pay', href: 'https://onlineapply.itmgoi.in/form_hdfc.php?ok=Apply+Now', external: true },
];

export default function Header() {
  const { dark } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deptOpen, setDeptOpen] = useState(false);
  const [mobileDeptOpen, setMobileDeptOpen] = useState(false);
  const [clubOpen, setClubOpen] = useState(false);
  const [mobileClubOpen, setMobileClubOpen] = useState(false);
  const [admOpen, setAdmOpen] = useState(false);
  const [mobileAdmOpen, setMobileAdmOpen] = useState(false);
  const [resOpen, setResOpen] = useState(false);
  const [mobileResOpen, setMobileResOpen] = useState(false);
  const deptRef = useRef(null);
  const clubRef = useRef(null);
  const admRef = useRef(null);
  const resRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled || mobileMenuOpen
        ? "bg-gradient-to-r from-[#3e0202] via-[#800000] to-[#3e0202] dark:from-[#020617] dark:via-[#0d1117] dark:to-[#020617] dark:border-b dark:border-white/5 shadow-xl"
        : "bg-gradient-to-b from-black/60 via-black/20 to-transparent"
    }`}>

      {/* UTILITY BAR — collapses on scroll */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.div
            key="utility-bar"
            initial={{ height: "auto", opacity: 1 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden md:block bg-gradient-to-r from-[#3e0202] via-[#600000] to-[#3e0202] dark:from-[#0d0d1a] dark:via-[#0d0d1a] dark:to-[#0d0d1a] text-[11px] text-white/90 py-2 border-b border-white/10 overflow-hidden"
          >
            <div className="max-w-[1500px] mx-auto px-6 lg:px-10 flex justify-between items-center font-bold tracking-tight">
              <div className="flex gap-4 lg:gap-8 opacity-80 uppercase tracking-widest">
                <a href="#" className="hover:text-red-400">Anti-Ragging</a>
                <a href="#" className="hover:text-red-400">NIRF</a>
                <a href="#" className="hover:text-red-400">IQAC</a>
                <a href="#" className="hover:text-red-400">NAAC Grade A</a>
              </div>
              <div className="flex gap-4 lg:gap-6 items-center">
                <a href="https://onlineapply.itmgoi.in/form_hdfc.php?ok=Apply+Now" target="_blank" rel="noreferrer" className="hover:text-red-300">Online Payment</a>
                <div className="h-3 w-[1px] bg-white/20"></div>
                <Link to="/login" className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/50 rounded-full text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all">LMS Portal</Link>
                <Link to="/login" className="px-3 py-1 bg-amber-500/20 border border-amber-400/50 rounded-full text-amber-400 hover:bg-amber-500 hover:text-black transition-all">MIS Login</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN NAVIGATION */}
      <div className={`max-w-[1500px] mx-auto px-6 lg:px-10 flex items-center justify-between transition-all duration-500 ${isScrolled ? 'py-2' : 'py-4'}`}>

        {/* LOGO GROUP */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0 overflow-hidden">
          <Link to="/" className="group cursor-pointer shrink-0">
            <img
              src={logo}
              alt="ITM Logo"
              className={`transition-all duration-500 group-hover:scale-105 object-contain ${isScrolled ? 'h-10 lg:h-12' : 'h-14 lg:h-20'}`}
            />
          </Link>

          {/* Divider + secondary logos — slide left and disappear on scroll */}
          <AnimatePresence>
            {!isScrolled && (
              <motion.div
                key="secondary-logos"
                className="hidden lg:flex items-center gap-4"
                initial={{ opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <div className="h-10 w-[1px] bg-white/30"></div>
                <img src={Years29Logo} alt="29 Years" className="h-8 lg:h-12 w-auto object-contain drop-shadow" />
                <img src={NAACLogo} alt="NAAC" className="h-8 lg:h-12 w-auto object-contain drop-shadow" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* DESKTOP LINKS */}
        <nav className="hidden xl:flex items-center gap-4">
          <div
            className="flex items-center gap-1 text-[12px] font-black uppercase tracking-widest text-white"
            onMouseLeave={() => setHoveredItem(null)}
          >
            {[
              { label: 'Home', path: '/' },
              { label: 'Training & Placement', path: '/tap' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onMouseEnter={() => setHoveredItem(item.label)}
                className="relative px-4 py-2 hover:text-amber-300 transition-colors z-10"
              >
                {hoveredItem === item.label && (
                  <motion.span
                    layoutId="navbar-pill"
                    className="absolute inset-0 bg-white/10 rounded-full border border-white/20 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </Link>
            ))}

            {/* Admissions Dropdown */}
            <div className="relative" ref={admRef} onMouseEnter={() => setAdmOpen(true)} onMouseLeave={() => setAdmOpen(false)}>
              <Link to="/admissions" className="flex items-center gap-1 px-4 py-2 hover:text-amber-300 transition-colors">
                Admission <ChevronDown size={12} className={`transition-transform ${admOpen ? 'rotate-180' : ''}`} />
              </Link>
              <AnimatePresence>
                {admOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-60 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
                  >
                    {ADMISSION_LINKS.map((a) =>
                      a.external ? (
                        <a
                          key={a.label}
                          href={a.href}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => setAdmOpen(false)}
                          className="block px-4 py-3 text-[11px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-[#800000] transition-colors"
                        >
                          {a.label} ↗
                        </a>
                      ) : (
                        <Link
                          key={a.label}
                          to={a.path}
                          onClick={() => setAdmOpen(false)}
                          className="block px-4 py-3 text-[11px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-[#800000] transition-colors"
                        >
                          {a.label}
                        </Link>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Departments Dropdown */}
            <div className="relative" ref={deptRef} onMouseEnter={() => setDeptOpen(true)} onMouseLeave={() => setDeptOpen(false)}>
              <button className="flex items-center gap-1 px-4 py-2 hover:text-amber-300 transition-colors">
                Departments <ChevronDown size={12} className={`transition-transform ${deptOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {deptOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-52 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
                  >
                    {DEPT_LINKS.map((d) => (
                      <Link
                        key={d.path}
                        to={d.path}
                        onClick={() => setDeptOpen(false)}
                        className="block px-4 py-3 text-[11px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-[#800000] transition-colors"
                      >
                        {d.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Research Dropdown */}
            <div className="relative" ref={resRef} onMouseEnter={() => setResOpen(true)} onMouseLeave={() => setResOpen(false)}>
              <Link to="/research" className="flex items-center gap-1 px-4 py-2 hover:text-amber-300 transition-colors">
                Research <ChevronDown size={12} className={`transition-transform ${resOpen ? 'rotate-180' : ''}`} />
              </Link>
              <AnimatePresence>
                {resOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
                  >
                    {RESEARCH_LINKS.map((d) => (
                      <Link
                        key={d.path}
                        to={d.path}
                        onClick={() => setResOpen(false)}
                        className="block px-4 py-3 text-[11px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-[#800000] transition-colors"
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
              <button className="flex items-center gap-1 px-4 py-2 hover:text-amber-300 transition-colors">
                Clubs / Cells <ChevronDown size={12} className={`transition-transform ${clubOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {clubOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
                  >
                    {CLUB_LINKS.map((d) => (
                      <Link
                        key={d.path}
                        to={d.path}
                        onClick={() => setClubOpen(false)}
                        className="block px-4 py-3 text-[11px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-[#800000] transition-colors"
                      >
                        {d.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <ThemeToggle className="ml-4" />
          <Link
            to="/admissions/how-to-apply"
            className="bg-white text-[#800000] px-6 py-3 rounded-full font-black text-[10px] tracking-widest hover:bg-amber-300 hover:text-[#3e0202] transition-all ml-2 shadow"
          >
            APPLY NOW
          </Link>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <div className="xl:hidden flex items-center gap-2">
          <ThemeToggle />
          <Link to="/admissions/how-to-apply" className="bg-white text-[#800000] px-4 py-2 rounded-full font-black text-[10px] tracking-widest hover:bg-amber-300 transition-all">
            APPLY
          </Link>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-white">
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
            className="xl:hidden bg-white dark:bg-gray-900 border-t border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col p-6 gap-6 font-black uppercase tracking-widest text-sm text-gray-800 dark:text-white">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#800000] dark:hover:text-red-400">Home</Link>
              <Link to="/tap" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#800000] dark:hover:text-red-400">Training & Placement</Link>

              <div>
                <button
                  onClick={() => setMobileAdmOpen(!mobileAdmOpen)}
                  className="w-full flex items-center justify-between text-[#800000] mb-3 focus:outline-none"
                >
                  <span>Admission</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileAdmOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileAdmOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-3 pl-4 border-l-2 border-red-100 text-[11px] mb-3">
                        {ADMISSION_LINKS.map((a) =>
                          a.external ? (
                            <a
                              key={a.label}
                              href={a.href}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => { setMobileMenuOpen(false); setMobileAdmOpen(false); }}
                              className="text-gray-600 dark:text-gray-300 hover:text-[#800000] dark:hover:text-red-400 py-1"
                            >
                              {a.label} ↗
                            </a>
                          ) : (
                            <Link
                              key={a.label}
                              to={a.path}
                              onClick={() => { setMobileMenuOpen(false); setMobileAdmOpen(false); }}
                              className="text-gray-600 dark:text-gray-300 hover:text-[#800000] dark:hover:text-red-400 py-1"
                            >
                              {a.label}
                            </Link>
                          )
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
                            className="text-gray-600 dark:text-gray-300 hover:text-[#800000] dark:hover:text-red-400 py-1"
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
                  onClick={() => setMobileResOpen(!mobileResOpen)}
                  className="w-full flex items-center justify-between text-[#800000] mb-3 focus:outline-none"
                >
                  <span>Research</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileResOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileResOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-3 pl-4 border-l-2 border-red-100 text-[11px] mb-3">
                        {RESEARCH_LINKS.map((d) => (
                          <Link
                            key={d.path}
                            to={d.path}
                            onClick={() => { setMobileMenuOpen(false); setMobileResOpen(false); }}
                            className="text-gray-600 dark:text-gray-300 hover:text-[#800000] dark:hover:text-red-400 py-1"
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
                            className="text-gray-600 dark:text-gray-300 hover:text-[#800000] dark:hover:text-red-400 py-1"
                          >
                            {d.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-[1px] bg-gray-100 dark:bg-gray-700"></div>
              <div className="grid grid-cols-2 gap-4 text-[10px] opacity-70 dark:text-gray-400">
                <Link to="/login">LMS Portal</Link>
                <Link to="/login">MIS Login</Link>
                <a href="#">Anti-Ragging</a>
                <a href="https://onlineapply.itmgoi.in/form_hdfc.php?ok=Apply+Now" target="_blank" rel="noreferrer">Online Payment</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
