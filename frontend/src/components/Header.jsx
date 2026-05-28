import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ChevronDown, ArrowUpRight, ShieldCheck, Sun, Moon } from "lucide-react";

const logo = "/images/ITMGOILogo.webp";
const NAACLogo = "/images/NAACLogo.webp";
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

/* Campus Life — internal pages for every cell, plus PAC and full Clubs page */
const CLUB_LINKS = [
  { label: "Performing Arts Club (PAC)", path: "/pac" },
  { label: "Other Clubs & Activities", path: "/clubs" },
  { label: "UBA Cell (Unnat Bharat Abhiyan)", path: "/cells/uba" },
  { label: "NSS Cell", path: "/cells/nss" },
  { label: "Sports Cell", path: "/cells/sports" },
  { label: "Women Empowerment Cell (WEC)", path: "/cells/wec" },
];

/* About — internal pages */
const ABOUT_LINKS = [
  { label: "About Institute", path: "/about" },
  { label: "Mission & Vision", path: "/about/mission-vision" },
  { label: "ITM Officials", path: "/about/officials" },
  { label: "Board of Governors", path: "/about/board-of-governors" },
  { label: "Director's Message", path: "/about/director-message" },
  { label: "Programmes Offered", path: "/about/programmes" },
  { label: "Infrastructure", path: "/about/infrastructure" },
  { label: "Institute Distinctiveness", path: "/about/distinctiveness" },
  { label: "Best Practices", path: "/about/best-practices" },
  { label: "Policies & Reports", path: "/about/policies" },
  { label: "Student Magazine", path: "/about/magazine" },
  { label: "What Gwalior Offers", path: "/about/gwalior" },
];

/* Alumni — internal pages (portal + Facebook stay external) */
const ALUMNI_LINKS = [
  { label: "Alumni Online Portal", href: "https://www.itmalumni.in/", external: true },
  { label: "Mentorship Program", path: "/alumni/mentorship" },
  { label: "Life Membership", path: "/alumni/membership" },
  { label: "Alumni Chapters", path: "/alumni/chapters" },
  { label: "Alumni Speaks", path: "/alumni/speaks" },
  { label: "Discussion Forum", href: "https://www.facebook.com/ITMGOIGWALIOR", external: true },
];

