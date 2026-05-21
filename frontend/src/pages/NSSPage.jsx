import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ChevronRight as Crumb, Heart, Award, Mail, Phone, Users } from "lucide-react";

const OFFICERS = [
  { name: "Mr. Narendra Kumar Verma", role: "NSS Program Officer", dept: "Mechanical Engineering", accent: "from-rose-500 to-[#800000]" },
  { name: "Mrs. Archana Tomar", role: "NSS Girls Unit Officer", dept: "CSE Department", accent: "from-amber-500 to-orange-600" },
];

const OBJECTIVES = [
  "Enable students to understand their community and its needs",
  "Identify community problems and involve students in problem-solving",
  "Develop social and civic responsibility among youth",
  "Acquire leadership qualities and democratic attitudes",
  "Practice national integration and social harmony",
];

const ACTIVITIES = [
  { icon: "🩸", title: "Blood Donation Camps", body: "Approximately 500 units donated annually through regular blood donation drives." },
  { icon: "🌿", title: "Swachh Bharat", body: "Cleanliness awareness programs and Swachh Bharat Summer Internship drives." },
  { icon: "🌳", title: "Plantation Drives", body: "'One Student One Tree' initiative — tree plantation across campus and adopted villages." },
  { icon: "🎭", title: "Street Plays", body: "Nukkad Nataks on health, AIDS awareness, gender equality in collaboration with PAC." },
  { icon: "🏕️", title: "Leadership Camps", body: "7-day residential training camps for leadership development and community service." },
  { icon: "🌾", title: "Village Visits", body: "Regular visits to UBA adopted villages for surveys, education support and awareness drives." },
  { icon: "🎗️", title: "HIV/AIDS Awareness", body: "Campaigns including state-level Nukkad Natak at Barkatullah University, Bhopal." },
  { icon: "🗣️", title: "Expert Talks", body: "Workshops and expert sessions on civic responsibility, health and environment." },
];

const ACHIEVEMENTS = [
  "Selection for national and state-level NSS camps",
  "Swachh Bharat Summer Internship recognition",
  "Perennial Fund Award under Unnat Bharat Abhiyan (with UBA Cell)",
  "State and university-level awards for community service",
  "Active collaboration with Gwalior district administration",
];

const VOLUMES = [
  { year: "2023-24", url: "" },
  { year: "2022-23", url: "" },
  { year: "2021-22", url: "" },
  { year: "2020-21", url: "" },
];

const GALLERY = Array.from({ length: 20 }, (_, i) =>
  `https://www.itmgoi.in/include/gallery/NSS_19to23/NSS/nss${i + 1}.jpg`
);

