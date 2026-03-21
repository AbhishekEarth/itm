import React, { useState } from 'react';
import labCs1 from '../assets/lab_cs1.png';
import labCs2 from '../assets/lab_cs2.jpg';
import labCs3 from '../assets/lab_cs3.png';
import labCs4 from '../assets/lab_cs4.png';
import labCs5 from '../assets/lab_cs5.jpg';

// ─── Data ─────────────────────────────────────────────────────────────────────
const missionPoints = [
  'To provide high quality education through an effective teaching-learning process, emphasizing active participation of the students.',
  'To build scientifically strong engineers to cater to the needs of industry, higher studies, research and startups.',
  'To stir young minds, ingrained with professional and behavioral ethics for the betterment of the society.',
];

const peoStatements = [
  'Our graduates will exhibit team-work and leadership qualities to meet stakeholders\' business objectives in their careers.',
  'Our graduates will employ capabilities of solving complex engineering problems to succeed in research and / or higher studies.',
  'Our graduates will demonstrate application of comprehensive technical knowledge for innovation and entrepreneurship.',
  'Our graduates will evolve in ethical and professional practices and enhance socio-economic contributions to the society.',
];

const psoStatements = [
  'The ability to understand the principles of computer hardware and software to analyze, design and develop algorithms for complex and logical problems.',
  'Enhance programming concepts and professional competencies of students by exercising principles of software engineering to fix various computational problems.',
  'To implement emerging technologies such as internet of things, cloud computing, artificial intelligence, machine learning etc. to serve the society.',
];

