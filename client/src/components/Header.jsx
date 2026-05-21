import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ChevronDown, ArrowUpRight, Phone, Mail, ShieldCheck } from "lucide-react";

const logo = "/images/ITMGOILogo.png";
const NAACLogo = "/images/NAACLogo.png";
const NBALogo = "/images/NBALogo.png";
const YearsLogo = "/images/30years.png";

const DEPT_LINKS = [
  { label: "CS Engineering", path: "/cs" },
  { label: "Information Technology", path: "/it" },
  { label: "Electronics & Communication", path: "/ece" },
  { label: "Mechanical Engineering", path: "/me" },
  { label: "Civil Engineering", path: "/ce" },
  { label: "MBA · Management", path: "/mba" },
  { label: "Engineering Sciences & Humanities", path: "/esh" },
  { label: "Emerging Branches", path: "/emerging-branches" },
  { label: "Central Library", path: "/library" },
];

const CLUB_LINKS = [{ label: "Performing Arts Club (PAC)", path: "/pac" }];

const RESEARCH_LINKS = [
  { label: "Research Overview", path: "/research" },
  { label: "Research & Development Cell", path: "/research/rd-cell" },
  { label: "Innovation Ecosystem", path: "/research/innovation-ecosystem" },
  { label: "ITM International Journal", path: "/research/journal" },
  { label: "ITM International Conference", path: "/research/conference" },
  { label: "Faculty Development Program (FDP)", path: "/research/fdp" },
];

const ADMISSION_LINKS = [
  { label: "Admissions Overview", path: "/admissions" },
  { label: "UG Courses", path: "/admissions/ug" },
  { label: "PG Courses", path: "/admissions/pg" },
  { label: "How to Seek Admission", path: "/admissions/how-to-apply" },
  { label: "Online Apply", href: "http://itmgoi.in/OnlineApply_ITMGOI", external: true },
  { label: "Online Pay", href: "https://onlineapply.itmgoi.in/form_hdfc.php?ok=Apply+Now", external: true },
];