export default function NSSPage() {
  const [showAllGallery, setShowAllGallery] = useState(false);

  return (
    <div className="min-h-screen bg-[#fbf7f2] dark:bg-[#020617]">

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-900 border-b border-rose-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
          <Link to="/" className="hover:text-[#800000] inline-flex items-center gap-1.5"><Home size={11} /> Home</Link>
          <Crumb size={10} className="text-gray-300" />
          <span className="text-[#800000]">NSS Cell</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3e0202] via-[#800000] to-[#5a0000] text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-10 right-20 w-72 h-72 rounded-full border-2 border-white"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 text-red-200 font-bold tracking-widest text-[10px] uppercase mb-4 px-3 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
              🎗️ National Service Scheme · Ministry of Youth Affairs
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-[-0.04em] leading-[0.95] mb-4">
              NSS Cell<br /><span className="text-red-200">ITM Gwalior.</span>
            </h1>
            <p className="text-red-100/80 text-sm sm:text-base max-w-xl leading-relaxed font-medium italic">
              &ldquo;Not Me, But You&rdquo; — fostering social responsibility and community service among students.
            </p>
          </div>
          <div className="lg:col-span-5 grid grid-cols-3 gap-3">
            {[
              { v: "200", l: "Volunteers (2020+)" },
              { v: "500+", l: "Blood Units / Year" },
              { v: "2", l: "Units (Boys + Girls)" },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black tracking-tight leading-none">{s.v}</div>
                <div className="text-[9px] uppercase tracking-widest font-black text-rose-100/80 mt-2">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Motto + Logo info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-3xl border border-rose-50 dark:border-gray-800 shadow-sm p-8">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#800000] to-amber-500"></div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#800000] to-[#5a0000] text-white flex items-center justify-center mb-5 text-2xl">🎗️</div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000] mb-2">NSS Motto</div>
            <p className="text-2xl font-black text-[#1a0606] dark:text-white italic mb-3">&ldquo;Not Me, But You&rdquo;</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">Reflecting the essence of democratic living and selfless service to society.</p>
          </div>
          <div className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-3xl border border-rose-50 dark:border-gray-800 shadow-sm p-8">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-[#800000]"></div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-700 text-white flex items-center justify-center mb-5 text-2xl">☸️</div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-700 dark:text-amber-400 mb-2">NSS Logo</div>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">Based on the Rath Wheel of the Konark Sun Temple (Odisha) with 24 spokes representing 24 hours — symbolising energy, dynamism, and youth.</p>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="bg-white dark:bg-gray-900 border-y border-rose-100 dark:border-gray-800 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000]">Objectives</span>
              <div className="w-8 h-1 bg-gradient-to-r from-amber-500 to-[#800000] rounded-full"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white">Five core objectives.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
            {OBJECTIVES.map((o, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3 p-5 bg-rose-50/50 dark:bg-gray-800 rounded-2xl">
                <span className="shrink-0 w-7 h-7 rounded-lg bg-[#800000] text-white flex items-center justify-center font-black text-[10px]">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{o}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000]">Major Activities</span>
            <div className="w-8 h-1 bg-gradient-to-r from-amber-500 to-[#800000] rounded-full"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white">Service in action.</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACTIVITIES.map((a, i) => (
            <motion.div key={a.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} whileHover={{ y: -4 }}
              className="bg-white dark:bg-gray-900 border border-rose-50 dark:border-gray-800 rounded-3xl p-5 hover:shadow-xl transition-shadow">
              <div className="text-3xl mb-3">{a.icon}</div>
              <h4 className="font-black text-sm text-[#1a0606] dark:text-white tracking-tight mb-2">{a.title}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{a.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="bg-[#1a0606] text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-300">Recognition</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-[-0.03em] mt-2">Achievements.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {ACHIEVEMENTS.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3 p-5 bg-white/[0.05] border border-white/10 rounded-2xl">
                <Award size={16} className="text-amber-300 shrink-0 mt-0.5" />
                <p className="text-sm text-white/85 font-medium leading-relaxed">{a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Officers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000]">Program Officers</span>
            <div className="w-8 h-1 bg-gradient-to-r from-amber-500 to-[#800000] rounded-full"></div>
          </div>
          <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white">Leadership.</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {OFFICERS.map((o) => (
            <div key={o.name} className="relative overflow-hidden bg-white dark:bg-gray-900 border border-rose-50 dark:border-gray-800 rounded-3xl p-6 hover:shadow-xl transition-shadow">
              <div className={`h-1.5 bg-gradient-to-r ${o.accent} -mx-6 -mt-6 mb-5`}></div>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${o.accent} text-white flex items-center justify-center font-black text-sm mb-3`}>
                {o.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
              </div>
              <div className="text-[9px] uppercase tracking-widest font-black text-[#800000] mb-1">{o.role}</div>
              <h4 className="font-black text-base text-[#1a0606] dark:text-white tracking-tight mb-1">{o.name}</h4>
              <p className="text-xs text-gray-500 font-medium">{o.dept}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-white dark:bg-gray-900 border-y border-rose-100 dark:border-gray-800 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000]">Gallery</span>
              <div className="w-8 h-1 bg-gradient-to-r from-amber-500 to-[#800000] rounded-full"></div>
            </div>
            <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white">NSS in action.</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {(showAllGallery ? GALLERY : GALLERY.slice(0, 8)).map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-xl bg-rose-50 dark:bg-gray-800">
                <img src={src} alt={`NSS activity ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
          {!showAllGallery && (
            <div className="text-center mt-6">
              <button onClick={() => setShowAllGallery(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border border-rose-100 dark:border-gray-800 rounded-full text-[11px] font-black uppercase tracking-widest text-[#800000] hover:shadow-md transition-shadow">
                Show all {GALLERY.length} photos
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a0606] via-[#3e0202] to-[#800000] text-white p-8 md:p-12 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-amber-300 font-bold tracking-widest text-[10px] uppercase mb-3 px-3 py-1.5 bg-white/10 rounded-full border border-white/20">
              🎗️ Join NSS
            </span>
            <h3 className="text-3xl md:text-4xl font-black tracking-tighter mb-3">Serve. Lead. Grow.</h3>
            <p className="text-rose-100/80 text-sm font-medium max-w-md">200 volunteers strong — join ITM&apos;s NSS Cell and make a real difference in your community.</p>
          </div>
          <div className="flex flex-col gap-3">
            <a href="mailto:admission@itmgoi.in" className="bg-amber-300 text-[#1a0606] text-center font-black text-xs tracking-widest px-6 py-4 rounded-2xl hover:scale-[1.02] transition-transform inline-flex items-center justify-center gap-2">
              <Mail size={13} /> Contact NSS Cell
            </a>
            <a href="tel:+917773005065" className="bg-black/30 backdrop-blur text-white border border-white/30 text-center font-black text-xs tracking-widest px-6 py-4 rounded-2xl hover:bg-black/50 transition-colors inline-flex items-center justify-center gap-2">
              <Phone size={13} /> +91-7773005065
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
