import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Flag, Info, Star, Briefcase, Calendar as CalendarIcon, Award, CheckCircle2, Plus, Users, MessageSquare, Handshake, ChevronLeft, ChevronRight, X } from 'lucide-react';

const industrySpeak = [
  { name: "Aditya Mahajan", role: "Recruiter Campus Hiring, TCS", text: "It was a wonderful and great experience for conducting interviews at ITM. Students were well prepared. College Management has invested a lot in grooming them. Good performance by students. Good professionalism." },
  { name: "Lakshmi", role: "Regional Head, Wipro", text: "It was a good batch that we interviewed met our most of the requirement. Technical knowledge of students was good but can be better. They need to work on communication skills. Looking forward to conduct more drives in future." },
  { name: "Ronak Choudhary", role: "Regional Head, Cognizant", text: "The spirits shown by students was very delightful and encouraging for us & for our company too. Did bulk hiring even on the virtual mode. Students have good technical knowledge." },
  { name: "Piuli Ghosh", role: "Campus Lead, ICICI", text: "We had a good experience!! We expected more candidates for interview, out of 30 to 40 Students almost 50% got placed. Decent quality of students." },
  { name: "Deepti Thakur", role: "Campus Team, Xiaomi", text: "Good, was a good experience, glad to provide this opportunity to the students of ITM, students should work on Aptitude part." },
  { name: "Sandeep Mishra", role: "HR, VISA Steel", text: "It was an amazing experience and the students were really enthusiastic. Every year we got upgraded batch. Will love to visit again." },
  { name: "Kajal Soni", role: "HR Recruiter, Thermax Limited", text: "During the pandemic time, it was unexpected to conduct such a wonderful drive on a Virtual Mode. Students have good technical knowledge. Great Experience!!" },
  { name: "Akhil James", role: "HR Specialist, FedEx", text: "Had a great experience visiting ITM, Courtesy campus members really appreciate the efforts and support provided. Well-groomed and prepared students." },
  { name: "Achu Mani", role: "Senior Analyst, Mphasis", text: "It was a good batch that we interviewed. Good luck to each of them. Also, thanks for all the support." },
  { name: "Amrita Paul", role: "DGM, IBM India", text: "Good Campus. Got lot of support from the staff, well organized. It was a pleasure being here." },
  { name: "Ms. Shazia Siddiqui", role: "HR Manager, Infosys Technologies", text: "Extremely impressive infrastructure. A good team of officials with a good vision for the institute and the students. The students look eager to learn and grasp things and with the given atmosphere in the institute the students will definitely be groomed into good professionals." },
  { name: "Varun Jain", role: "Senior Project Manager, Infosys Limited", text: "Overall good performance by students. Impressive communication skills. Good infrastructure and facilities at campus." }
];

const tapEventsData = [
  "Personal Training for Performing well during interview: Before every placement/ internship drive students are get a personal training session from the members of TAP CELL so that the thry get to know how to perform really well and give their best during the interview.",
  "Industrial Expert Talk: Renowned people from industries come to our campus in online and offline mode to give overview and tips to students about the corporate world.",
  "Summer Internship Drive: It is mandatory for every student to go for a 45 days summer internship in which they have to take industrial exposure.",
  "Campus recruitment Drive: We at ITM Gwalior, invites all the renowned recruiter for conducting placement drive in the campus, followed by various process. The students apply for the same and grab best available opportunities for them."
];

const placementRecords = ["2023-24", "2022-23", "2021-22", "2020-21", "2019-20"];

