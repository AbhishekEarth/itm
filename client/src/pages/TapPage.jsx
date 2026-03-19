import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Flag, Info, Briefcase, Calendar as CalendarIcon, Award, Users, MessageSquare, Handshake, ChevronRight, X, Menu } from 'lucide-react';

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

const TapPage = () => {
  const [activeTab, setActiveTab] = useState('About TAP');
  const [recruiterIndex, setRecruiterIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRecruiterIndex(prev => prev + 1);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
  { name: 'About TAP', icon: Info },
  { name: 'Industry Speak', icon: MessageSquare },
  { name: 'TAP Team', icon: Users },
  { name: 'MOUs & Collaborations', icon: Handshake }, // New Tab
  { name: 'Placement Records', icon: Award },
  { name: 'TAP Events', icon: CalendarIcon }
];

  return (
    /* Changed outer bg to Gray */
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors duration-500">
      
      {/* Top Header Section */}
      <div className="bg-gradient-to-r from-[#3e0202] via-[#600000] to-[#3e0202] dark:from-white dark:via-[#1a0202] dark:to-white text-[11px] text-white/90 py-3 border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center font-bold tracking-tight">
          <div className="flex gap-8 opacity-80 uppercase tracking-widest">
            <span>Training & Placement Cell</span>
          </div>
          <div className="flex gap-6 items-center">
            <a href="#" className="hover:text-red-300 transition-colors">Contact TAP</a>
            <div className="h-3 w-[1px] bg-white/20"></div>
            <a href="#" className="hover:text-red-300 transition-colors">Schedule Visit</a>
          </div>
        </div>
      </div>

      <div className="pb-16">
        {/* Page Title Header - Changed to Gray to blend with background */}
        <div className="bg-gray-50 dark:bg-[#020617] border-b border-gray-200 dark:border-gray-800 py-5">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-xl md:text-2xl font-black text-[#0b2a4a] dark:text-gray-100 uppercase tracking-wide">
              Training and Placement Cell
            </h1>
          </div>
        </div>

        {/* Content Layout */}
        <div className="max-w-[1500px] mx-auto px-6 mt-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
           {/* Sidebar Navigation - Main container White */}
            <aside className="lg:w-[300px] shrink-0">
              <div className="sticky top-40 bg-white dark:bg-[#020617] border border-gray-200 dark:border-gray-800 rounded-sm shadow-sm overflow-hidden">
                <nav className="flex flex-col">
                  {tabs.map((tab) => (
                    <button 
                      key={tab.name}
                      onClick={() => setActiveTab(tab.name)}
                      className={`text-left py-4 px-5 text-sm font-semibold transition-all border-b border-gray-200 dark:border-gray-800 last:border-b-0 ${
                        activeTab === tab.name 
                          ? 'bg-[#800000] text-white border-l-[4px] border-l-[#3e0202]' // Active State: Full Red background
                          : 'text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-[#800000] dark:hover:text-red-400 border-l-[4px] border-l-transparent'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 space-y-8">
            
            <AnimatePresence mode="wait">
              {activeTab === 'About TAP' && (
                <motion.div key="about" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white dark:bg-[#020617] p-8 border border-gray-200 dark:border-gray-800 rounded-sm shadow-sm space-y-8">
                  
                  {/* Main About Section - Internal containers White */}
                  <section>
                    <div className="mb-6">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider inline-block border-b-2 border-[#800000] pb-2">
                        About TAP Cell
                      </h2>
                    </div>
                    <p className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-sm shadow-sm">
                      ITM Gwalior has always given training, augmentation and placements an utmost priority and to implement it into action an exclusive training, augmentation and placement assistance cell (TAP) has been established with state–of-art facilities. The cell is headed by experienced professionals from Industry.
                    <br /><br />
                      TAP Cell is responsible for conducting following activities in time bound schedules without violating the time table of university curriculum.
                    </p>
                  </section>

                  {/* Vision & Mission Grid - Background White */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <motion.div whileHover={{ y: -4 }} className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-sm shadow-sm">
                      <h3 className="text-lg font-bold mb-4 uppercase tracking-wide text-[#800000] dark:text-red-400">Vision</h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        To Bridge the gap between Students' skill, knowledge and the industry's Requirement and expectation by Building employability through various workshops, seminars and campus recruitment training.
                      </p>
                    </motion.div>
                    
                    <motion.div whileHover={{ y: -4 }} className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-sm shadow-sm">
                      <h3 className="text-lg font-bold mb-4 uppercase tracking-wide text-[#0b2a4a] dark:text-blue-400">Mission</h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        To promote and support students in developing the required competencies which help them to secure good placements in reputed national and international companies.
                      </p>
                    </motion.div>
                  </div>

                  {/* Major Recruiters - Background White */}
                  <section className="bg-white dark:bg-gray-900 p-8 rounded-sm border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider inline-block border-b-2 border-[#800000] pb-2">
                        Major Recruiters
                      </h3>
                    </div>
                    
                    <div className="mb-10">
                      <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-widest">Engineering</h4>
                      <div className="relative overflow-hidden w-full">
                        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${(recruiterIndex % 195) * 0.5}%)`, width: '5000%' }}>
                          {[...Array(200)].map((_, i) => {
                            const idx = i % 39;
                            return (
                              <div key={i} className="w-[0.5%] shrink-0 px-2 lg:px-3">
                                <div className="w-full h-32 flex items-center justify-center overflow-hidden">
                                  <img src={`/images/company_logos/Engineering_Computer_Applications/logo_${idx}.png`} alt={`Logo ${idx}`} className="w-full h-full object-contain p-4" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-widest">Management</h4>
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
                  </section>
                </motion.div>
              )}

            {activeTab === 'Industry Speak' && (
  <motion.div 
    key="industry" 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }} 
    exit={{ opacity: 0, y: -10 }} 
    className="bg-white dark:bg-[#020617] p-8 border border-gray-200 dark:border-gray-800 rounded-sm shadow-sm space-y-8"
  >
    <section>
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider inline-block border-b-2 border-[#800000] pb-2">
          Industry Speak
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {industrySpeak.map((speak, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex flex-col bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* TOP SECTION: Name and Role */}
            <div className="bg-white dark:bg-gray-800 p-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#800000] text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                {speak.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-[15px] leading-tight">
                  {speak.name}
                </h4>
                <p className="text-[12px] text-[#800000] dark:text-red-400 font-semibold uppercase tracking-wide mt-1">
                  {speak.role}
                </p>
              </div>
            </div>

            {/* BOTTOM SECTION: Testimonial Text */}
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 italic text-[14px] leading-relaxed">
                "{speak.text}"
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  </motion.div>
)}

              {/* Other tabs follow the same bg-white logic */}
              {activeTab === 'TAP Team' && (
  <motion.div 
    key="team" 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }} 
    exit={{ opacity: 0, y: -10 }} 
    className="bg-white dark:bg-[#020617] p-8 border border-gray-200 dark:border-gray-800 rounded-sm shadow-sm"
  >
    <section className="flex flex-col items-center w-full"> 
      <div className="mb-12 text-center w-full">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider inline-block border-b-2 border-[#800000] pb-2">
          TAP Cell Team
        </h2>
      </div>

      {/* Horizontal Flex Container - Centers both members in one row */}
      <div className="flex flex-col md:flex-row gap-12 lg:gap-24 justify-center items-start w-full">
        {[
          {
            name: "Mr. Arpit Singh Chauhan",
            position: "(Dean/Director TAP CELL I/C)",
            email: "arpit.chauhan@itmuniversity.ac.in",
            phone: "+91-9691973919",
            image: "/public/images/Arpit_Singh.jpg" 
          },
          {
            name: "Mrs. Shikha Sharma",
            position: "(Asst. Director Placement)",
            email: "shikhasharma@itmuniversity.ac.in",
            phone: "+91-9229333335",
            image: "/public/images/Shikha_Sharma.jpg"
          }
        ].map((member, idx) => (
          <div key={idx} className="flex flex-col items-start max-w-[256px]">
            
            {/* Photo with Black Border */}
            <div className="w-64 h-80 border border-black mb-4 overflow-hidden bg-gray-50">
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "https://via.placeholder.com/256x320?text=Photo"; }}
              />
            </div>
            
            {/* Info matching your provided image style */}
            <div className="space-y-1 text-left"> 
              <h4 className="text-[16px] font-bold text-gray-900 dark:text-white leading-tight">
                {member.name}
              </h4>
              <p className="text-[14px] text-gray-700 dark:text-gray-300">
                {member.position}
              </p>
              <p className="text-[14px] text-gray-700 dark:text-gray-300 break-words">
                Email id : <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{member.email}</span>
              </p>
              <p className="text-[14px] text-gray-700 dark:text-gray-300">
                Phone No : {member.phone}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  </motion.div>
)}

{activeTab === 'MOUs & Collaborations' && (
  <motion.div 
    key="mous" 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }} 
    exit={{ opacity: 0, y: -10 }} 
    className="bg-white dark:bg-[#020617] p-8 border border-gray-200 dark:border-gray-800 rounded-sm shadow-sm space-y-8"
  >
    <section>
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider inline-block border-b-2 border-[#800000] pb-2">
          MOUs & Strategic Collaborations
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            image: "/images/mou.jpg", // Using the MOU image for this partnership
            text: "A career-oriented Certificate Program in Banking, Finance, and Insurance (CPBFI) designed to help students acquire specialized knowledge and stay ready for future financial sector opportunities."
          }
        ].map((mou, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -5 }}
            className="flex flex-col bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-sm overflow-hidden shadow-sm"
          >
            {/* Image Header */}
            <div className="h-40 bg-white p-6 flex items-center justify-center border-b border-gray-100 dark:border-gray-800">
              <img 
                src={mou.image} 
                alt={mou.title} 
                className="max-w-full max-h-full object-contain"
                onError={(e) => { e.target.src = "https://via.placeholder.com/200x100?text=Collaboration"; }}
              />
            </div>

            {/* Content Area */}
            <div className="p-6">
              <h4 className="font-bold text-[#0b2a4a] dark:text-blue-400 text-lg mb-3">
                {mou.title}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {mou.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  </motion.div>
)}

{activeTab === 'Placement Records' && (
  <motion.div 
    key="records" 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }} 
    exit={{ opacity: 0, y: -10 }} 
    className="bg-white dark:bg-[#020617] p-8 border border-gray-200 dark:border-gray-800 rounded-sm shadow-sm space-y-8"
  >
    <section>
      {/* Heading style matching 'About TAP' and 'TAP Team' */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider inline-block border-b-2 border-[#800000] pb-2">
          Placement Records
        </h2>
      </div>

      {/* Content Area */}
      <div className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-sm">
        <p className="text-gray-600 dark:text-gray-400 text-sm italic">
          Detailed placement statistics and year-wise records are currently being updated for the latest academic session.
        </p>
      </div>
    </section>
  </motion.div>
)}
              {activeTab === 'TAP Events' && (
                <motion.div key="events" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white dark:bg-[#020617] p-8 border border-gray-200 dark:border-gray-800 rounded-sm shadow-sm space-y-8">
                  <section>
                    <div className="mb-6">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider inline-block border-b-2 border-[#800000] pb-2">
                        TAP Events & Activities
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {tapEventsData.map((event, idx) => (
                        <motion.div key={idx} whileHover={{ y: -4 }} className="p-6 bg-white dark:bg-gray-900 rounded-sm border border-gray-100 dark:border-gray-800 shadow-sm transition-all">
                          <div className="text-3xl mb-4">{event.icon}</div>
                          <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">{event.title}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{event.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default TapPage;