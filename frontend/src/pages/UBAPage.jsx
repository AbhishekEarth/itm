import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ChevronRight as Crumb, MapPin, Award, Mail, Phone, Compass } from "lucide-react";

const VILLAGES = ["Sarnagat", "Badera", "Belgada", "Bargava", "Chetupada"];

const OBJECTIVES = [
  "Address rural development challenges using institutional knowledge and expertise",
  "Foster meaningful student-faculty-community engagement",
  "Promote sustainable rural development through actionable interventions",
  "Bridge the urban-rural gap in education, health, and infrastructure",
  "Collaborate with sports organisations, local bodies and government agencies",
];

const ACTIVITIES = [
  { icon: "🏥", title: "Medical Camps", body: "Regular health camps and menstrual hygiene awareness drives in adopted villages." },
  { icon: "📚", title: "School Library", body: "Established library for 100 students at Chetupada Primary School with digital learning resources." },
  { icon: "☀️", title: "Renewable Energy", body: "Promoted solar energy, biogas and sustainable farming practices among village communities." },
  { icon: "💧", title: "Water Harvesting", body: "Implemented rainwater harvesting systems and waste management initiatives." },
  { icon: "🌳", title: "Tree Plantation", body: "Regular plantation drives and environmental awareness campaigns across adopted villages." },
  { icon: "📋", title: "Baseline Surveys", body: "Identified sanitation, education, employment and healthcare needs through systematic surveys." },
];

const ACHIEVEMENTS = [
  "Perennial Fund Award from IIT Delhi — National Coordinating Institute for UBA",
  "Recognition from District Collector, Gwalior",
  "Appreciation from local Panchayats and government schools",
  "Improved student enrollments in government schools",
  "Successful infrastructure interventions — roads, sanitation, electrification",
];

const TEAM = [
  { name: "Dr. Meenakshi Mazumdar", role: "UBA Nodal Officer", email: "meenakshi.mazumdar@itmgoi.in", accent: "from-rose-500 to-[#800000]" },
  { name: "Mr. Narendra Kumar Verma", role: "Institute Coordinator", email: "narendra.verma@itmgoi.in", accent: "from-amber-500 to-orange-600" },
];

const GALLERY = [
  ...Array.from({ length: 4 }, (_, i) => `https://www.itmgoi.in/include/gallery/IIC_TEAM/uba${i + 1}.jpg`),
  ...Array.from({ length: 5 }, (_, i) => `https://www.itmgoi.in/include/gallery/Best_practice1/${76 + i}.jpg`),
  ...Array.from({ length: 8 }, (_, i) => `https://www.itmgoi.in/include/gallery/Best_practice1/${85 + i}.jpg`),
];

