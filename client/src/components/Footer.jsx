import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";
import { Mail, Phone, MapPin, ArrowUpRight, Send } from "lucide-react";

const logo = "/images/ITMGOILogo.png";

const SECTIONS = [
  {
    title: "About",
    links: [
      { label: "About Institute",    to: "/about" },
      { label: "Mission & Vision",   to: "/about/mission-vision" },
      { label: "Director's Message", to: "/about/director-message" },
      { label: "Board of Governors", to: "/about/board-of-governors" },
      { label: "Infrastructure",     to: "/about/infrastructure" },
      { label: "Best Practices",     to: "/about/best-practices" },
    ],
  },
  {
    title: "Admissions",
    links: [
      { label: "Overview",          to: "/admissions" },
      { label: "UG Courses",        to: "/admissions/ug" },
      { label: "PG Courses",        to: "/admissions/pg" },
      { label: "How to Apply",      to: "/admissions/how-to-apply" },
      { label: "Online Apply",      href: "http://itmgoi.in/OnlineApply_ITMGOI", external: true },
      { label: "Online Pay",        href: "https://onlineapply.itmgoi.in/form_hdfc.php?ok=Apply+Now", external: true },
    ],
  },
  {
    title: "Departments",
    links: [
      { label: "Computer Science",  to: "/cs" },
      { label: "Information Tech",  to: "/it" },
      { label: "Electronics & Comm.", to: "/ece" },
      { label: "Mechanical Eng.",   to: "/me" },
      { label: "Civil Engineering", to: "/ce" },
      { label: "MBA · Management",  to: "/mba" },
      { label: "Engg. Sci. & Hum.", to: "/esh" },
      { label: "Emerging Branches", to: "/emerging-branches" },
      { label: "Central Library",   to: "/library" },
    ],
  },
  {
    title: "Campus Life",
    links: [
      { label: "Training & Placement", to: "/tap" },
      { label: "Performing Arts Club", to: "/pac" },
      { label: "Other Clubs",          to: "/clubs" },
      { label: "UBA Cell",              to: "/cells/uba" },
      { label: "NSS Cell",              to: "/cells/nss" },
      { label: "Sports Cell",           to: "/cells/sports" },
      { label: "Women Empowerment",    to: "/cells/wec" },
    ],
  },
  {
    title: "Alumni & Research",
    links: [
      { label: "Alumni Portal",          href: "https://www.itmalumni.in/", external: true },
      { label: "Alumni Speaks",          to: "/alumni/speaks" },
      { label: "Mentorship",              to: "/alumni/mentorship" },
      { label: "Chapters",                to: "/alumni/chapters" },
      { label: "R&D Cell",                to: "/research/rd-cell" },
      { label: "International Journal",  href: "https://iijisem.com", external: true },
      { label: "FDP",                    to: "/research/fdp" },
      { label: "JRF",                    to: "/jrf" },
    ],
  },
  {
    title: "Compliance",
    links: [
      { label: "NAAC Policies",  to: "/naac" },
      { label: "IQAC",            to: "/iqac" },
      { label: "Committees",     to: "/committees" },
      { label: "NIRF Ranking",   to: "/nirf" },
      { label: "Anti-Ragging",   to: "/anti-ragging" },
      { label: "MOUs",            to: "/mous" },
      { label: "Appreciation",   to: "/appreciation" },
      { label: "Grievance Form", href: "https://forms.gle/VTEumajnux762Vtv8", external: true },
      { label: "Careers",        to: "/careers" },
      { label: "Gallery",         to: "/gallery" },
      { label: "Contact",         to: "/contact" },
    ],
  },
];