const hodMessage = [
  'I warmly welcome you to the Department of Computer Science & Engineering. We pride ourselves on providing pioneering visionaries of tomorrow, conducting cutting-edge research, and leading a wide range of initiatives that affirm the transformative power of computing and informatics.',
  'The Department has well-qualified and experienced faculty which strengthens the students to become technologically proficient, research competent, and socially accountable for the welfare of society. The Department has high computing machines connected with a high-speed leased line.',
  'High-quality academic programs provide a unique combination of teaching, research, and hands-on services which strengthen problem-solving skills, allowing students to expand their knowledge, work independently, think critically, and find new ways to apply science for the benefit of society.',
  'Practical experience is offered to students and the opportunity to work first-hand in the state-of-the-art laboratory on research projects with local industry experts, collecting data and conducting research that leads to viable solutions for businesses.',
  'We strive to improve business and society through educational leadership, research and development, intellectual partnerships, and outreach. Students work with Professors who are leaders in their respective disciplines, have access to state-of-the-art labs that offer a wide range of opportunities. This offers our students critical thinking skills & practical skills that are valued by reputed companies and academic institutions.',
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
export default function CSDepartment() {
  const [activeTab, setActiveTab] = useState('About Department');

  const menuItems = ['About Department', 'HoD Desk', 'Course', 'Laboratories', 'Faculty', 'Placement', 'OBE'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] transition-colors duration-500">

      {/* ── HERO BANNER ─────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-[#3e0202] via-[#800000] to-[#5a0000] pt-16 pb-24 overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-8 right-32 w-72 h-72 rounded-full border-2 border-white"></div>
          <div className="absolute -bottom-20 -left-10 w-96 h-96 rounded-full border border-white/50"></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-white/20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <span className="inline-block text-red-200 font-bold tracking-widest text-xs uppercase mb-3 px-3 py-1 bg-white/10 rounded-full border border-white/20">
            NBA Accredited 2022–2025
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-tight">
            Computer Science &<br />
            <span className="text-red-200">Engineering</span>
          </h1>
          <p className="text-red-100/80 max-w-xl text-sm leading-relaxed font-medium">
            Est. July 1997 · B.Tech & M.Tech Programmes · Cutting-Edge Research · State-of-the-Art Laboratories
          </p>

          {/* Quick-stat chips */}
          <div className="mt-8 flex flex-wrap gap-3">
            {[['🎓', 'B.Tech & M.Tech'], ['🔬', 'Research Labs'], ['💡', 'Industry Connect'], ['🏆', 'NBA Accredited']].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-4 py-2 rounded-full text-xs font-bold">
                <span>{icon}</span> {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 pb-24">
        <div className="grid lg:grid-cols-4 gap-8 items-start">

          {/* ── SIDEBAR ─────────────────────────────────────────── */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32">
              <Card className="overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#800000] via-red-500 to-[#800000]"></div>
                <div className="p-5">
                  <h3 className="font-black text-xs uppercase tracking-widest mb-4 text-[#800000]">Department Menu</h3>
                  <nav className="flex flex-col gap-1">
                    {menuItems.map((item) => (
                      <button
                        key={item}
                        onClick={() => setActiveTab(item)}
                        className={`text-left py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 ${
                          activeTab === item
                            ? 'bg-[#800000] text-white shadow-md shadow-red-900/30'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-[#800000] dark:hover:text-red-400'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </nav>
                </div>
              </Card>
            </div>
          </aside>

          {/* ── MAIN CONTENT ────────────────────────────────────── */}
          <main className="lg:col-span-3 space-y-8">

            {/* ══ ABOUT DEPARTMENT ══════════════════════════════════ */}
            {activeTab === 'About Department' && (
              <div className="space-y-8">

                {/* About text */}
                <Card className="p-8">
                  <SectionHeading>About Department</SectionHeading>
                  <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    <p>
                      The Discipline of Computer Science and Engineering (CSE) was set up in <strong className="text-[#800000] dark:text-red-400">July 1997</strong>. It is one of the disciplines that offers <strong>Bachelor of Technology (B.Tech)</strong> and <strong>Master of Technology (M.Tech.)</strong> programmes. The discipline adopts a modern approach to teaching wherein students are rendered in adequate academic freedom to innovate and learn in the process. Facilities, including the latest software and advanced hardware are available in various laboratories for use in both teaching and research. This facilitates adequate implementation of major projects.
                    </p>
                    <p>
                      The faculty members of the discipline are from diverse streams and specializations. Being a part of an established institute, together with extremely competent research faculty, the Department offers a unique interactive platform for the students to explore the arena of fundamentals.
                    </p>
                  </div>
                </Card>

                {/* Feature cards */}
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { icon: '📅', title: 'Est. July 1997', sub: 'Over 25 years of academic excellence' },
                    { icon: '🎓', title: 'B.Tech & M.Tech', sub: 'Undergraduate and postgraduate programmes' },
                    { icon: '🔬', title: 'Advanced Labs', sub: 'Latest software & hardware infrastructure' },
                    { icon: '👨‍🏫', title: 'Diverse Faculty', sub: 'Experts from varied streams & specializations' },
                  ].map(({ icon, title, sub }) => (
                    <div key={title} className="flex items-start gap-4 p-5 bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md hover:border-red-200 dark:hover:border-red-900/50 transition-all duration-200">
                      <div className="text-3xl">{icon}</div>
                      <div>
                        <div className="font-black text-[#0b2a4a] dark:text-white text-sm">{title}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Vision & Mission */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Vision */}
                  <div className="p-8 bg-gradient-to-br from-[#800000] to-[#5a0000] rounded-2xl text-white shadow-xl shadow-red-900/25">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🔭</span>
                      <h3 className="text-lg font-black uppercase tracking-tight">Vision</h3>
                    </div>
                    <p className="text-red-100/90 text-sm leading-relaxed">
                      The department envisions nurturing students to become <strong className="text-white">technologically proficient</strong>, <strong className="text-white">research competent</strong> and <strong className="text-white">socially accountable</strong> for the welfare of the society.
                    </p>
                  </div>

                  {/* Mission */}
                  <div className="p-8 bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🎯</span>
                      <h3 className="text-lg font-black uppercase tracking-tight text-[#0b2a4a] dark:text-red-400">Mission</h3>
                    </div>
                    <ul className="space-y-3">
                      {missionPoints.map((m, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#800000] dark:bg-red-500 shrink-0"></span>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* PEO */}
                <Card className="p-8">
                  <SectionHeading>Program Educational Objectives (PEO)</SectionHeading>
                  <div className="grid gap-4">
                    {peoStatements.map((peo, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group">
                        <div className="w-8 h-8 rounded-full bg-[#800000] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-md shadow-red-900/20">
                          PEO{i + 1}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          {peo}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* PSO */}
                <Card className="p-8">
                  <SectionHeading>Program Specific Outcomes (PSO)</SectionHeading>
                  <div className="grid gap-4">
                    {psoStatements.map((pso, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group">
                        <div className="w-8 h-8 rounded-full bg-[#0b2a4a] dark:bg-red-900/60 text-white dark:text-red-200 flex items-center justify-center text-xs font-black shrink-0">
                          PSO{i + 1}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          {pso}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>

              </div>
            )}

            {/* ══ HOD DESK ══════════════════════════════════════════ */}
            {activeTab === 'HoD Desk' && (
              <div className="space-y-6">
                <Card className="p-8">
                  <SectionHeading>HoD Desk</SectionHeading>

                  {/* Quote banner */}
                  <div className="mb-8 p-6 bg-gradient-to-r from-[#800000]/8 to-red-50 dark:from-red-900/20 dark:to-red-900/10 border-l-4 border-[#800000] rounded-r-2xl">
                    <p className="text-lg font-black text-[#800000] dark:text-red-400 italic">
                      "Welcome to the Future of Computing"
                    </p>
                  </div>

                  {/* HoD avatar + content */}
                  <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
                    <div className="shrink-0 text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-[#800000] to-[#5a0000] rounded-2xl flex items-center justify-center text-4xl shadow-xl shadow-red-900/25 mx-auto">
                        🎓
                      </div>
                      <p className="mt-3 font-black text-[#0b2a4a] dark:text-white text-xs uppercase tracking-widest">Head of Department</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">CS&amp;E Department</p>
                    </div>
                    <div className="flex-1 space-y-4">
                      {hodMessage.map((para, i) => (
                        <p key={i} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Key highlights from HoD message */}
                <div className="grid sm:grid-cols-3 gap-5">
                  {[
                    { icon: '👨‍🏫', title: 'Expert Faculty', sub: 'Well-qualified & experienced research-active staff' },
                    { icon: '🏭', title: 'Industry Connect', sub: 'Research with local industry experts & partners' },
                    { icon: '🧠', title: 'Critical Thinking', sub: 'Skills valued by reputed companies & institutions' },
                  ].map(({ icon, title, sub }) => (
                    <div key={title} className="p-6 bg-gradient-to-br from-[#800000] to-[#5a0000] rounded-2xl text-white text-center shadow-lg shadow-red-900/20">
                      <div className="text-4xl mb-3">{icon}</div>
                      <div className="font-black text-base">{title}</div>
                      <div className="text-red-200 text-xs mt-1 leading-relaxed">{sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══ LABORATORIES ══════════════════════════════════════ */}
            {activeTab === 'Laboratories' && (
              <div className="space-y-8">

                {/* Intro card */}
                <Card className="p-8">
                  <SectionHeading>Laboratories</SectionHeading>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium mb-8">
                    The Department of Computer Science &amp; Engineering houses a range of state-of-the-art laboratories
                    equipped with the latest hardware and software facilities, supporting both curriculum requirements
                    and advanced research activities. Each lab is designed to provide hands-on experience in core and
                    emerging areas of computing.
                  </p>

                  {/* Lab grid */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { icon: '🐍', name: 'Python Lab', desc: 'Programming, data science & ML practicals using Python ecosystem' },
                      { icon: '🌐', name: 'Networking Lab / Cloud Computing', desc: 'Network configuration, protocols, and cloud infrastructure hands-on' },
                      { icon: '💾', name: 'Operating System Lab', desc: 'OS concepts, process management, scheduling & system calls' },
                      { icon: '🔢', name: 'Data Structure & Algorithms Lab', desc: 'Implementation and analysis of fundamental DSA concepts' },
                      { icon: '🗄️', name: 'DBMS Laboratory', desc: 'Database design, SQL programming and database management systems' },
                      { icon: '🖥️', name: 'Project Lab / Computer Graphics', desc: 'Final year projects and computer graphics rendering & visualization' },
                      { icon: '☕', name: 'Software Engineering / JAVA Lab', desc: 'SDLC, design patterns, and Java programming practicals' },
                    ].map(({ icon, name, desc }) => (
                      <div
                        key={name}
                        className="flex items-start gap-4 p-5 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-900/40 transition-all duration-200 group"
                      >
                        <div className="w-11 h-11 rounded-xl bg-[#800000]/10 dark:bg-red-900/30 flex items-center justify-center text-2xl shrink-0 group-hover:bg-[#800000] transition-colors duration-200">
                          <span className="group-hover:grayscale-0">{icon}</span>
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-[#0b2a4a] dark:text-white group-hover:text-[#800000] dark:group-hover:text-red-400 transition-colors">{name}</h4>
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Photo Gallery */}
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-[#800000] rounded"></span>
                    Lab Photo Gallery
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { src: labCs1, alt: 'Computer Lab – students working at desktops', caption: 'Computer Lab Session' },
                      { src: labCs2, alt: 'Networking Lab – students at workstations', caption: 'Networking Lab' },
                      { src: labCs3, alt: 'Classroom lecture session', caption: 'Classroom Lecture' },
                      { src: labCs4, alt: 'Python / AI training session with projector', caption: 'Python & AI Training' },
                      { src: labCs5, alt: 'Exam / practical session in large lab hall', caption: 'Practical Examination Hall' },
                    ].map(({ src, alt, caption }, i) => (
                      <div
                        key={i}
                        className={`group relative rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 ${
                          i === 4 ? 'col-span-2 md:col-span-1' : ''
                        }`}
                      >
                        <img
                          src={src}
                          alt={alt}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <p className="text-white text-xs font-bold">{caption}</p>
                          <p className="text-white/70 text-[10px]">CS&E Department — ITM Gwalior</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ══ FACULTY ═══════════════════════════════════════════ */}
            {activeTab === 'Faculty' && (
              <div className="space-y-8">

                {/* Faculty table */}
                <Card className="overflow-hidden">
                  <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                    <SectionHeading>Faculty Members</SectionHeading>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#800000] text-white">
                          <th className="px-5 py-4 text-center font-black text-xs uppercase tracking-wide w-12">S.No.</th>
                          <th className="px-5 py-4 text-left font-black text-xs uppercase tracking-wide">Name</th>
                          <th className="px-5 py-4 text-center font-black text-xs uppercase tracking-wide">Qualification</th>
                          <th className="px-5 py-4 text-center font-black text-xs uppercase tracking-wide">Designation</th>
                          <th className="px-5 py-4 text-center font-black text-xs uppercase tracking-wide">Experience</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {[
                          { sno: 1,  name: 'Dr. Rishi Soni',               qual: 'Ph.D',   desig: 'Professor',           exp: '28+ Years' },
                          { sno: 2,  name: 'Dr. Pradeep Yadav',             qual: 'Ph.D',   desig: 'Associate Professor', exp: '26+ Years' },
                          { sno: 3,  name: 'Dr. Deepak Omprakash Gupta',    qual: 'Ph.D',   desig: 'Associate Professor', exp: '2+ Years'  },
                          { sno: 4,  name: 'Dr. Monika Chauhan',            qual: 'Ph.D',   desig: 'Associate Professor', exp: '1+ Years'  },
                          { sno: 5,  name: 'Ms. Priusha Narwariya',         qual: 'M.Tech', desig: 'Asst. Professor',     exp: '20+ Years' },
                          { sno: 6,  name: 'Mr. Arun Agrawal',              qual: 'M.Tech', desig: 'Asst. Professor',     exp: '19+ Years' },
                          { sno: 7,  name: 'Mr. Gaurav Dubey',              qual: 'M.Tech', desig: 'Asst. Professor',     exp: '19+ Years' },
                          { sno: 8,  name: 'Mr. Chandra Prakash Bhargava', qual: 'M.Tech', desig: 'Asst. Professor',     exp: '18+ Years' },
                          { sno: 9,  name: 'Ms. Aruna Bajpai',              qual: 'M.Tech', desig: 'Asst. Professor',     exp: '18+ Years' },
                          { sno: 10, name: 'Ms. Archana Tomar',             qual: 'M.Tech', desig: 'Asst. Professor',     exp: '18+ Years' },
                          { sno: 11, name: 'Ms. Rakhi Sunny Arora',         qual: 'M.Tech', desig: 'Asst. Professor',     exp: '14+ Years' },
                          { sno: 12, name: 'Mr. Nitin Dixit',               qual: 'M.Tech', desig: 'Asst. Professor',     exp: '13+ Years' },
                          { sno: 13, name: 'Mr. Yogendra Singh Rathore',    qual: 'M.Tech', desig: 'Asst. Professor',     exp: '13+ Years' },
                          { sno: 14, name: 'Mr. Yogesh Kumar Sharma',       qual: 'M.Tech', desig: 'Asst. Professor',     exp: '2+ Years'  },
                          { sno: 15, name: 'Ms. Jyoti Kumari',              qual: 'M.Tech', desig: 'Asst. Professor',     exp: '2+ Years'  },
                          { sno: 16, name: 'Mr. Vijay Prakash Sharma',      qual: 'M.Tech', desig: 'Asst. Professor',     exp: '2+ Years'  },
                          { sno: 17, name: 'Ms. Samiksha Khule',            qual: 'M.Tech', desig: 'Asst. Professor',     exp: '2+ Years'  },
                          { sno: 18, name: 'Ms. Muskan Sihare',             qual: 'M.Tech', desig: 'Asst. Professor',     exp: '2+ Years'  },
                          { sno: 19, name: 'Ms. Smriti Singh Bhadoriya',    qual: 'M.Tech', desig: 'Asst. Professor',     exp: '1+ Years'  },
                          { sno: 20, name: 'Mr. Khemchand Shakywar',        qual: 'M.Tech', desig: 'Asst. Professor',     exp: '4+ Years'  },
                          { sno: 21, name: 'Mr. Ravi Mishra',               qual: 'M.Tech', desig: 'Asst. Professor',     exp: '1+ Years'  },
                          { sno: 22, name: 'Mr. Deepak Kumar Mishra',       qual: 'M.Tech', desig: 'Asst. Professor',     exp: '15+ Years' },
                          { sno: 23, name: 'Mr. Praveen Kumar Mudgal',      qual: 'M.Tech', desig: 'Asst. Professor',     exp: '4+ Years'  },
                          { sno: 24, name: 'Ms. Sugandha Rathi',            qual: 'M.Tech', desig: 'Asst. Professor',     exp: '3+ Years'  },
                          { sno: 25, name: 'Ms. Neha Saxena',               qual: 'M.Tech', desig: 'Asst. Professor',     exp: '4+ Years'  },
                          { sno: 26, name: 'Ms. Neelam Kushwah',            qual: 'M.Tech', desig: 'Asst. Professor',     exp: '4+ Years'  },
                          { sno: 27, name: 'Mr. Kukki Chirgainya',          qual: 'M.Tech', desig: 'Asst. Professor',     exp: '4+ Years'  },
                          { sno: 28, name: 'Mr. Avinash Singh Bhadoriya',   qual: 'M.Tech', desig: 'Asst. Professor',     exp: '4+ Years'  },
                        ].map(({ sno, name, qual, desig, exp }, i) => (
                            <tr key={sno} className={`hover:bg-red-50/30 dark:hover:bg-red-900/10 transition-colors ${i % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-900/20' : ''}`}>
                              <td className="px-5 py-3.5 text-center font-black text-[#800000] dark:text-red-400 text-xs">{sno}</td>
                              <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-white text-sm">{name}</td>
                              <td className="px-5 py-3.5 text-center text-sm text-gray-700 dark:text-gray-300">{qual}</td>
                              <td className="px-5 py-3.5 text-center text-sm text-gray-700 dark:text-gray-300">{desig}</td>
                              <td className="px-5 py-3.5 text-center text-sm text-gray-700 dark:text-gray-300">{exp}</td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

              </div>
            )}

            {/* ══ PLACEHOLDER TABS ══════════════════════════════════ */}
            {['Course', 'Placement', 'OBE'].includes(activeTab) && (
              <Card className="p-16 text-center">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="font-black text-xl text-[#0b2a4a] dark:text-white mb-2">{activeTab}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">This section is coming soon. Content is being prepared.</p>
              </Card>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
