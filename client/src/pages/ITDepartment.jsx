import React, { useState } from 'react';
const hod_it = '/images/hod_it.png';
const labCs1 = "/images/company_logos/Engineering_Computer_Applications/img1.png";

// ─── Data ─────────────────────────────────────────────────────────────────────
const missionPoints = [
  'To offer valuable education through an effective pedagogical teaching-learning process.',
  'To shape technologically strong students for industry, research & higher studies.',
  'To stimulate the young brain entrenched with ethical values and professional behaviors for the progress of society.',
];

const peoStatements = [
  'Our graduates will show management skills and teamwork to attain employers\' objectives in their careers.',
  'Our graduates will explore the opportunities to succeed in research and/or higher studies.',
  'Our graduates will apply technical knowledge of information technology for innovation and entrepreneurship.',
  'Our graduates will evolve ethical and professional practices for the betterment of society.',
];

const psoStatements = [
  'The ability to understand the principles of computer software to analyze, design, and develop algorithms for complex and logical problems.',
  'Enhance programming concepts and professional competencies of students by exercising principles of software engineering to fix various computational problems.',
  'To implement emerging technologies such as Natural Language Processing, Quantum Computing, Parallel Processing & Cloud Computing, etc., to serve society.',
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
export default function ITDepartment() {
  const [activeTab, setActiveTab] = useState('About Department');

  const menuItems = ['About Department', 'HoD Desk', 'Course', 'Laboratories', 'Faculty', 'Placement', 'OBE'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] transition-colors duration-500">

      {/* ── HERO BANNER ─────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-[#3e0202] via-[#800000] to-[#5a0000] pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-8 right-32 w-72 h-72 rounded-full border-2 border-white"></div>
          <div className="absolute -bottom-20 -left-10 w-96 h-96 rounded-full border border-white/50"></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-white/20"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <span className="inline-block text-red-200 font-bold tracking-widest text-xs uppercase mb-3 px-3 py-1 bg-white/10 rounded-full border border-white/20">
            AICTE Approved
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-tight">
            Information<br />
            <span className="text-red-200">Technology</span>
          </h1>
          <p className="text-red-100/80 max-w-xl text-sm leading-relaxed font-medium">
            B.Tech Programme · 565 Terminals · High-Speed Wi-Fi · Advanced Application Labs
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[['💻', 'B.Tech Programme'], ['🌐', '565 Terminals'], ['☁️', 'Cloud & AI'], ['🏅', 'AICTE Approved']].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-4 py-2 rounded-full text-xs font-bold">
                <span>{icon}</span> {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pb-16 md:pb-24">

        {/* ── MOBILE TAB BAR ───────────────────────────────────── */}
        <div className="lg:hidden bg-gray-50 py-3 -mx-3 px-3 sm:-mx-6 sm:px-6">
          <div className="flex overflow-x-auto gap-2 pb-1 snap-x" style={{scrollbarWidth:'none',msOverflowStyle:'none'}}>
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`shrink-0 snap-start px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  activeTab === item ? 'bg-[#800000] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >{item}</button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8 items-start md:-mt-10">

          {/* ── SIDEBAR ─────────────────────────────────────────── */}
          <aside className="hidden lg:block lg:col-span-1">
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
                      The Department of Information Technology at the Institute of Technology & Management is dedicated to nurturing professionals with the technical expertise required to drive <strong className="text-[#800000] dark:text-red-400">automation in production processes</strong> and address the demands of the modern digital world. Our curriculum is thoughtfully crafted to integrate in-depth theoretical knowledge with hands-on practical applications, enabling students to excel in diverse domains of information technology and IT-enabled sectors.
                    </p>
                    <p>
                      Our department boasts advanced laboratories equipped with essential application software, compilers, and hardware. The infrastructure is designed for modern learning, featuring hybrid configurations with high-speed internet and Wi-Fi connectivity across <strong className="text-[#800000] dark:text-red-400">565 terminals</strong> to facilitate seamless and effective education.
                    </p>
                    <p>
                      By offering students experiential learning opportunities with state-of-the-art technologies and platforms, we ensure they develop proficiency across both software and hardware environments. Our mission is to empower students with the knowledge, skills, and tools they need to thrive in the fast-evolving and highly competitive field of Information Technology.
                    </p>
                  </div>
                </Card>

                {/* Feature highlight cards */}
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { icon: '🖥️', title: '565 Terminals', sub: 'Hybrid lab configurations with Wi-Fi & high-speed internet' },
                    { icon: '📦', title: 'Advanced Labs', sub: 'Application software, compilers & modern hardware' },
                    { icon: '🎓', title: 'Experiential Learning', sub: 'Hands-on with cutting-edge technologies & platforms' },
                    { icon: '🌐', title: 'Industry-Ready', sub: 'Proficiency across both software & hardware environments' },
                  ].map(({ icon, title, sub }) => (
                    <div key={title} className="flex items-start gap-4 p-5 bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md hover:border-red-200 dark:hover:border-red-900/50 transition-all duration-200">
                      <div className="text-3xl">{icon}</div>
                      <div>
                        <div className="font-black text-[#0b2a4a] dark:text-white text-sm">{title}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 leading-relaxed">{sub}</div>
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
                      The Department of Information Technology envisions preparing <strong className="text-white">technically competent problem solvers</strong>, researchers, innovators, entrepreneurs, and skilled IT professionals for the development of rural and backward areas of the country for the modern computing challenges.
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
              <div className="space-y-8">
                <Card className="p-8">
                  <SectionHeading>HoD Desk</SectionHeading>

                  {/* HoD Profile & Message */}
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* ID Card Style Side */}
                    <div className="md:w-1/3 shrink-0">
                      <div className="sticky top-40 space-y-4">
                        <div className="relative group">
                          <div className="absolute -inset-1 bg-gradient-to-r from-[#800000] to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-4 border-white dark:border-gray-800 shadow-xl">
                            <img 
                              src={hod_it} 
                              alt="Dr. Aditya Vidyarthi" 
                              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                            />
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                          <h3 className="font-black text-[#0b2a4a] dark:text-white text-lg">Dr. Aditya Vidyarthi</h3>
                          <p className="text-[#800000] dark:text-red-400 font-bold text-xs uppercase tracking-widest mb-3">Professor & Head</p>
                          
                          <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                              <span className="shrink-0 w-6 h-6 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 text-[10px]">📞</span>
                              +91 9300144689
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                              <span className="shrink-0 w-6 h-6 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 text-[10px]">✉️</span>
                              hodit@itmgoi.in
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Message Side */}
                    <div className="md:w-2/3 space-y-5 text-sm leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
                      <p className="text-lg text-[#0b2a4a] dark:text-white font-black italic mb-6">"Dear Students and Future Technologists,"</p>
                      
                      <p>
                        It is with immense pride that I welcome you to the Department of Information Technology at the Institute of Technology & Management. Our department serves as a hub of cutting-edge technological innovation, dedicated to advancing the frontiers of knowledge and technology. We aim to inspire, educate, and empower the next generation of IT leaders who will shape industries and create meaningful societal impact.
                      </p>

                      <p>
                        Equipped with state-of-the-art laboratories and advanced infrastructure, our department provides a hands-on learning environment aligned with emerging technologies and industry trends. These modern facilities prepare you to tackle the dynamic challenges of the ever-evolving IT landscape.
                      </p>

                      <p>
                        Our adoption of an <strong className="text-[#800000] dark:text-red-400">Outcome-Based Education (OBE)</strong> approach ensures that our students graduate with a comprehensive skill set. This philosophy emphasizes not only technical expertise but also ethical responsibility and global competence, ensuring you are well-prepared for professional success.
                      </p>

                      <p>
                        We are privileged to have a team of highly qualified faculty members, many of whom are alumni of premier institutes across India. Their passion for teaching and research is focused on enhancing your employability and nurturing your potential as future IT professionals. Your growth and achievements are a reflection of our commitment, and we are here to guide and support you at every step.
                      </p>

                      <p>
                        We are confident that your journey through our department will be both transformative and enriching, equipping you to excel in a global arena and to embrace challenges with confidence and capability. Together, let us build a future of innovation, responsibility, and excellence.
                      </p>

                      <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                        <p className="font-black text-[#0b2a4a] dark:text-white">Wishing you a successful and rewarding academic journey!</p>
                        <div className="mt-6">
                           <p className="font-black text-[#800000] dark:text-red-400 text-base">Dr. Aditya Vidyarthi</p>
                           <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Professor and Head</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Department of Information Technology</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* ══ FACULTY ═══════════════════════════════════════════ */}
            {activeTab === 'Faculty' && (
              <div className="space-y-8">
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
                          <th className="px-5 py-4 text-center font-black text-xs uppercase tracking-wide">Designation</th>
                          <th className="px-5 py-4 text-center font-black text-xs uppercase tracking-wide">Date of Joining</th>
                          <th className="px-5 py-4 text-center font-black text-xs uppercase tracking-wide">Nature of Association</th>
                          <th className="px-5 py-4 text-left font-black text-xs uppercase tracking-wide">Area of Specialization</th>
                          <th className="px-5 py-4 text-center font-black text-xs uppercase tracking-wide">Qualification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {[
                          { sno: 1, name: 'Dr. Aditya Vidyarthi', desig: 'Professor', doj: '11/8/2021', assoc: 'Regular', spec: 'Operating System, DBMS', qual: 'M.Tech, Ph.D. (CSE)' },
                          { sno: 2, name: 'Dr. Jitendra Singh Kushwah', desig: 'Associate Professor', doj: '10/7/2009', assoc: 'Regular', spec: 'Data Structure, Data Analysis, Analysis & Design of Algorithm', qual: 'M.Tech, Ph.D. (CSE)' },
                          { sno: 3, name: 'Mr. Deshdeepak Shrivastava', desig: 'Assistant Professor', doj: '21/8/2007', assoc: 'Regular', spec: 'Data Structure, OOPM, Analysis & Design of Algorithm', qual: 'M.Tech, Ph.D (CSE)-Pursuing' },
                          { sno: 4, name: 'Mr. Madhukar Dubey', desig: 'Assistant Professor', doj: '21/03/2022', assoc: 'Regular', spec: 'Theory of Computation, JAVA', qual: 'M.Tech, Ph.D (CSE)-Pursuing' },
                          { sno: 5, name: 'Ms. Apoorva Deshpande', desig: 'Assistant Professor', doj: '26/02/2024', assoc: 'Regular', spec: 'Cyber Security, OOPM', qual: 'M.Tech' },
                          { sno: 6, name: 'Ms. Shristhi Kaurav', desig: 'Assistant Professor', doj: '01/08/2024', assoc: 'Regular', spec: 'Software Engineering', qual: 'M.Tech' },
                          { sno: 7, name: 'Ms. Khushboo Saraswat', desig: 'Assistant Professor', doj: '7/8/2023', assoc: 'Regular', spec: 'OOPM, Operating System', qual: 'M.Tech' },
                          { sno: 8, name: 'Ms. Arti Gupta', desig: 'Assistant Professor', doj: '13/06/2025', assoc: 'Regular', spec: 'Analysis & Design of Algorithm, DBMS', qual: 'M.Tech' },
                          { sno: 9, name: 'Dr. Ashish Gupta', desig: 'Assistant Professor', doj: '06/11/2024', assoc: 'Regular', spec: 'Machine Learning, Data Mining', qual: 'M.Tech, Ph.D (CSE)' },
                          { sno: 10, name: 'Mr. Shailendra Pal', desig: 'Assistant Professor', doj: '22/08/2025', assoc: 'Regular', spec: 'OOPS, DBMS, Python', qual: 'M.Tech' },
                          { sno: 11, name: 'Mr. Sanjay Pathak', desig: 'Assistant Professor', doj: '07/04/2025', assoc: 'Regular', spec: 'Computer Network, Software Engineering', qual: 'M.Tech' },
                          { sno: 12, name: 'Mr. Saurabh Shrivastava', desig: 'Assistant Professor', doj: '2/8/2022', assoc: 'Regular', spec: 'Computer Graphics & Multimedia, Theory of Computation', qual: 'M.Tech, Ph.D (CSE)-Pursuing' },
                          { sno: 13, name: 'Ms. Riya Rai', desig: 'Assistant Professor', doj: '11/7/2022', assoc: 'Contractual / Full Time', spec: 'Software Engineering', qual: 'M.Tech' },
                          { sno: 14, name: 'Mr. Shyam Singh Rajput', desig: 'Assistant Professor', doj: '20/07/2022', assoc: 'Contractual / Full Time', spec: 'Python Programming', qual: 'M.Tech' },
                          { sno: 15, name: 'Mr. Himanshu Kumar', desig: 'Assistant Professor', doj: '29/08/25', assoc: 'Regular', spec: 'Analysis and Design Algorithm, Data Structure', qual: 'M.Tech' },
                        ].map(({ sno, name, desig, doj, assoc, spec, qual }, i) => (
                          <tr key={sno} className={`hover:bg-red-50/30 dark:hover:bg-red-900/10 transition-colors ${i % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-900/20' : ''}`}>
                            <td className="px-5 py-3.5 text-center font-black text-[#800000] dark:text-red-400 text-xs">{sno}</td>
                            <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-white text-sm whitespace-nowrap">{name}</td>
                            <td className="px-5 py-3.5 text-center text-sm text-gray-700 dark:text-gray-300">{desig}</td>
                            <td className="px-5 py-3.5 text-center text-sm text-gray-700 dark:text-gray-300">{doj}</td>
                            <td className="px-5 py-3.5 text-center text-sm text-gray-700 dark:text-gray-300">{assoc}</td>
                            <td className="px-5 py-3.5 text-left text-sm text-gray-700 dark:text-gray-300">{spec}</td>
                            <td className="px-5 py-3.5 text-center text-sm text-gray-700 dark:text-gray-300">{qual}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

            {/* ══ COURSE ═══════════════════════════════════════════ */}
            {activeTab === 'Course' && (
              <div className="space-y-8">
                <Card className="p-8">
                  <SectionHeading>Course</SectionHeading>
                  <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    <h3 className="font-black text-lg text-[#0b2a4a] dark:text-white">Programmes Offered</h3>
                    <p className="text-[#800000] dark:text-red-400 font-bold">
                      Bachelor of Technology (B.Tech) in Information Technology
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      (04 Year Degree Program)
                    </p>
                  </div>
                </Card>
              </div>
            )}

            {/* ══ PLACEHOLDER TABS ══════════════════════════════════ */}
            {['Laboratories', 'Placement', 'OBE'].includes(activeTab) && (
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