const SOCIALS = [
  { Icon: FaInstagram, url: "https://www.instagram.com/itm_gwalior/", label: "Instagram" },
  { Icon: FaLinkedinIn, url: "https://in.linkedin.com/school/itm-gwalior-cp/", label: "LinkedIn" },
  { Icon: FaFacebookF, url: "https://www.facebook.com/itmgoigwl/", label: "Facebook" },
  { Icon: FaTwitter, url: "https://x.com/itm_gwalior", label: "Twitter" },
  { Icon: FaYoutube, url: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#0a0a14] text-white pt-20 pb-10 px-4 sm:px-6 overflow-hidden">

      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-[30vw] h-[30vw] bg-[#800000]/20 blur-2xl rounded-full pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto">

        {/* Newsletter strip */}
        <div className="mb-16 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl md:text-2xl font-black tracking-tight mb-1">Stay in the loop.</h3>
            <p className="text-sm text-gray-400 font-medium">Admission dates, deadlines and ITM stories — straight to your inbox.</p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full md:w-auto gap-2 bg-white/5 border border-white/10 rounded-full p-1.5 backdrop-blur"
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 md:w-72 bg-transparent px-4 py-2 text-sm font-medium outline-none placeholder-gray-500"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-[#800000] to-[#5a0000] text-white px-5 py-2 rounded-full font-black text-[10px] tracking-widest uppercase hover:scale-[1.02] transition-transform"
            >
              <Send size={12} /> Subscribe
            </button>
          </form>
        </div>

        {/* Top row — brand + contact strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-8 space-y-6">
            <img src={logo} alt="ITM Logo" className="h-14 w-auto brightness-200 drop-shadow-xl" />
            <p className="text-sm text-gray-400 leading-relaxed font-medium max-w-sm">
              <span className="text-amber-300 font-black">Think Big. Think Beyond.</span> 30 years of
              shaping leaders, engineers and entrepreneurs in central India.
            </p>

            {/* Accreditation badges */}
            <div className="flex flex-wrap gap-2">
              {["NAAC A+", "NBA", "AICTE", "RGPV"].map((b) => (
                <span
                  key={b}
                  className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-amber-300"
                >
                  {b}
                </span>
              ))}
            </div>

            {/* Socials */}
            <div className="flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#800000] flex items-center justify-center text-gray-400 hover:text-white transition-all border border-white/10"
                >
                  <s.Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Contact column */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-amber-300 font-black uppercase tracking-[0.25em] text-[10px]">Reach Us</h4>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <a href="tel:+917773005065" className="flex items-start gap-2.5 text-gray-300 hover:text-white">
                <Phone size={14} className="mt-1 text-amber-300 shrink-0" />
                <span className="font-medium leading-relaxed">
                  <span className="block text-[9px] uppercase tracking-widest text-gray-500 mb-0.5">Admissions</span>
                  +91-77730 05065<br />+91-77730 01624
                </span>
              </a>
              <a href="tel:+917512440056" className="flex items-start gap-2.5 text-gray-300 hover:text-white">
                <Phone size={14} className="mt-1 text-amber-300 shrink-0" />
                <span className="font-medium leading-relaxed">
                  <span className="block text-[9px] uppercase tracking-widest text-gray-500 mb-0.5">General</span>
                  +91-751-2440056<br />+91-751-2432977
                </span>
              </a>
              <a href="mailto:admission@itmgoi.in" className="sm:col-span-2 flex items-start gap-2.5 text-gray-300 hover:text-white">
                <Mail size={14} className="mt-1 text-amber-300 shrink-0" />
                <span className="font-medium break-all">admission@itmgoi.in</span>
              </a>
              <div className="sm:col-span-2 flex items-start gap-2.5 text-gray-300">
                <MapPin size={14} className="mt-1 text-amber-300 shrink-0" />
                <span className="text-xs font-medium leading-relaxed">
                  ITM Campus, Opp. Sithouli Railway Station,<br />
                  NH-75 Sithouli, Jhansi Road, Gwalior – 475001, M.P.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Link sections grid — 6 columns of pages */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-16 pb-12 border-b border-white/10">
          {SECTIONS.map((sec) => (
            <div key={sec.title}>
              <h4 className="text-amber-300 font-black uppercase tracking-[0.22em] text-[10px] mb-5">
                {sec.title}
              </h4>
              <ul className="space-y-2.5">
                {sec.links.map((l) =>
                  l.to ? (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="group inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-[13px] font-medium transition-colors"
                      >
                        {l.label}
                        <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ) : (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        target={l.external ? "_blank" : undefined}
                        rel={l.external ? "noreferrer" : undefined}
                        className="group inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-[13px] font-medium transition-colors"
                      >
                        {l.label}
                        {l.external && <ArrowUpRight size={10} className="opacity-50" />}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-500">
            © 2026 ITM Gwalior · Independent Excellence
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
            <a href="#" className="hover:text-amber-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-300 transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-amber-300 transition-colors">Sitemap</a>
            <Link to="/anti-ragging" className="hover:text-amber-300 transition-colors">Anti-Ragging</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