/* More — internal pages, plus 3 genuinely external (grievance form, IEEE, payment) */
const MORE_LINKS = [
  { label: "NAAC Policies", path: "/naac" },
  { label: "IQAC", path: "/iqac" },
  { label: "Committees", path: "/committees" },
  { label: "MOUs & Collaborations", path: "/mous" },
  { label: "Appreciation & Recognition", path: "/appreciation" },
  { label: "NIRF Ranking", path: "/nirf" },
  { label: "Gallery", path: "/gallery" },
  { label: "Anti-Ragging", path: "/anti-ragging" },
  { label: "Online Grievance Form", href: "https://forms.gle/VTEumajnux762Vtv8", external: true },
  { label: "Vacancies / Careers", path: "/careers" },
  { label: "Junior Research Fellow", path: "/jrf" },
  { label: "IEEE Student Branch", href: "https://itmgoi.in/student/IEEE/", external: true },
  { label: "Contact Us", path: "/contact" },
];

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
function DropdownPanel({ open, items, width = "w-64", onItemClick, align = "left" }) {
  let alignmentClass = "left-0";
  if (align === "right") {
    alignmentClass = "right-0";
  } else if (align === "center") {
    alignmentClass = "left-1/2 -translate-x-1/2";
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute top-full mt-3 ${alignmentClass} ${width} bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] border border-black/5 overflow-hidden z-50`}
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
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [alumniOpen, setAlumniOpen] = useState(false);
  const [mobileAlumniOpen, setMobileAlumniOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const deptRef = useRef(null);
  const clubRef = useRef(null);
  const admRef = useRef(null);
  const resRef = useRef(null);
  const aboutRef = useRef(null);
  const alumniRef = useRef(null);
  const moreRef = useRef(null);

  // Theme state — simple light/dark; persisted in localStorage.
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("theme") === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // RAF-driven scroll values — no React re-renders for the progress bar.
  const { scrollY, scrollYProgress } = useScroll();

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
      className="fixed top-0 w-full z-[200] shadow-[0_18px_44px_-18px_rgba(0,0,0,0.65)]"
      style={{ willChange: "background-color" }}
    >

      {/* Top brand accent strip */}
      <div className="h-[3px] w-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 dark:from-[#0a0e1a] dark:via-amber-300 dark:to-[#0a0e1a]" />

      {/* 1. UTILITY BAR — permanent maroon gradient (on-theme, doesn't flip).
            NOTE: no overflow-hidden — the theme dropdown needs to escape below the bar. */}
      <div className="hidden md:block relative text-white bg-gradient-to-r from-[#2a0101] via-[#800000] to-[#2a0101]">
        {/* shimmer overlay for depth (absolute inset-0, contained naturally) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(252,211,77,0.45), transparent 60%), radial-gradient(ellipse 80% 100% at 50% 120%, rgba(0,0,0,0.5), transparent 60%)",
          }}
        />
        {/* subtle dotted texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
            backgroundSize: "14px 14px",
          }}
        />
        {/* top + bottom gold hairlines */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
        <div className="relative w-full px-4 lg:px-8 flex justify-between items-center py-1.5">
          <div className="flex items-center gap-2 text-[11px] font-medium tracking-wide text-white/85">
            <span>Developed By</span>
            <span className="text-white/30">—</span>
            <span className="text-amber-200">INFINITY CLUB</span>
          </div>
          <div className="flex items-center gap-5 text-[11px]">
            <a href="#" className="text-white/80 hover:text-white transition flex items-center gap-1.5">
              <ShieldCheck size={11} strokeWidth={2.4} /> Anti-Ragging
            </a>
            <a href="#" className="text-white/80 hover:text-white transition">NIRF</a>
            <a href="#" className="text-white/80 hover:text-white transition">IQAC</a>
            <a href="#" className="text-white/80 hover:text-white transition">NAAC A+</a>
            <span className="text-white/20">|</span>
            <a
              href="https://lms.itmgoi.in/"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-0.5 rounded-full border border-cyan-300/40 text-cyan-200 hover:bg-cyan-400 hover:text-[#2a0101] hover:border-cyan-400 transition-all font-medium"
            >
              LMS
            </a>
            <a
              href="http://mis.itmgoi.in/"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-0.5 rounded-full border border-amber-300/40 text-amber-200 hover:bg-amber-300 hover:text-[#2a0101] hover:border-amber-300 transition-all font-medium"
            >
              MIS
            </a>
            {/* Light / dark toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
              className="ml-1 flex items-center justify-center w-7 h-7 rounded-full border border-amber-300/40 text-amber-200 hover:bg-amber-300 hover:text-[#2a0101] hover:border-amber-300 transition-all"
            >
              {theme === "dark" ? <Sun size={13} strokeWidth={2.4} /> : <Moon size={13} strokeWidth={2.4} />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION — single row: logos + nav links + CTA.
            NOTE: no overflow-hidden here, otherwise the nav dropdowns get clipped behind the hero. */}
      <div className="relative bg-gradient-to-r from-white via-slate-50 to-white dark:from-[#0a0e1a] dark:via-[#111a2e] dark:to-[#0a0e1a]">
        {/* Mesh-gradient glow accents — dark mode only (light mode stays clean) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-90 transition-opacity duration-500"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 50% 80% at 15% 50%, rgba(252,211,77,0.08), transparent 60%), radial-gradient(ellipse 50% 80% at 85% 50%, rgba(96,165,250,0.10), transparent 60%), radial-gradient(ellipse 70% 100% at 50% 120%, rgba(56,189,248,0.12), transparent 60%)",
          }}
        />
        {/* Subtle dotted texture — dark mode only */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-[0.06] transition-opacity duration-500"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
            backgroundSize: "18px 18px",
          }}
        />
        {/* Top + bottom gold hairlines */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent dark:via-amber-300/70" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent dark:via-amber-300/40" />

        <div
          className={`relative w-full px-4 lg:px-8 flex items-center justify-between transition-[padding] duration-300 ease-out ${
            isScrolled ? "py-2.5" : "py-4"
          }`}
        >
          {/* LOGO GROUP — pinned to the far left edge */}
          <div className="flex items-center gap-4 lg:gap-6 shrink-0 min-w-0 mr-auto">
            <Link to="/" className="group relative cursor-pointer flex items-center shrink-0">
              <img
                src={logo}
                alt="ITM Logo"
                className={`relative block object-contain transition-[height] duration-300 ease-out ${
                  isScrolled ? "h-12 lg:h-14" : "h-14 lg:h-[68px]"
                }`}
              />
            </Link>
            <span
              aria-hidden
              className={`hidden lg:block w-px bg-gradient-to-b from-transparent via-amber-300/50 to-transparent transition-[height] duration-300 ${
                isScrolled ? "h-10" : "h-12"
              }`}
            />
            <div className="flex items-center gap-4 lg:gap-5 shrink-0">
              <motion.img
                whileHover={{ scale: 1.08 }}
                src={YearsLogo}
                alt="30 Years"
                className={`block w-auto object-contain transition-[height] duration-300 ease-out ${
                  isScrolled ? "h-10 lg:h-12" : "h-12 lg:h-[58px]"
                }`}
              />
              <motion.img
                whileHover={{ scale: 1.08 }}
                src={NAACLogo}
                alt="NAAC"
                className={`block w-auto object-contain transition-[height] duration-300 ease-out ${
                  isScrolled ? "h-10 lg:h-12" : "h-12 lg:h-[58px]"
                }`}
              />
              <motion.img
                whileHover={{ scale: 1.08 }}
                src={NBALogo}
                alt="NBA Accredited"
                style={{ mixBlendMode: "multiply" }}
                className={`block w-auto object-contain transition-[height] duration-300 ease-out bg-transparent ${
                  isScrolled ? "h-10 lg:h-12" : "h-12 lg:h-[58px]"
                }`}
              />
            </div>
          </div>

          {/* DESKTOP LINKS — pinned to the far right edge */}
          <nav className="hidden xl:flex items-center gap-2 ml-auto" onMouseLeave={() => setHoveredItem(null)}>
            <div className="flex items-center gap-0.5 text-[13px] font-semibold rounded-full px-1.5 py-1 text-slate-800 bg-slate-100/80 border border-slate-200 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] dark:text-white dark:bg-white/5 dark:border-white/10 dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.6)]">
            {/* simple links */}
            {[
              { label: "Home", path: "/" },
              { label: "Placement", path: "/tap" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onMouseEnter={() => setHoveredItem(item.label)}
                className="relative px-3 py-2 hover:text-[#800000] transition-colors"
              >
                {hoveredItem === item.label && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 border border-amber-300/70 shadow-[0_4px_14px_-2px_rgba(180,120,0,0.45)] -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </Link>
            ))}

            {/* About */}
            <div
              className="relative"
              ref={aboutRef}
              onMouseEnter={() => { setAboutOpen(true); setHoveredItem("About"); }}
              onMouseLeave={() => setAboutOpen(false)}
            >
              <button className="relative flex items-center gap-1 px-3 py-2 hover:text-[#800000] transition-colors">
                {hoveredItem === "About" && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 border border-amber-300/70 shadow-[0_4px_14px_-2px_rgba(180,120,0,0.45)] -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                About
                <ChevronDown size={12} strokeWidth={2.5} className={`transition-transform duration-200 ${aboutOpen ? "rotate-180" : ""}`} />
              </button>
              <DropdownPanel open={aboutOpen} items={ABOUT_LINKS} width="w-72" onItemClick={() => setAboutOpen(false)} />
            </div>

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
              <Link to="/admissions" className="relative flex items-center gap-1 px-3 py-2 hover:text-[#800000] transition-colors">
                {hoveredItem === "Admission" && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 border border-amber-300/70 shadow-[0_4px_14px_-2px_rgba(180,120,0,0.45)] -z-10"
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
              <button className="relative flex items-center gap-1 px-3 py-2 hover:text-[#800000] transition-colors">
                {hoveredItem === "Departments" && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 border border-amber-300/70 shadow-[0_4px_14px_-2px_rgba(180,120,0,0.45)] -z-10"
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
              <Link to="/research" className="relative flex items-center gap-1 px-3 py-2 hover:text-[#800000] transition-colors">
                {hoveredItem === "Research" && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 border border-amber-300/70 shadow-[0_4px_14px_-2px_rgba(180,120,0,0.45)] -z-10"
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
              <button className="relative flex items-center gap-1 px-3 py-2 hover:text-[#800000] transition-colors">
                {hoveredItem === "Clubs" && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 border border-amber-300/70 shadow-[0_4px_14px_-2px_rgba(180,120,0,0.45)] -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                Clubs
                <ChevronDown size={12} strokeWidth={2.5} className={`transition-transform duration-200 ${clubOpen ? "rotate-180" : ""}`} />
              </button>
              <DropdownPanel open={clubOpen} items={CLUB_LINKS} width="w-72" onItemClick={() => setClubOpen(false)} />
            </div>

            {/* Alumni */}
            <div
              className="relative"
              ref={alumniRef}
              onMouseEnter={() => { setAlumniOpen(true); setHoveredItem("Alumni"); }}
              onMouseLeave={() => setAlumniOpen(false)}
            >
              <button className="relative flex items-center gap-1 px-3 py-2 hover:text-[#800000] transition-colors">
                {hoveredItem === "Alumni" && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 border border-amber-300/70 shadow-[0_4px_14px_-2px_rgba(180,120,0,0.45)] -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                Alumni
                <ChevronDown size={12} strokeWidth={2.5} className={`transition-transform duration-200 ${alumniOpen ? "rotate-180" : ""}`} />
              </button>
              <DropdownPanel open={alumniOpen} items={ALUMNI_LINKS} width="w-72" onItemClick={() => setAlumniOpen(false)} align="right" />
            </div>

            {/* More — NAAC / Gallery / Compliance / Careers / Contact */}
            <div
              className="relative"
              ref={moreRef}
              onMouseEnter={() => { setMoreOpen(true); setHoveredItem("More"); }}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button className="relative flex items-center gap-1 px-3 py-2 hover:text-[#800000] transition-colors">
                {hoveredItem === "More" && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 border border-amber-300/70 shadow-[0_4px_14px_-2px_rgba(180,120,0,0.45)] -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                More
                <ChevronDown size={12} strokeWidth={2.5} className={`transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`} />
              </button>
              <DropdownPanel open={moreOpen} items={MORE_LINKS} width="w-72" onItemClick={() => setMoreOpen(false)} align="right" />
            </div>
            </div>

            {/* CTA — clean white pill */}
            <Link
              to="/admissions/how-to-apply"
              className="group relative ml-3 inline-flex items-center gap-2 rounded-full bg-white dark:bg-[#0a0e1a] text-[#800000] dark:text-amber-200 pl-5 pr-4 py-2.5 text-[12.5px] font-bold tracking-wide ring-1 ring-white/60 dark:ring-amber-300/50 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.55)] hover:bg-amber-50 hover:ring-amber-200 dark:hover:bg-amber-300 dark:hover:text-[#0a0e1a] transition-colors"
            >
              <span>Apply Now</span>
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-blue-700 text-white group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight size={13} strokeWidth={2.6} />
              </span>
            </Link>
          </nav>

          {/* MOBILE CONTROLS — pinned to the far right edge */}
          <div className="xl:hidden flex items-center gap-3 ml-auto">
            {/* Light / dark toggle — mobile */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-slate-300 dark:border-white/30 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/15 transition-colors"
            >
              {theme === "dark" ? <Sun size={16} strokeWidth={2.4} /> : <Moon size={16} strokeWidth={2.4} />}
            </button>
            <Link
              to="/admissions/how-to-apply"
              className="px-4 py-2 rounded-full text-[11px] font-bold ring-1 shadow-md bg-[#800000] text-white ring-[#800000]/30 dark:bg-white dark:text-[#800000] dark:ring-white/60"
            >
              Apply
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 dark:text-white dark:hover:bg-white/15"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
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

              {/* About */}
              <div>
                <button
                  onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                  className="w-full flex items-center justify-between font-semibold text-gray-800 focus:outline-none"
                >
                  <span>About</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileAboutOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileAboutOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="flex flex-col gap-1 pl-4 mt-3 border-l-2 border-[#800000]/20 text-[13px]">
                        {ABOUT_LINKS.map((a) => a.external ? (
                          <a key={a.label} href={a.href} target="_blank" rel="noreferrer"
                            onClick={() => { setMobileMenuOpen(false); setMobileAboutOpen(false); }}
                            className="text-gray-600 hover:text-[#800000] py-1.5 font-medium">
                            {a.label} ↗
                          </a>
                        ) : (
                          <Link key={a.label} to={a.path}
                            onClick={() => { setMobileMenuOpen(false); setMobileAboutOpen(false); }}
                            className="text-gray-600 hover:text-[#800000] py-1.5 font-medium">
                            {a.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Alumni */}
              <div>
                <button
                  onClick={() => setMobileAlumniOpen(!mobileAlumniOpen)}
                  className="w-full flex items-center justify-between font-semibold text-gray-800 focus:outline-none"
                >
                  <span>Alumni</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileAlumniOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileAlumniOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="flex flex-col gap-1 pl-4 mt-3 border-l-2 border-[#800000]/20 text-[13px]">
                        {ALUMNI_LINKS.map((a) => a.external ? (
                          <a key={a.label} href={a.href} target="_blank" rel="noreferrer"
                            onClick={() => { setMobileMenuOpen(false); setMobileAlumniOpen(false); }}
                            className="text-gray-600 hover:text-[#800000] py-1.5 font-medium">
                            {a.label} ↗
                          </a>
                        ) : (
                          <Link key={a.label} to={a.path}
                            onClick={() => { setMobileMenuOpen(false); setMobileAlumniOpen(false); }}
                            className="text-gray-600 hover:text-[#800000] py-1.5 font-medium">
                            {a.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* More */}
              <div>
                <button
                  onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
                  className="w-full flex items-center justify-between font-semibold text-gray-800 focus:outline-none"
                >
                  <span>More — NAAC / Gallery / Contact</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileMoreOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileMoreOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="flex flex-col gap-1 pl-4 mt-3 border-l-2 border-[#800000]/20 text-[13px]">
                        {MORE_LINKS.map((a) => a.external ? (
                          <a key={a.label} href={a.href} target="_blank" rel="noreferrer"
                            onClick={() => { setMobileMenuOpen(false); setMobileMoreOpen(false); }}
                            className="text-gray-600 hover:text-[#800000] py-1.5 font-medium">
                            {a.label} ↗
                          </a>
                        ) : (
                          <Link key={a.label} to={a.path}
                            onClick={() => { setMobileMenuOpen(false); setMobileMoreOpen(false); }}
                            className="text-gray-600 hover:text-[#800000] py-1.5 font-medium">
                            {a.label}
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
                <a href="https://www.itmgoi.in/anti_ragging.php" target="_blank" rel="noreferrer" className="hover:text-[#800000]">Anti-Ragging</a>
                <a href="https://onlineapply.itmgoi.in/form_hdfc.php?ok=Apply+Now" target="_blank" rel="noreferrer" className="hover:text-[#800000]">Online Payment</a>
                <a href="https://www.itmgoi.in/nirf_itm.php" target="_blank" rel="noreferrer" className="hover:text-[#800000]">NIRF</a>
                <a href="https://www.itmgoi.in/itm_iqac.php" target="_blank" rel="noreferrer" className="hover:text-[#800000]">IQAC</a>
                <a href="https://www.itmgoi.in/jobs/" target="_blank" rel="noreferrer" className="hover:text-[#800000]">Careers</a>
                <a href="https://www.itmgoi.in/contact_more.php" target="_blank" rel="noreferrer" className="hover:text-[#800000]">Contact</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