const LogoCarousel = ({ companies, categoryPath }) => {
  const [index, setIndex] = useState(0);
  const visibleCount = 5;

  useEffect(() => {
    if (!companies || companies.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % companies.length);
    }, 2000); // 2 seconds for a faster swap
    return () => clearInterval(timer);
  }, [companies]);

  // Derive the 5 visible items. 
  // We use a stable key based on the actual logo index to avoid "blank" jumps.
  const getVisibleLogos = () => {
    const logos = [];
    for (let i = 0; i < visibleCount; i++) {
      const actualIdx = (index + i) % companies.length;
      logos.push({
        id: actualIdx, // Use actualIdx as key for stable tracking
        src: `/images/company_logos/${categoryPath}/logo_${actualIdx}.png`,
        name: companies[actualIdx] || `Partner ${actualIdx}`
      });
    }
    return logos;
  };

  return (
    <div className="relative w-full h-32 sm:h-44 md:h-56 overflow-hidden flex items-center justify-center">
      <div className="flex items-center gap-6 md:gap-10 w-full max-w-7xl justify-center px-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {getVisibleLogos().map((logo) => (
            <motion.div
              key={`${categoryPath}-${logo.id}`}
              layout
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ 
                type: "tween",
                ease: "easeInOut",
                duration: 0.8
              }}
              className="flex-1 min-w-0 max-w-[280px] h-full flex items-center justify-center group"
            >
              <img 
                src={logo.src} 
                alt={logo.name}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const TapPage = () => {
  const [currentEventImage, setCurrentEventImage] = useState(0);
  const [currentBgImage, setCurrentBgImage] = useState(0);
  const [activeTab, setActiveTab] = useState('About TAP');
  const [isDashboardMinimized, setIsDashboardMinimized] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  
  const tabs = ['About TAP', 'TAP Team', 'Placement Records', 'TAP Events'];

  const bgImages = [
    "/images/Tap_Cell.jpg",
    "/images/iNDUSTRIAL VISIT(INDIVAR COMPANY).jpg",
    "/images/Center of excellence inaugration-1.jpeg"
  ];
  const eventImages = [
    "/images/TAP_Cell1.jpeg",
    "/images/event(1).jpeg",
    "/images/event(2).jpeg",
    "/images/event(3).jpeg",
    "/images/event(4).jpeg"
  ];

  const engineeringCompanies = ["Infosys", "Deloitte", "IBM", "Accenture", "Capgemini", "HP", "Wipro", "Microsoft", "Xiaomi", "Impetus", "Amazon", "Adobe", "ICICI Bank", "Visa", "Nagarro", "Zycus", "Growisto", "Axis Bank", "CoinDCX", "RR Kabel", "Infoedge", "Witmates", "S&P Global", "Tech Mahindra", "DTDC", "Dabur", "Ceasefire", "IDFC First Bank", "Intuit", "Rakuten", "ITC", "Saint-Gobain", "TCS", "Cadbury", "GeeksforGeeks", "Toluna", "Cavisson", "Deutsche Bank", "DXC Technology"];
  
  const managementCompanies = ["Amazon", "ICICI Bank", "HDFC Bank", "Axis Bank", "Aditya Birla", "Byju's", "Lido", "Jaro Education", "Extramarks", "UpGrad", "Indiamart", "Zeemedia", "Haldi Vita", "Virtusa", "Gati Kwe", "Eastern Software", "Myntra", "Hero MotoCorp", "NielsenIQ", "Teva", "TCS", "Wipro", "Infosys", "IBM", "Accenture", "Cognizant", "Genpact", "Capgemini", "HCL", "Tech Mahindra", "Mindtree", "LTI", "Mphasis", "Syntel", "Zensar", "Persistent", "Globallogic"];

  const pharmacyCompanies = ["Aimil", "Teva", "Tropolite", "Dr. Reddy's", "Sun Pharma", "Cipla", "Lupin", "Biocon", "Aurobindo", "Cadila", "Torrent", "Ipca", "Glenmark", "Alkem", "Abbott", "Pfizer", "GlaxoSmithKline", "Novartis", "Sanofi", "Roche", "Bayer", "Merck", "AstraZeneca", "Johnson & Johnson", "Eli Lilly", "Bristol Myers Squibb", "Gilead", "Amgen", "Biogen", "Regeneron", "Vertex", "Illumina", "Alexion", "Moderna", "Pfizer"];

  const dashboardRef = React.useRef(null);
  const contentTopRef = React.useRef(null);
  
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    if (contentTopRef.current) {
      const offset = 100; // Account for fixed navbar
      const elementPosition = contentTopRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };
  
  useEffect(() => {
    const eventTimer = setInterval(() => {
      setCurrentEventImage((prev) => (prev + 1) % eventImages.length);
    }, 3500);
    
    const bgTimer = setInterval(() => {
      setCurrentBgImage((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight;
      
      // Auto-minimize on scroll - more lenient threshold
      if (Math.abs(scrollPos - (window.lastScrollPos || 0)) > 150) {
        setIsDashboardMinimized(true);
      }
      window.lastScrollPos = scrollPos;

      // Threshold to stop dashboard
      const footerThreshold = 550;
      
      // Show after hero
      if (scrollPos > 250) {
        setShowDashboard(true);
      } else {
        setShowDashboard(false);
      }
    };

    const handleClickOutside = (e) => {
      if (dashboardRef.current && !dashboardRef.current.contains(e.target)) {
        setIsDashboardMinimized(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClickOutside);
    
    return () => {
      clearInterval(eventTimer);
      clearInterval(bgTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="pb-16 bg-gray-50 min-h-screen relative overflow-x-hidden">
      {/* Page Header - Full-Width Edge-to-Edge with Vibrant Glowing Gradient */}
      <div className="relative w-full mb-12 sm:mb-16">
        <div className="relative w-full flex flex-col md:flex-row overflow-hidden shadow-[0_10px_60px_rgba(219,39,119,0.3)] min-h-[400px] md:min-h-[550px]">
          
          {/* Left Side: Intense Glowing Gradient Content */}
          <div className="w-full md:w-[55%] p-10 sm:p-14 md:p-20 lg:p-28 bg-gradient-to-br from-[#020617] via-[#9d174d] to-[#dc2626] relative z-10 flex flex-col justify-center">
            {/* Multi-layered Animated Glows */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(220,38,38,0.2),transparent)] pointer-events-none"></div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-8 leading-[1.05] tracking-tight drop-shadow-[0_5px_30px_rgba(0,0,0,0.5)]"
              >
                Training & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-300 to-blue-300">Placements</span>
              </motion.h1>
              
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "120px" }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="h-2 bg-gradient-to-r from-red-500 to-blue-500 rounded-full mb-10 shadow-[0_0_20px_rgba(220,38,38,0.5)]"
              ></motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/90 text-base sm:text-lg md:text-2xl max-w-2xl leading-relaxed font-semibold drop-shadow-lg"
              >
                Empowering students to achieve their career goals through comprehensive training and industry collaboration.
              </motion.p>
            </motion.div>
          </div>

          {/* Right Side: Image Slider Section */}
          <div className="w-full md:w-[45%] relative min-h-[400px] md:min-h-full overflow-hidden flex items-center justify-center bg-gray-900">
            <AnimatePresence mode="sync">
              <motion.img 
                key={currentBgImage}
                src={bgImages[currentBgImage]}
                initial={{ opacity: 0, scale: 1.02, filter: 'brightness(1.15) contrast(1.05)' }}
                animate={{ opacity: 1, scale: 1, filter: 'brightness(1.15) contrast(1.05)' }}
                exit={{ opacity: 0, scale: 1.02, filter: 'brightness(1.15) contrast(1.05)' }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                alt="TAP Background" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {/* Seamless Transition Overlays */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none md:hidden"></div>
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#9d174d]/50 to-transparent pointer-events-none hidden md:block"></div>
          </div>
        </div>
      </div>

      <div ref={contentTopRef} className="container mx-auto px-4 md:px-8 mb-16 max-w-7xl">
        {/* Tab Content Area */}
        <div className="min-h-[350px]">
          <AnimatePresence mode="popLayout" initial={false}>
            
            {/* ABOUT TAP TAB */}
            {activeTab === 'About TAP' && (
              <motion.div 
                key="about"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-8"
              >
                <section className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-slate-200 flex flex-col justify-center max-w-6xl mx-auto w-full relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 border border-blue-100 shadow-sm">
                      <Info className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">About TAP</h2>
                  </div>
                  <p className="text-slate-600 mb-4 leading-relaxed text-sm md:text-lg font-medium">
                    ITM Gwalior has always given training, augmentation and placements an utmost priority and to implement it into action an exclusive training, augmentation and placement assistance cell (TAP) has been established with state–of-art facilities. The cell is headed by experienced professionals from Industry.
                  </p>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-lg">
                    TAP Cell is responsible for conducting following activities in time bound schedules without violating the time table of university curriculum.
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-6xl mx-auto w-full">
                  <section className="bg-slate-50/80 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 flex-1 flex flex-col justify-center hover:bg-white transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-100/50 p-2 rounded-xl text-blue-600 border border-blue-100/50">
                        <Target className="w-5 h-5" />
                      </div>
                      <h2 className="text-base md:text-xl font-bold text-slate-800 uppercase tracking-wide">Vision</h2>
                    </div>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                      To Bridge the gap between Students’ skill, knowledge and the industry's Requirement and expectation by Building employability through various workshops, seminars and campus recruitment training so that the student can grab the best opportunities and will grow vigorously in their career.
                    </p>
                  </section>

                  <section className="bg-slate-50/80 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 flex-1 flex flex-col justify-center hover:bg-white transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-100/50 p-2 rounded-xl text-blue-600 border border-blue-100/50">
                        <Flag className="w-5 h-5" />
                      </div>
                      <h2 className="text-base md:text-xl font-bold text-slate-800 uppercase tracking-wide">Mission</h2>
                    </div>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                      The Training Augmentation and Placement team Team of ITM Gwalior is dedicated towards achieving 100% placements by collaborating with HR Teams of different corporate to ensure the smooth functioning of the Campus-Recruitment process.
                    </p>
                  </section>
                </div>

                {/* Major Recruiters */}
                <section id="major-recruiters" className="mt-8 md:mt-12">
                  <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                     <Briefcase className="w-5 h-5 md:w-7 md:h-7 text-primary-600" />
                     <h2 className="text-lg md:text-2xl font-bold text-gray-900 uppercase">Major Recruiters</h2>
                  </div>

                  <div className="space-y-8 md:space-y-12">
                    {[
                      { 
                        title: "Engineering", 
                        companies: engineeringCompanies,
                        path: "Engineering_Computer_Applications"
                      },
                      { 
                        title: "Management", 
                        companies: managementCompanies,
                        path: "Management"
                      },
                      { 
                        title: "Life Sciences & Pharmacy", 
                        companies: pharmacyCompanies,
                        path: "Life_Sciences_Pharmacy"
                      }
                    ].map((category, catIdx) => (
                      <div key={catIdx} className="space-y-4">
                        <div className="flex items-center gap-4">
                          <h3 className="text-sm md:text-lg font-bold text-white bg-red-800 px-4 py-1.5 rounded-r-full shadow-sm">
                            {category.title}
                          </h3>
                          <div className="h-0.5 flex-grow bg-gray-200 rounded-full"></div>
                        </div>
                        
                        <div className="relative overflow-hidden bg-blue-50/40 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-blue-100 shadow-inner">
                          <LogoCarousel companies={category.companies} categoryPath={category.path} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Industry Speak */}
                <section id="industry-speak" className="mt-8 md:mt-12">
                  <div className="flex items-center gap-2 md:gap-3 mb-5 md:mb-6">
                    <Star className="w-5 h-5 md:w-7 md:h-7 text-accent-500" />
                    <h2 className="text-lg md:text-2xl font-bold text-gray-900 uppercase tracking-tight">Industry Speak About ITM Gwalior</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {industrySpeak.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 relative group hover:shadow-md transition-shadow"
                      >
                         <div className="mb-4 md:mb-6 border-b border-slate-100 pb-2">
                          <h4 className="font-bold text-base md:text-xl text-slate-800">{item.name}</h4>
                          <p className="text-[10px] md:text-xs font-semibold text-blue-600 uppercase tracking-widest">{item.role}</p>
                         </div>
                         <p className="text-slate-600 text-sm md:text-base italic leading-relaxed text-justify">"{item.text}"</p>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* MoUs and Collaborations */}
                <section id="collaborations-mous" className="mt-8 md:mt-12">
                  <div className="flex flex-col md:flex-row justify-between md:items-end mb-4 md:mb-6">
                    <div>
                      <div className="flex items-center gap-2 md:gap-3 mb-1">
                        <Briefcase className="w-5 h-5 md:w-7 md:h-7 text-primary-600" />
                        <h2 className="text-lg md:text-2xl font-bold text-gray-900 uppercase">Collaborations & MoUs</h2>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600">Bridging the gap with industry leaders.</p>
                    </div>
                    <div className="mt-3 md:mt-0 px-2 py-1 md:px-3 md:py-1.5 bg-primary-50 rounded-lg border border-primary-100 text-primary-700 font-semibold text-[10px] md:text-xs flex items-center w-fit">
                       MoUs established: 2019 - 2024
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                     <motion.div 
                        whileHover={{ y: -3 }}
                        className="bg-white p-3 md:p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center gap-2 md:gap-3"
                     >
                        <div className="h-12 flex items-center justify-center mb-1">
                          <img src="/images/LOGO_EduSkills.png" alt="EduSkills" className="max-h-full max-w-full object-contain" />
                        </div>
                        <h3 className="font-bold text-sm md:text-base text-gray-800">EduSkills</h3>
                        <p className="text-[10px] text-gray-500 leading-tight">Digital skills expansion in Networking, Cyber, and Cloud.</p>
                     </motion.div>

                    <motion.div 
                       whileHover={{ y: -5 }}
                       className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center gap-3 md:gap-4"
                    >
                       <div className="h-16 flex items-center justify-center mb-2">
                         <img src="/images/aws.jpg" alt="AWS Academy" className="max-h-full max-w-full object-contain" />
                       </div>
                       <h3 className="font-bold text-lg text-gray-800">AWS Academy</h3>
                       <p className="text-xs text-gray-500">Enhancing Students with Industry ready Cloud Computing and Machine Learning Skills.</p>
                    </motion.div>

                    <motion.div 
                       whileHover={{ y: -5 }}
                       className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center gap-3 md:gap-4"
                    >
                       <div className="h-16 flex items-center justify-center mb-2">
                         <img src="/images/ms.jpg" alt="Microsoft" className="max-h-full max-w-full object-contain" />
                       </div>
                       <h3 className="font-bold text-lg text-gray-800">Microsoft</h3>
                       <p className="text-xs text-gray-500">Authorized Certification Center. Empowering students with emerging technologies like AI and Cyber Security.</p>
                    </motion.div>

                    <motion.div 
                       whileHover={{ y: -5 }}
                       className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center gap-4 md:gap-6"
                    >
                       <div className="h-16 flex items-center justify-center mb-2">
                         <img src="/images/mou.jpg" alt="Bajaj FinServ" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                       </div>
                       <h3 className="font-bold text-lg md:text-2xl text-gray-800">Bajaj FinServ</h3>
                       <p className="text-sm md:text-base text-gray-600">Offering a career-oriented Certificate Program in Banking, Finance, and Insurance (CPBFI).</p>
                    </motion.div>
                  </div>
                </section>
              </motion.div>
            )}

            {/* TAP TEAM TAB */}
            {activeTab === 'TAP Team' && (
              <motion.div 
                key="team"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-slate-50/50 rounded-3xl p-6 md:p-12 shadow-sm border border-slate-200 backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-3 md:gap-6 mb-6 md:mb-10 border-b border-slate-200 pb-4 md:pb-6">
                    <h2 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight">Meet the TAP Team</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div className="flex flex-col items-center text-center bg-white p-6 md:p-8 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shrink-0 border-4 border-slate-50 shadow-md mb-4 md:mb-6">
                        <img src="/images/Arpit_Singh.jpg" alt="Mr. Arpit Singh Chauhan" className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="space-y-1 md:space-y-2">
                        <h4 className="font-bold text-lg md:text-xl text-slate-800">Mr. Arpit Singh Chauhan</h4>
                        <p className="text-[10px] md:text-xs text-blue-600 font-bold uppercase tracking-widest bg-blue-50 py-1 px-3 rounded-full inline-block">(Dean/Director TAP CELL I/C)</p>
                        <div className="space-y-0.5">
                          <p className="text-xs md:text-sm text-gray-600 font-medium">arpit.chauhan@itmuniversity.ac.in</p>
                          <p className="text-sm md:text-base text-gray-900 font-bold">+91-9691973919</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center text-center bg-white p-6 md:p-8 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shrink-0 border-4 border-slate-50 shadow-md mb-4 md:mb-6">
                        <img src="/images/Shikha_Sharma.jpg" alt="Mrs. Shikha Sharma" className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="space-y-1 md:space-y-2">
                        <h4 className="font-bold text-lg md:text-xl text-slate-800">Mrs. Shikha Sharma</h4>
                        <p className="text-[10px] md:text-xs text-blue-600 font-bold uppercase tracking-widest bg-blue-50 py-1 px-3 rounded-full inline-block">(Asst. Director Placement)</p>
                        <div className="space-y-0.5">
                          <p className="text-xs md:text-sm text-gray-600 font-medium">shikhasharma@itmuniversity.ac.in</p>
                          <p className="text-sm md:text-base text-gray-900 font-bold">+91-9229333335</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PLACEMENT RECORDS TAB */}
            {activeTab === 'Placement Records' && (
              <motion.div 
                key="records"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto"
              >
                <div className="bg-slate-950 rounded-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(30,58,138,0.3)] relative overflow-hidden border border-blue-500/20">
                  <div className="absolute top-0 right-0 p-8 md:p-12 opacity-5 pointer-events-none">
                    <Award className="w-48 h-48 md:w-64 md:h-64 text-white" />
                  </div>
                  <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-10 relative z-10 flex items-center gap-3 md:gap-5 text-white tracking-tight">
                    <Award className="w-6 h-6 md:w-10 md:h-10 text-blue-500" />
                    Consistent Placement Records
                  </h2>
                  <div className="space-y-3 md:space-y-4 relative z-10">
                    {placementRecords.map((year, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-blue-900/20 p-4 md:p-6 rounded-2xl hover:bg-blue-900/30 transition-all border border-blue-500/10 shadow-sm group">
                        <span className="text-lg md:text-2xl font-bold text-gray-100 group-hover:text-white transition-colors">{year}</span>
                        <div className="flex items-center gap-2 md:gap-3 text-blue-400 text-xs md:text-lg font-bold">
                          <span>Verified Highlights</span>
                          <CheckCircle2 className="w-4 h-4 md:w-6 md:h-6" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAP EVENTS TAB */}
            {activeTab === 'TAP Events' && (
              <motion.div 
                key="events"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(30,58,138,0.3)] border border-blue-500/20">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-8 sm:p-10 md:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-3 md:gap-5 mb-6 md:mb-8">
                        <div className="bg-blue-900/40 p-3 md:p-4 rounded-2xl text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                          <CalendarIcon className="w-8 h-8 md:w-10 md:h-10" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">TAP Events</h2>
                      </div>
                      <ul className="space-y-4 md:space-y-5">
                        {tapEventsData.map((event, index) => (
                          <li key={index} className="flex gap-3 md:gap-5 items-start bg-blue-950/40 p-4 md:p-5 rounded-2xl border border-blue-500/10 hover:border-blue-400/30 transition-all shadow-sm group">
                            <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-blue-500 shrink-0 mt-0.5 md:mt-1 group-hover:scale-110 transition-transform" />
                            <p className="text-blue-100/90 text-sm md:text-base font-medium leading-relaxed">{event}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="h-64 sm:h-[400px] lg:h-auto overflow-hidden relative w-full bg-blue-900/10 border-t lg:border-t-0 lg:border-l border-blue-500/10 flex items-center justify-center p-6 sm:p-8">
                      <AnimatePresence mode="popLayout">
                        <motion.img 
                          key={currentEventImage}
                          src={eventImages[currentEventImage]}
                          initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                          transition={{ duration: 0.8 }}
                          alt="TAP Events Gallery" 
                          className="w-full h-full object-contain absolute inset-0 p-4 md:p-6 filter drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                        />
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Floating Dashboard */}
      <AnimatePresence>
        {showDashboard && (
          <motion.div
            ref={dashboardRef}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="z-40 transition-all duration-300 pointer-events-none fixed left-4 top-24"
          >
            <div className={`bg-[#FFFBEB] shadow-2xl border-2 border-red-500 rounded-r-3xl overflow-hidden relative transition-all duration-300 flex flex-col pointer-events-auto ${
              isDashboardMinimized ? 'w-10 h-10' : 'w-72 h-auto max-h-[75vh]'
            }`}>
              {/* Minimized View (+) */}
              {isDashboardMinimized ? (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDashboardMinimized(false);
                  }}
                  className="w-full h-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors shadow-inner"
                  title="Quick View"
                >
                  <Plus className="w-5 h-5 text-white" />
                </button>
              ) : (
                <>
                  {/* Header - Strong Red Theme */}
                  <div className="bg-red-600 p-3 relative">
                    <h3 className="font-black text-white text-base uppercase tracking-wider">Quick View</h3>
                    <button 
                      onClick={(e) => { // Reverted this specific onClick to its original function
                        e.stopPropagation();
                        setIsDashboardMinimized(true);
                      }}
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 hover:bg-red-700 rounded-lg transition-colors group"
                    >
                      <ChevronLeft className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  <div className="p-4 pr-6 overflow-y-auto custom-scrollbar">
                    {/* Nav Links */}
                    <div className="space-y-6">
                      {/* Main Tabs */}
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">Main Sections</p>
                        {tabs.map((tab) => {
                          const Icon = {
                            'About TAP': Info,
                            'TAP Team': Users,
                            'Placement Records': Award,
                            'TAP Events': CalendarIcon
                          }[tab];

                          return (
                            <button
                              key={tab}
                              onClick={() => {
                                setActiveTab(tab);
                                const element = document.querySelector('.container.mx-auto.px-4.md\\:px-8.mb-16');
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }}
                              className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                                activeTab === tab 
                                  ? 'bg-red-50 text-red-600 font-bold shadow-sm' 
                                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                            >
                              <div className={`shrink-0 ${activeTab === tab ? 'text-red-600' : 'text-gray-400'}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className="text-sm truncate">{tab}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* About TAP Deep Links */}
                      <div className="space-y-1.5 border-t border-gray-100 pt-5">
                        {[
                          { label: 'Major Recruiters', id: 'major-recruiters', icon: Briefcase },
                          { label: 'Industry Speak', id: 'industry-speak', icon: MessageSquare },
                          { label: 'Collaborations', id: 'collaborations-mous', icon: Handshake }
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab('About TAP');
                              setTimeout(() => {
                                const element = document.getElementById(item.id);
                                if (element) {
                                  const offset = 100;
                                  const bodyRect = document.body.getBoundingClientRect().top;
                                  const elementRect = element.getBoundingClientRect().top;
                                  const elementPosition = elementRect - bodyRect;
                                  const offsetPosition = elementPosition - offset;

                                  window.scrollTo({
                                    top: offsetPosition,
                                    behavior: 'smooth'
                                  });
                                }
                              }, 100);
                            }}
                            className="w-full flex items-center gap-3 p-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-700 group transition-all"
                          >
                            <div className="shrink-0 text-gray-400 group-hover:text-red-600">
                              <item.icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm truncate">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TapPage;
