import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ChevronRight as Crumb, Award, Mail, Phone, Calendar, MapPin } from "lucide-react";

const TEAM = [
  { name: "Dr. Megha Lahane", role: "Chairperson", accent: "from-rose-500 to-[#800000]" },
  { name: "Dr. Prabha Dixit", role: "Member", accent: "from-amber-500 to-orange-600" },
  { name: "Ms. Priusha Narwariya", role: "Member", accent: "from-indigo-500 to-violet-700" },
  { name: "Ms. Vishakha Yadav", role: "Member", accent: "from-emerald-500 to-teal-700" },
];

const EVENTS = [
  { date: "12 Feb 2024", title: "Expert Lecture: Challenges in Being a Woman Sculptor", speaker: "Prof. Latika Katt", venue: "Aruna Asif Ali Auditorium" },
  { date: "13 & 20 Jan 2024", title: "Nukkad Natak on Gender Equality", speaker: "WEC & PAC Collaboration", venue: "Village locations" },
  { date: "25–29 Nov 2023", title: "Workshop: Protection & Prevention from Sexual Harassment", speaker: "WEC", venue: "VSB Seminar Hall" },
  { date: "24 Nov 2023", title: "National Seminar: Challenges for Sex Workers & Their Children", speaker: "NCW-Sponsored", venue: "VSB Seminar Hall" },
  { date: "21–23 Mar 2023", title: "Sports Day for Female Faculty & Staff (International Women's Day)", speaker: "WEC", venue: "Campus" },
  { date: "06 Feb 2023", title: "International Seminar: Cancer Treatment Research", speaker: "WEC", venue: "VSB Seminar Hall (Hybrid)" },
  { date: "26 Dec 2022", title: "Poster Competition: Women Achieving Great Success", speaker: "WEC", venue: "Campus" },
  { date: "01 Nov 2022", title: "Expert Talk: Stop Violence Against Women", speaker: "WEC", venue: "Campus" },
  { date: "08 Mar 2022", title: "International Women's Day Celebration — Gender Equality", speaker: "6 Expert Speakers", venue: "Aruna Asaf Ali Auditorium (Hybrid)" },
];

const GALLERY = Array.from({ length: 44 }, (_, i) =>
  `https://pub-127dc462e0864e8981d24768d4ba7822.r2.dev/include/gallery/WEC/${i + 1}.jpg`
);

