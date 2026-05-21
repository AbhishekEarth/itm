import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Circle, ArrowRight, BookOpen, Wifi, Shield,
  Users, MapPin, Phone, Mail, GraduationCap, Laptop, Library,
  Star, ChevronDown, ChevronRight, Calendar, Award, Sparkles,
  Building2, Bus, Utensils, HeartPulse,
} from "lucide-react";
import {
  INSTITUTE, ACCREDITATIONS, ACHIEVEMENTS, CORE_VALUES,
} from "../data/itm_data";

const STEPS = [
  {
    id: 1,
    title: "Collect Your Offer Letter",
    body: "Visit the admissions office (Block A, Ground Floor) with original documents — marksheets, transfer certificate, migration certificate, and 4 passport-size photographs.",
    tag: "Day 1",
    icon: <Award size={20} />,
    accent: "from-rose-500 to-[#800000]",
  },
  {
    id: 2,
    title: "Fee Payment & Enrollment",
    body: "Pay your semester fee online via the HDFC gateway or at the accounts counter. Collect your enrollment number — you'll need this for everything.",
    tag: "Day 1–2",
    icon: <CheckCircle2 size={20} />,
    accent: "from-amber-500 to-orange-600",
  },
  {
    id: 3,
    title: "Get Your Student ID Card",
    body: "Submit your photo to the IT Cell (Block C, Room 12). Your smart card doubles as library access and hostel entry.",
    tag: "Day 2",
    icon: <Shield size={20} />,
    accent: "from-indigo-500 to-violet-700",
  },
  {
    id: 4,
    title: "Register on LMS & MIS",
    body: "Log in to lms.itmgoi.in with your enrollment number for course material. MIS (mis.itmgoi.in) tracks attendance, grades, and fee receipts.",
    tag: "Day 2–3",
    icon: <Laptop size={20} />,
    accent: "from-emerald-500 to-teal-700",
  },
  {
    id: 5,
    title: "Attend Orientation Week",
    body: "Meet your faculty, department head, and student mentors. Campus tour, lab induction, and anti-ragging pledge are all part of orientation.",
    tag: "Week 1",
    icon: <Users size={20} />,
    accent: "from-cyan-500 to-blue-600",
  },
  {
    id: 6,
    title: "Explore Clubs & Cells",
    body: "Join the Performing Arts Club (PAC), coding clubs, NSS, or sports teams. Extra-curriculars are integral to ITM's 360° development philosophy.",
    tag: "Week 2",
    icon: <Sparkles size={20} />,
    accent: "from-purple-500 to-fuchsia-700",
  },
];

