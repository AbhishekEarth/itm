import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─── Main Departments ─────────────────────────────────────────────────────────
const departments = [
  {
    name: "Computer Science & Engineering",
    icon: "💻",
    desc: "Nurturing innovators with NBA-accredited programmes. Cutting-edge AI labs, industry connect and exceptional placement support.",
    accent: "from-[#800000] to-red-600",
    path: "/cs",
    badge: "NBA Accredited",
  },
  {
    name: "Information Technology",
    icon: "🌐",
    desc: "Developing digital-first professionals through 565 hybrid terminals, cloud computing labs, and AICTE-approved specializations.",
    accent: "from-[#800000] to-red-700",
    path: "/it",
    badge: "AICTE Approved",
  },
  {
    name: "Electronics & Communication",
    icon: "📡",
    desc: "Mastering VLSI design, signals, embedded systems and wireless communication with dedicated R&D labs since 1997.",
    accent: "from-[#800000] to-red-800",
    path: "/ece",
    badge: "AICTE Approved",
  },
  {
    name: "Civil Engineering",
    icon: "🏗️",
    desc: "Building the nation's infrastructure — structural engineering, geotechnics, transportation and sustainable construction.",
    accent: "from-[#800000] to-red-700",
    path: "/ce",
    badge: "Est. 1997",
  },
  {
    name: "Central Library",
    icon: "📚",
    desc: "A knowledge hub with thousands of volumes, digital resources, e-journals, and dedicated reading & research spaces.",
    accent: "from-[#800000] to-red-500",
    path: "/library",
    badge: "Knowledge Hub",
  },
];

// ─── Emerging Branches ────────────────────────────────────────────────────────
const emergingBranches = [
  { name: 'AI & ML', icon: '🤖', path: '/aiml' },
  { name: 'Cyber Security', icon: '🛡️', path: '/cyber-security' },
  { name: 'Cloud Computing', icon: '☁️', path: '/cloud-computing' },
  { name: 'Data Science', icon: '📊', path: '/emerging-branches' },
  { name: 'IoT', icon: '🌐', path: '/emerging-branches' },
];

export default function Departments() {
  return (
    <section id="departments" className="pt-12 pb-24 bg-white dark:bg-[#020617] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Heading */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#800000] dark:text-red-400 font-black uppercase tracking-[0.4em] text-[10px]"
          >
            Academic Excellence
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-[1000] text-black dark:text-white mt-2 tracking-tighter uppercase"
          >
            Explore our <span className="text-[#800000]">Specializations</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-black dark:text-white max-w-2xl mx-auto font-bold mt-4 leading-relaxed"
          >
            World-class education across diverse disciplines designed to make you industry-ready from day one.
          </motion.p>
        </div>

        {/* Departments Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept, index) => (
            <Link to={dept.path} key={index} className="block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative p-10 bg-gray-50 dark:bg-white/[0.03] rounded-[3rem] border-2 border-transparent hover:border-[#800000] transition-all duration-500 shadow-sm h-full"
              >
                <div className="relative z-10">
                  {dept.badge && (
                    <span className="mb-6 inline-block text-[#800000] dark:text-red-400 font-black tracking-widest text-[9px] uppercase px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded-full border border-red-100 dark:border-red-900/40">
                      {dept.badge}
                    </span>
                  )}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${dept.accent} flex items-center justify-center text-3xl shadow-xl shadow-red-900/30 mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    {dept.icon}
                  </div>

                  <h3 className="text-2xl font-[1000] text-black dark:text-white mb-4 tracking-tighter uppercase group-hover:text-[#800000] transition-colors">
                    {dept.name}
                  </h3>

                  <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-8 font-medium">
                    {dept.desc}
                  </p>

                  <span className="flex items-center gap-2 text-[11px] font-[1000] uppercase tracking-[0.2em] text-[#800000] dark:text-red-400 group-hover:gap-4 transition-all">
                    View Program <span className="text-xl">→</span>
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 h-2 w-0 bg-[#800000] group-hover:w-full transition-all duration-700 rounded-b-[3rem]" />
              </motion.div>
            </Link>
          ))}

          {/* Emerging Branches – Special Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: departments.length * 0.1 }}
            whileHover={{ y: -10 }}
            className="group relative p-10 bg-gray-50 dark:bg-white/[0.03] rounded-[3rem] border-2 border-transparent hover:border-[#800000] transition-all duration-500 shadow-sm"
          >
            <div className="relative z-10">
              <span className="mb-6 inline-block text-[#800000] dark:text-red-400 font-black tracking-widest text-[9px] uppercase px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded-full border border-red-100 dark:border-red-900/40">
                Under CSE
              </span>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#800000] to-red-500 flex items-center justify-center text-3xl shadow-xl shadow-red-900/30 mb-6 group-hover:scale-110 transition-transform duration-500">
                🚀
              </div>

              <h3 className="text-2xl font-[1000] text-black dark:text-white mb-4 tracking-tighter uppercase group-hover:text-[#800000] transition-colors">
                Emerging Branches
              </h3>

              {/* Branch Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {emergingBranches.map((branch) => (
                  <Link
                    key={branch.name}
                    to={branch.path}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700 hover:border-[#800000] hover:text-[#800000] dark:hover:border-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <span className="text-sm">{branch.icon}</span>
                    {branch.name}
                  </Link>
                ))}
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-8 font-medium">
                Future-ready specializations in Data Science, IoT, AI &amp; ML, and Cyber Security.
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
