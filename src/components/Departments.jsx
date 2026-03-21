import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';

const departments = [
  {
    name: "Department of Engineering",
    icon: "⚙️",
    desc: "Nurturing innovators with cutting-edge labs and industry-led curriculum. Learn from industry experts and gain hands-on experience.",
    accent: "from-[#800000] to-red-600"
  },
  {
    name: "Department of Management",
    icon: "📊",
    desc: "Developing global business leaders through case-study based learning and corporate mentorship programs. Gain real-world leadership skills.",
    accent: "from-[#800000] to-red-700"
  },
  {
    name: "Department of Law",
    icon: "⚖️",
    desc: "Promoting justice and excellence in legal education through moot courts and extensive research facilities with top legal minds.",
    accent: "from-[#800000] to-red-800"
  },
  {
    name: "Agriculture Science",
    icon: "🌱",
    desc: "Advancing sustainable farming and modern agricultural technologies on our dedicated research farms with hands-on field work.",
    accent: "from-[#800000] to-red-600"
  },
  {
    name: "Computer Applications",
    icon: "💻",
    desc: "Mastering the world of code, AI, and cybersecurity with 24/7 access to high-performance computing labs and project-based learning.",
    accent: "from-[#800000] to-red-500"
  },
  {
    name: "Art & Design",
    icon: "🎨",
    desc: "Unleashing creativity in fashion, interior, and visual arts within our state-of-the-art design studios and annual gallery showcases.",
    accent: "from-[#800000] to-red-400"
  }
];

const emergingBranches = [
  { name: 'Data Science', icon: '📊' },
  { name: 'Internet of Things', icon: '🌐' },
  { name: 'AI & Machine Learning', icon: '🤖' },
  { name: 'Cyber Security', icon: '🛡️' },
];

export default function Departments() {
  return (
    /* Reduced py-24 to pt-12 to pull it up closer to the Stats above */
    <section id="departments" className="pt-12 pb-24 bg-white dark:bg-[#020617] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading - Tighter margins */}
        <div className="text-center mb-12"> 
          <Reveal>
            <span className="text-[#800000] dark:text-red-400 font-black uppercase tracking-[0.4em] text-[10px]">
              Academic Excellence
            </span>
          </Reveal>
          <Reveal delay={0.2}>
            <h2 className="text-4xl md:text-6xl font-[1000] text-black dark:text-white mt-2 tracking-tighter uppercase">
              Explore our <span className="text-[#800000]">Specializations</span>
            </h2>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-black dark:text-white max-w-2xl mx-auto font-bold mt-4 leading-relaxed">
              World-class education across diverse disciplines designed to make you industry-ready from day one.
            </p>
          </Reveal>
        </div>

        {/* Departments Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative p-10 bg-gray-50 dark:bg-white/[0.03] rounded-[3rem] border-2 border-transparent hover:border-[#800000] transition-all duration-500 shadow-sm"
            >
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${dept.accent} flex items-center justify-center text-3xl shadow-xl shadow-red-900/30 mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  {dept.icon}
                </div>
                
                <h3 className="text-2xl font-[1000] text-black dark:text-white mb-4 tracking-tighter uppercase group-hover:text-[#800000] transition-colors">
                  {dept.name}
                </h3>
                
                <p className="text-black dark:text-white text-base leading-relaxed mb-8 font-bold">
                  {dept.desc}
                </p>

                <button className="flex items-center gap-2 text-[11px] font-[1000] uppercase tracking-[0.2em] text-[#800000] dark:text-red-400 group-hover:gap-4 transition-all">
                  View Program <span className="text-xl">→</span>
                </button>
              </div>

              <div className="absolute bottom-0 left-0 h-2 w-0 bg-[#800000] group-hover:w-full transition-all duration-700 rounded-b-[3rem]" />
            </motion.div>
          ))}

          {/* ── EMERGING BRANCHES SPECIAL CARD ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            whileHover={{ y: -10 }}
            className="group relative p-10 bg-gradient-to-br from-[#800000]/5 to-red-50 dark:from-[#800000]/10 dark:to-red-950/20 rounded-[3rem] border-2 border-dashed border-[#800000]/30 hover:border-[#800000] hover:border-solid transition-all duration-500 shadow-sm"
          >
            <div className="relative z-10">
              {/* NEW badge */}
              <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-amber-500/30">
                New
              </div>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#800000] to-red-500 flex items-center justify-center text-3xl shadow-xl shadow-red-900/30 mb-8 group-hover:scale-110 transition-transform duration-500">
                🚀
              </div>
              
              <h3 className="text-2xl font-[1000] text-black dark:text-white mb-4 tracking-tighter uppercase group-hover:text-[#800000] transition-colors">
                Emerging Branches
              </h3>
              
              {/* Sub-branch pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {emergingBranches.map((branch) => (
                  <span
                    key={branch.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-900/60 rounded-full text-[11px] font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm"
                  >
                    <span className="text-sm">{branch.icon}</span>
                    {branch.name}
                  </span>
                ))}
              </div>

              <p className="text-black dark:text-white text-base leading-relaxed mb-8 font-bold">
                Future-ready specializations in Data Science, IoT, AI & ML, and Cyber Security.
              </p>

              <Link
                to="/emerging-branches"
                className="flex items-center gap-2 text-[11px] font-[1000] uppercase tracking-[0.2em] text-[#800000] dark:text-red-400 group-hover:gap-4 transition-all"
              >
                Explore Branches <span className="text-xl">→</span>
              </Link>
            </div>

            <div className="absolute bottom-0 left-0 h-2 w-0 bg-gradient-to-r from-[#800000] to-red-500 group-hover:w-full transition-all duration-700 rounded-b-[3rem]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}