export default function UBAPage() {
  const [showAllGallery, setShowAllGallery] = useState(false);

  return (
    <div className="min-h-screen bg-[#fbf7f2] dark:bg-[#020617]">

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-900 border-b border-rose-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
          <Link to="/" className="hover:text-[#800000] inline-flex items-center gap-1.5"><Home size={11} /> Home</Link>
          <Crumb size={10} className="text-gray-300" />
          <span className="text-[#800000]">UBA Cell</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3e0202] via-[#800000] to-[#5a0000] text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-10 right-20 w-72 h-72 rounded-full border-2 border-white"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14 md:py-20 grid lg:grid-cols-12 gap-6 sm:gap-10 items-end">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 text-red-200 font-bold tracking-widest text-[9px] sm:text-[10px] uppercase mb-2 sm:mb-4 px-2 py-1 sm:px-3 sm:py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
              🌾 Unnat Bharat Abhiyan · Ministry of Education
            </span>
            <h1 className="text-2xl sm:text-5xl md:text-7xl font-black tracking-[-0.04em] leading-[0.95] mb-2 sm:mb-4">
              UBA Cell<br /><span className="text-red-200">ITM Gwalior.</span>
            </h1>
            <p className="text-red-100/80 text-xs sm:text-base max-w-xl leading-relaxed font-medium">
              Connecting higher education with rural communities — 5 adopted villages, active since 2018-19.
            </p>
          </div>
          <div className="lg:col-span-5 grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { v: "5", l: "Adopted Villages" },
              { v: "2018", l: "Active Since" },
              { v: "IIT", l: "Delhi Award" },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-2.5 sm:p-4 text-center">
                <div className="text-lg sm:text-2xl font-black tracking-tight leading-none">{s.v}</div>
                <div className="text-[9px] uppercase tracking-widest font-black text-rose-100/80 mt-2">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Adopted Villages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000]">Block Dabra, District Gwalior</span>
            <div className="w-8 h-1 bg-gradient-to-r from-amber-500 to-[#800000] rounded-full"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white leading-[1.05]">
            Five adopted villages.
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {VILLAGES.map((v, i) => (
            <motion.div key={v} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="flex items-center gap-2 px-3 py-2 sm:px-5 sm:py-3 bg-white dark:bg-gray-900 border border-rose-50 dark:border-gray-800 rounded-2xl shadow-sm">
              <MapPin size={14} className="text-[#800000]" />
              <span className="font-black text-sm text-[#1a0606] dark:text-white">{v}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Objectives + Vision */}
      <section className="bg-white dark:bg-gray-900 border-y border-rose-100 dark:border-gray-800 py-8 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000]">Objectives</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white mb-4 sm:mb-6">What we set out to do.</h2>
              <div className="space-y-2.5 sm:space-y-3">
                {OBJECTIVES.map((o, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 p-3 sm:p-4 bg-rose-50/50 dark:bg-gray-800 rounded-2xl">
                    <span className="shrink-0 w-7 h-7 rounded-lg bg-[#800000] text-white flex items-center justify-center font-black text-[10px]">{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{o}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative overflow-hidden bg-gradient-to-br from-[#3e0202] to-[#800000] text-white rounded-3xl p-4 sm:p-8">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-3 sm:mb-4"><Compass size={20} /></div>
                <div className="text-[10px] uppercase tracking-widest font-black text-amber-300 mb-2">Program Description</div>
                <p className="text-xs sm:text-sm leading-relaxed font-medium text-rose-100/90">Flagship program initiated by the Ministry of Education, Government of India, aimed at connecting higher educational institutions with rural communities to address developmental challenges.</p>
              </div>
              <div className="bg-amber-50 dark:bg-gray-800 border border-amber-100 dark:border-gray-700 rounded-3xl p-4 sm:p-6">
                <div className="text-[10px] uppercase tracking-widest font-black text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5"><Award size={11} /> Key Achievement</div>
                <p className="text-sm font-black text-[#1a0606] dark:text-white">Perennial Fund Award from IIT Delhi — National Coordinating Institute for UBA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000]">Activities Implemented</span>
            <div className="w-8 h-1 bg-gradient-to-r from-amber-500 to-[#800000] rounded-full"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white">Impact on the ground.</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {ACTIVITIES.map((a, i) => (
            <motion.div key={a.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }}
              className="bg-white dark:bg-gray-900 border border-rose-50 dark:border-gray-800 rounded-3xl p-3 sm:p-6 hover:shadow-xl transition-shadow">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{a.icon}</div>
              <h4 className="font-black text-sm sm:text-base text-[#1a0606] dark:text-white tracking-tight mb-1.5 sm:mb-2">{a.title}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{a.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="bg-[#1a0606] text-white py-8 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-300">Recognition</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.03em] mt-2">Achievements.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {ACHIEVEMENTS.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3 p-3 sm:p-5 bg-white/[0.05] border border-white/10 rounded-2xl">
                <Award size={16} className="text-amber-300 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-white/85 font-medium leading-relaxed">{a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000]">Leadership</span>
            <div className="w-8 h-1 bg-gradient-to-r from-amber-500 to-[#800000] rounded-full"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white">Our team.</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
          {TEAM.map((m) => (
            <div key={m.name} className="relative overflow-hidden bg-white dark:bg-gray-900 border border-rose-50 dark:border-gray-800 rounded-3xl p-3 sm:p-6 hover:shadow-xl transition-shadow">
              <div className={`h-1.5 bg-gradient-to-r ${m.accent} -mx-3 sm:-mx-6 -mt-3 sm:-mt-6 mb-3 sm:mb-5`}></div>
              <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${m.accent} text-white flex items-center justify-center font-black text-sm mb-2 sm:mb-3`}>
                {m.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
              </div>
              <div className="text-[9px] uppercase tracking-widest font-black text-[#800000] mb-1">{m.role}</div>
              <h4 className="font-black text-base text-[#1a0606] dark:text-white tracking-tight mb-3">{m.name}</h4>
              <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-[#800000] break-all">
                <Mail size={11} className="text-[#800000] shrink-0" /> {m.email}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-white dark:bg-gray-900 border-y border-rose-100 dark:border-gray-800 py-8 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000]">Gallery</span>
              <div className="w-8 h-1 bg-gradient-to-r from-amber-500 to-[#800000] rounded-full"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white">UBA in action.</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {(showAllGallery ? GALLERY : GALLERY.slice(0, 8)).map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-xl bg-rose-50 dark:bg-gray-800">
                <img src={src} alt={`UBA activity ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
          {!showAllGallery && GALLERY.length > 8 && (
            <div className="text-center mt-6">
              <button onClick={() => setShowAllGallery(true)} className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-white dark:bg-gray-900 border border-rose-100 dark:border-gray-800 rounded-full text-[11px] font-black uppercase tracking-widest text-[#800000] hover:shadow-md transition-shadow">
                Show all {GALLERY.length} photos
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 md:py-20">
        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a0606] via-[#3e0202] to-[#800000] text-white p-5 sm:p-8 md:p-12 grid md:grid-cols-2 gap-4 sm:gap-6 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-amber-300 font-bold tracking-widest text-[10px] uppercase mb-3 px-3 py-1.5 bg-white/10 rounded-full border border-white/20">
              🌾 Join UBA
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter mb-2 sm:mb-3">Be part of the change.</h3>
            <p className="text-rose-100/80 text-xs sm:text-sm font-medium max-w-md">Connect with the UBA Cell to participate in village visits, surveys and community development activities.</p>
          </div>
          <div className="flex flex-col gap-3">
            <a href="mailto:uba@itmgoi.in" className="bg-amber-300 text-[#1a0606] text-center font-black text-xs tracking-widest px-4 py-3 sm:px-6 sm:py-4 rounded-2xl hover:scale-[1.02] transition-transform inline-flex items-center justify-center gap-2">
              <Mail size={13} /> uba@itmgoi.in
            </a>
            <a href="tel:+918109707108" className="bg-black/30 backdrop-blur text-white border border-white/30 text-center font-black text-xs tracking-widest px-4 py-3 sm:px-6 sm:py-4 rounded-2xl hover:bg-black/50 transition-colors inline-flex items-center justify-center gap-2">
              <Phone size={13} /> +91-8109707108
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