export default function WECPage() {
  const [showAllGallery, setShowAllGallery] = useState(false);

  return (
    <div className="min-h-screen bg-[#fbf7f2] dark:bg-[#020617]">

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-900 border-b border-rose-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
          <Link to="/" className="hover:text-[#800000] inline-flex items-center gap-1.5"><Home size={11} /> Home</Link>
          <Crumb size={10} className="text-gray-300" />
          <span className="text-[#800000]">Women Empowerment Cell</span>
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
              ♀️ Women Empowerment Cell · WEC
            </span>
            <h1 className="text-2xl sm:text-5xl md:text-7xl font-black tracking-[-0.04em] leading-[0.95] mb-2 sm:mb-4">
              WEC<br /><span className="text-red-200">ITM Gwalior.</span>
            </h1>
            <p className="text-red-100/80 text-xs sm:text-base max-w-xl leading-relaxed font-medium">
              Creating awareness of women&apos;s rights and promoting a culture of respect, equality and empowerment.
            </p>
          </div>
          <div className="lg:col-span-5 grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { v: "4", l: "Cell Members" },
              { v: "9+", l: "Events Organised" },
              { v: "44", l: "Gallery Photos" },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-2.5 sm:p-4 text-center">
                <div className="text-lg sm:text-2xl font-black tracking-tight leading-none">{s.v}</div>
                <div className="text-[9px] uppercase tracking-widest font-black text-rose-100/80 mt-2">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Purpose */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
            <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000]">Our Purpose</span>
            <div className="w-8 h-1 bg-gradient-to-r from-amber-500 to-[#800000] rounded-full"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white leading-[1.05] mb-3 sm:mb-4">
            Empowering women. Building equality.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
            The Women Empowerment Cell at ITM Gwalior aims to create awareness of women&apos;s rights, empower girl students, and promote a culture of respect and equality throughout the institute and in surrounding communities.
          </p>
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-white dark:bg-gray-900 border-y border-rose-100 dark:border-gray-800 py-8 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000]">Cell Members</span>
              <div className="w-8 h-1 bg-gradient-to-r from-amber-500 to-[#800000] rounded-full"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white">Our team.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {TEAM.map((m) => (
              <div key={m.name} className="relative overflow-hidden bg-white dark:bg-gray-900 border border-rose-50 dark:border-gray-800 rounded-3xl p-3 sm:p-6 hover:shadow-xl transition-shadow text-center">
                <div className={`h-1.5 bg-gradient-to-r ${m.accent} -mx-3 sm:-mx-6 -mt-3 sm:-mt-6 mb-3 sm:mb-5`}></div>
                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${m.accent} text-white flex items-center justify-center font-black text-sm mx-auto mb-2 sm:mb-3`}>
                  {m.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
                <div className="text-[9px] uppercase tracking-widest font-black text-[#800000] mb-1">{m.role}</div>
                <h4 className="font-black text-sm text-[#1a0606] dark:text-white tracking-tight leading-snug">{m.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000]">Events & Activities</span>
            <div className="w-8 h-1 bg-gradient-to-r from-amber-500 to-[#800000] rounded-full"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white">Making an impact.</h2>
        </div>
        <div className="space-y-2.5 sm:space-y-3">
          {EVENTS.map((e, i) => (
            <motion.div key={e.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              className="flex gap-3 sm:gap-4 p-3 sm:p-5 bg-white dark:bg-gray-900 border border-rose-50 dark:border-gray-800 rounded-2xl hover:shadow-md transition-shadow">
              <div className="shrink-0 w-20 sm:w-24 text-[10px] sm:text-xs font-black text-[#800000] tracking-tight">{e.date}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-sm text-[#1a0606] dark:text-white tracking-tight leading-snug mb-1">{e.title}</h4>
                <div className="flex flex-wrap gap-3 text-[10px] text-gray-500 font-medium">
                  <span className="flex items-center gap-1"><Calendar size={10} className="text-[#800000]" /> {e.speaker}</span>
                  <span className="flex items-center gap-1"><MapPin size={10} className="text-[#800000]" /> {e.venue}</span>
                </div>
              </div>
            </motion.div>
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
            <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white">WEC in action.</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {(showAllGallery ? GALLERY : GALLERY.slice(0, 8)).map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-xl bg-rose-50 dark:bg-gray-800">
                <img src={src} alt={`WEC event ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
          {!showAllGallery && (
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
              ♀️ Connect with WEC
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter mb-2 sm:mb-3">Together we rise.</h3>
            <p className="text-rose-100/80 text-xs sm:text-sm font-medium max-w-md">Reach out to the Women Empowerment Cell for events, support and community activities.</p>
          </div>
          <div className="flex flex-col gap-3">
            <a href="mailto:admission@itmgoi.in" className="bg-amber-300 text-[#1a0606] text-center font-black text-xs tracking-widest px-4 py-3 sm:px-6 sm:py-4 rounded-2xl hover:scale-[1.02] transition-transform inline-flex items-center justify-center gap-2">
              <Mail size={13} /> Contact WEC
            </a>
            <a href="tel:+917773005065" className="bg-black/30 backdrop-blur text-white border border-white/30 text-center font-black text-xs tracking-widest px-4 py-3 sm:px-6 sm:py-4 rounded-2xl hover:bg-black/50 transition-colors inline-flex items-center justify-center gap-2">
              <Phone size={13} /> +91-7773005065
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
