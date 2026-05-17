
import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import SectionHeading from '../components/SectionHeading';
import Card from '../components/Card';

// ─── Data ─────────────────────────────────────────────────────────────────────
const missionPoints = [
  'To impart quality technical education through innovative teaching-learning methodologies to produce competent civil engineers.',
  'To foster research culture and provide exposure to emerging technologies in civil engineering for sustainable development.',
  'To inculcate professional ethics, leadership qualities and social responsibility among students for the betterment of society.',
  'To establish strong industry-academia collaboration for enhancing employability and entrepreneurial skills of students.',
];

const peoStatements = [
  'Graduates will apply knowledge of civil engineering to design, construct, and maintain infrastructure projects effectively.',
  'Graduates will pursue higher education or research in specialized areas of civil engineering and allied fields.',
  'Graduates will demonstrate leadership, teamwork, and communication skills to manage multidisciplinary projects.',
  'Graduates will practice professional ethics and contribute to sustainable development of society.',
];

const psoStatements = [
  'Ability to apply principles of structural analysis, geotechnical engineering, and construction management to solve complex civil engineering problems.',
  'Competence in using modern surveying instruments, design software (AutoCAD, STAAD Pro, ETABS) and construction technologies.',
  'Capability to design sustainable infrastructure considering environmental impact, safety standards, and regulatory compliance.',
];

const hodMessage = [
  'I warmly welcome you to the Department of Civil Engineering at ITM Group of Institutions, Gwalior. Established in 1997, our department has been a cornerstone of engineering education in the region, producing competent civil engineers who have made significant contributions to the nation\'s infrastructure development.',
  'The department is committed to providing a holistic learning experience that blends theoretical knowledge with practical applications. Our well-equipped laboratories, experienced faculty, and industry collaborations ensure that our students are prepared to tackle real-world challenges in structural engineering, transportation, environmental engineering, and construction management.',
  'We emphasize project-based learning, industrial visits, and internships to bridge the gap between academia and industry. Our students have consistently performed well in competitive examinations like GATE, IES, and state-level PSC examinations.',
  'The department actively promotes research and innovation through seminars, workshops, and conferences. Our faculty members are engaged in cutting-edge research in areas such as green building technologies, earthquake-resistant structures, sustainable construction materials, and smart city infrastructure.',
  'I invite you to explore the opportunities that our department offers and be a part of our journey towards building a better tomorrow.',
];

const facultyData = [
  { sno: 1,  name: 'Dr. Rajendra Kumar Sharma',    qual: 'Ph.D (Structural Engg.)',    desig: 'Professor & Head',      exp: '26+ Years', specialization: 'Structural Engineering' },
  { sno: 2,  name: 'Dr. Anita Verma',               qual: 'Ph.D (Geotech. Engg.)',     desig: 'Associate Professor',   exp: '22+ Years', specialization: 'Geotechnical Engineering' },
  { sno: 3,  name: 'Dr. Manoj Kumar Tiwari',         qual: 'Ph.D (Env. Engg.)',         desig: 'Associate Professor',   exp: '20+ Years', specialization: 'Environmental Engineering' },
  { sno: 4,  name: 'Dr. Priya Singh Chauhan',        qual: 'Ph.D (Transportation)',     desig: 'Associate Professor',   exp: '18+ Years', specialization: 'Transportation Engineering' },
  { sno: 5,  name: 'Mr. Suresh Babu Patel',          qual: 'M.Tech (Structures)',       desig: 'Asst. Professor',       exp: '17+ Years', specialization: 'RCC & Steel Structures' },
  { sno: 6,  name: 'Mr. Vikram Singh Kushwah',       qual: 'M.Tech (Geotech.)',         desig: 'Asst. Professor',       exp: '16+ Years', specialization: 'Foundation Engineering' },
  { sno: 7,  name: 'Ms. Deepika Jain',               qual: 'M.Tech (Env. Engg.)',       desig: 'Asst. Professor',       exp: '15+ Years', specialization: 'Water Resources' },
  { sno: 8,  name: 'Mr. Arvind Kumar Mishra',        qual: 'M.Tech (Const. Mgmt.)',     desig: 'Asst. Professor',       exp: '14+ Years', specialization: 'Construction Management' },
  { sno: 9,  name: 'Mr. Rahul Shrivastava',          qual: 'M.Tech (Highway Engg.)',    desig: 'Asst. Professor',       exp: '12+ Years', specialization: 'Highway Engineering' },
  { sno: 10, name: 'Ms. Kavita Dubey',               qual: 'M.Tech (Structural)',       desig: 'Asst. Professor',       exp: '10+ Years', specialization: 'Earthquake Engineering' },
  { sno: 11, name: 'Mr. Pankaj Kumar Yadav',         qual: 'M.Tech (Hydraulics)',       desig: 'Asst. Professor',       exp: '8+ Years',  specialization: 'Hydraulic Engineering' },
  { sno: 12, name: 'Ms. Neha Agrawal',               qual: 'M.Tech (Env. Engg.)',       desig: 'Asst. Professor',       exp: '6+ Years',  specialization: 'Waste Management' },
  { sno: 13, name: 'Mr. Amit Singh Tomar',           qual: 'M.Tech (Surveying)',        desig: 'Asst. Professor',       exp: '5+ Years',  specialization: 'Surveying & GIS' },
  { sno: 14, name: 'Ms. Shweta Gupta',               qual: 'M.Tech (Structures)',       desig: 'Asst. Professor',       exp: '4+ Years',  specialization: 'Pre-stressed Concrete' },
  { sno: 15, name: 'Mr. Dheeraj Rajput',             qual: 'M.Tech (Transportation)',   desig: 'Asst. Professor',       exp: '3+ Years',  specialization: 'Traffic Engineering' },
];

