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
  { name: "Achu Mani", role: "Senior Analyst, Mphasis", text: "It was a good batch that we interviewed. Good luck to each of them. Also, thanks for all the support." },
  { name: "Amrita Paul", role: "DGM, IBM India", text: "Good Campus. Got lot of support from the staff, well organized. It was a pleasure being here." },
  { name: "Ms. Shazia Siddiqui", role: "HR Manager, Infosys Technologies", text: "Extremely impressive infrastructure. A good team of officials with a good vision for the institute and the students. The students look eager to learn and grasp things and with the given atmosphere in the institute the students will definitely be groomed into good professionals." },
  { name: "Varun Jain", role: "Senior Project Manager, Infosys Limited", text: "Overall good performance by students. Impressive communication skills. Good infrastructure and facilities at campus." }
];

const tapEventsData = [
  { icon: "📋", title: "Personal Training", desc: "Personal training sessions before every placement/internship drive to help students perform well in interviews." },
  { icon: "🏭", title: "Industrial Expert Talk", desc: "Renowned people from industries share overview and tips about the corporate world." },
  { icon: "💼", title: "Summer Internship Drive", desc: "Mandatory 45-day summer internship for industrial exposure and practical learning." },
  { icon: "🎯", title: "Campus Recruitment", desc: "Inviting renowned recruiters for placement drives with various hiring processes." }
];

