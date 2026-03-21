import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon } from 'lucide-react';
import PlacementData from "../components/PlacementData";
import axios from 'axios';

// ─── Data ──────────────────────────────────────────────────────────────────────
const industrySpeak = [
  { name: "Aditya Mahajan", role: "Recruiter Campus Hiring, TCS", text: "It was a wonderful and great experience for conducting interviews at ITM. Students were well prepared. College Management has invested a lot in grooming them. Good performance by students. Good professionalism." },
  { name: "Lakshmi", role: "Regional Head, Wipro", text: "It was a good batch that we interviewed met our most of the requirement. Technical knowledge of students was good but can be better. They need to work on communication skills. Looking forward to conduct more drives in future." },
  { name: "Ronak Choudhary", role: "Regional Head, Cognizant", text: "The spirits shown by students was very delightful and encouraging for us & for our company too. Did bulk hiring even on the virtual mode. Students have good technical knowledge." },
  { name: "Piuli Ghosh", role: "Campus Lead, ICICI", text: "We had a good experience!! We expected more candidates for interview, out of 30 to 40 Students almost 50% got placed. Decent quality of students." },
  { name: "Deepti Thakur", role: "Campus Team, Xiaomi", text: "Good, was a good experience, glad to provide this opportunity to the students of ITM, students should work on Aptitude part." },
  { name: "Sandeep Mishra", role: "HR, VISA Steel", text: "It was an amazing experience and the students were really enthusiastic. Every year we got upgraded batch. Will love to visit again." },
  { name: "Kajal Soni", role: "HR Recruiter, Thermax Limited", text: "During the pandemic time, it was unexpected to conduct such a wonderful drive on a Virtual Mode. Students have good technical knowledge. Great Experience!!" },
  { name: "Akhil James", role: "HR Specialist, FedEx", text: "Had a great experience visiting ITM, Courtesy campus members really appreciate the efforts and support provided. Well-groomed and prepared students." },
  { name: "Amrita Paul", role: "DGM, IBM India", text: "Good Campus. Got lot of support from the staff, well organized. It was a pleasure being here." },
  { name: "Ms. Shazia Siddiqui", role: "HR Manager, Infosys Technologies", text: "Extremely impressive infrastructure. A good team of officials with a good vision for the institute and the students. The students will definitely be groomed into good professionals." },
];

const tapEventsData = [
  { icon: "📋", title: "Personal Training", desc: "Personal training sessions before every placement/internship drive to help students perform well in interviews." },
  { icon: "🏭", title: "Industrial Expert Talk", desc: "Renowned people from industries share overview and tips about the corporate world." },
  { icon: "💼", title: "Summer Internship Drive", desc: "Mandatory 45-day summer internship for industrial exposure and practical learning." },
  { icon: "🎯", title: "Campus Recruitment", desc: "Inviting renowned recruiters for placement drives with various hiring processes." }
];

// ─── Sub-components ────────────────────────────────────────────────────────────
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