/* ----- Reusable dropdown panel ---------------------------------------------- */
function DropdownPanel({ open, items, width = "w-64", onItemClick }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 ${width} bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] border border-black/5 overflow-hidden z-50`}
        >
          <div className="h-[2px] bg-gradient-to-r from-[#800000] via-red-500 to-[#800000]" />
          <div className="py-2">
            {items.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={onItemClick}
                  className="group flex items-center justify-between px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-red-50/70 hover:text-[#800000] transition-colors"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight size={13} className="text-gray-300 group-hover:text-[#800000] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={onItemClick}
                  className="group flex items-center justify-between px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-red-50/70 hover:text-[#800000] transition-colors"
                >
                  <span>{item.label}</span>
                  <ChevronDown size={13} className="-rotate-90 text-gray-300 group-hover:text-[#800000] group-hover:translate-x-0.5 transition-all" />
                </Link>
              )
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Header() {
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

  // RAF-driven scroll values — no React re-renders for the progress bar.
  const { scrollY, scrollYProgress } = useScroll();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, []);

  // Only flip isScrolled when crossing the threshold — minimal re-renders.
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 24;
    setIsScrolled((prev) => (prev === next ? prev : next));
  });

  // Sub-pages have a light background, so default the navbar to its solid look there.
  const location = useLocation();
  const isHome = location.pathname === "/";
  const solid = isScrolled || mobileMenuOpen || !isHome;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-[background,box-shadow] duration-300 ease-out ${
        solid
          ? "bg-gradient-to-r from-[#2a0101] via-[#5c0202] to-[#2a0101] backdrop-blur-xl shadow-[0_14px_36px_-14px_rgba(0,0,0,0.55)]"
          : "bg-gradient-to-b from-black/55 via-black/20 to-transparent backdrop-blur-[2px]"
      }`}
      style={{ willChange: "background-color" }}
    >
      {/* Halo gradient that bleeds below the bar so the image is clearly separated */}
      {!solid && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-full h-16 bg-gradient-to-b from-black/35 to-transparent"
        />
      )}

      {/* Top brand accent strip */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#3e0202] via-amber-300 to-[#3e0202]" />

      {/* 1. UTILITY BAR */}
      <div className="hidden md:block relative bg-gradient-to-r from-[#3e0202] via-[#700000] to-[#3e0202] text-white overflow-hidden">
        {/* subtle pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)",
            backgroundSize: "14px 14px",
          }}
        />
        <div className="max-w-[1500px] mx-auto px-6 lg:px-10 flex justify-between items-center py-1.5">
          <div className="flex items-center gap-5 text-[11px] text-white/85">
            <a href="tel:+919876543210" className="flex items-center gap-1.5 hover:text-white transition">
              <Phone size={11} strokeWidth={2.4} /> +91 98765 43210
            </a>
            <span className="text-white/20">|</span>
            <a href="mailto:info@itmgoi.in" className="flex items-center gap-1.5 hover:text-white transition">
              <Mail size={11} strokeWidth={2.4} /> info@itmgoi.in
            </a>
          </div>
          <div className="flex items-center gap-5 text-[11px]">
            <a href="#" className="text-white/75 hover:text-white transition flex items-center gap-1.5">
              <ShieldCheck size={11} strokeWidth={2.4} /> Anti-Ragging
            </a>
            <a href="#" className="text-white/75 hover:text-white transition">NIRF</a>
            <a href="#" className="text-white/75 hover:text-white transition">IQAC</a>
            <a href="#" className="text-white/75 hover:text-white transition">NAAC A+</a>
            <span className="text-white/15">|</span>
            <a
              href="https://lms.itmgoi.in/"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-0.5 rounded-full border border-cyan-300/40 text-cyan-200 hover:bg-cyan-400 hover:text-[#3e0202] hover:border-cyan-400 transition-all font-medium"
            >
              LMS
            </a>
            <a
              href="http://mis.itmgoi.in/"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-0.5 rounded-full border border-amber-300/40 text-amber-200 hover:bg-amber-300 hover:text-[#3e0202] hover:border-amber-300 transition-all font-medium"
            >
              MIS
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <div
        className={`max-w-[1500px] mx-auto px-6 lg:px-10 flex items-center justify-between transition-[padding] duration-300 ease-out ${
          isScrolled ? "py-2.5" : "py-4"
        }`}
      >
        {/* LOGO GROUP — premium card */}
        <div className="flex items-center gap-3 lg:gap-5 shrink-0">
          <Link to="/" className="group relative cursor-pointer flex items-center">
            {/* soft glow behind the logo */}
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#800000]/0 via-red-500/0 to-amber-300/0 group-hover:from-[#800000]/15 group-hover:via-red-500/10 group-hover:to-amber-300/10 blur-xl transition-all duration-500" />
            <motion.img
              whileHover={{ scale: 1.05, rotate: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              src={logo}
              alt="ITM Logo"
              className={`relative object-contain transition-[height] duration-300 ease-out drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] ${
                isScrolled ? "h-12 lg:h-14" : "h-14 lg:h-[68px]"
              }`}
            />
          </Link>
          <div className="hidden lg:flex items-center self-stretch">
            <span className="h-10 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent" />
          </div>
          <div className="flex items-center gap-3 lg:gap-4">
            <motion.img
              whileHover={{ scale: 1.08 }}
              src={YearsLogo}
              alt="30 Years"
              className={`w-auto object-contain transition-[height] duration-300 ease-out drop-shadow-[0_3px_12px_rgba(0,0,0,0.45)] ${
                isScrolled ? "h-10 lg:h-12" : "h-11 lg:h-14"
              }`}
            />
            <motion.img
              whileHover={{ scale: 1.08 }}
              src={NAACLogo}
              alt="NAAC"
              className={`w-auto object-contain transition-[height] duration-300 ease-out drop-shadow-[0_3px_12px_rgba(0,0,0,0.45)] ${
                isScrolled ? "h-10 lg:h-12" : "h-11 lg:h-14"
              }`}
            />
            <motion.img
              whileHover={{ scale: 1.08 }}
              src={NBALogo}
              alt="NBA Accredited"
              className={`w-auto object-contain transition-[height] duration-300 ease-out drop-shadow-[0_3px_12px_rgba(0,0,0,0.45)] ${
                isScrolled ? "h-10 lg:h-12" : "h-11 lg:h-14"
              }`}
            />
          </div>
        </div>

        {/* DESKTOP LINKS — encapsulated in a premium pill */}
        <nav className="hidden xl:flex items-center gap-2" onMouseLeave={() => setHoveredItem(null)}>
          <div className="flex items-center gap-0.5 text-[13.5px] font-semibold text-white bg-white/10 border border-white/20 rounded-full px-2 py-1 backdrop-blur-md shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)]">
            {/* simple links */}
            {[
              { label: "Home", path: "/" },
              { label: "Placement", path: "/tap" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onMouseEnter={() => setHoveredItem(item.label)}
                className="relative px-4 py-2 hover:text-[#800000] transition-colors"
              >
                {hoveredItem === item.label && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 via-white to-rose-100 border border-white/60 shadow-[0_4px_14px_-2px_rgba(0,0,0,0.35)] -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </Link>
            ))}

            {/* Admissions */}
            <div
              className="relative"
              ref={admRef}
              onMouseEnter={() => {
                setAdmOpen(true);
                setHoveredItem("Admission");
              }}
              onMouseLeave={() => setAdmOpen(false)}
            >
              <Link to="/admissions" className="relative flex items-center gap-1 px-4 py-2 hover:text-[#800000] transition-colors">
                {hoveredItem === "Admission" && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 via-white to-rose-100 border border-white/60 shadow-[0_4px_14px_-2px_rgba(0,0,0,0.35)] -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                Admission
                <ChevronDown size={12} strokeWidth={2.5} className={`transition-transform duration-200 ${admOpen ? "rotate-180" : ""}`} />
              </Link>
              <DropdownPanel open={admOpen} items={ADMISSION_LINKS} width="w-64" onItemClick={() => setAdmOpen(false)} />
            </div>

            {/* Departments */}
            <div
              className="relative"
              ref={deptRef}
              onMouseEnter={() => {
                setDeptOpen(true);
                setHoveredItem("Departments");
              }}
              onMouseLeave={() => setDeptOpen(false)}
            >
              <button className="relative flex items-center gap-1 px-4 py-2 hover:text-[#800000] transition-colors">
                {hoveredItem === "Departments" && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 via-white to-rose-100 border border-white/60 shadow-[0_4px_14px_-2px_rgba(0,0,0,0.35)] -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                Departments
                <ChevronDown size={12} strokeWidth={2.5} className={`transition-transform duration-200 ${deptOpen ? "rotate-180" : ""}`} />
              </button>
              <DropdownPanel open={deptOpen} items={DEPT_LINKS} width="w-60" onItemClick={() => setDeptOpen(false)} />
            </div>

            {/* Research */}
            <div
              className="relative"
              ref={resRef}
              onMouseEnter={() => {
                setResOpen(true);
                setHoveredItem("Research");
              }}
              onMouseLeave={() => setResOpen(false)}
            >
              <Link to="/research" className="relative flex items-center gap-1 px-4 py-2 hover:text-[#800000] transition-colors">
                {hoveredItem === "Research" && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 via-white to-rose-100 border border-white/60 shadow-[0_4px_14px_-2px_rgba(0,0,0,0.35)] -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                Research
                <ChevronDown size={12} strokeWidth={2.5} className={`transition-transform duration-200 ${resOpen ? "rotate-180" : ""}`} />
              </Link>
              <DropdownPanel open={resOpen} items={RESEARCH_LINKS} width="w-72" onItemClick={() => setResOpen(false)} />
            </div>

            {/* Clubs */}
            <div
              className="relative"
              ref={clubRef}
              onMouseEnter={() => {
                setClubOpen(true);
                setHoveredItem("Clubs");
              }}
              onMouseLeave={() => setClubOpen(false)}
            >
              <button className="relative flex items-center gap-1 px-4 py-2 hover:text-[#800000] transition-colors">
                {hoveredItem === "Clubs" && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 via-white to-rose-100 border border-white/60 shadow-[0_4px_14px_-2px_rgba(0,0,0,0.35)] -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                Clubs
                <ChevronDown size={12} strokeWidth={2.5} className={`transition-transform duration-200 ${clubOpen ? "rotate-180" : ""}`} />
              </button>
              <DropdownPanel open={clubOpen} items={CLUB_LINKS} width="w-60" onItemClick={() => setClubOpen(false)} />
            </div>
          </div>

          {/* CTA — clean white pill with maroon mark, premium and high-contrast on the maroon bar */}
          <Link
            to="/admissions/how-to-apply"
            className="group relative ml-3 inline-flex items-center gap-2 rounded-full bg-white text-[#800000] pl-5 pr-4 py-2.5 text-[12.5px] font-bold tracking-wide ring-1 ring-white/60 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] hover:bg-amber-50 hover:ring-amber-200 transition-colors"
          >
            <span>Apply Now</span>
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#a30000] to-[#600000] text-white group-hover:rotate-45 transition-transform duration-300">
              <ArrowUpRight size={13} strokeWidth={2.6} />
            </span>
          </Link>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <div className="xl:hidden flex items-center gap-3">
          <Link
            to="/admissions/how-to-apply"
            className="bg-white text-[#800000] px-4 py-2 rounded-full text-[11px] font-bold ring-1 ring-white/60 shadow-md"
          >
            Apply
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white rounded-lg hover:bg-white/15"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Scroll progress — MotionValue-driven, zero React re-renders */}
      <div className="relative h-[2px] w-full bg-white/10">
        <motion.div
          style={{ scaleX: scrollYProgress, transformOrigin: "0% 50%" }}
          className="absolute inset-0 bg-gradient-to-r from-amber-300 via-red-400 to-amber-300"
        />
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
            <div className="flex flex-col p-6 gap-5 text-[14px]">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-gray-800 hover:text-[#800000]">
                Home
              </Link>

              {/* Admission */}
              <div>
                <button
                  onClick={() => setMobileAdmOpen(!mobileAdmOpen)}
                  className="w-full flex items-center justify-between font-semibold text-gray-800 focus:outline-none"
                >
                  <span>Admission</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileAdmOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileAdmOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-1 pl-4 mt-3 border-l-2 border-[#800000]/20 text-[13px]">
                        {ADMISSION_LINKS.map((a) =>
                          a.external ? (
                            <a
                              key={a.label}
                              href={a.href}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setMobileAdmOpen(false);
                              }}
                              className="text-gray-600 hover:text-[#800000] py-1.5 font-medium"
                            >
                              {a.label} ↗
                            </a>
                          ) : (
                            <Link
                              key={a.label}
                              to={a.path}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setMobileAdmOpen(false);
                              }}
                              className="text-gray-600 hover:text-[#800000] py-1.5 font-medium"
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

              {/* Departments */}
              <div>
                <button
                  onClick={() => setMobileDeptOpen(!mobileDeptOpen)}
                  className="w-full flex items-center justify-between font-semibold text-gray-800 focus:outline-none"
                >
                  <span>Departments</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileDeptOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileDeptOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-1 pl-4 mt-3 border-l-2 border-[#800000]/20 text-[13px]">
                        {DEPT_LINKS.map((d) => (
                          <Link
                            key={d.path}
                            to={d.path}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setMobileDeptOpen(false);
                            }}
                            className="text-gray-600 hover:text-[#800000] py-1.5 font-medium"
                          >
                            {d.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Clubs */}
              <div>
                <button
                  onClick={() => setMobileClubOpen(!mobileClubOpen)}
                  className="w-full flex items-center justify-between font-semibold text-gray-800 focus:outline-none"
                >
                  <span>Clubs / Cells</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileClubOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileClubOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-1 pl-4 mt-3 border-l-2 border-[#800000]/20 text-[13px]">
                        {CLUB_LINKS.map((d) => (
                          <Link
                            key={d.path}
                            to={d.path}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setMobileClubOpen(false);
                            }}
                            className="text-gray-600 hover:text-[#800000] py-1.5 font-medium"
                          >
                            {d.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/tap" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-gray-800 hover:text-[#800000]">
                Training & Placement
              </Link>

              {/* Research */}
              <div>
                <button
                  onClick={() => setMobileResOpen(!mobileResOpen)}
                  className="w-full flex items-center justify-between font-semibold text-gray-800 focus:outline-none"
                >
                  <span>Research</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileResOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileResOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-1 pl-4 mt-3 border-l-2 border-[#800000]/20 text-[13px]">
                        {RESEARCH_LINKS.map((d) => (
                          <Link
                            key={d.path}
                            to={d.path}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setMobileResOpen(false);
                            }}
                            className="text-gray-600 hover:text-[#800000] py-1.5 font-medium"
                          >
                            {d.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-px bg-gray-100 my-1" />
              <div className="grid grid-cols-2 gap-3 text-[12px] text-gray-500">
                <a href="https://lms.itmgoi.in/" target="_blank" rel="noreferrer" className="hover:text-[#800000]">LMS Portal</a>
                <a href="http://mis.itmgoi.in/" target="_blank" rel="noreferrer" className="hover:text-[#800000]">MIS Login</a>
                <a href="#" className="hover:text-[#800000]">Anti-Ragging</a>
                <a href="https://onlineapply.itmgoi.in/form_hdfc.php?ok=Apply+Now" target="_blank" rel="noreferrer" className="hover:text-[#800000]">Online Payment</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