const labData = [
  { icon: '🏗️', name: 'Concrete Technology Lab', desc: 'Testing of cement, aggregates, concrete mix design, compressive & tensile strength tests' },
  { icon: '🪨', name: 'Geotechnical Engineering Lab', desc: 'Soil classification, permeability, shear strength, consolidation & compaction tests' },
  { icon: '📐', name: 'Surveying Lab', desc: 'Chain surveying, theodolite, total station, GPS-based surveys & levelling exercises' },
  { icon: '🌊', name: 'Fluid Mechanics & Hydraulics Lab', desc: 'Flow measurement, Bernoulli\'s theorem, pipe friction, open channel flow experiments' },
  { icon: '🏢', name: 'Structural Analysis Lab', desc: 'Beam deflection, column buckling, truss analysis & structural model testing' },
  { icon: '🛣️', name: 'Transportation Engineering Lab', desc: 'Bitumen testing, aggregate impact & abrasion tests, Marshall stability, CBR tests' },
  { icon: '🌿', name: 'Environmental Engineering Lab', desc: 'Water quality testing, BOD/COD analysis, sewage treatment process studies' },
  { icon: '🧱', name: 'Building Materials Lab', desc: 'Testing of bricks, tiles, timber, steel bars — tensile, compression & hardness tests' },
  { icon: '💻', name: 'CAD & Computational Lab', desc: 'AutoCAD, STAAD Pro, ETABS, Revit BIM for structural design & analysis' },
  { icon: '🔬', name: 'Research & Project Lab', desc: 'Dedicated lab for final year projects, M.Tech dissertations & sponsored research' },
];

const placementCompanies = [
  { name: 'L&T Construction', type: 'Core' },
  { name: 'Tata Projects', type: 'Core' },
  { name: 'Shapoorji Pallonji', type: 'Core' },
  { name: 'Gammon India', type: 'Core' },
  { name: 'Dilip Buildcon', type: 'Core' },
  { name: 'Afcons Infrastructure', type: 'Core' },
  { name: 'NHAI', type: 'Govt' },
  { name: 'CPWD', type: 'Govt' },
  { name: 'PWD (MP)', type: 'Govt' },
  { name: 'Indian Railways', type: 'Govt' },
  { name: 'Municipal Corporation', type: 'Govt' },
  { name: 'Infosys (BPO)', type: 'IT' },
  { name: 'TCS', type: 'IT' },
  { name: 'Wipro', type: 'IT' },
  { name: 'Capgemini', type: 'IT' },
  { name: 'Sobha Developers', type: 'Core' },
  { name: 'Ultratech Cement', type: 'Core' },
  { name: 'ACC Limited', type: 'Core' },
];