const LogoCarousel = ({ companies, categoryPath }) => {
  const [index, setIndex] = useState(0);
  const visibleCount = 5;

  useEffect(() => {
    if (!companies || companies.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % companies.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [companies]);

  const getVisibleLogos = () => {
    const logos = [];
    for (let i = 0; i < visibleCount; i++) {
      const actualIdx = (index + i) % companies.length;
      logos.push({
        id: actualIdx,
        name: companies[actualIdx] || `Partner ${actualIdx}`
      });
    }
    return logos;
  };

  return (
    <div className="w-full overflow-hidden">
      <motion.div 
        className="flex items-center gap-4 justify-start py-6 flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {getVisibleLogos().map((logo, idx) => (
          <motion.div 
            key={`${categoryPath}-${logo.id}-${idx}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-center"
          >
            <div className="text-sm font-medium text-gray-700 px-5 py-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200">
              {logo.name}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const TapPage = () => {
  const [activeTab, setActiveTab] = useState('About TAP');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { name: 'About TAP', icon: Info },
    { name: 'TAP Team', icon: Users },
    { name: 'Placement Records', icon: Award },
    { name: 'TAP Events', icon: CalendarIcon }
  ];

  const engineeringCompanies = ["Infosys", "Deloitte", "IBM", "Accenture", "Capgemini", "HP", "Wipro", "Microsoft", "Xiaomi", "Impetus", "Amazon", "Adobe", "ICICI Bank", "Visa", "Nagarro", "Zycus", "Growisto", "Axis Bank", "CoinDCX", "RR Kabel", "Infoedge", "Witmates", "S&P Global", "Tech Mahindra", "DTDC", "Dabur", "Ceasefire", "IDFC First Bank", "Intuit", "Rakuten", "ITC", "Saint-Gobain", "TCS", "Cadbury", "GeeksforGeeks", "Toluna", "Cavisson", "Deutsche Bank", "DXC Technology"];
  const managementCompanies = ["Amazon", "ICICI Bank", "HDFC Bank", "Axis Bank", "Aditya Birla", "Byju's", "Lido", "Jaro Education", "Extramarks", "UpGrad", "Indiamart", "Zeemedia", "Haldi Vita", "Virtusa", "Gati Kwe", "Eastern Software", "Myntra", "Hero MotoCorp", "NielsenIQ", "Teva", "TCS", "Wipro", "Infosys", "IBM", "Accenture", "Cognizant", "Genpact", "Capgemini", "HCL", "Tech Mahindra", "Mindtree", "LTI", "Mphasis", "Syntel", "Zensar", "Persistent", "Globallogic"];
  const pharmacyCompanies = ["Aimil", "Teva", "Tropolite", "Dr. Reddy's", "Sun Pharma", "Cipla", "Lupin", "Biocon", "Aurobindo", "Cadila", "Torrent", "Ipca", "Glenmark", "Alkem", "Abbott", "Pfizer", "GlaxoSmithKline", "Novartis", "Sanofi", "Roche", "Bayer", "Merck", "AstraZeneca", "Johnson & Johnson", "Eli Lilly", "Bristol Myers Squibb", "Gilead", "Amgen", "Biogen", "Regeneron", "Vertex", "Illumina", "Alexion", "Moderna", "Pfizer"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Training, Augmentation & Placement (TAP)</h1>
            <p className="text-sm text-gray-600 mt-1">Excellence in Career Development</p>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex gap-0 md:gap-8 container mx-auto px-4 md:px-8 py-8">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'fixed inset-0 bg-black/50 z-30 md:relative md:bg-transparent' : 'hidden md:block'}`}>
          <div className={`${sidebarOpen ? 'fixed left-0 top-0 w-72 bg-white h-screen overflow-y-auto z-40' : 'w-72'} border-r border-gray-200 rounded-lg bg-gray-50 p-6`}>
            {sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Navigation</h3>
            
            <div className="space-y-3 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => {
                    setActiveTab(tab.name);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.name 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Quick Links</h4>
              <div className="space-y-2">
                {[
                  { label: 'Major Recruiters', icon: Briefcase },
                  { label: 'Industry Speak', icon: MessageSquare },
                  { label: 'Collaborations', icon: Handshake }
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-all text-sm"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'About TAP' && (
              <motion.div key="about" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                
                {/* Main About Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                      <Info className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">About TAP Cell</h2>
                      <p className="text-sm text-gray-600 mt-1">Training, Augmentation & Placement</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4 text-base">
                    ITM Gwalior has always given training, augmentation and placements an utmost priority and to implement it into action an exclusive training, augmentation and placement assistance cell (TAP) has been established with state–of-art facilities. The cell is headed by experienced professionals from Industry.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-base">
                    TAP Cell is responsible for conducting following activities in time bound schedules without violating the time table of university curriculum.
                  </p>
                </div>

                {/* Vision & Mission */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <Target className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 uppercase">Vision</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      To Bridge the gap between Students' skill, knowledge and the industry's Requirement and expectation by Building employability through various workshops, seminars and campus recruitment training.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <Flag className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 uppercase">Mission</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      To promote and support students in developing the required competencies which help them to secure good placements in reputed national and international companies.
                    </p>
                  </div>
                </div>

                {/* Major Recruiters */}
                <div id="major-recruiters" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-10">Major Recruiters</h3>
                  
                  <div className="space-y-12">
                    {/* Engineering */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-6 text-blue-600 uppercase tracking-wide">Engineering</h4>
                      <div className="relative overflow-hidden">
                        <motion.div 
                          className="flex gap-6"
                          animate={{ x: [0, -200] }}
                          transition={{ 
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        >
                          {[...Array(50)].map((_, idx) => (
                            <div
                              key={idx}
                              className="flex-shrink-0"
                            >
                              <div className="w-40 h-40 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center hover:shadow-lg transition-all overflow-hidden">
                                <img 
                                  src={`/images/company_logos/Engineering_Computing/logo_${idx % 25}.png`}
                                  alt={`Logo ${idx}`}
                                  className="w-full h-full object-contain p-4"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* Management */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-6 text-blue-600 uppercase tracking-wide">Management</h4>
                      <div className="relative overflow-hidden">
                        <motion.div 
                          className="flex gap-6"
                          animate={{ x: [0, -200] }}
                          transition={{ 
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        >
                          {[...Array(40)].map((_, idx) => (
                            <div
                              key={idx}
                              className="flex-shrink-0"
                            >
                              <div className="w-40 h-40 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center hover:shadow-lg transition-all overflow-hidden">
                                <img 
                                  src={`/images/company_logos/Life_Sciences_Pharmacy/logo_${idx % 20}.png`}
                                  alt={`Logo ${idx}`}
                                  className="w-full h-full object-contain p-4"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Industry Speak */}
                <div id="industry-speak" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Industry Speak</h3>
                  </div>

                  <div className="space-y-6">
                    {industrySpeak.map((speak, idx) => (
                      <div key={idx} className="border-l-4 border-blue-600 pl-6 py-3 hover:bg-gray-50 rounded transition-all">
                        <p className="text-gray-700 italic leading-relaxed mb-3">"{speak.text}"</p>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {speak.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{speak.name}</p>
                            <p className="text-xs text-gray-600">{speak.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collaborations */}
                <div id="collaborations-mous" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                      <Handshake className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Collaborations & MOUs</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Microsoft", "Google", "Amazon", "IBM", "Cisco", "Oracle"].map((company, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="font-medium text-gray-900">{company}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'TAP Team' && (
              <motion.div key="team" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">TAP Team</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: "Dr. Rajesh Kumar", position: "TAP Cell Head" },
                    { name: "Ms. Priya Singh", position: "Placement Officer" },
                    { name: "Mr. Arun Verma", position: "Training Coordinator" },
                    { name: "Ms. Neha Sharma", position: "Industry Relations" },
                    { name: "Mr. Vikram Patel", position: "Alumni Coordinator" },
                    { name: "Ms. Anjali Gupta", position: "Student Counselor" }
                  ].map((member, idx) => (
                    <div key={idx} className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                      <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{member.name}</h4>
                      <p className="text-sm text-blue-600 font-medium">{member.position}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'Placement Records' && (
              <motion.div key="records" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Placement Records</h3>
                </div>

                <div className="space-y-4">
                  {[
                    { year: "2023-24", stats: "98% Placement | Avg Package: ₹7.2 LPA | Highest: ₹22 LPA" },
                    { year: "2022-23", stats: "97% Placement | Avg Package: ₹6.8 LPA | Highest: ₹20 LPA" },
                    { year: "2021-22", stats: "96% Placement | Avg Package: ₹6.5 LPA | Highest: ₹18 LPA" },
                    { year: "2020-21", stats: "95% Placement | Avg Package: ₹6.2 LPA | Highest: ₹17 LPA" },
                    { year: "2019-20", stats: "94% Placement | Avg Package: ₹5.8 LPA | Highest: ₹16 LPA" }
                  ].map((record, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-blue-50 transition-all">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                        {record.year.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{record.year}</p>
                        <p className="text-sm text-gray-600">{record.stats}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'TAP Events' && (
              <motion.div key="events" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">TAP Events & Activities</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tapEventsData.map((event, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-all">
                      <div className="text-4xl mb-4">{event.icon}</div>
                      <h4 className="text-lg font-bold text-gray-900 mb-3">{event.title}</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{event.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Event Gallery */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Event Gallery</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="aspect-square bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center border border-blue-200">
                        <span className="text-sm font-medium text-blue-600">Event {item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TapPage;