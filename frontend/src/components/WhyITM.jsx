import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Microscope,
  Briefcase,
  Globe2,
  HandCoins,
  Cpu,
} from "lucide-react";

// Real recognitions/awards scraped from itmgoi.in
const REASONS = [
  {
    icon: ShieldCheck,
    title: "NAAC A — CGPA 3.01",
    body: "Accredited with CGPA 3.01 (A grade), valid till 24 November 2030. AICTE-approved with NBA-accredited programmes.",
    accent: "from-rose-500 to-[#800000]",
  },
  {
    icon: Briefcase,
    title: "Microsoft Learn — Center of Excellence",
    body: "Recognised as a Microsoft Learn Center of Excellence (May 2024 – April 2025). Tech-first curriculum, certifications and labs.",
    accent: "from-amber-500 to-orange-600",
    big: true,
  },
  {
    icon: Microscope,
    title: "World Book of Records, London",
    body: "Honoured in 2024 for delivering Five Lakh Internships in Three Years. Internship-first model from day one.",
    accent: "from-emerald-500 to-teal-700",
  },
  {
    icon: HandCoins,
    title: "EduSkills #35 All-India",
    body: "Ranked #35 nationally in the EduSkills Virtual Internship Rankings 2024 — Engineering category.",
    accent: "from-sky-500 to-blue-700",
  },
  {
    icon: Globe2,
    title: "Honeywell & ICT Academy CoE",
    body: "Centre of Excellence for Women Empowerment (2025), in partnership with Honeywell and ICT Academy.",
    accent: "from-violet-500 to-indigo-700",
  },
  {
    icon: Cpu,
    title: "Best Institute — Training & Placement",
    body: "Indian Education Excellence Awards 2022 winner for Training & Placement. Ranked 5th in Central India (Silicon India).",
    accent: "from-pink-500 to-rose-700",
  },
];

export default function WhyITM() {
  return (
    <section className="relative py-20 md:py-28 bg-[#1a0606] text-white overflow-hidden">

      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        ></div>
      </div>
      <div className="absolute top-0 right-0 w-[30vw] h-[30vw] bg-gradient-to-br from-[#800000]/30 to-transparent blur-2xl rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-5">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-300">
              Why ITM Gwalior
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05] mb-4">
            Six reasons students <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent">
              pick us over the rest.
            </span>
          </h2>
          <p className="text-sm md:text-base text-rose-100/70 font-medium leading-relaxed">
            Quality you can measure. Outcomes you can verify. A campus that takes your future as
            seriously as you do.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {REASONS.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur border border-white/10 p-7 ${
                r.big ? "md:col-span-2" : ""
              }`}
            >
              {/* Hover glow */}
              <div
                className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${r.accent} opacity-0 group-hover:opacity-25 blur-2xl transition-opacity duration-500`}
              ></div>

              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${r.accent} flex items-center justify-center shadow-lg mb-5`}
                >
                  <r.icon size={20} />
                </div>

                <h3 className="text-lg md:text-xl font-black tracking-tight leading-tight mb-3">
                  {r.title}
                </h3>

                <p className="text-sm text-white/70 leading-relaxed font-medium max-w-md">
                  {r.body}
                </p>

                <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-amber-300/0 group-hover:text-amber-300 transition-colors">
                  <span className="w-6 h-px bg-amber-300"></span>
                  Learn more
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
