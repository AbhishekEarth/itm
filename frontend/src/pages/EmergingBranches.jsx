import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import { usePublicDepartment } from '../hooks/usePublicDepartment';

// Bundled defaults for the CSE-Emerging HoD. Used until the admin uploads a
// custom photo / writes their own message via /admin/departments → AIML → HoD.
const EMERGING_HOD_DEFAULTS = {
  name: 'Dr. Deepak Gupta',
  role: 'Coordinator · CSE Emerging Branches',
  qualification: 'Ph.D · Computer Science & Engineering',
  message:
    "Welcome to the CSE Emerging Branches cell at ITM Gwalior. The technologies of tomorrow — Artificial Intelligence, Data Science, Cyber Security, Cloud Computing and the Internet of Things — are reshaping every industry, and our specialised B.Tech tracks are designed to put you at the forefront of that change. We blend a strong computer-science foundation with hands-on labs, industry-grade tooling, and project-based learning so that every graduate leaves with both a deep technical edge and the confidence to build, secure and scale real-world systems. Step in with curiosity — we'll equip you with the rest.",
};

// Default profile photo used until the admin uploads a personalised picture
// via /admin/departments → AIML → HoD Profile → Upload photo.
const DEFAULT_HOD_PHOTO =
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80";

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
    path: '/department/cse/data-science',
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
    path: '/department/cse/iot',
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
    path: '/department/cse/aiml',
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
    path: '/department/cse/cyber-security',
  },
  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    icon: '☁️',
    color: 'from-blue-500 to-indigo-700',
    shadowColor: 'shadow-blue-900/30',
    description: 'Master cloud infrastructure and distributed systems. Learn AWS, Azure, DevOps, and cloud-native application development.',
    highlights: ['Cloud Architecture', 'DevOps & CI/CD', 'Virtualization', 'Serverless Computing', 'Containerization', 'Cloud Security'],
    career: ['Cloud Architect', 'DevOps Engineer', 'Cloud Developer', 'SysOps Administrator'],
    path: '/department/cse/cloud-computing',
  },
];

// Import Link
import { Link } from 'react-router-dom';

// ─── Sub-components ───────────────────────────────────────────────────────────

