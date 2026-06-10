import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { usePublicEvents, usePublicGallery } from "../hooks/usePublicEvents";
import {
  HeartHandshake, Leaf, Trophy, Users2, ShieldCheck, Scale,
  Calendar, MapPin, ArrowUpRight, GraduationCap, Briefcase,
  Award, FileText, Megaphone, Image as ImageIcon, Video,
  Building2, Camera, Sparkles, Phone, Mail, ExternalLink,
} from "lucide-react";
import LazyImage from "./LazyImage";

/* ============================================================
   CELLS — student cells & committees from the old itmgoi.in
   ============================================================ */
const CELLS = [
  { Icon: HeartHandshake, title: "Women Empowerment Cell",  short: "WEC",    body: "Centre of Excellence (2025) in partnership with Honeywell & ICT Academy. Workshops, mentorship and a safe-campus charter.", accent: "from-rose-500 to-pink-700",      to: "/cells/wec" },
  { Icon: Leaf,           title: "Unnat Bharat Abhiyan",     short: "UBA",    body: "Government of India's flagship rural-development cell — five adopted villages, awareness drives and sustainability projects.",  accent: "from-emerald-500 to-teal-700",   to: "/cells/uba" },
  { Icon: Users2,         title: "National Service Scheme", short: "NSS",    body: "Volunteer service, blood drives, plantation campaigns and community outreach — 200 volunteers per session.",                       accent: "from-indigo-500 to-violet-700",  to: "/cells/nss" },
  { Icon: Trophy,         title: "Sports Cell",               short: "Sports", body: "12 sports, a multipurpose ground, indoor gym and inter-college tournaments. RGPV Nodal-level events hosted here.",                accent: "from-amber-500 to-orange-700",  to: "/cells/sports" },
  { Icon: ShieldCheck,    title: "Anti-Ragging Cell",          short: "ARC",    body: "UGC-compliant policy, 28-member committee, helpline numbers and an online grievance form. Zero tolerance, full transparency.",   accent: "from-slate-600 to-slate-900",   to: "/anti-ragging" },
  { Icon: Scale,          title: "IQAC",                       short: "IQAC",   body: "Internal Quality Assurance Cell — drives NAAC compliance, audits programmes and publishes the annual quality report.",          accent: "from-sky-500 to-blue-700",       to: "/iqac" },
];