// ─── Main Component ────────────────────────────────────────────────────────────
const TapPage = () => {
  const [activeTab, setActiveTab] = useState('About TAP');
  const [recruiterIndex, setRecruiterIndex] = useState(0);
  const [events, setEvents] = useState({ upcoming: [], past: [] });
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRecruiterIndex(prev => prev + 1);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { name: 'About TAP' },
    { name: 'Industry Speak' },
    { name: 'TAP Team' },
    { name: 'MOUs & Collaborations' },
    { name: 'Placement Records' },
    { name: 'TAP Events' },
  ];

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/events/all");
      setEvents(response.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    if (activeTab === 'TAP Events') {
      fetchEvents();
    }
  }, [activeTab]);

  useEffect(() => {
    if (events.upcoming.length > 1) {
      const timer = setInterval(() => {
        setCurrentEventIndex((prev) => (prev + 1) % events.upcoming.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [events.upcoming.length]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] transition-colors duration-500 overflow-x-hidden">

      {/* ── HERO BANNER ──────────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-[#3e0202] via-[#800000] to-[#5a0000] pt-12 pb-20 md:pt-16 md:pb-24 overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-8 right-32 w-72 h-72 rounded-full border-2 border-white"></div>
          <div className="absolute -bottom-20 -left-10 w-96 h-96 rounded-full border border-white/50"></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-white/20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <span className="inline-block text-red-200 font-bold tracking-widest text-[10px] sm:text-xs uppercase mb-3 px-3 py-1 bg-white/10 rounded-full border border-white/20">
            ITM Gwalior — Placement Cell
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter mb-3 leading-tight">
            Training &amp; <br />
            <span className="text-red-200">Placement Cell</span>
          </h1>
          <p className="text-red-100/80 max-w-xl text-xs sm:text-sm leading-relaxed font-medium">
            Bridging student talent with industry needs · Campus Recruitment · Industry Expert Talks · Internship Drives
          </p>

          {/* Quick-stat chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[['🏢', 'Top Recruiters'], ['📈', 'Placement Records'], ['🤝', 'Industry MOUs'], ['🎓', 'Campus Drives']].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/20 text-white px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold">
                <span>{icon}</span> {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pb-16 md:pb-24">

        {/* ── MOBILE TAB BAR (hidden on lg+) ─────────────────────────────────── */}
        <div className="lg:hidden bg-gray-50 py-3 -mx-3 px-3 sm:-mx-6 sm:px-6">
          <div className="flex overflow-x-auto gap-2 pb-1 snap-x" style={{scrollbarWidth:'none', msOverflowStyle:'none'}}>
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`shrink-0 snap-start px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.name
                    ? 'bg-[#800000] text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8 items-start -mt-0 md:-mt-10">

          {/* ── SIDEBAR (desktop only) ───────────────────────────────────────── */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32">
              <Card className="overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#800000] via-red-500 to-[#800000]"></div>
                <div className="p-5">
                  <h3 className="font-black text-xs uppercase tracking-widest mb-4 text-[#800000]">TAP Cell Menu</h3>
                  <nav className="flex flex-col gap-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`text-left py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 ${
                          activeTab === tab.name
                            ? 'bg-[#800000] text-white shadow-md shadow-red-900/30'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-[#800000] dark:hover:text-red-400'
                        }`}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </Card>
            </div>
          </aside>

          {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
          <main className="lg:col-span-3 space-y-6 md:space-y-8 min-w-0 w-full overflow-hidden">
            <AnimatePresence mode="wait">

              {/* ══ ABOUT TAP ════════════════════════════════════════════════════ */}
              {activeTab === 'About TAP' && (
                <motion.div key="about" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 md:space-y-8">

                  {/* About text */}
                  <Card className="p-4 sm:p-6 md:p-8 overflow-hidden w-full min-w-0">
                    <SectionHeading>About TAP Cell</SectionHeading>
                    <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium break-words whitespace-pre-wrap">
                      <p>
                        ITM Gwalior has always given training, augmentation and placements an utmost priority and to implement it into action an exclusive <strong className="text-[#800000] dark:text-red-400">Training, Augmentation and Placement Assistance Cell (TAP)</strong> has been established with state-of-art facilities. The cell is headed by experienced professionals from Industry.
                      </p>
                      <p>
                        TAP Cell is responsible for conducting following activities in time bound schedules without violating the time table of university curriculum.
                      </p>
                    </div>
                  </Card>

                  {/* Vision & Mission */}
                  <div className="grid md:grid-cols-2 gap-6 w-full min-w-0">
                    {/* Vision */}
                    <div className="p-4 sm:p-8 bg-gradient-to-br from-[#800000] to-[#5a0000] rounded-2xl text-white shadow-xl shadow-red-900/25 overflow-hidden w-full min-w-0 break-words">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">🔭</span>
                        <h3 className="text-lg font-black uppercase tracking-tight">Vision</h3>
                      </div>
                      <p className="text-red-100/90 text-sm leading-relaxed break-words whitespace-pre-wrap">
                        To Bridge the gap between Students' skill, knowledge and the industry's Requirement and expectation by Building employability through various workshops, seminars and campus recruitment training.
                      </p>
                    </div>

                    {/* Mission */}
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden w-full min-w-0 break-words">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">🎯</span>
                        <h3 className="text-lg font-black uppercase tracking-tight text-[#0b2a4a] dark:text-red-400">Mission</h3>
                      </div>
                      <ul className="space-y-3">
                        {[
                          'To promote and support students in developing the required competencies which help them to secure good placements in reputed national and international companies.',
                          'To conduct training programs, workshops, and industry interactions to enhance the employability of students.',
                          'To maintain strong industry-academia relationships for campus recruitment and internship opportunities.',
                        ].map((m, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed break-words whitespace-pre-wrap">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#800000] dark:bg-red-500 shrink-0"></span>
                            <span className="flex-1 min-w-0 break-words">{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Major Recruiters */}
                  <Card className="p-4 sm:p-6 md:p-8 overflow-hidden w-full">
                    <SectionHeading>Major Recruiters</SectionHeading>

                    <div className="mb-10 max-w-full">
                      <h4 className="text-xs font-black text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-widest break-words">Engineering</h4>
                      <div className="relative overflow-hidden w-full">
                        <div className="flex transition-transform duration-500 ease-in-out w-full" style={{ transform: `translateX(-${(recruiterIndex % 195) * 0.5}%)`, width: '5000%' }}>
                          {[...Array(200)].map((_, i) => {
                            const idx = i % 39;
                            return (
                              <div key={i} className="w-[0.5%] shrink-0 px-2 lg:px-3">
                                <div className="w-full h-24 sm:h-32 flex items-center justify-center overflow-hidden">
                                  <img src={`/images/company_logos/Engineering_Computer_Applications/logo_${idx}.png`} alt={`Logo ${idx}`} className="w-full h-full object-contain p-2 sm:p-4" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-widest">Management</h4>
                      <div className="relative overflow-hidden w-full">
                        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${(recruiterIndex % 195) * 0.5}%)`, width: '5000%' }}>
                          {[...Array(200)].map((_, i) => {
                            const idx = i % 37;
                            return (
                              <div key={i} className="w-[0.5%] shrink-0 px-2 lg:px-3">
                                <div className="w-full h-32 flex items-center justify-center overflow-hidden">
                                  <img src={`/images/company_logos/Management/logo_${idx}.png`} alt={`Logo ${idx}`} className="w-full h-full object-contain p-4" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ══ INDUSTRY SPEAK ═══════════════════════════════════════════════ */}
              {activeTab === 'Industry Speak' && (
                <motion.div key="industry" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <Card className="p-4 sm:p-6 md:p-8">
                    <SectionHeading>Industry Speak</SectionHeading>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {industrySpeak.map((speak, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.98 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          className="flex flex-col bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                          {/* Header: Name & Role */}
                          <div className="bg-white dark:bg-gray-800 p-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#800000] text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                              {speak.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-black text-gray-900 dark:text-white text-[15px] leading-tight">{speak.name}</h4>
                              <p className="text-[12px] text-[#800000] dark:text-red-400 font-semibold uppercase tracking-wide mt-1">{speak.role}</p>
                            </div>
                          </div>
                          {/* Testimonial */}
                          <div className="p-6">
                            <p className="text-gray-700 dark:text-gray-300 italic text-[14px] leading-relaxed">"{speak.text}"</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ══ TAP TEAM ═════════════════════════════════════════════════════ */}
              {activeTab === 'TAP Team' && (
                <motion.div key="team" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <Card className="p-4 sm:p-6 md:p-8">
                    <SectionHeading>TAP Cell Team</SectionHeading>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-8 sm:gap-12 lg:gap-24 justify-center items-center sm:items-start w-full">
                      {[
                        {
                          name: "Mr. Arpit Singh Chauhan",
                          position: "(Dean/Director TAP CELL I/C)",
                          email: "arpit.chauhan@itmuniversity.ac.in",
                          phone: "+91-9691973919",
                          image: "/images/Arpit_Singh.jpg"
                        },
                        {
                          name: "Mrs. Shikha Sharma",
                          position: "(Asst. Director Placement)",
                          email: "shikhasharma@itmuniversity.ac.in",
                          phone: "+91-9229333335",
                          image: "/images/Shikha_Sharma.jpg"
                        }
                      ].map((member, idx) => (
                        <div key={idx} className="flex flex-col items-center sm:items-start w-full sm:max-w-[192px]">
                          <div className="w-40 h-52 sm:w-48 sm:h-60 border border-gray-200 dark:border-gray-700 rounded-2xl mb-4 overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center shadow-sm">
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = "https://via.placeholder.com/192x240?text=Photo"; }}
                            />
                          </div>
                          <div className="space-y-1.5 text-center sm:text-left text-[13px] md:text-[14px]">
                            <h4 className="font-black text-gray-900 dark:text-white leading-tight">{member.name}</h4>
                            <p className="text-gray-600 dark:text-gray-400">{member.position}</p>
                            <p className="text-gray-700 dark:text-gray-300 break-words">
                              Email: <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{member.email}</span>
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">Phone: {member.phone}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ══ MOUs & COLLABORATIONS ════════════════════════════════════════ */}
              {activeTab === 'MOUs & Collaborations' && (
                <motion.div key="mous" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <Card className="p-4 sm:p-6 md:p-8">
                    <SectionHeading>MOUs &amp; Strategic Collaborations</SectionHeading>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          title: "EduSkills Foundation",
                          image: "/images/LOGO_EduSkills.png",
                          text: "EduSkills and ITM Gwalior work together to expand digital skills in higher education through world-class technical programs in Networking, Cybersecurity, Cloud computing, automation, RPA, and Industry 4.0."
                        },
                        {
                          title: "AWS Academy",
                          image: "/images/aws.jpg",
                          text: "As a Member Institution, ITM Gwalior alliances with AWS Academy to empower students with industry-ready Cloud Computing, Machine Learning (ML), and Data Analytics skills delivered by AWS Certified faculty."
                        },
                        {
                          title: "Microsoft Collaboration",
                          image: "/images/ms.jpg",
                          text: "Partnering to provide training in emerging technologies like AI, Cyber Security, and Green Skills. This initiative aims to equip students with industry-relevant skills and enhance global employability."
                        },
                        {
                          title: "Bajaj FinServ (CPBFI)",
                          image: "/images/mou.jpg",
                          text: "A career-oriented Certificate Program in Banking, Finance, and Insurance (CPBFI) designed to help students acquire specialized knowledge and stay ready for future financial sector opportunities."
                        }
                      ].map((mou, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ y: -5 }}
                          className="flex flex-col bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div className="h-40 bg-white dark:bg-gray-900 p-6 flex items-center justify-center border-b border-gray-100 dark:border-gray-800 rounded-t-2xl">
                            <img
                              src={mou.image}
                              alt={mou.title}
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => { e.target.src = "https://via.placeholder.com/200x100?text=Collaboration"; }}
                            />
                          </div>
                          <div className="p-6">
                            <h4 className="font-black text-[#0b2a4a] dark:text-blue-400 text-base mb-2">{mou.title}</h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{mou.text}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ══ PLACEMENT RECORDS ════════════════════════════════════════════ */}
              {activeTab === 'Placement Records' && (
                <motion.div key="records" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <Card className="p-4 sm:p-6 md:p-8">
                    <SectionHeading>Placement Record</SectionHeading>
                    <div className="mt-4">
                      <PlacementData />
                    </div>
                    <p className="text-[11px] text-gray-400 italic mt-10">
                      *Data is fetched live from the ITMGOI Placement Database.
                    </p>
                  </Card>
                </motion.div>
              )}

              {/* ══ TAP EVENTS ═══════════════════════════════════════════════════ */}
              {activeTab === 'TAP Events' && (
                <div className="space-y-8">

                  {/* Upcoming Events */}
                  <Card className="p-6 md:p-8">
                    <SectionHeading>Upcoming Events</SectionHeading>
                    <div className="relative w-full min-h-[250px] md:min-h-[400px] lg:min-h-[500px] overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                      {events.upcoming.length > 0 ? (
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={events.upcoming[currentEventIndex].id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full h-full flex items-center justify-center"
                          >
                            <img
                              src={`http://localhost:8000${events.upcoming[currentEventIndex].image_url}`}
                              className="w-full h-auto max-h-[70vh] block object-contain shadow-sm"
                              alt="Upcoming Event Banner"
                              loading="eager"
                            />
                            {events.upcoming.length > 1 && (
                              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                {events.upcoming.map((_, idx) => (
                                  <div
                                    key={idx}
                                    className={`h-1.5 transition-all duration-300 rounded-full ${idx === currentEventIndex ? "w-6 bg-[#800000]" : "w-2 bg-gray-400/50"}`}
                                  />
                                ))}
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                          <CalendarIcon size={40} className="mb-2 opacity-20" />
                          <p className="italic text-sm">No upcoming events scheduled.</p>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Past Activities */}
                  <Card className="p-6 md:p-8">
                    <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-500 dark:text-gray-400">
                      <span className="w-8 h-1 bg-gray-400 rounded-full shrink-0"></span>
                      Past Activities
                    </h2>
                    <div className="flex flex-col gap-8">
                      {events.past.map((event) => (
                        <div key={event.id} className="w-full overflow-hidden rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                          <img
                            src={`http://localhost:8000${event.image_url}`}
                            className="w-full h-auto block"
                            alt="Past Event Banner"
                          />
                        </div>
                      ))}
                    </div>
                  </Card>

                </div>
              )}

            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TapPage;