const RESOURCES = [
  {
    title: "LMS Portal",
    desc: "Course content, assignments, and faculty uploads.",
    href: "https://lms.itmgoi.in/",
    icon: <BookOpen size={22} />,
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  {
    title: "MIS Login",
    desc: "Attendance, grades, fee receipts & timetable.",
    href: "http://mis.itmgoi.in/",
    icon: <Laptop size={22} />,
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    title: "Central Library",
    desc: "45,000+ books, e-journals, IEEE & Springer access.",
    to: "/library",
    icon: <Library size={22} />,
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    title: "Online Apply / Pay",
    desc: "Fee payment gateway via HDFC.",
    href: "https://onlineapply.itmgoi.in/form_hdfc.php?ok=Apply+Now",
    icon: <Award size={22} />,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

const FACILITIES = [
  { icon: <Wifi size={20} />, label: "Campus-wide Wi-Fi" },
  { icon: <Building2 size={20} />, label: "42 Modern Labs" },
  { icon: <Library size={20} />, label: "Central Library" },
  { icon: <Utensils size={20} />, label: "Multi-cuisine Cafeteria" },
  { icon: <HeartPulse size={20} />, label: "Medical Centre" },
  { icon: <Bus size={20} />, label: "Transport Facility" },
  { icon: <Users size={20} />, label: "Hostel (Boys & Girls)" },
  { icon: <Star size={20} />, label: "2500-seat Amphitheatre" },
];

const CONTACTS = [
  { label: "Admissions Office", phone: "+91-7773005065", email: "admission@itmgoi.in" },
  { label: "IT Cell / LMS Help", phone: "+91-751-2440056", email: null },
  { label: "Hostel Warden", phone: "+91-751-2432977", email: null },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
};

export default function Onboarding() {
  const [completed, setCompleted] = useState([]);
  const [expanded, setExpanded] = useState(null);

  const toggle = (id) =>
    setCompleted((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const progress = Math.round((completed.length / STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3e0202] via-[#6b0000] to-[#800000] text-white py-24 md:py-36">
        <div className="absolute inset-0 bg-[url('/images/hero1.jpg')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#800000]/60 to-[#3e0202]" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="text-[11px] font-black uppercase tracking-[0.35em] text-red-300 mb-4"
          >
            Welcome to
          </motion.p>
          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6"
          >
            Institute of Technology<br />
            <span className="text-red-300">&amp; Management</span>
          </motion.h1>
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Your step-by-step guide to getting started at ITM Gwalior — from enrollment to your very first day of class.
          </motion.p>

          {/* Accreditation chips */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-wrap justify-center gap-2"
          >
            {ACCREDITATIONS.map((a) => (
              <span key={a.name} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[11px] font-black uppercase tracking-widest text-white/80">
                {a.name}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROGRESS BAR ────────────────────────────────────────────── */}
      <section className="sticky top-[120px] md:top-[160px] z-30 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-4">
          <span className="text-[11px] font-black uppercase tracking-widest text-gray-500 shrink-0">
            Onboarding Progress
          </span>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-500 to-[#800000] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <span className="text-[11px] font-black text-[#800000] shrink-0">{progress}%</span>
        </div>
      </section>

      {/* ── STEPS ───────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#800000] mb-2">Step by Step</p>
          <h2 className="text-3xl md:text-4xl font-black text-[#3e0202] tracking-tight mb-12">Your Onboarding Checklist</h2>
        </motion.div>

        <div className="space-y-4">
          {STEPS.map((step, i) => {
            const done = completed.includes(step.id);
            const open = expanded === step.id;
            return (
              <motion.div
                key={step.id}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.5}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden
                  ${done ? "border-green-200 bg-green-50/50" : "border-gray-100 bg-white shadow-sm hover:shadow-md"}`}
              >
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                  onClick={() => setExpanded(open ? null : step.id)}
                >
                  {/* check toggle */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggle(step.id); }}
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                      ${done ? "border-green-500 bg-green-500 text-white" : "border-gray-300 text-gray-300 hover:border-[#800000] hover:text-[#800000]"}`}
                  >
                    {done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </button>

                  {/* gradient icon */}
                  <div className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${step.accent} flex items-center justify-center text-white`}>
                    {step.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-black text-sm md:text-base tracking-tight ${done ? "line-through text-gray-400" : "text-[#3e0202]"}`}>
                        {step.title}
                      </h3>
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-50 text-[#800000]">
                        {step.tag}
                      </span>
                    </div>
                  </div>

                  <ChevronDown size={16} className={`text-gray-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
                </div>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 pl-[calc(1.25rem+2rem+2.5rem+1rem)] text-gray-600 text-sm leading-relaxed">
                        {step.body}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {completed.length === STEPS.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-center"
          >
            <p className="text-2xl font-black text-green-700 mb-1">You're all set!</p>
            <p className="text-green-600 text-sm">Welcome to the ITM family. Now go explore campus.</p>
          </motion.div>
        )}
      </section>

      {/* ── RESOURCES ───────────────────────────────────────────────── */}
      <section className="bg-[#fbf7f2] py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#800000] mb-2">Quick Access</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#3e0202] tracking-tight mb-10">Key Student Portals</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RESOURCES.map((r, i) => (
              <motion.div
                key={r.title}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.5}
              >
                {r.to ? (
                  <Link to={r.to} className="group flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${r.color}`}>{r.icon}</div>
                    <div>
                      <p className="font-black text-[#3e0202] mb-0.5 group-hover:text-[#800000] transition-colors">{r.title}</p>
                      <p className="text-gray-500 text-sm">{r.desc}</p>
                    </div>
                    <ChevronRight size={16} className="ml-auto text-gray-300 group-hover:text-[#800000] transition-colors mt-1 shrink-0" />
                  </Link>
                ) : (
                  <a href={r.href} target="_blank" rel="noreferrer" className="group flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${r.color}`}>{r.icon}</div>
                    <div>
                      <p className="font-black text-[#3e0202] mb-0.5 group-hover:text-[#800000] transition-colors">{r.title} ↗</p>
                      <p className="text-gray-500 text-sm">{r.desc}</p>
                    </div>
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FACILITIES GRID ─────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#800000] mb-2">On Campus</p>
          <h2 className="text-3xl md:text-4xl font-black text-[#3e0202] tracking-tight mb-10">What's Available to You</h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FACILITIES.map((f, i) => (
            <motion.div
              key={f.label}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.3}
              className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-red-50 text-[#800000] flex items-center justify-center">
                {f.icon}
              </div>
              <p className="text-[12px] font-black text-[#3e0202] uppercase tracking-tight leading-tight">{f.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CORE VALUES ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#3e0202] via-[#6b0000] to-[#800000] py-16 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-red-300 mb-2">What We Stand For</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Core Values</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CORE_VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.4}
                className="p-5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur"
              >
                <p className="font-black mb-1 text-white">{v.title}</p>
                <p className="text-white/65 text-sm leading-relaxed">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACHIEVEMENTS ────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#800000] mb-2">Recognition</p>
          <h2 className="text-3xl md:text-4xl font-black text-[#3e0202] tracking-tight mb-10">Why You Made the Right Choice</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((a, i) => (
            <motion.div
              key={a.title}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.3}
              className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-[#800000] bg-red-50 px-2 py-0.5 rounded-full">
                {a.year}
              </span>
              <p className="font-black text-[#3e0202] mt-3 mb-1 leading-tight">{a.title}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{a.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────── */}
      <section className="bg-[#fbf7f2] py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#800000] mb-2">Need Help?</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#3e0202] tracking-tight mb-10">Contact the Right People</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {CONTACTS.map((c, i) => (
              <motion.div
                key={c.label}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.4}
                className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm"
              >
                <p className="font-black text-[#3e0202] mb-3">{c.label}</p>
                <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#800000] transition-colors mb-1">
                  <Phone size={14} /> {c.phone}
                </a>
                {c.email && (
                  <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#800000] transition-colors">
                    <Mail size={14} /> {c.email}
                  </a>
                )}
              </motion.div>
            ))}
          </div>
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100"
          >
            <MapPin size={18} className="text-[#800000] shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600 leading-relaxed">{INSTITUTE.address}</p>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-black text-[#3e0202] tracking-tight mb-4">Ready to Explore?</h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Dive into your department, browse research opportunities, or check out what the Performing Arts Club has planned.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/admissions" className="flex items-center gap-2 px-6 py-3 bg-[#800000] text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#600000] transition-colors">
              Admissions <ArrowRight size={14} />
            </Link>
            <Link to="/" className="flex items-center gap-2 px-6 py-3 bg-red-50 text-[#800000] rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors">
              Explore Home
            </Link>
            <Link to="/tap" className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-700 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors border border-gray-200">
              Training &amp; Placement
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
