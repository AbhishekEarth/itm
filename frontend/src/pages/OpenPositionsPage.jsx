import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, GraduationCap, FlaskConical, Users, Search, MapPin, Clock, Calendar,
  ArrowRight, FileDown, Filter, BadgeCheck, Sparkles, Mail, Send, CheckCircle2, X,
} from "lucide-react";
import PageShell, { SectionTitle, FactRow } from "./_PageShell";
import { usePublicPositions } from "../hooks/usePublicAdmissions";
import { careersApi } from "../api/admissions";
import { errorMessage } from "../api/client";

const CATEGORIES = [
  { id: "all",      label: "All",       icon: Filter },
  { id: "faculty",  label: "Faculty",   icon: GraduationCap },
  { id: "research", label: "Research",  icon: FlaskConical },
  { id: "admin",    label: "Admin & Staff", icon: Users },
];

const POSITIONS = [
  {
    id: "asst-prof-cse",
    title: "Assistant Professor — Computer Science",
    department: "Computer Science & Engineering",
    category: "faculty",
    type: "Full-time",
    location: "Gwalior Campus",
    experience: "PhD / M.Tech, 0–5 yrs",
    posted: "2 days ago",
    deadline: "30 Jun 2026",
    description:
      "Teach UG / PG CS courses, contribute to AI/ML labs and supervise final-year projects. Strong publication record and industry exposure preferred.",
    tags: ["AI/ML", "DSA", "Python"],
    accent: "from-rose-500 to-[#800000]",
    jdUrl: "#",
  },
  {
    id: "asst-prof-it",
    title: "Assistant Professor — Information Technology",
    department: "Information Technology",
    category: "faculty",
    type: "Full-time",
    location: "Gwalior Campus",
    experience: "PhD / M.Tech, 0–4 yrs",
    posted: "3 days ago",
    deadline: "30 Jun 2026",
    description:
      "Cloud, DevOps and full-stack curriculum delivery. Work with AWS Academy and Microsoft Learn certified track. Mentor student internship pipeline.",
    tags: ["Cloud", "DevOps", "Full-stack"],
    accent: "from-amber-500 to-orange-600",
    jdUrl: "#",
  },
  {
    id: "assoc-prof-me",
    title: "Associate Professor — Mechanical Engineering",
    department: "Mechanical Engineering",
    category: "faculty",
    type: "Full-time",
    location: "Gwalior Campus",
    experience: "PhD, 6+ yrs",
    posted: "1 week ago",
    deadline: "15 Jul 2026",
    description:
      "Lead Thermodynamics & Manufacturing labs. Research focus on CAD/CAM, sustainable manufacturing or robotics is a plus. PhD supervision rights expected.",
    tags: ["CAD/CAM", "Robotics", "Research"],
    accent: "from-indigo-500 to-violet-700",
    jdUrl: "#",
  },
  {
    id: "jrf-cyber",
    title: "Junior Research Fellow — Cyber Security",
    department: "R&D Cell",
    category: "research",
    type: "Project — 2 yrs",
    location: "Gwalior Campus",
    experience: "M.Tech / GATE-qualified",
    posted: "5 days ago",
    deadline: "10 Jul 2026",
    description:
      "Funded project on intrusion detection & adversarial ML. Stipend ₹31,000/month + HRA. Conference travel and publication support included.",
    tags: ["Cyber Security", "ML", "GATE"],
    accent: "from-emerald-500 to-teal-700",
    jdUrl: "#",
  },
  {
    id: "lab-assist-ec",
    title: "Lab Assistant — Electronics Lab",
    department: "Electronics & Communication",
    category: "admin",
    type: "Full-time",
    location: "Gwalior Campus",
    experience: "Diploma / B.Tech, 1–3 yrs",
    posted: "1 week ago",
    deadline: "20 Jun 2026",
    description:
      "Maintain VLSI and embedded systems lab equipment. Assist with practicals, inventory and student lab sessions across UG batches.",
    tags: ["Embedded", "VLSI Lab", "Hardware"],
    accent: "from-sky-500 to-blue-700",
    jdUrl: "#",
  },
  {
    id: "admin-officer",
    title: "Administrative Officer — Admissions Cell",
    department: "Admissions",
    category: "admin",
    type: "Full-time",
    location: "Gwalior Campus",
    experience: "MBA / Graduate, 3+ yrs",
    posted: "2 weeks ago",
    deadline: "25 Jun 2026",
    description:
      "Manage end-to-end admissions counselling, document verification and CRM follow-ups. Strong communication and Excel skills required.",
    tags: ["Admissions", "CRM", "Counselling"],
    accent: "from-pink-500 to-rose-700",
    jdUrl: "#",
  },
];

