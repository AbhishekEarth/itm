import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Branch Data ──────────────────────────────────────────────────────────────
const branches = [
  {
    id: 'data-science',
    name: 'Data Science',
    icon: '📊',
    color: 'from-violet-600 to-purple-700',
    shadowColor: 'shadow-violet-900/30',
    description: 'Master the art of extracting insights from complex data. Learn statistical analysis, machine learning, data visualization, and big data technologies to drive data-informed decisions.',
    highlights: ['Python & R Programming', 'Machine Learning & Deep Learning', 'Big Data Analytics', 'Data Visualization & Storytelling', 'Statistical Modeling', 'Natural Language Processing'],
    career: ['Data Scientist', 'Data Analyst', 'ML Engineer', 'Business Intelligence Analyst', 'Data Architect'],
    path: '/emerging/data-science',
  },
  {
    id: 'iot',
    name: 'Internet of Things',
    icon: '🌐',
    color: 'from-cyan-500 to-teal-600',
    shadowColor: 'shadow-teal-900/30',
    description: 'Explore the interconnected world of smart devices and systems. Build expertise in sensor networks, embedded systems, cloud computing, and IoT application development.',
    highlights: ['Embedded Systems & Sensors', 'IoT Protocols & Communication', 'Edge & Cloud Computing', 'Smart City Applications', 'Industrial IoT', 'Wearable Technology'],
    career: ['IoT Developer', 'Embedded Systems Engineer', 'IoT Solutions Architect', 'Smart Systems Designer', 'Automation Engineer'],
    path: '/emerging/iot',
  },
  {
    id: 'aiml',
    name: 'AI & Machine Learning',
    icon: '🤖',
    color: 'from-orange-500 to-red-600',
    shadowColor: 'shadow-orange-900/30',
    description: 'Dive into the cutting-edge world of Artificial Intelligence and Machine Learning. Develop intelligent systems that can learn, reason, and make autonomous decisions.',
    highlights: ['Neural Networks & Deep Learning', 'Computer Vision', 'Reinforcement Learning', 'Generative AI & LLMs', 'Robotics & Automation', 'AI Ethics & Governance'],
    career: ['AI Engineer', 'ML Researcher', 'Computer Vision Engineer', 'NLP Specialist', 'AI Product Manager'],
    path: '/emerging/aiml',
  },
  {
    id: 'cyber-security',
    name: 'Cyber Security',
    icon: '🛡️',
    color: 'from-emerald-500 to-green-700',
    shadowColor: 'shadow-emerald-900/30',
    description: 'Protect digital assets and infrastructure from evolving cyber threats. Master ethical hacking, cryptography, network security, and digital forensics to safeguard organizations.',
    highlights: ['Ethical Hacking & Penetration Testing', 'Cryptography & Encryption', 'Network Security', 'Digital Forensics', 'Incident Response', 'Cloud Security'],
    career: ['Cybersecurity Analyst', 'Ethical Hacker', 'Security Architect', 'SOC Analyst', 'Forensic Investigator'],
    path: '/emerging/cyber-security',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionHeading({ children }) {
  return (
    <h2 className="text-2xl font-black text-[#0b2a4a] dark:text-white mb-6 flex items-center gap-3">
      <span className="w-8 h-1 bg-[#800000] rounded-full shrink-0"></span>
      {children}
    </h2>
  );
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EmergingBranches() {
  const [expandedBranch, setExpandedBranch] = useState(null);

  const toggleBranch = (id) => {
    setExpandedBranch(expandedBranch === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] transition-colors duration-500">

      {/* ── HERO BANNER ──────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-[#3e0202] via-[#800000] to-[#5a0000] pt-16 pb-28 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-8 right-32 w-72 h-72 rounded-full border-2 border-white/10 animate-pulse"></div>
          <div className="absolute -bottom-20 -left-10 w-96 h-96 rounded-full border border-white/5"></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-white/5"></div>
          {/* Floating particles */}
          <motion.div
            className="absolute top-20 right-1/4 w-3 h-3 rounded-full bg-red-400/30"
            animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-40 left-1/4 w-2 h-2 rounded-full bg-white/20"
            animate={{ y: [10, -30, 10], x: [5, -15, 5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-1/3 w-4 h-4 rounded-full bg-red-300/20"
            animate={{ y: [-15, 25, -15] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block text-red-200 font-bold tracking-widest text-xs uppercase mb-3 px-3 py-1 bg-white/10 rounded-full border border-white/20"
          >
            Future-Ready Programs
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-tight"
          >
            Emerging<br />
            <span className="text-red-200">Branches</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-red-100/80 max-w-xl text-sm leading-relaxed font-medium"
          >
            Explore our cutting-edge specializations designed for the technologies of tomorrow. 
            Choose your path in Data Science, IoT, AI & ML, or Cyber Security.
          </motion.p>

          {/* Quick-stat chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {[['🚀', '4 Specializations'], ['🎓', 'Industry-Aligned'], ['💡', 'Innovation-Driven'], ['🏆', 'AICTE Approved']].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-4 py-2 rounded-full text-xs font-bold">
                <span>{icon}</span> {label}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 -mt-14 pb-24">

        {/* Branch Cards Grid */}
        <div className="space-y-6">
          {branches.map((branch, index) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                {/* Branch Header - Clickable */}
                <button
                  onClick={() => toggleBranch(branch.id)}
                  className="w-full text-left"
                >
                  <div className={`relative p-6 md:p-8 flex items-center gap-5 md:gap-8 group cursor-pointer
                    ${expandedBranch === branch.id ? 'bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/80 dark:to-gray-900/40' : 'hover:bg-gray-50/80 dark:hover:bg-gray-900/30'}
                    transition-all duration-300`}
                  >
                    {/* Icon */}
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${branch.color} flex items-center justify-center text-3xl md:text-4xl shadow-xl ${branch.shadowColor} shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                      {branch.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl md:text-2xl font-black text-[#0b2a4a] dark:text-white tracking-tight group-hover:text-[#800000] dark:group-hover:text-red-400 transition-colors">
                        {branch.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1 line-clamp-1 md:line-clamp-2">
                        {branch.description}
                      </p>
                    </div>

                    {/* Expand/Collapse Arrow */}
                    <motion.div
                      animate={{ rotate: expandedBranch === branch.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-[#800000] group-hover:text-white transition-colors duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </motion.div>

                    {/* Bottom accent line */}
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${branch.color} transition-all duration-500 ${expandedBranch === branch.id ? 'w-full' : 'w-0 group-hover:w-1/3'}`} />
                  </div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedBranch === branch.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 md:px-8 pb-8 pt-2 border-t border-gray-100 dark:border-gray-800">
                        
                        {/* Description */}
                        <div className="mb-8">
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                            {branch.description}
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Key Topics */}
                          <div className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <h4 className="font-black text-sm uppercase tracking-widest text-[#800000] dark:text-red-400 mb-4 flex items-center gap-2">
                              <span className="w-5 h-0.5 bg-[#800000] rounded"></span>
                              Key Topics
                            </h4>
                            <ul className="space-y-3">
                              {branch.highlights.map((item, i) => (
                                <motion.li
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 font-medium"
                                >
                                  <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${branch.color} shrink-0`}></span>
                                  {item}
                                </motion.li>
                              ))}
                            </ul>
                          </div>

                          {/* Career Paths */}
                          <div className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <h4 className="font-black text-sm uppercase tracking-widest text-[#800000] dark:text-red-400 mb-4 flex items-center gap-2">
                              <span className="w-5 h-0.5 bg-[#800000] rounded"></span>
                              Career Paths
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {branch.career.map((role, i) => (
                                <motion.span
                                  key={i}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: i * 0.05 }}
                                  className={`px-4 py-2 rounded-full text-xs font-bold border bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#800000] dark:hover:border-red-500 hover:text-[#800000] dark:hover:text-red-400 transition-colors cursor-default`}
                                >
                                  {role}
                                </motion.span>
                              ))}
                            </div>

                            {/* Why Choose Section */}
                            <div className="mt-6 p-4 bg-gradient-to-r from-[#800000]/5 to-red-50/50 dark:from-red-900/20 dark:to-red-900/10 border-l-4 border-[#800000] rounded-r-xl">
                              <p className="text-xs text-gray-600 dark:text-gray-400 font-bold">
                                💡 <span className="text-[#800000] dark:text-red-400">Industry demand</span> for {branch.name} professionals is growing at 25%+ annually with lucrative career opportunities.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <div className="mt-6 flex justify-end">
                          <div className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${branch.color} text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg ${branch.shadowColor} hover:scale-105 transition-transform duration-300 cursor-pointer`}>
                            Explore {branch.name}
                            <span className="text-sm">→</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <Card className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#800000] to-[#5a0000] flex items-center justify-center text-4xl shadow-xl shadow-red-900/25 shrink-0">
                🎯
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-black text-[#0b2a4a] dark:text-white tracking-tight mb-2">
                  Why Choose Emerging Branches?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  Our emerging branch programs are designed in collaboration with industry leaders to ensure you gain 
                  the most relevant skills. With hands-on project-based learning, industry internships, and 
                  state-of-the-art lab facilities, you'll be prepared to lead the technological revolution.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 shrink-0">
                {[
                  { num: '100%', label: 'Placement Assist' },
                  { num: '20+', label: 'Industry Partners' },
                  { num: '50+', label: 'Lab Projects' },
                  { num: '4', label: 'Specializations' },
                ].map(({ num, label }) => (
                  <div key={label} className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="text-lg font-black text-[#800000] dark:text-red-400">{num}</div>
                    <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