const placementStats = [
  { year: '2023-24', placed: 42, highest: '8.5 LPA', average: '4.2 LPA', companies: 18 },
  { year: '2022-23', placed: 38, highest: '7.8 LPA', average: '3.9 LPA', companies: 15 },
  { year: '2021-22', placed: 35, highest: '7.2 LPA', average: '3.6 LPA', companies: 14 },
  { year: '2020-21', placed: 30, highest: '6.5 LPA', average: '3.2 LPA', companies: 12 },
];

const courseStructure = [
  { sem: 'I', subjects: ['Engineering Mathematics-I', 'Engineering Physics', 'Engineering Chemistry', 'Basic Electrical Engg.', 'Engineering Graphics', 'Workshop Practice'] },
  { sem: 'II', subjects: ['Engineering Mathematics-II', 'Basic Mechanical Engg.', 'Basic Computer Engg.', 'Environmental Studies', 'Communication Skills', 'Engineering Mechanics'] },
  { sem: 'III', subjects: ['Engineering Mathematics-III', 'Strength of Materials', 'Fluid Mechanics', 'Surveying-I', 'Building Materials & Construction', 'Geology'] },
  { sem: 'IV', subjects: ['Building Planning & Drawing', 'Structural Analysis-I', 'Hydraulics & Hydraulic Machines', 'Surveying-II', 'Concrete Technology', 'Geotechnical Engg-I'] },
  { sem: 'V', subjects: ['Structural Analysis-II', 'RCC Structures-I', 'Geotechnical Engg-II', 'Transportation Engg-I', 'Environmental Engg-I', 'Estimation & Costing'] },
  { sem: 'VI', subjects: ['RCC Structures-II', 'Steel Structures-I', 'Transportation Engg-II', 'Environmental Engg-II', 'Hydrology & Water Resources', 'Elective-I'] },
  { sem: 'VII', subjects: ['Steel Structures-II', 'Construction Management', 'Foundation Engineering', 'Elective-II', 'Elective-III', 'Project-I'] },
  { sem: 'VIII', subjects: ['Pre-stressed Concrete', 'Earthquake Engineering', 'Elective-IV', 'Project-II', 'Seminar', 'Industrial Training Report'] },
];

const poStatements = [
  'Engineering knowledge', 'Problem analysis', 'Design / development of solutions',
  'Conduct investigations of complex problems', 'Modern tool usage', 'The engineer and society',
  'Environment and sustainability', 'Ethics', 'Individual and team work',
  'Communication', 'Project management and finance', 'Life-long learning',
];