const STATS = [
  { num: "12+", label: "Open Roles" },
  { num: "7",   label: "Departments" },
  { num: "85%", label: "Full-time" },
  { num: "₹31K", label: "JRF Stipend" },
];

function PositionCard({ p, i, onApply }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: i * 0.05, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl border border-rose-50 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-shadow"
    >
      {/* Top accent bar */}
      <div className={`h-1 bg-gradient-to-r ${p.accent}`} />

      {/* Decorative blur */}
      <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${p.accent} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity pointer-events-none`} />

      <div className="relative p-4 sm:p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-[#800000] dark:text-amber-300 mb-1.5">
              <BadgeCheck size={11} /> {p.department}
            </div>
            <h3 className="text-base sm:text-xl font-black tracking-tight text-[#1a0606] dark:text-white leading-tight group-hover:text-[#800000] transition-colors">
              {p.title}
            </h3>
          </div>
          <span className={`shrink-0 inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br ${p.accent} text-white shadow-lg`}>
            <Briefcase size={16} />
          </span>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
          <span className="inline-flex items-center gap-1"><Briefcase size={11} className="text-[#800000]" /> {p.type}</span>
          <span className="inline-flex items-center gap-1"><MapPin size={11} className="text-[#800000]" /> {p.location}</span>
          <span className="inline-flex items-center gap-1"><Clock size={11} className="text-[#800000]" /> {p.experience}</span>
        </div>

        {/* Description */}
        <p className="text-[12px] sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
          {p.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-5">
          {p.tags.map((t) => (
            <span
              key={t}
              className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 sm:py-1 bg-rose-50 dark:bg-gray-800 text-[#800000] dark:text-rose-300 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-rose-50 dark:border-gray-800 gap-2">
          <div className="text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-gray-400 inline-flex items-center gap-1.5">
            <Calendar size={11} className="text-amber-500" />
            <span>Apply by <span className="text-[#800000] dark:text-amber-300 font-black">{p.deadline}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <a
              href={p.jdUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-100 dark:border-gray-700 text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-800 transition-colors"
            >
              <FileDown size={11} /> JD
            </a>
            {onApply ? (
              <button
                onClick={() => onApply(p)}
                className="inline-flex items-center gap-1.5 bg-gradient-to-br from-[#800000] to-[#5a0000] hover:from-[#a30000] hover:to-[#800000] text-white px-3 py-2 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all"
              >
                Apply <ArrowRight size={11} />
              </button>
            ) : (
              <Link
                to={`/careers/open-positions/${p.id}`}
                className="inline-flex items-center gap-1.5 bg-gradient-to-br from-[#800000] to-[#5a0000] hover:from-[#a30000] hover:to-[#800000] text-white px-3 py-2 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all"
              >
                Apply <ArrowRight size={11} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ApplyDrawer({ position, onClose }) {
  const [form, setForm] = useState({ applicant_name: "", email: "", phone: "", cover_letter_md: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr("");
    try { await careersApi.apply({ position_id: position.id, ...form }); setDone(true); }
    catch (e2) { setErr(errorMessage(e2)); }
    finally { setBusy(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-lg bg-white dark:bg-gray-900 h-full overflow-y-auto p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-base text-[#1a0606] dark:text-white">Apply: {position.title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X size={16} /></button>
        </div>
        {done ? (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-center">
            <CheckCircle2 size={28} className="text-emerald-600 mx-auto mb-3" />
            <h3 className="font-black text-base text-emerald-900 dark:text-emerald-100">Application received</h3>
            <p className="text-xs text-emerald-800 dark:text-emerald-200 mt-1">HR will get back to {form.email} shortly.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input required placeholder="Full name *" value={form.applicant_name} onChange={(e) => setForm({ ...form, applicant_name: e.target.value })}
                   className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]" />
            <input required type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                   className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]" />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                   className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]" />
            <textarea rows={6} placeholder="Cover letter (markdown supported)" value={form.cover_letter_md} onChange={(e) => setForm({ ...form, cover_letter_md: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]" />
            {err && <div className="text-xs text-red-600">{err}</div>}
            <button disabled={busy} className="w-full bg-gradient-to-r from-[#a30000] to-[#800000] text-white text-xs font-black uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
              <Send size={12} /> {busy ? "Submitting…" : "Submit application"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function _liveToBundledShape(p) {
  return {
    id: p.id,
    title: p.title,
    department: p.department_code || "—",
    category: (p.category || "faculty").toLowerCase(),
    type: p.type || "Full-time",
    location: p.location || "Gwalior Campus",
    experience: p.experience || "",
    posted: "Recently",
    deadline: p.deadline || "",
    description: p.description || "",
    tags: p.tags || [],
    accent: "from-rose-500 to-[#800000]",
    jdUrl: p.jd_pdf_url || "#",
  };
}

export default function OpenPositionsPage() {
  const [activeCat, setActiveCat] = useState("all");
  const [query, setQuery] = useState("");
  const [applying, setApplying] = useState(null);
  const { data: live } = usePublicPositions();
  const source = live && live.length ? live.map(_liveToBundledShape) : POSITIONS;

  const filtered = useMemo(() => {
    return source.filter((p) => {
      const catMatch = activeCat === "all" ? true : p.category === activeCat;
      const q = query.trim().toLowerCase();
      const qMatch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.department || "").toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q));
      return catMatch && qMatch;
    });
  }, [source, activeCat, query]);

  return (
    <PageShell
      eyebrow="Open Positions"
      title="Join the team."
      accentTitle="Build the future of ITM."
      intro="Faculty, research and administrative openings across departments — apply directly to the role that fits, or reach out to careers@itmgoi.in for general enquiries."
      chips={[`${POSITIONS.length} open roles`, "Year-round hiring", "PhD · M.Tech · Graduate"]}
    >
      <FactRow items={STATS} />

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl border border-rose-50 dark:border-gray-800 p-3 sm:p-5 shadow-sm space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 sm:gap-3 bg-rose-50/50 dark:bg-gray-800/60 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5">
          <Search size={16} className="text-[#800000] shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, department or skill…"
            className="flex-1 bg-transparent text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#800000]"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            const active = activeCat === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCat(c.id)}
                className={`relative inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-colors ${
                  active
                    ? "text-white"
                    : "text-gray-600 dark:text-gray-300 bg-rose-50 dark:bg-gray-800 hover:bg-rose-100 dark:hover:bg-gray-700"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="cat-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#800000] to-[#5a0000]"
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  />
                )}
                <Icon size={12} className="relative" />
                <span className="relative">{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Position list */}
      <div>
        <SectionTitle eyebrow="Available roles" title="Pick your" accent="next chapter." />

        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              key="grid"
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5"
            >
              {filtered.map((p, i) => (
                <PositionCard key={p.id} p={p} i={i} onApply={() => setApplying(p)} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-12 sm:py-16 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-rose-200 dark:border-gray-700"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-50 dark:bg-gray-800 text-[#800000] dark:text-amber-300 mb-3 sm:mb-4">
                <Search size={20} />
              </div>
              <h4 className="text-base sm:text-lg font-black text-[#1a0606] dark:text-white mb-1">No roles match your filters.</h4>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mb-4">
                Try clearing the search or choosing a different category.
              </p>
              <button
                type="button"
                onClick={() => { setActiveCat("all"); setQuery(""); }}
                className="inline-flex items-center gap-2 bg-[#800000] hover:bg-[#5a0000] text-white px-4 py-2.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-colors"
              >
                Reset filters <ArrowRight size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* General enquiry CTA */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a0606] via-[#3e0202] to-[#800000] text-white rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 border border-amber-300/20">
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
        <div className="relative grid lg:grid-cols-12 gap-5 lg:gap-8 items-center">
          <div className="lg:col-span-8">
            <span className="inline-flex items-center gap-2 text-amber-200 font-bold tracking-widest text-[10px] uppercase mb-3 px-3 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
              <Sparkles size={12} /> General Enquiry
            </span>
            <h3 className="text-xl sm:text-3xl md:text-4xl font-black tracking-[-0.03em] leading-tight mb-2 sm:mb-3">
              Don&apos;t see the right role?
            </h3>
            <p className="text-rose-100/80 text-xs sm:text-base font-medium leading-relaxed max-w-xl">
              Send us your CV and we&apos;ll keep you on file for upcoming openings across departments.
              JRF aspirants should head to the dedicated JRF page.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-3 lg:items-stretch">
            <a
              href="mailto:careers@itmgoi.in"
              className="inline-flex items-center justify-center gap-2 bg-amber-300 hover:bg-amber-400 text-[#1a0606] px-4 py-2.5 sm:px-6 sm:py-3 rounded-full font-black text-[10px] sm:text-[11px] tracking-widest uppercase transition-colors"
            >
              <Mail size={13} /> Email CV
            </a>
            <Link
              to="/jrf"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-full font-black text-[10px] sm:text-[11px] tracking-widest uppercase transition-colors"
            >
              JRF Programme <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
      {applying && <ApplyDrawer position={applying} onClose={() => setApplying(null)} />}
    </PageShell>
  );
}