export function CellsAndCommittees() {
  return (
    <section className="relative py-10 sm:py-20 md:py-28 bg-[#fbf7f2] dark:bg-[#020617] overflow-hidden">
      <div className="absolute top-20 left-0 w-[28vw] h-[28vw] rounded-full bg-gradient-to-tr from-amber-200/40 to-transparent blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000] dark:text-rose-300">
              Cells &amp; Committees
            </span>
            <div className="w-8 h-1 bg-gradient-to-r from-amber-500 to-[#800000] rounded-full" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white leading-[1.05] mb-4">
            Built on{" "}
            <span className="bg-gradient-to-br from-[#800000] to-[#3e0202] dark:from-rose-400 dark:to-amber-200 bg-clip-text text-transparent">
              service, sport &amp; quality.
            </span>
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
            Six active cells run independently of the academic calendar — covering everything from
            rural outreach to women's empowerment, sport and quality assurance.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 auto-rows-fr">
          {CELLS.map((c, i) => (
            <motion.div
              key={c.short}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="auto-rows-fr"
            >
            <Link
              to={c.to}
              className="group relative h-full flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-rose-50 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-shadow p-3 sm:p-6"
            >
              <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${c.accent} opacity-0 group-hover:opacity-25 blur-2xl transition-opacity duration-500`} />
              <div className="relative flex flex-col h-full">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${c.accent} flex items-center justify-center text-white shadow-md mb-3 sm:mb-5`}>
                  <c.Icon size={22} strokeWidth={2.1} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm sm:text-lg font-black tracking-tight text-[#1a0606] dark:text-white leading-tight">
                    {c.title}
                  </h3>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#800000] bg-rose-50 dark:bg-gray-800 px-2 py-0.5 rounded">
                    {c.short}
                  </span>
                </div>
                <p className="text-[11px] sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium line-clamp-2 sm:line-clamp-none">
                  {c.body}
                </p>
                <div className="mt-auto pt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#800000] group-hover:gap-3 transition-all">
                  <span className="w-6 h-px bg-[#800000]" />
                  Learn more
                  <ArrowUpRight size={12} />
                </div>
              </div>
            </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   UPCOMING EVENTS — pulled from the old homepage
   ============================================================ */
const EVENTS = [
  {
    badge: "Cultural Festival",
    title: "DiversITM 2.0",
    when: "Coming Soon",
    body: "Our flagship inter-college cultural festival — music, dance, performing arts and a campus turned into one giant stage.",
    accent: "from-rose-500 to-[#800000]",
    href: "https://www.itmgoi.in/",
  },
  {
    badge: "Faculty Development",
    title: "FDP — June 2026",
    when: "June 2026",
    body: "Annual Faculty Development Program for educators across India. Pedagogy, research methodology and emerging tech tracks.",
    accent: "from-emerald-500 to-teal-700",
    href: "https://www.itmgoi.in/itm_fdp.php",
  },
  {
    badge: "Research",
    title: "ITM International Conference 2026",
    when: "Save the date",
    body: "Peer-reviewed research conference — bringing together academics, industry and PhD scholars on engineering and management.",
    accent: "from-sky-500 to-blue-700",
    href: "https://www.itmgoi.in/itm_conf.php",
  },
];

export function UpcomingEvents() {
  const { data } = usePublicEvents({ status: "upcoming", limit: 6 });
  const liveEvents = (data || []).slice(0, 6).map((e) => ({
    badge: e.type || "Event",
    title: e.title,
    when: e.event_date || "TBA",
    body: e.description || e.location || "",
    accent: "from-rose-500 to-[#800000]",
    href: e.registration_url || "#events",
  }));
  const items = liveEvents.length ? liveEvents : EVENTS;
  return (
    <section className="relative py-10 sm:py-20 md:py-28 bg-white dark:bg-[#0a0a14] overflow-hidden">
      <div className="absolute top-0 right-0 w-[35vw] h-[35vw] bg-gradient-to-bl from-rose-100/60 to-transparent blur-2xl rounded-full pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000] dark:text-rose-300">
                What's next on campus
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white leading-[1.05]">
              Upcoming{" "}
              <span className="bg-gradient-to-br from-[#800000] to-[#3e0202] dark:from-rose-400 dark:to-amber-200 bg-clip-text text-transparent">
                events &amp; conferences.
              </span>
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-md">
            From DiversITM's festival energy to peer-reviewed research conferences — three signature
            events anchor the ITM calendar every year.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 auto-rows-fr">
          {items.map((e, i) => (
            <motion.a
              key={e.title}
              href={e.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="group relative h-full flex flex-col overflow-hidden rounded-3xl border border-rose-50 dark:border-gray-800 bg-gradient-to-br from-white to-rose-50/40 dark:from-gray-900 dark:to-gray-900 shadow-sm hover:shadow-2xl transition-shadow"
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${e.accent}`} />
              <div className="relative flex flex-col flex-1 p-3 sm:p-7">
                <div className="flex items-center justify-between mb-3 sm:mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-gray-800 text-[#800000] dark:text-rose-300 rounded-full text-[9px] font-black uppercase tracking-widest">
                    <Calendar size={10} /> {e.badge}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-700 dark:text-amber-400">{e.when}</span>
                </div>
                <h3 className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-[#1a0606] dark:text-white leading-tight mb-2 sm:mb-3">
                  {e.title}
                </h3>
                <p className="text-[11px] sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium line-clamp-2 sm:line-clamp-none">{e.body}</p>
                <div className="mt-auto pt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#800000] group-hover:gap-3 transition-all">
                  <span className="w-6 h-px bg-[#800000]" />
                  Event details
                  <ArrowUpRight size={12} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   QUICK LINKS — compliance, careers, important documents
   ============================================================ */
const QUICK_LINKS = [
  { Icon: Award,        label: "NIRF Ranking",             to: "/nirf" },
  { Icon: Scale,        label: "IQAC",                      to: "/iqac" },
  { Icon: ShieldCheck,  label: "Anti-Ragging",              to: "/anti-ragging" },
  { Icon: Megaphone,    label: "Grievance Form",            href: "https://forms.gle/VTEumajnux762Vtv8" },
  { Icon: Briefcase,    label: "Careers / Vacancies",      to: "/careers" },
  { Icon: GraduationCap, label: "Junior Research Fellow",   to: "/jrf" },
  { Icon: FileText,     label: "NAAC Policies",             to: "/naac" },
  { Icon: HeartHandshake, label: "MOUs & Collaborations",   to: "/mous" },
  { Icon: Sparkles,     label: "Appreciation",              to: "/appreciation" },
  { Icon: Users2,       label: "Committees",                to: "/committees" },
  { Icon: ImageIcon,    label: "Gallery",                   to: "/gallery" },
  { Icon: ExternalLink, label: "Online Pay",                href: "https://onlineapply.itmgoi.in/form_hdfc.php?ok=Apply+Now" },
];

export function QuickLinks() {
  return (
    <section className="relative py-10 sm:py-20 md:py-24 bg-[#1a0606] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
        backgroundSize: "32px 32px",
      }} />
      <div className="absolute -top-24 -right-24 w-[36vw] h-[36vw] bg-gradient-to-br from-[#800000]/40 to-transparent blur-3xl rounded-full pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-5">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-300">
              Important Links
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05] mb-4">
            Everything you might{" "}
            <span className="bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent">
              need in one place.
            </span>
          </h2>
          <p className="text-sm text-rose-100/70 font-medium leading-relaxed">
            Rankings, policies, grievance redressal, careers, and every compliance document — all
            one click away.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {QUICK_LINKS.map((l, i) => {
            const inner = (
              <>
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#800000] to-[#3e0202] text-amber-200 ring-1 ring-amber-300/30 shadow-md shrink-0">
                  <l.Icon size={18} strokeWidth={2.1} />
                </div>
                <span className="flex-1 text-xs sm:text-sm font-bold leading-tight text-white/90 group-hover:text-white">
                  {l.label}
                </span>
                <ArrowUpRight size={14} className="text-white/40 group-hover:text-amber-300 transition-colors" />
              </>
            );
            const cls = "group relative flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-300/40 backdrop-blur transition-colors";
            return (
              <motion.div key={l.label}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.03, duration: 0.4 }} whileHover={{ y: -3 }}
              >
                {l.to ? (
                  <Link to={l.to} className={cls}>{inner}</Link>
                ) : (
                  <a href={l.href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ALUMNI — portal, mentorship, chapters
   ============================================================ */
const ALUMNI_TILES = [
  { Icon: Users2,         label: "Alumni Portal",     href: "https://www.itmalumni.in/" },
  { Icon: HeartHandshake, label: "Mentorship Program", to: "/alumni/mentorship" },
  { Icon: Award,          label: "Life Membership",    to: "/alumni/membership" },
  { Icon: MapPin,         label: "Alumni Chapters",    to: "/alumni/chapters" },
  { Icon: Megaphone,      label: "Alumni Speaks",      to: "/alumni/speaks" },
];

export function AlumniSection() {
  return (
    <section className="relative py-10 sm:py-20 md:py-28 bg-gradient-to-br from-[#fbf7f2] via-white to-rose-50/40 dark:from-[#020617] dark:via-[#020617] dark:to-[#0a0a14] overflow-hidden">
      <div className="absolute top-10 left-10 w-[26vw] h-[26vw] bg-gradient-to-br from-amber-100/60 to-transparent blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 items-center">
        {/* Left: copy + CTAs */}
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000] dark:text-rose-300">
              Alumni Network
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white leading-[1.05] mb-5">
            Once an ITMian,{" "}
            <span className="bg-gradient-to-br from-[#800000] to-[#3e0202] dark:from-rose-400 dark:to-amber-200 bg-clip-text text-transparent">
              always an ITMian.
            </span>
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-7">
            Three decades of graduates working at Microsoft, TCS, Infosys, Capgemini and across
            India's startup scene. Our alumni run mentorship, fund scholarships and host meets
            across India and abroad.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.itmalumni.in/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#800000] hover:bg-[#5c0202] text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl font-black text-[11px] tracking-widest uppercase transition-colors shadow-lg shadow-[#800000]/30"
            >
              Visit Alumni Portal <ArrowUpRight size={13} />
            </a>
            <Link
              to="/alumni/speaks"
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 text-[#800000] dark:text-amber-300 border border-[#800000]/20 dark:border-amber-300/30 hover:bg-rose-50 dark:hover:bg-gray-800 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl font-black text-[11px] tracking-widest uppercase transition-colors"
            >
              Alumni Speaks <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-6 border-t border-rose-100 dark:border-gray-800 pt-6 max-w-md">
            {[
              { num: "30K+",  label: "Alumni" },
              { num: "3",      label: "Chapters" },
              { num: "300+",  label: "Recruiters" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#800000] to-amber-600 dark:from-rose-400 dark:to-amber-200 leading-none">{s.num}</div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: tile grid */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ALUMNI_TILES.map((t, i) => {
            const inner = (
              <>
                <div className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#800000] to-[#3e0202] text-amber-200 ring-1 ring-amber-300/30 shadow-md">
                  <t.Icon size={20} strokeWidth={2.1} />
                </div>
                <span className="text-xs sm:text-sm font-black text-[#1a0606] dark:text-white leading-tight">{t.label}</span>
                <ArrowUpRight size={14} className="absolute top-4 right-4 text-gray-300 group-hover:text-[#800000] dark:group-hover:text-amber-300 transition-colors" />
              </>
            );
            const cls = "group relative flex flex-col gap-2 sm:gap-3 p-3 sm:p-5 rounded-2xl bg-white dark:bg-gray-900 border border-rose-50 dark:border-gray-800 shadow-sm hover:shadow-xl transition-shadow";
            return (
              <motion.div key={t.label}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.05, duration: 0.45 }} whileHover={{ y: -4 }}
              >
                {t.to ? (<Link to={t.to} className={cls}>{inner}</Link>) : (<a href={t.href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>)}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   GALLERY PREVIEW — 7 categories from the old site
   ============================================================ */
const GALLERY = [
  { Icon: Sparkles,      label: "Cultural Events", to: "/gallery/cultural",       tint: "from-rose-500 to-pink-700",       image: "cultural.jpg" },
  { Icon: GraduationCap, label: "Experts Visits",  to: "/gallery/experts",        tint: "from-amber-500 to-orange-700",    image: "experts.jpg" },
  { Icon: Building2,    label: "Infrastructure",  to: "/gallery/infrastructure", tint: "from-sky-500 to-blue-700",       image: "infrastructure.jpg" },
  { Icon: Trophy,       label: "Sports",          to: "/gallery/sports",         tint: "from-emerald-500 to-teal-700",    image: "sports.jpg" },
  { Icon: Users2,       label: "Student Photos",  to: "/gallery/students",       tint: "from-indigo-500 to-violet-700",    image: "students.jpg" },
  { Icon: ImageIcon,    label: "Life @ ITM",      to: "/gallery/life",           tint: "from-fuchsia-500 to-purple-700",  image: "life.jpg" },
  { Icon: Video,         label: "Video Gallery",   to: "/gallery/videos",         tint: "from-yellow-500 to-amber-700",    image: "videos.jpg" },
];

export function GalleryPreview() {
  const { data } = usePublicGallery();
  const iconMap = {
    cultural: Sparkles, experts: GraduationCap, infrastructure: Building2,
    sports: Trophy, students: Users2, life: ImageIcon, videos: Video,
  };
  const liveItems = (data || []).map((g) => ({
    Icon: iconMap[g.slug] || ImageIcon,
    label: g.label,
    to: `/gallery/${g.slug}`,
    tint: `bg-gradient-to-br ${g.accent || 'from-rose-500 to-pink-700'}`,
    cover: g.cover,
  }));
  const items = liveItems.length ? liveItems : GALLERY.map((g) => ({ ...g, tint: g.tint, cover: null }));
  return (
    <section className="relative py-10 sm:py-20 md:py-28 bg-white dark:bg-[#020617] overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000] dark:text-rose-300">
                Campus Through the Lens
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white leading-[1.05]">
              The{" "}
              <span className="bg-gradient-to-br from-[#800000] to-[#3e0202] dark:from-rose-400 dark:to-amber-200 bg-clip-text text-transparent">
                ITM gallery.
              </span>
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-md">
            Cultural festivals, expert visits, infrastructure, sport, student life — every part of
            campus captured and archived across seven curated collections.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.map((g, i) => (
            <motion.div key={g.label}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.05, duration: 0.45 }} whileHover={{ y: -5 }}
            >
            <Link
              to={g.to}
              className={`group relative aspect-square rounded-3xl overflow-hidden ${g.tint?.startsWith('bg-') ? g.tint : `bg-gradient-to-br ${g.tint}`} shadow-lg hover:shadow-2xl transition-shadow flex`}
            >
              {/* Premium image backdrop with hover scale and opacity blend */}
              {g.cover ? (
                <img src={g.cover} alt={g.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                g.image && (
                  <LazyImage
                    src={`/images/gallery/${g.image}`}
                    alt={g.label}
                    className="transition-transform duration-700 group-hover:scale-110"
                    objectFit="cover"
                    objectPosition="center"
                  />
                )
              )}
              <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-black/50 to-black/80" />
              <div className="absolute inset-0 opacity-10 z-10" style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
                backgroundSize: "18px 18px",
              }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-95 group-hover:opacity-100 transition-opacity z-10" />
              <div className="relative h-full w-full flex flex-col justify-between p-3 sm:p-5 text-white z-20">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-white/20 backdrop-blur ring-1 ring-white/30 flex items-center justify-center">
                  <g.Icon size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.25em] text-white/70 mb-1">Gallery</div>
                  <div className="text-sm sm:text-base md:text-lg font-black tracking-tight leading-tight">{g.label}</div>
                </div>
              </div>
              <ArrowUpRight size={14} className="absolute top-5 right-5 text-white/70 group-hover:text-white transition-colors z-20" />
            </Link>
            </motion.div>
          ))}

          {/* "View all" tile */}
          <Link
            to="/gallery"
            className="group relative aspect-square rounded-3xl bg-[#1a0606] dark:bg-gray-900 border border-[#800000]/30 dark:border-gray-800 flex flex-col items-center justify-center text-center p-3 sm:p-5 hover:bg-[#3e0202] transition-colors"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-amber-300/20 ring-1 ring-amber-300/40 text-amber-300 flex items-center justify-center mb-2 sm:mb-3">
              <Camera size={20} strokeWidth={2.2} />
            </div>
            <div className="text-white text-xs sm:text-sm font-black tracking-tight leading-tight mb-1">
              See the full archive
            </div>
            <div className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-300/80">
              All Galleries →
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CONTACT — address, phones, email, official portals
   ============================================================ */
export function ContactSection() {
  return (
    <section className="relative py-10 sm:py-20 md:py-28 bg-gradient-to-br from-[#1a0606] via-[#2a0101] to-[#1a0606] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
        backgroundSize: "32px 32px",
      }} />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10">
        {/* Left: heading */}
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-5">
            <Phone size={11} className="text-amber-300" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-300">Get in touch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05] mb-5">
            Visit us.{" "}
            <span className="bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent">
              Call us. Write to us.
            </span>
          </h2>
          <p className="text-sm md:text-base text-rose-100/70 font-medium leading-relaxed mb-7">
            The ITM Gwalior campus is on NH-75, opposite Sithouli Railway Station — 9 km from the
            city centre, easy access by road and rail.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/contact"
              className="inline-flex items-center gap-2 bg-amber-300 hover:bg-amber-400 text-[#1a0606] px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl font-black text-[11px] tracking-widest uppercase transition-colors shadow-lg">
              Full Contact Page <ArrowUpRight size={13} />
            </Link>
            <a href="http://itmgoi.in/OnlineApply_ITMGOI/" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 border border-amber-300/40 hover:bg-amber-300/10 text-amber-300 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl font-black text-[11px] tracking-widest uppercase transition-colors">
              Online Enquiry <ArrowUpRight size={13} />
            </a>
          </div>
        </div>

        {/* Right: tile grid (address, general, admissions, email) */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4">
          {/* Address */}
          <div className="col-span-2 p-4 sm:p-6 rounded-3xl bg-white/5 backdrop-blur border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={14} className="text-amber-300" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-300">Campus Address</span>
            </div>
            <p className="text-sm sm:text-base md:text-lg font-bold leading-snug text-white/95 break-words">
              ITM Campus, Opp. Sithouli Railway Station,<br />
              NH-75 Sithouli, Jhansi Road,<br />
              Gwalior — 475001, Madhya Pradesh, INDIA
            </p>
          </div>

          {/* General phones */}
          <div className="p-4 sm:p-6 rounded-3xl bg-white/5 backdrop-blur border border-white/10">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Phone size={14} className="text-amber-300" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-300">General</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm font-bold break-all">
              <li><a href="tel:+917512440056" className="hover:text-amber-300 transition-colors">+91-751-2440056</a></li>
              <li><a href="tel:+917512432977" className="hover:text-amber-300 transition-colors">+91-751-2432977</a></li>
            </ul>
          </div>

          {/* Admission phones */}
          <div className="p-4 sm:p-6 rounded-3xl bg-white/5 backdrop-blur border border-white/10">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <GraduationCap size={14} className="text-amber-300" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-300">Admissions</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm font-bold break-all">
              <li><a href="tel:+917773005065" className="hover:text-amber-300 transition-colors">+91-77730 05065</a></li>
              <li><a href="tel:+917773001624" className="hover:text-amber-300 transition-colors">+91-77730 01624</a></li>
              <li><a href="tel:+917773001627" className="hover:text-amber-300 transition-colors">+91-77730 01627</a></li>
            </ul>
          </div>

          {/* Email */}
          <div className="col-span-2 p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-300/15 to-transparent border border-amber-300/30">
            <div className="flex items-center gap-2 mb-3">
              <Mail size={14} className="text-amber-300" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-300">Email</span>
            </div>
            <a href="mailto:admission@itmgoi.in"
              className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-white hover:text-amber-300 transition-colors break-all">
              admission@itmgoi.in
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
