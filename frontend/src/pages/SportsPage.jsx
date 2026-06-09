import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ChevronRight as Crumb, Award, Mail, Phone, Target, Compass } from "lucide-react";

const SPORTS_OFFICER = { name: "Mr. Mushahid Khan", role: "Sports Officer", email: "sportsofficer@itmgoi.in", accent: "from-rose-500 to-[#800000]" };

const TEAM = [
  { name: "Mr. Yogendra Singh Rathore", dept: "CSE", accent: "from-rose-500 to-[#800000]" },
  { name: "Mr. Saurabh Sharma", dept: "EC", accent: "from-amber-500 to-orange-600" },
  { name: "Mr. Shashank Agrawal", dept: "ME", accent: "from-emerald-500 to-teal-700" },
  { name: "Mr. Brajendra Rajak", dept: "CE", accent: "from-indigo-500 to-violet-700" },
  { name: "Mr. Saurabh Shrivastava", dept: "IT", accent: "from-sky-500 to-blue-700" },
  { name: "Dr. Prashant Sharma", dept: "MBA", accent: "from-pink-500 to-rose-700" },
];

const OBJECTIVES = [
  "Encourage student engagement in sports for a healthy lifestyle",
  "Identify and nurture talented athletes across all disciplines",
  "Organize inter-departmental, inter-college and national competitions",
  "Instill teamwork, leadership and discipline through sports",
  "Collaborate with sports organisations for enhanced opportunities",
];

const ACTIVITIES = [
  { icon: "🏆", title: "Annual Sports Meet", body: "Multi-sport campus competition bringing together all departments." },
  { icon: "⚔️", title: "Inter-Departmental Tournaments", body: "Regular tournaments fostering healthy competition between departments." },
  { icon: "🎯", title: "National & State-Level", body: "Student representation at state and national championships across sports." },
  { icon: "💪", title: "Fitness & Training", body: "Coaching programs, fitness sessions and expert workshops for all students." },
  { icon: "🏟️", title: "RGPV Nodal Tournaments", body: "Successfully hosted RGPV Nodal-Level tournaments on campus." },
  { icon: "🎮", title: "Recreational Events", body: "Fun sports days, friendly matches and recreational sporting events." },
];

const SPORTS = ["Cricket", "Football", "Basketball", "Kabaddi", "Hockey", "Badminton", "Volleyball", "Athletics", "Table Tennis", "Chess"];

const ACHIEVEMENTS = [
  "Won/runner-up positions in multiple Nodal and State tournaments",
  "Student representation at state and national championships",
  "Athletes secured positions in government and corporate sports teams",
  "Consistent recognition for sports excellence across disciplines",
  "Successfully hosted RGPV Nodal-Level tournaments on campus",
];

const GALLERY_ACHIEVEMENTS = Array.from({ length: 24 }, (_, i) =>
  `https://pub-127dc462e0864e8981d24768d4ba7822.r2.dev/include/gallery/Sport_Cell_Achivements_photo/${i + 1}.jpg`
);
const GALLERY_ACTIVITIES = ["Sp7","Sp8","Sp9","Sp10","Sp11","Sp12","Sp13","Sp14","Sp15","Sp16","Sp17","Sp18","Sp19","Sp20"].map(
  (f) => `https://pub-127dc462e0864e8981d24768d4ba7822.r2.dev/include/gallery/Club_photos/${f}.jpg`
);
const GALLERY = [...GALLERY_ACHIEVEMENTS, ...GALLERY_ACTIVITIES];