function BranchCard({ branch, isExpanded, onToggle }) {
  return (
    <Card className="overflow-hidden">
      {/* Branch Header - Clickable area for toggle */}
      <div 
        onClick={onToggle}
        className={`relative p-3 sm:p-6 md:p-8 flex items-center gap-3 sm:gap-5 md:gap-8 group cursor-pointer
          ${isExpanded ? 'bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/80 dark:to-gray-900/40' : 'hover:bg-gray-50/80 dark:hover:bg-gray-900/30'}
          transition-all duration-300`}
      >
        {/* Icon */}
        <div className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${branch.color} flex items-center justify-center text-2xl sm:text-3xl md:text-4xl shadow-xl ${branch.shadowColor} shrink-0 group-hover:scale-110 transition-transform duration-500`}>
          {branch.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-xl md:text-2xl font-black text-[#0b2a4a] dark:text-white tracking-tight group-hover:text-[#800000] dark:group-hover:text-red-400 transition-colors">
            {branch.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mt-1 line-clamp-1 md:line-clamp-2">
            {!isExpanded ? branch.description : "Click to view less details"}
          </p>
        </div>

        {/* Improved Dropdown Toggle Button */}
        <div className="flex items-center justify-center shrink-0">
          <button
            aria-label={isExpanded ? "Collapse" : "Expand"}
            className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300
              ${isExpanded ? 'bg-[#800000] text-white rotate-180' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:bg-[#800000] group-hover:text-white'}
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>

        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${branch.color} transition-all duration-500 ${isExpanded ? 'w-full' : 'w-0 group-hover:w-1/3'}`} />
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-3 sm:px-6 md:px-8 pb-4 sm:pb-8 pt-2 border-t border-gray-100 dark:border-gray-800">

              {/* Description */}
              <div className="mb-4 sm:mb-8">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                  {branch.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-3 sm:gap-6">
                {/* Key Topics */}
                <div className="p-3 sm:p-6 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800">
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
                <div className="p-3 sm:p-6 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800">
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

              {/* CTA Button as Link */}
              <div className="mt-6 flex justify-end">
                <Link 
                  to={branch.path || '#'}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r ${branch.color} text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg ${branch.shadowColor} hover:scale-105 transition-transform duration-300 cursor-pointer`}
                >
                  Explore Curriculum
                  <span className="text-sm">→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EmergingBranches() {
  const [expandedBranch, setExpandedBranch] = useState(null);
  // CSE-Emerging HoD lives on the AIML department row in the DB. The admin
  // edits Dr. Deepak Gupta's name, photo, message etc. via /admin/departments
  // → AIML → HoD Profile, and this page picks the live values up automatically.
  const { data: aiml } = usePublicDepartment('AIML');
  const hodFromApi = aiml?.hod;
  const hod = {
    name:    hodFromApi?.name          || EMERGING_HOD_DEFAULTS.name,
    role:    hodFromApi?.role          || EMERGING_HOD_DEFAULTS.role,
    qual:    hodFromApi?.qualification || EMERGING_HOD_DEFAULTS.qualification,
    message: hodFromApi?.message       || EMERGING_HOD_DEFAULTS.message,
    photo:   hodFromApi?.photo         || DEFAULT_HOD_PHOTO,
  };

  const toggleBranch = (id) => {
    setExpandedBranch(expandedBranch === id ? null : id);
  };

  return (
    <PageLayout
      name={<>CSE — Emerging<br /><span className="text-red-200">Branches</span></>}
      shortName="CSE-Emerging"
      badge="Future-Ready Programs · Under CSE Umbrella"
      subtitle="Explore our cutting-edge specializations designed for the technologies of tomorrow. Choose your path in Data Science, IoT, AI & ML, Cyber Security or Cloud Computing — all delivered under the Department of Computer Science & Engineering."
      chips={[['🚀', '5 Specializations'], ['🎓', 'Industry-Aligned'], ['💡', 'Innovation-Driven'], ['🏆', 'AICTE Approved']]}
      menuItems={[]} // No sidebar for overview
    >
      {/* HoD's Desk — Coordinator for CSE Emerging Branches */}
      <Card className="overflow-hidden !mb-4 sm:!mb-6">
        <div className="relative bg-gradient-to-br from-[#1a0606] via-[#3e0202] to-[#800000] text-white p-4 sm:p-6 md:p-8">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-xl ring-2 ring-amber-200/50 bg-gray-200">
              <img
                src={hod.photo}
                alt={hod.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-200 text-[9px] font-black uppercase tracking-[0.25em] mb-2">
                🎓 HoD's Desk
              </span>
              <h3 className="text-lg sm:text-2xl font-black tracking-tight mb-0.5">
                {hod.name}
              </h3>
              <p className="text-amber-200/90 text-[11px] sm:text-xs font-black uppercase tracking-widest mb-1">
                {hod.role}
              </p>
              <p className="text-rose-100/80 text-[11px] sm:text-xs font-medium">
                {hod.qual}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-900">
          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#800000] dark:text-rose-300 mb-3">
            Message from the HoD
          </div>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium italic">
            "{hod.message}"
          </p>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium mt-3">
            — <span className="font-black text-[#1a0606] dark:text-white">{hod.name}</span>, {hod.role}
          </p>
        </div>
      </Card>

      {/* Branch Cards List */}
      <div className="space-y-3 sm:space-y-6">
        {branches.map((branch) => (
          <BranchCard
            key={branch.id}
            branch={branch}
            isExpanded={expandedBranch === branch.id}
            onToggle={() => toggleBranch(branch.id)}
          />
        ))}
      </div>

      {/* Why Choose Section */}
      <Card className="p-4 sm:p-8 md:p-10 !mt-8 sm:!mt-16">
        <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-8">
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#800000] to-[#5a0000] flex items-center justify-center text-2xl sm:text-4xl shadow-xl shadow-red-900/25 shrink-0">
            🎯
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-base sm:text-xl font-black text-[#0b2a4a] dark:text-white tracking-tight mb-2">
              Why Choose CSE — Emerging Branches?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed line-clamp-3 sm:line-clamp-none">
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
    </PageLayout>
  );
}
