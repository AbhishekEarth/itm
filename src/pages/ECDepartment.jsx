import React, { useState } from 'react';
import ec_event_1 from '../assets/ec_event_1.png';
import ec_event_2 from '../assets/ec_event_2.png';
import ec_achievement_1 from '../assets/ec_achievement_1.png';
import ec_achievement_2 from '../assets/ec_achievement_2.png';
import ec_hod from '../assets/ec_hod.png';

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
export default function ECDepartment() {
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
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-tight">
            Electronics & <br />
            <span className="text-red-200">Communication Engineering</span>
          </h1>
          <p className="text-red-100/80 max-w-xl text-sm leading-relaxed font-medium">
            Est. 1997 · B.Tech Programme · Electronics, Communication & Signal Processing
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[['📡', 'B.Tech Programme'], ['🔧', 'Advanced Labs'], ['💡', 'Industry Connect'], ['🏅', 'AICTE Approved']].map(([icon, label]) => (
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
                      Electronics & Communication engineering today is a multidisciplinary field that blends ingredients from electrical engineering, computer science engineering, information technology, and others. The Communication field now serves broader industries where the telephony, cellular, computer, data warehouse and entertainment industries have converged. It affects society in many aspects, including health, business, defense, security, space, banking, and social life.
                    </p>
                    <p>
                      Thus, as never before, a situation has arisen where a strong scientific manpower with technical background is needed to meet the growing challenges in the field of electronics for its research, development and applications. To achieve this, our energies are directed towards blending a sound understanding of fundamental science, engineering and technological aspects of electronics. The under graduate course of Electronics & Communication was started in <strong className="text-[#800000] dark:text-red-400">1997</strong>. The department has always been on a high growth path which reflected through M.Tech. in Embedded system & VLSI design in 2007. The department was accredited by <strong className="text-[#800000] dark:text-red-400">National Board of Accreditation in 2009</strong>. The department has received grants from govt. agencies for up-gradation and modernization of laboratories.
                    </p>
                  </div>
                  
                  <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                      <h3 className="font-black text-lg text-[#0b2a4a] dark:text-white mb-3">No. seats</h3>
                      <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 font-bold">
                          <li className="flex items-center gap-2"><span className="text-[#800000]">▪</span> B.E - 90</li>
                          <li className="flex items-center gap-2"><span className="text-[#800000]">▪</span> M.Tech VLSI - 18</li>
                      </ul>
                  </div>
                </Card>

                {/* Vision & Mission */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Vision */}
                  <div className="p-8 bg-gradient-to-br from-[#800000] to-[#5a0000] rounded-2xl text-white shadow-xl shadow-red-900/25">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🔭</span>
                      <h3 className="text-lg font-black uppercase tracking-tight">Our Vision</h3>
                    </div>
                    <p className="text-red-100/90 text-sm leading-relaxed">
                      The Electronics and Communication Engineering department envisions to prepare world-class technocrats and entrepreneurs with fresh ideas and innovations to meet the demands of industrial development and social commitment.
                    </p>
                  </div>

                  {/* Mission */}
                  <div className="p-8 bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🎯</span>
                      <h3 className="text-lg font-black uppercase tracking-tight text-[#0b2a4a] dark:text-red-400">Our Mission</h3>
                    </div>
                    <ul className="space-y-3">
                      {[
                        'Prepare students to solve real world problems through research and develop their entrepreneurship skills.',
                        'To provide high quality education with effective teaching pedagogy.'
                      ].map((m, i) => (
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
                  <SectionHeading>Program Educational Objectives</SectionHeading>
                  <div className="grid gap-4">
                    {[
                        'Our graduates will excel in professional career and/or higher education or in entrepreneurship.',
                        'Our graduates will have Knowledge, skills, attitude and teamwork capacity.',
                        'Our graduates will be globally competent and empowered.'
                    ].map((peo, i) => (
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
                  <SectionHeading>Program Specific Outcomes</SectionHeading>
                  <div className="grid gap-4">
                    {[
                        'The ability to understand the principles in VLSI, Signal Processing, Communication, Embedded System & Control Engineering.',
                        'To design, implement and test projects using the simulating software and hardware tools.',
                        'To demonstrate the leadership qualities and strive for the betterment of organization, environment and society.'
                    ].map((pso, i) => (
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
                
                {/* Infrastructure */}
                <Card className="p-8">
                  <SectionHeading>Infrastructure</SectionHeading>
                  <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    <p>
                        The Electronics and Communication Branch, is enriched with well - developed laboratories, having variety of equipment useful for novice to understand concepts to high end equipment for different applications. The equipment and software tools are as per the industry requirements and standards. The department has following lab facilities in different areas and is listed as below:
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-3 py-4">
                        {[
                            'Communication Lab', 'Electronics Devices & Circuit Lab', 'Network Lab',
                            'Microprocessor & Microcontroller Lab', 'Digital Electronics Lab', 'Software Lab',
                            'Microwave & Antenna Engineering Lab', 'Optical Fiber Communication Lab', 'Digital Signal Processing Lab',
                            'VLSI Lab', 'Computer Networking Lab', 'PCB Design Lab', 'PLC Lab',
                            'Measurement & Instrumentation Lab', 'Makers Lab', 'Exclusive R&D and Major Project Lab'
                        ].map((lab, i) => (
                            <li key={i} className="flex items-center gap-2">
                                <span className="text-[#800000]">▪</span> {lab}
                            </li>
                        ))}
                    </ul>
                    <p>
                        There are exclusive labs for carrying out research and development. These labs have important software like Tinapro, MATLAB, EDA software, Multisim, PCB wizard and Xilinx. For design of Integrated circuits, a new backend tool HEP1 from Mentor Graphics is available. One can design own IC and directly give it to foundry for manufacturing. Department has an exclusive Printed Circuit Board (PCB) Laboratory. This Lab manufacturer various types industries standard Printed Circuit Boards. These PCB’s are used in student’s projects and outsourced projects.
                    </p>
                  </div>
                </Card>

                {/* Scope and Placements */}
                <Card className="p-8">
                  <SectionHeading>Scope and Placements</SectionHeading>
                  <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    <p>
                        Graduates & Post graduates in Electronics & Communication Engineering have opportunities in govt. & private companies for installation, operation and maintenance of electronic equipments and systems. Defense, space and other large research organizations employ electronics engineers in design and development of complex devices and systems for signal processing and telecommunication. Industries involved in design and fabrication of devices, integrated circuits, embedded systems, electronic equipments etc. also provide large scale placements for engineers with this specialization.
                    </p>
                    <p>
                        Students of Electronics and Communication have participated in CANSAT Competition organized by the American Astronautically Society (AAS), American Institute of Aeronautics and Astronautics(AIAA), and NASA an annual open world level competition. Mission was to simulate a sensor payload travelling through planetary atmosphere sampling of atmospheric composition during flight. The team of ITM-GOI named INDYAAN has participated in this competition project.
                    </p>
                    <p>
                        Knowledge of computer hardware, networking equipments and communication systems enables electronics engineering graduate to annex an edge in the IT job market. The skills and understanding developed in the course enable them to be preferred, as software professionals in IT companies. The students of ITM have been placed in companies like <strong className="text-[#800000] dark:text-red-400">Capgemini, L&T, Bosch, Siemens, TCS, Infosys, Hexaware, Accenture, Wipro, Cognizant, Amdocs, IGate, Sadex, Bitwise</strong>, Government Agencies like Defence, Navy, DRDO, ISRO, Prasar Bhartis. Public Sector Companies like BHEL, NTPC, BEL, BSNL
                    </p>
                  </div>
                </Card>

                {/* Process and Methodology */}
                <Card className="p-8">
                  <SectionHeading>Learning Process and Methodology</SectionHeading>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    The methodology adopted to ensure proper learning includes Lectures, Tutorials and Practical's in groups of 30 each. Classroom is equipped with LCD projector.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                      <div>
                          <h3 className="text-lg font-black text-[#0b2a4a] dark:text-white mb-4">Evaluation Process</h3>
                          <p className="text-sm text-gray-600 mb-3 font-semibold">Internal assessment is based on:</p>
                          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                              {['Midterm/Online test/ Activity', 'PBL Activities', 'Attendance', 'Discipline, Attitude & behavior of students', 'Extra classes for weak / hostel students are being arranged'].map((item, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                      <span className="text-[#800000] mt-1">▪</span> {item}
                                  </li>
                              ))}
                          </ul>
                      </div>
                      <div>
                          <h3 className="text-lg font-black text-[#0b2a4a] dark:text-white mb-4">Two weeks practical training</h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                              It is mandatory to undergo two weeks practical training by the students of VI semesters after the end of examination. After completion of practical training, they have to submit a practical training report and to deliver a presentation of their training report.
                          </p>
                      </div>
                  </div>
                </Card>

                {/* Development & Mentorship */}
                <Card className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                      <div>
                          <SectionHeading>Development and Grooming</SectionHeading>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 font-medium">Department and Training Placement Department also arrange expert lecturers and workshop on:</p>
                          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 font-medium pb-3 border-b border-gray-100 dark:border-gray-800">
                                {['Personality Development', 'Technical Training', 'Moral / Ethics', 'Etiquettes & Manners', 'Mock Interviews', 'Communication Skills', 'Leadership', 'Confidence Building'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2"><span className="text-green-600">✓</span> {item}</li>
                                ))}
                          </ul>
                          <p className="text-xs text-gray-500 mt-3 font-medium italic">Invited lectures from industries (HR personnel) are also being arranged to develop the students on present scenario / trends for placement.</p>
                      </div>
                      <div>
                          <SectionHeading>Mentorship Program</SectionHeading>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 font-medium">A faculty member is assigned 20-30 students. His/her role is:</p>
                          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                                {['to guide the students for academic excellence', 'to guide the students for personality development', 'to guide the students for positive attitude, good behavior and discipline', 'to guide the students for proper dress, etiquettes and manners', 'to motivate the students to participate in sports and cultural activities', 'to refrain them not to indulge in ragging and other social evils'].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2"><span className="text-blue-600 mt-1">✓</span> {item}</li>
                                ))}
                          </ul>
                      </div>
                  </div>
                </Card>

                {/* Methods of Measuring Learning Outcomes */}
                <Card className="p-8">
                  <SectionHeading>Methods of Measuring Learning Outcomes</SectionHeading>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 font-medium">
                      If several different sources of data are used, it increases the probability that the findings present an accurate picture. We employ the following formal assessment procedures:
                  </p>
                  <div className="flex flex-wrap gap-2">
                      {['End-Of-Semester Course Evaluations', 'Departmental Mid-Semester Course Evaluations', 'Alumni Feedback', 'Employer Surveys', 'Department Academic Council Meetings', 'Faculty Meetings', 'Project Work', 'Job Placements', 'Professional Societies', 'Industrial Trainings', 'Professional Certifications', 'HR Summit', 'Research Publications'].map((item, i) => (
                          <span key={i} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-bold">
                              {item}
                          </span>
                      ))}
                  </div>
                </Card>

                {/* Industry Interaction */}
                <Card className="p-8">
                  <SectionHeading>Industry Interaction</SectionHeading>
                  <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    <p>
                        Expert from industries and renowned academic institute of India are invited to get an insightful overview of the current trends & innovation in the industry. Constant interaction with industry is being maintained through industrial visits arranged for the students.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <h4 className="font-bold text-[#0b2a4a] dark:text-blue-300 mb-3">Industrial visits conducted during session 2018-19:</h4>
                        <ol className="list-decimal list-outside ml-4 space-y-3">
                            <li>Industrial Visit of Electronics (V semester) students in Bharat Sanchar Nigam Limited, Gwalior on 09/10/18. Students are learn about switching process of mobile phone and fixed telephone network.</li>
                            <li>Industrial visit of Electrical (VIII Semester and diploma) and Electronics (IV Semester) students in Priyanka Industries, Banmore, Morena on 01/03/19. Priyanka Industry is high rating Transformer manufacturing Industry. Student learns manufacturing process of transformer during this visit.</li>
                        </ol>
                    </div>
                    <p>
                        Department has arranged the visit to industries time to time for students. Following are the industries we have visited for students to make aware of industrial atmosphere: Doordarshan, Rail Spring Plant (Gwalior), Surya Roshni (Malanpur), SRF (Malanpur) and many more……..
                    </p>
                    <p>
                        Recently, Department has organized an industrial tour to Advance Technology, Chandigarh, Micro Tuner Groups, Hydro Power Plant, Manali. Advance Technology, Chandigarh is an ISO 9001:2008 Certified Company deals in the field of Hardware Development, Embedded Products Development, Security & Surveillance and Engineers Training Programs.
                    </p>
                  </div>
                </Card>

                {/* Events / Seminars / Expert Talk / Workshops */}
                <Card className="p-8">
                  <SectionHeading>Events / Seminars / Expert Talk / Workshops</SectionHeading>
                  <div className="space-y-6">
                      <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          <p className="mb-2"><strong>National Seminar on Recent Innovation in Signal Processing and Embedded Systems (RISE – 2018)</strong>, April 19-21, 2018</p>
                          <p><strong>Swatch Bharat summer internship</strong> in the month of November-2018.</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                          <div className="rounded-xl overflow-hidden shadow-sm aspect-video border border-gray-100 dark:border-gray-800">
                              <img src={ec_event_1} alt="Event 1" className="w-full h-full object-cover" />
                          </div>
                          <div className="rounded-xl overflow-hidden shadow-sm aspect-video border border-gray-100 dark:border-gray-800">
                              <img src={ec_event_2} alt="Event 2" className="w-full h-full object-cover" />
                          </div>
                      </div>
                  </div>
                </Card>

                {/* Students Achievements */}
                <Card className="p-8">
                  <SectionHeading>Students Achievements</SectionHeading>
                  <div className="space-y-6">
                      <div className="text-sm text-gray-700 dark:text-gray-300 font-medium space-y-3">
                          <p>
                              With the persistent hard work of one year, six students of the Makers-lab of the EC dept. of ITM-GOI have developed a Humanoid Robot “Adhvik 1.0”. This robot is capable to identify the person through face recognition and also welcome the guest by handshaking gesture with pronouncing the identified person’s name.
                          </p>
                          <p className="font-bold text-[#800000] dark:text-red-400">Students of the department have secured Vice Chancellor Award.</p>
                          <ul className="space-y-2 list-disc list-outside ml-4">
                              <li><strong>Sajal Agrawal</strong> (2006-2010) student of the department has got Vice Chancellor Award by the R.G.P.V., Bhopal.</li>
                              <li><strong>Harshali Rewadikar</strong> (2009-2013) student of the department has got Vice Chancellor Award by the R.G.P.V., Bhopal.</li>
                              <li><strong>Abhinay Gupta</strong> (2009-2013) student of the department has secured 153 Rank in GATE -2013.</li>
                              <li><strong>Ayushi Jain</strong> 2012-2016 batch student of the department has got Vice Chancellor Award by the R.G.P.V., Bhopal</li>
                              <li><strong>Priyanka Shrivastava</strong> 2015- 2019 batch student of the department has got Vice Chancellor Award by the R.G.P.V., Bhopal</li>
                          </ul>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                          <div className="rounded-xl overflow-hidden shadow-sm aspect-video border border-gray-100 dark:border-gray-800">
                              <img src={ec_achievement_1} alt="Achievement 1" className="w-full h-full object-cover" />
                          </div>
                          <div className="rounded-xl overflow-hidden shadow-sm aspect-video border border-gray-100 dark:border-gray-800">
                              <img src={ec_achievement_2} alt="Achievement 2" className="w-full h-full object-cover" />
                          </div>
                      </div>
                  </div>
                </Card>

              </div>
            )}

            {/* ══ HOD DESK ══════════════════════════════════════════ */}
            {activeTab === 'HoD Desk' && (
              <div className="space-y-8">
                <Card className="p-8">
                  <SectionHeading>HoD's Desk</SectionHeading>

                  {/* HoD Profile & Message */}
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* ID Card Style Side */}
                    <div className="md:w-1/3 shrink-0">
                      <div className="sticky top-40 space-y-4">
                        <div className="relative group">
                          <div className="absolute -inset-1 bg-gradient-to-r from-[#800000] to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-4 border-white dark:border-gray-800 shadow-xl">
                            <img 
                              src={ec_hod} 
                              alt="Head of Department" 
                              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                            />
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                          <h3 className="font-black text-[#0b2a4a] dark:text-white text-lg">Head of Department</h3>
                          <p className="text-[#800000] dark:text-red-400 font-bold text-xs uppercase tracking-widest mb-3">Professor & Head</p>
                          <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                              <span className="shrink-0 w-6 h-6 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 text-[10px]">✉️</span>
                              hodece@itmgoi.in
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Message Side */}
                    <div className="md:w-2/3 space-y-5 text-sm leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
                      <p>
                        Today's era is of Communication & Information Technology. With the advent of the advance technologies in this field the whole world is becoming very easily accessible. This branch is having wide scope in the public sector, Private sector as well as in Government sector. The professionals of this field will find a very good future prospectus since so many multinational companies are indented in the field of Communication i.e. BSNL, MTNL, AIRTEL, IDEA etc.
                      </p>

                      <p>
                        Students are placed in good renowned group of India and abroad i.e. BSNL, ISRO, NTPC, BHEL, Idea, Airtel, Infosys, Wipro, Accenture, Cogzinent, etc. The alumni of the department have secured their places in the higher echelons of the society and technical world. A good number of students are going for higher studies for their M.Tech, MS, MBA and PhD. from different reputed institutes in India and abroad.
                      </p>

                      <p>
                        This branch has tremendous applications such as Telephony, Telegraphy, Radio & TV broadcasting, Mobile Communication (2G/3G/4G), Video Conferencing, Internet, e-mail, e-commerce, Industrial Automation, Military etc. As such there is no limit to its applications and scope as well. Every day you will find a new addition in the application of this field.
                      </p>

                      <p>
                        It is a versatile branch, in the sense that the students holding the degree in the Electronics and Communication can build up their carrier in any field such as Computer Engineering, Information Technology and Communication etc. Our objective is to build up students who will be equally competent in all these fields. Keeping this in mind, we are working to develop well-equipped advanced computer based laboratories, to give the students full exposure to computer, Internet Technology, and the advancements in this field.
                      </p>

                      <p>
                        The department has a variety of laboratories according to the requirement of industry. Department has also a designing, developing and analyzing tool's and software i.e. Multisim, Mentor Graphics, PCB Designing, Netsim, Matlab, Labview, Comsim etc.
                      </p>

                      <p>
                        The department encompasses a fine blend of renowned as well as young and dynamic faculties with a balanced mix from industry and academics. Most of the faculties have excellent track records and is drawn from leading institutes like IITs/NITs and other reputed universities. The faculty takes active interest in research and development activities. The infrastructure and lab facilities are upgraded from time to time and provide a good practical learning and innovative environment for UG students and PG researchers.
                      </p>

                      <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                        <div className="mt-6">
                           <p className="font-black text-[#800000] dark:text-red-400 text-base">Head of Department</p>
                           <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Professor and Head</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Department of Electronics and Communication Engineering</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* ══ PLACEHOLDER TABS ══════════════════════════════════ */}
            {['Course', 'Laboratories', 'Faculty', 'Placement', 'OBE'].includes(activeTab) && (
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