export default function SportsPage() {
  const [showAllGallery, setShowAllGallery] = useState(false);

  return (
    <div className="min-h-screen bg-[#fbf7f2] dark:bg-[#020617]">

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-900 border-b border-rose-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
          <Link to="/" className="hover:text-[#800000] inline-flex items-center gap-1.5"><Home size={11} /> Home</Link>
          <Crumb size={10} className="text-gray-300" />
          <span className="text-[#800000]">Sports Cell</span>
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
              🏆 Sports Cell · ITM Gwalior
            </span>
            <h1 className="text-2xl sm:text-5xl md:text-7xl font-black tracking-[-0.04em] leading-[0.95] mb-2 sm:mb-4">
              Sports Cell<br /><span className="text-red-200">ITM Gwalior.</span>
            </h1>
            <p className="text-red-100/80 text-xs sm:text-base max-w-xl leading-relaxed font-medium">
              Where sports and academics go hand in hand — nurturing athletes, champions and well-rounded individuals.
            </p>
          </div>
          <div className="lg:col-span-5 grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { v: "10+", l: "Sports" },
              { v: "6", l: "Dept. Reps" },
              { v: "National", l: "Level" },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-2.5 sm:p-4 text-center">
                <div className="text-lg sm:text-2xl font-black tracking-tight leading-none">{s.v}</div>
                <div className="text-[9px] uppercase tracking-widest font-black text-rose-100/80 mt-2">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision + Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
          <div className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-3xl border border-rose-50 dark:border-gray-800 shadow-sm p-4 sm:p-8">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#800000] to-amber-500"></div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#800000] to-[#5a0000] text-white flex items-center justify-center mb-3 sm:mb-5"><Compass size={22} /></div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000] mb-2">Vision</div>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium italic">&ldquo;Create an environment where sports and academics go hand in hand, ensuring the all-round development of students while preparing them for competitive sports.&rdquo;</p>
          </div>
          <div className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-3xl border border-rose-50 dark:border-gray-800 shadow-sm p-4 sm:p-8">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-[#800000]"></div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-700 text-white flex items-center justify-center mb-3 sm:mb-5"><Target size={22} /></div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-700 dark:text-amber-400 mb-2">Mission</div>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium italic">&ldquo;Establish world-class sports infrastructure, enhance participation in inter-university tournaments, and support outstanding athletes with scholarships and specialised training.&rdquo;</p>
          </div>
        </div>
      </section>

      {/* Sports we play */}
      <section className="bg-white dark:bg-gray-900 border-y border-rose-100 dark:border-gray-800 py-8 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000]">Sports Offered</span>
              <div className="w-8 h-1 bg-gradient-to-r from-amber-500 to-[#800000] rounded-full"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white">{SPORTS.length} sports on campus.</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {SPORTS.map((s, i) => (
              <motion.span key={s} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-rose-50 dark:bg-gray-800 text-[#800000] dark:text-rose-400 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest">
                {s}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000]">Activities & Programs</span>
            <div className="w-8 h-1 bg-gradient-to-r from-amber-500 to-[#800000] rounded-full"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white">What we organise.</h2>
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
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto">
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
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000]">Sports Cell Team</span>
            <div className="w-8 h-1 bg-gradient-to-r from-amber-500 to-[#800000] rounded-full"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white">Leadership.</h2>
        </div>

        {/* Sports Officer */}
        <div className="max-w-xs mx-auto mb-4 sm:mb-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#3e0202] to-[#800000] text-white rounded-3xl p-4 sm:p-6 text-center shadow-xl">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/10 rounded-2xl flex items-center justify-center font-black text-lg mx-auto mb-2 sm:mb-3">MK</div>
            <div className="text-[9px] uppercase tracking-widest font-black text-amber-300 mb-1">{SPORTS_OFFICER.role}</div>
            <h4 className="font-black text-base tracking-tight mb-2">{SPORTS_OFFICER.name}</h4>
            <a href={`mailto:${SPORTS_OFFICER.email}`} className="text-[10px] text-rose-100/80 hover:text-amber-300 transition-colors">{SPORTS_OFFICER.email}</a>
          </div>
        </div>

        {/* Team members */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {TEAM.map((m) => (
            <div key={m.name} className="relative overflow-hidden bg-white dark:bg-gray-900 border border-rose-50 dark:border-gray-800 rounded-2xl p-3 sm:p-4 hover:shadow-md transition-shadow flex items-center gap-3">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${m.accent} text-white flex items-center justify-center font-black text-xs shrink-0`}>
                {m.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-widest font-black text-gray-400">{m.dept}</div>
                <h4 className="font-black text-sm text-[#1a0606] dark:text-white tracking-tight leading-snug">{m.name}</h4>
              </div>
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
            <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white">Sports in action.</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {(showAllGallery ? GALLERY : GALLERY.slice(0, 8)).map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-xl bg-rose-50 dark:bg-gray-800">
                <img src={src} alt={`Sports activity ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
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
              🏆 Join Sports Cell
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter mb-2 sm:mb-3">Play. Compete. Excel.</h3>
            <p className="text-rose-100/80 text-xs sm:text-sm font-medium max-w-md">Connect with the Sports Cell to participate in tournaments, training sessions and national-level competitions.</p>
          </div>
          <div className="flex flex-col gap-3">
            <a href="mailto:sportsofficer@itmgoi.in" className="bg-amber-300 text-[#1a0606] text-center font-black text-xs tracking-widest px-4 py-3 sm:px-6 sm:py-4 rounded-2xl hover:scale-[1.02] transition-transform inline-flex items-center justify-center gap-2">
              <Mail size={13} /> sportsofficer@itmgoi.in
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