// ─── Main Component ───────────────────────────────────────────────────────────
export default function CEDepartment() {
  const [activeTab, setActiveTab] = useState('About Department');
  const [activeSem, setActiveSem] = useState('I');

  const menuItems = [
    'About Department', 'HoD Desk', 'Course', 'Laboratories',
    'Faculty', 'Placement', 'Infrastructure', 'Research', 'OBE'
  ];

  return (
    <PageLayout
      name={<>Civil<br /><span className="text-red-200">Engineering</span></>}
      shortName="CE"
      badge="AICTE Approved · Est. 1997"
      subtitle="B.Tech Programme · Structures, Geotechnics, Transportation & Environmental Engineering · Building the Nation's Infrastructure"
      chips={[['🏗️', 'B.Tech Programme'], ['🔬', 'Research Labs'], ['🌉', 'Field Projects'], ['🏅', 'AICTE Approved']]}
      menuItems={menuItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >

            {/* ══ ABOUT DEPARTMENT ══════════════════════════════════ */}
            {activeTab === 'About Department' && (
              <div className="space-y-8">
                <Card className="p-8">
                  <SectionHeading>About Department</SectionHeading>
                  <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    <p>
                      The Department of Civil Engineering was established in <strong className="text-[#800000] dark:text-red-400">1997</strong> and is one of the oldest and most prestigious departments of ITM Group of Institutions, Gwalior. The department offers a four-year <strong>Bachelor of Technology (B.Tech)</strong> programme in Civil Engineering, approved by AICTE and affiliated to Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal.
                    </p>
                    <p>
                      Civil Engineering is one of the broadest engineering disciplines, dealing with the design, construction, and maintenance of the physical and naturally built environment including bridges, roads, canals, dams, airports, sewerage systems, pipelines, and railways. Our department provides a thorough grounding in all these core areas along with exposure to emerging fields like green building technology, smart city planning, and GIS-based infrastructure management.
                    </p>
                    <p>
                      The department has well-qualified and experienced faculty members with expertise spanning structural engineering, geotechnical engineering, transportation engineering, environmental engineering, water resources, and construction management. With state-of-the-art laboratories, modern computational facilities, and strong industry connections, the department prepares students to become competent professionals ready to take on the challenges of modern infrastructure development.
                    </p>
                  </div>
                  <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                    <h3 className="font-black text-lg text-[#0b2a4a] dark:text-white mb-3">Programme Offered</h3>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 font-bold">
                      <li className="flex items-center gap-2"><span className="text-[#800000]">▪</span> B.Tech in Civil Engineering — 60 Seats (4 Year Programme)</li>
                    </ul>
                  </div>
                </Card>

                {/* Feature cards */}
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { icon: '📅', title: 'Est. 1997', sub: 'Over 27 years of academic excellence' },
                    { icon: '🎓', title: 'B.Tech Programme', sub: '4-year undergraduate programme' },
                    { icon: '🔬', title: '10+ Laboratories', sub: 'State-of-the-art lab infrastructure' },
                    { icon: '👨‍🏫', title: '15 Faculty Members', sub: 'Expert faculty with research experience' },
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
                  <div className="p-8 bg-gradient-to-br from-[#800000] to-[#5a0000] rounded-2xl text-white shadow-xl shadow-red-900/25">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🔭</span>
                      <h3 className="text-lg font-black uppercase tracking-tight">Vision</h3>
                    </div>
                    <p className="text-red-100/90 text-sm leading-relaxed">
                      To be a centre of excellence in civil engineering education and research, producing competent professionals who contribute to <strong className="text-white">sustainable infrastructure development</strong> and the <strong className="text-white">socio-economic growth</strong> of the nation while maintaining the highest standards of <strong className="text-white">professional ethics</strong>.
                    </p>
                  </div>
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
                  <SectionHeading>HoD's Desk</SectionHeading>
                  <div className="mb-8 p-6 bg-gradient-to-r from-[#800000]/8 to-red-50 dark:from-red-900/20 dark:to-red-900/10 border-l-4 border-[#800000] rounded-r-2xl">
                    <p className="text-lg font-black text-[#800000] dark:text-red-400 italic">
                      "Building the foundations of tomorrow's infrastructure"
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
                    <div className="shrink-0 text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-[#800000] to-[#5a0000] rounded-2xl flex items-center justify-center text-4xl shadow-xl shadow-red-900/25 mx-auto">
                        🎓
                      </div>
                      <p className="mt-3 font-black text-[#0b2a4a] dark:text-white text-sm">Dr. R.K. Sharma</p>
                      <p className="text-[#800000] dark:text-red-400 text-xs font-bold uppercase tracking-widest">Professor & Head</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Ph.D (Structural Engg.)</p>
                      <p className="text-gray-400 text-[10px] mt-1">hodce@itmgoi.in</p>
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

                <div className="grid sm:grid-cols-3 gap-5">
                  {[
                    { icon: '👨‍🏫', title: 'Expert Faculty', sub: '15 qualified faculty with research publications' },
                    { icon: '🏭', title: 'Industry Connect', sub: 'Tie-ups with L&T, Tata Projects & NHAI' },
                    { icon: '🧠', title: 'GATE & IES', sub: '25+ GATE qualifiers in last 5 years' },
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

            {/* ══ COURSE ═══════════════════════════════════════════ */}
            {activeTab === 'Course' && (
              <div className="space-y-8">
                <Card className="p-8">
                  <SectionHeading>B.Tech Civil Engineering — Course Structure</SectionHeading>
                  <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium mb-8">
                    <p>
                      The <strong className="text-[#800000] dark:text-red-400">Bachelor of Technology (B.Tech) in Civil Engineering</strong> is a 4-year (8-semester) undergraduate programme. The curriculum is designed by RGPV, Bhopal and covers fundamental engineering sciences, core civil engineering subjects, and specialized electives. The programme emphasizes both theoretical knowledge and practical skills through lab work, field surveys, industrial visits, and project work.
                    </p>
                  </div>

                  {/* Semester Tabs */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {courseStructure.map(({ sem }) => (
                      <button
                        key={sem}
                        onClick={() => setActiveSem(sem)}
                        className={`px-4 py-2 rounded-full text-xs font-black transition-all duration-200 ${
                          activeSem === sem
                            ? 'bg-[#800000] text-white shadow-md shadow-red-900/30'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                        }`}
                      >
                        Sem {sem}
                      </button>
                    ))}
                  </div>

                  {/* Subjects for selected semester */}
                  {courseStructure.filter(s => s.sem === activeSem).map(({ sem, subjects }) => (
                    <div key={sem} className="grid sm:grid-cols-2 gap-3">
                      {subjects.map((subj, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-900/40 transition-all">
                          <div className="w-8 h-8 rounded-lg bg-[#800000]/10 dark:bg-red-900/30 flex items-center justify-center text-xs font-black text-[#800000] dark:text-red-400 shrink-0">
                            {i + 1}
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{subj}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </Card>

                {/* Elective Subjects */}
                <Card className="p-8">
                  <SectionHeading>Elective Subjects</SectionHeading>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      'Advanced Structural Analysis', 'Finite Element Methods', 'Bridge Engineering',
                      'Earthquake Resistant Design', 'Ground Improvement Techniques', 'Remote Sensing & GIS',
                      'Pavement Design', 'Urban Planning & Development', 'Advanced Construction Materials',
                      'Green Building Technology', 'Project Planning & Management', 'River Engineering',
                    ].map((subj, i) => (
                      <div key={i} className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300">
                        <span className="text-[#800000]">▪</span> {subj}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* ══ LABORATORIES ══════════════════════════════════════ */}
            {activeTab === 'Laboratories' && (
              <div className="space-y-8">
                <Card className="p-8">
                  <SectionHeading>Laboratories</SectionHeading>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium mb-8">
                    The Department of Civil Engineering houses 10 well-equipped laboratories covering all core areas of civil engineering. These labs are designed to provide students with hands-on experience in testing construction materials, analyzing soil properties, surveying terrain, studying fluid behavior, and using modern computational tools for structural design and analysis.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {labData.map(({ icon, name, desc }) => (
                      <div
                        key={name}
                        className="flex items-start gap-4 p-5 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-900/40 transition-all duration-200 group"
                      >
                        <div className="w-11 h-11 rounded-xl bg-[#800000]/10 dark:bg-red-900/30 flex items-center justify-center text-2xl shrink-0 group-hover:bg-[#800000] transition-colors duration-200">
                          <span>{icon}</span>
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-[#0b2a4a] dark:text-white group-hover:text-[#800000] dark:group-hover:text-red-400 transition-colors">{name}</h4>
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-8">
                  <SectionHeading>Software & Tools Available</SectionHeading>
                  <div className="flex flex-wrap gap-2">
                    {['AutoCAD 2024', 'STAAD Pro', 'ETABS', 'Revit (BIM)', 'MATLAB', 'SAP2000', 'GIS Software', 'Primavera P6', 'MS Project', 'Google Earth Pro', 'QGIS', 'HEC-RAS'].map((tool) => (
                      <span key={tool} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#800000] hover:text-[#800000] transition-colors">
                        {tool}
                      </span>
                    ))}
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
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Our department has a team of {facultyData.length} dedicated faculty members with expertise across all core areas of Civil Engineering.
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#800000] text-white">
                          <th className="px-4 py-4 text-center font-black text-xs uppercase tracking-wide w-10">S.No.</th>
                          <th className="px-4 py-4 text-left font-black text-xs uppercase tracking-wide">Name</th>
                          <th className="px-4 py-4 text-center font-black text-xs uppercase tracking-wide">Qualification</th>
                          <th className="px-4 py-4 text-center font-black text-xs uppercase tracking-wide">Designation</th>
                          <th className="px-4 py-4 text-center font-black text-xs uppercase tracking-wide">Experience</th>
                          <th className="px-4 py-4 text-center font-black text-xs uppercase tracking-wide">Specialization</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {facultyData.map(({ sno, name, qual, desig, exp, specialization }, i) => (
                          <tr key={sno} className={`hover:bg-red-50/30 dark:hover:bg-red-900/10 transition-colors ${i % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-900/20' : ''}`}>
                            <td className="px-4 py-3.5 text-center font-black text-[#800000] dark:text-red-400 text-xs">{sno}</td>
                            <td className="px-4 py-3.5 font-semibold text-gray-800 dark:text-white text-sm">{name}</td>
                            <td className="px-4 py-3.5 text-center text-xs text-gray-700 dark:text-gray-300">{qual}</td>
                            <td className="px-4 py-3.5 text-center text-xs text-gray-700 dark:text-gray-300">{desig}</td>
                            <td className="px-4 py-3.5 text-center text-xs text-gray-700 dark:text-gray-300">{exp}</td>
                            <td className="px-4 py-3.5 text-center text-xs text-gray-600 dark:text-gray-400">{specialization}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

            {/* ══ PLACEMENT ════════════════════════════════════════ */}
            {activeTab === 'Placement' && (
              <div className="space-y-8">
                <Card className="p-8">
                  <SectionHeading>Placement Overview</SectionHeading>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium mb-8">
                    The department has an excellent track record of campus placements. Our graduates are working in leading construction companies, government organizations, consulting firms, and IT companies. The Training & Placement cell works closely with the department to organize pre-placement training, mock interviews, and campus drives.
                  </p>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                      { num: '85%', label: 'Placement Rate', color: 'from-[#800000] to-red-600' },
                      { num: '8.5 LPA', label: 'Highest Package', color: 'from-amber-500 to-orange-600' },
                      { num: '4.2 LPA', label: 'Avg. Package', color: 'from-emerald-500 to-green-600' },
                      { num: '18+', label: 'Recruiters', color: 'from-blue-500 to-indigo-600' },
                    ].map(({ num, label, color }) => (
                      <div key={label} className={`p-5 bg-gradient-to-br ${color} rounded-2xl text-white text-center shadow-lg`}>
                        <div className="text-2xl font-black">{num}</div>
                        <div className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-1">{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Year-wise Stats Table */}
                  <h3 className="font-black text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-[#800000] rounded"></span>
                    Year-wise Placement Data
                  </h3>
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900/60">
                          <th className="px-5 py-3 text-left font-black text-xs uppercase text-gray-500">Year</th>
                          <th className="px-5 py-3 text-center font-black text-xs uppercase text-gray-500">Students Placed</th>
                          <th className="px-5 py-3 text-center font-black text-xs uppercase text-gray-500">Highest Package</th>
                          <th className="px-5 py-3 text-center font-black text-xs uppercase text-gray-500">Avg. Package</th>
                          <th className="px-5 py-3 text-center font-black text-xs uppercase text-gray-500">Companies</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {placementStats.map((row, i) => (
                          <tr key={i} className="hover:bg-red-50/30 dark:hover:bg-red-900/10">
                            <td className="px-5 py-3 font-bold text-[#800000] dark:text-red-400">{row.year}</td>
                            <td className="px-5 py-3 text-center text-gray-700 dark:text-gray-300">{row.placed}</td>
                            <td className="px-5 py-3 text-center font-bold text-emerald-600 dark:text-emerald-400">{row.highest}</td>
                            <td className="px-5 py-3 text-center text-gray-700 dark:text-gray-300">{row.average}</td>
                            <td className="px-5 py-3 text-center text-gray-700 dark:text-gray-300">{row.companies}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Recruiting Companies */}
                <Card className="p-8">
                  <SectionHeading>Our Recruiters</SectionHeading>
                  <div className="space-y-4">
                    {['Core', 'Govt', 'IT'].map((type) => (
                      <div key={type}>
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${type === 'Core' ? 'bg-[#800000]' : type === 'Govt' ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                          {type === 'Core' ? 'Core Civil / Construction' : type === 'Govt' ? 'Government Sector' : 'IT / Software'}
                        </h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {placementCompanies.filter(c => c.type === type).map((c) => (
                            <span key={c.name} className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                              {c.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* ══ INFRASTRUCTURE ═══════════════════════════════════ */}
            {activeTab === 'Infrastructure' && (
              <div className="space-y-8">
                <Card className="p-8">
                  <SectionHeading>Department Infrastructure</SectionHeading>
                  <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium mb-8">
                    <p>
                      The Civil Engineering department occupies a dedicated wing of the main academic block with modern classrooms, well-equipped laboratories, faculty chambers, and a departmental library. The infrastructure is continuously upgraded to meet the evolving needs of engineering education and research.
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { icon: '🏫', title: '6 Smart Classrooms', desc: 'ICT-enabled rooms with LCD projectors, audio systems, and Wi-Fi connectivity' },
                      { icon: '🧪', title: '10 Laboratories', desc: 'Fully equipped labs covering all core CE areas with modern testing equipment' },
                      { icon: '📚', title: 'Department Library', desc: '2000+ books, journals, NPTEL resources, and e-learning materials' },
                      { icon: '💻', title: 'CAD Lab (40 Systems)', desc: 'High-performance computers with licensed engineering software' },
                      { icon: '🏗️', title: 'Materials Testing Centre', desc: 'UTM, CTM, flexural testing machines for structural research' },
                      { icon: '📡', title: 'Survey Equipment Store', desc: 'Total stations, GPS receivers, auto levels, planimeters, and chains' },
                      { icon: '🌿', title: 'Environmental Lab', desc: 'BOD incubator, pH meters, turbidity meters, jar test apparatus' },
                      { icon: '🔧', title: 'Workshop Area', desc: 'Dedicated space for model making, prototype construction, and field demos' },
                    ].map(({ icon, title, desc }) => (
                      <div key={title} className="flex items-start gap-4 p-5 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group">
                        <div className="w-11 h-11 rounded-xl bg-[#800000]/10 dark:bg-red-900/30 flex items-center justify-center text-2xl shrink-0 group-hover:bg-[#800000] transition-colors">
                          {icon}
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-[#0b2a4a] dark:text-white group-hover:text-[#800000] dark:group-hover:text-red-400 transition-colors">{title}</h4>
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* ══ RESEARCH ═════════════════════════════════════════ */}
            {activeTab === 'Research' && (
              <div className="space-y-8">
                <Card className="p-8">
                  <SectionHeading>Research & Publications</SectionHeading>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium mb-8">
                    Our faculty and students are actively engaged in research across various domains of Civil Engineering. The department encourages publications in reputed national and international journals and conferences.
                  </p>
                  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { num: '45+', label: 'Journal Papers' },
                      { num: '60+', label: 'Conference Papers' },
                      { num: '8', label: 'Funded Projects' },
                      { num: '4', label: 'Patents Filed' },
                    ].map(({ num, label }) => (
                      <div key={label} className="text-center p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div className="text-2xl font-black text-[#800000] dark:text-red-400">{num}</div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{label}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-8">
                  <SectionHeading>Research Areas</SectionHeading>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      'Green Building Technologies & Sustainable Construction',
                      'Earthquake Resistant Design of Structures',
                      'Advanced Concrete Materials (SCC, Geopolymer, FRC)',
                      'Soil Stabilization & Ground Improvement',
                      'Traffic Flow Modeling & Pavement Analysis',
                      'Water Quality Assessment & Treatment',
                      'GIS-based Urban Planning & Infrastructure',
                      'Building Information Modeling (BIM)',
                      'Structural Health Monitoring using IoT',
                      'Solid Waste Management & Recycling',
                    ].map((area, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                        <span className="w-2 h-2 rounded-full bg-[#800000] shrink-0"></span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{area}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-8">
                  <SectionHeading>Recent Publications (Sample)</SectionHeading>
                  <div className="space-y-4">
                    {[
                      { title: 'Study on Mechanical Properties of Geopolymer Concrete using Fly Ash and GGBS', journal: 'International Journal of Structural Engineering, 2024', authors: 'Dr. R.K. Sharma, Mr. S.B. Patel' },
                      { title: 'Seismic Analysis of Multi-storey RC Building with Shear Walls using ETABS', journal: 'Journal of Civil Engineering & Construction Technology, 2023', authors: 'Ms. K. Dubey, Dr. A. Verma' },
                      { title: 'Stabilization of Expansive Soil using Lime and Fly Ash for Road Construction', journal: 'Indian Geotechnical Journal, 2023', authors: 'Mr. V.S. Kushwah, Dr. M.K. Tiwari' },
                      { title: 'Performance Evaluation of Flexible Pavement using HDM-4 Model', journal: 'Transportation Research Procedia, 2023', authors: 'Mr. R. Shrivastava, Dr. P.S. Chauhan' },
                      { title: 'Assessment of Water Quality Index for Chambal River in Madhya Pradesh', journal: 'Environmental Monitoring & Assessment, 2024', authors: 'Ms. D. Jain, Ms. N. Agrawal' },
                    ].map((pub, i) => (
                      <div key={i} className="p-5 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-800 transition-all">
                        <p className="font-bold text-sm text-[#0b2a4a] dark:text-white">{pub.title}</p>
                        <p className="text-xs text-[#800000] dark:text-red-400 font-semibold mt-1">{pub.journal}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Authors: {pub.authors}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* ══ OBE ══════════════════════════════════════════════ */}
            {activeTab === 'OBE' && (
              <div className="space-y-8">
                <Card className="p-8">
                  <SectionHeading>Outcome Based Education (OBE)</SectionHeading>
                  <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium mb-8">
                    <p>
                      The Department of Civil Engineering follows the <strong className="text-[#800000] dark:text-red-400">Outcome Based Education (OBE)</strong> framework as mandated by the National Board of Accreditation (NBA). OBE focuses on clearly defining what students should be able to demonstrate upon completion of the programme, and then designing the curriculum, teaching-learning processes, and assessment methods to achieve those outcomes.
                    </p>
                  </div>

                  {/* PO Grid */}
                  <h3 className="font-black text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">Program Outcomes (POs)</h3>
                  <div className="grid sm:grid-cols-2 gap-3 mb-8">
                    {poStatements.map((po, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div className="w-8 h-8 rounded-lg bg-[#800000] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                          PO{i + 1}
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{po}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-8">
                  <SectionHeading>CO-PO Attainment Process</SectionHeading>
                  <div className="space-y-6">
                    {[
                      { step: '01', title: 'Define Course Outcomes (COs)', desc: 'Each course has 5-6 measurable COs aligned with Bloom\'s Taxonomy levels' },
                      { step: '02', title: 'CO-PO Mapping', desc: 'Course outcomes are mapped to Programme Outcomes with correlation levels (1/2/3)' },
                      { step: '03', title: 'Direct Assessment', desc: 'Through university exams, internal tests, assignments, lab work, and project reviews' },
                      { step: '04', title: 'Indirect Assessment', desc: 'Through course-end surveys, exit surveys, alumni feedback, and employer surveys' },
                      { step: '05', title: 'Attainment Calculation', desc: 'CO attainment computed using 80% direct + 20% indirect assessment weightage' },
                      { step: '06', title: 'Continuous Improvement', desc: 'Gap analysis and action plans are prepared for COs with attainment below threshold' },
                    ].map(({ step, title, desc }) => (
                      <div key={step} className="flex items-start gap-5 group">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#800000] to-red-600 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-lg shadow-red-900/20">
                          {step}
                        </div>
                        <div className="flex-1 pb-5 border-b border-gray-100 dark:border-gray-800 group-last:border-0">
                          <h4 className="font-black text-sm text-[#0b2a4a] dark:text-white">{title}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-8">
                  <SectionHeading>Assessment Tools</SectionHeading>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'University End-Sem Exams', 'Mid-Semester Tests', 'Assignments & Tutorials',
                      'Lab Performance & Viva', 'Mini Projects', 'Major Project (B.Tech)',
                      'Industrial Training Report', 'Seminar Presentations', 'Course-End Surveys',
                      'Alumni Feedback', 'Employer Surveys', 'Exit Surveys', 'GATE Score Analysis',
                    ].map((tool, i) => (
                      <span key={i} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300">
                        {tool}
                      </span>
                    ))}
                  </div>
                </Card>
              </div>
            )}

    </PageLayout>
  );
}
