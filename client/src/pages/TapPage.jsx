import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Flag, Info, Star, Briefcase, Calendar as CalendarIcon, Award, CheckCircle2 } from 'lucide-react';

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

const TapPage = () => {
  const [currentEventImage, setCurrentEventImage] = useState(0);
  const [currentBgImage, setCurrentBgImage] = useState(0);
  const [activeTab, setActiveTab] = useState('About TAP');
  
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

  useEffect(() => {
    const eventTimer = setInterval(() => {
      setCurrentEventImage((prev) => (prev + 1) % eventImages.length);
    }, 3500);
    
    const bgTimer = setInterval(() => {
      setCurrentBgImage((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    
    return () => {
      clearInterval(eventTimer);
      clearInterval(bgTimer);
    };
  }, []);

  return (
    <div className="pb-16 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="relative w-full bg-gray-900 mb-12 shadow-xl overflow-hidden rounded-b-3xl md:rounded-b-[3rem]">
        {/* Background Slider */}
        <div className="relative w-full aspect-[21/9] max-h-[70vh]">
          <AnimatePresence mode="popLayout">
            <motion.img 
              key={currentBgImage}
              src={bgImages[currentBgImage]}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5 }}
              alt="TAP Background" 
              className="w-full h-full object-contain absolute inset-0 z-0 bg-gray-900"
            />
          </AnimatePresence>
          
          {/* Subtle dark gradient just behind text for readabilty without blue tint */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-0"></div>
        </div>

        <div className="relative w-full px-8 md:px-16 py-8 md:py-12 z-10 text-white flex flex-col justify-end bg-gray-900">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4 drop-shadow-lg"
          >
            Training and Placements Cell
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-100 text-sm sm:text-lg md:text-xl max-w-3xl drop-shadow-md"
          >
            Empowering students to achieve their career goals through comprehensive training and industry collaboration.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 mb-16">
        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-8 md:mb-12">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2.5 text-xs sm:text-sm md:px-8 md:py-4 md:text-lg rounded-xl font-bold transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-blue-200 text-gray-900 border-2 border-blue-500 shadow-lg scale-105 transform'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="min-h-[400px]">
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
                <section className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-lg border border-gray-100 flex flex-col justify-center">
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="bg-blue-100 p-2 md:p-3 rounded-xl text-blue-600 mt-1 md:mt-0 align-top md:align-middle self-start md:self-auto">
                      <Info className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">About TAP</h2>
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed text-sm md:text-lg">
                    ITM Gwalior has always given training, augmentation and placements an utmost priority and to implement it into action an exclusive training, augmentation and placement assistance cell (TAP) has been established with state–of-art facilities. The cell is headed by experienced professionals from Industry.
                  </p>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-lg">
                    TAP Cell is responsible for conducting following activities in time bound schedules without violating the time table of university curriculum.
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <section className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-lg border border-gray-100 flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="bg-accent-100 p-2 md:p-3 rounded-xl text-accent-600">
                        <Target className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <h2 className="text-lg md:text-xl font-bold text-gray-900">Vision</h2>
                    </div>
                    <p className="text-gray-600 text-xs md:text-base leading-relaxed">
                      To Bridge the gap between Students’ skill, knowledge and the industry's Requirement and expectation by Building employability through various workshops, seminars and campus recruitment training so that the student can grab the best opportunities and will grow vigorously in their career.
                    </p>
                  </section>

                  <section className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-lg border border-gray-100 flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="bg-green-100 p-2 md:p-3 rounded-xl text-green-600">
                        <Flag className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <h2 className="text-lg md:text-xl font-bold text-gray-900">Mission</h2>
                    </div>
                    <p className="text-gray-600 text-xs md:text-base leading-relaxed">
                      The Training Augmentation and Placement team Team of ITM Gwalior is dedicated towards achieving 100% placements by collaborating with HR Teams of different corporate to ensure the smooth functioning of the Campus-Recruitment process.
                    </p>
                  </section>
                </div>

                {/* Major Recruiters */}
                <section className="mt-4 md:mt-8">
                  <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                     <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-primary-600" />
                     <h2 className="text-xl md:text-3xl font-bold text-gray-900">Major Recruiters</h2>
                  </div>
                  <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-white">
                    <img 
                      src="/images/ITM_Gwalior_Major_Recruiter.jpg" 
                      alt="Major Recruitment Drive" 
                      className="w-full h-auto object-contain bg-white"
                    />
                  </div>
                </section>

                {/* Industry Speak */}
                <section className="mt-6 md:mt-8">
                  <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                    <Star className="w-6 h-6 md:w-8 md:h-8 text-accent-500" />
                    <h2 className="text-xl md:text-3xl font-bold text-gray-900">Industry Speak About ITM Gwalior</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {industrySpeak.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="bg-white rounded-2xl p-4 md:p-6 shadow-md border border-gray-100 relative"
                      >
                         <div className="mb-3 md:mb-4">
                          <h4 className="font-bold text-base md:text-lg text-gray-900">{item.name}</h4>
                          <p className="text-[10px] md:text-xs font-semibold text-primary-600 uppercase tracking-wider">{item.role}</p>
                         </div>
                         <p className="text-gray-600 text-sm italic leading-relaxed text-justify">"{item.text}"</p>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* MoUs and Collaborations */}
                <section className="mt-6 md:mt-8">
                  <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 md:mb-8">
                    <div>
                      <div className="flex items-center gap-2 md:gap-3 mb-2">
                        <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-primary-600" />
                        <h2 className="text-xl md:text-3xl font-bold text-gray-900">Collaborations & MoUs</h2>
                      </div>
                      <p className="text-sm md:text-base text-gray-600">Bridging the gap with industry leaders.</p>
                    </div>
                    <div className="mt-4 md:mt-0 px-3 py-1.5 md:px-4 md:py-2 bg-primary-50 rounded-lg border border-primary-100 text-primary-700 font-semibold text-xs md:text-sm flex items-center w-fit">
                       MoUs established from 2019 to 2024
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <motion.div 
                       whileHover={{ y: -5 }}
                       className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center justify-center text-center gap-3 md:gap-4"
                    >
                       <div className="h-16 flex items-center justify-center mb-2">
                         <img src="/images/LOGO_EduSkills.png" alt="EduSkills" className="max-h-full max-w-full object-contain" />
                       </div>
                       <h3 className="font-bold text-lg text-gray-800">EduSkills</h3>
                       <p className="text-xs text-gray-500">Nation Building Through Skills. Expanding digital skills into higher education in Networking, Cybersecurity, and Cloud computing.</p>
                    </motion.div>

                    <motion.div 
                       whileHover={{ y: -5 }}
                       className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center justify-center text-center gap-3 md:gap-4"
                    >
                       <div className="h-16 flex items-center justify-center mb-2">
                         <img src="/images/aws.jpg" alt="AWS Academy" className="max-h-full max-w-full object-contain" />
                       </div>
                       <h3 className="font-bold text-lg text-gray-800">AWS Academy</h3>
                       <p className="text-xs text-gray-500">Enhancing Students with Industry ready Cloud Computing and Machine Learning Skills.</p>
                    </motion.div>

                    <motion.div 
                       whileHover={{ y: -5 }}
                       className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center justify-center text-center gap-3 md:gap-4"
                    >
                       <div className="h-16 flex items-center justify-center mb-2">
                         <img src="/images/ms.jpg" alt="Microsoft" className="max-h-full max-w-full object-contain" />
                       </div>
                       <h3 className="font-bold text-lg text-gray-800">Microsoft</h3>
                       <p className="text-xs text-gray-500">Authorized Certification Center. Empowering students with emerging technologies like AI and Cyber Security.</p>
                    </motion.div>

                    <motion.div 
                       whileHover={{ y: -5 }}
                       className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center justify-center text-center gap-3 md:gap-4"
                    >
                       <div className="h-16 flex items-center justify-center mb-2">
                         <img src="/images/mou.jpg" alt="Bajaj FinServ" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                       </div>
                       <h3 className="font-bold text-lg text-gray-800">Bajaj FinServ</h3>
                       <p className="text-xs text-gray-500">Offering a career-oriented Certificate Program in Banking, Finance, and Insurance (CPBFI).</p>
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
                <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-12 shadow-xl border border-gray-100">
                  <div className="flex items-center justify-center gap-2 md:gap-4 mb-6 md:mb-10 border-b pb-4 md:pb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Meet the TAP Team</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                    <div className="flex flex-col items-center text-center bg-gray-50 p-5 md:p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-lg mb-4 md:mb-6">
                        <img src="/images/Arpit_Singh.jpg" alt="Mr. Arpit Singh Chauhan" className="w-full h-full object-cover object-top" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg md:text-xl text-gray-900 mb-1">Mr. Arpit Singh Chauhan</h4>
                        <p className="text-xs md:text-sm text-primary-600 font-bold mb-3 md:mb-4 bg-primary-50 py-1 px-3 rounded-full inline-block">(Dean/Director TAP CELL I/C)</p>
                        <p className="text-xs md:text-sm text-gray-600 mb-1">arpit.chauhan@itmuniversity.ac.in</p>
                        <p className="text-xs md:text-sm text-gray-600 font-medium">+91-9691973919</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center text-center bg-gray-50 p-5 md:p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-lg mb-4 md:mb-6">
                        <img src="/images/Shikha_Sharma.jpg" alt="Mrs. Shikha Sharma" className="w-full h-full object-cover object-top" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg md:text-xl text-gray-900 mb-1">Mrs. Shikha Sharma</h4>
                        <p className="text-xs md:text-sm text-primary-600 font-bold mb-3 md:mb-4 bg-primary-50 py-1 px-3 rounded-full inline-block">(Asst. Director Placement)</p>
                        <p className="text-xs md:text-sm text-gray-600 mb-1">shikhasharma@itmuniversity.ac.in</p>
                        <p className="text-xs md:text-sm text-gray-600 font-medium">+91-9229333335</p>
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
                <div className="bg-primary-900 text-white rounded-2xl md:rounded-3xl p-5 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10">
                    <Award className="w-32 h-32 md:w-48 md:h-48" />
                  </div>
                  <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-8 relative z-10 flex items-center gap-2 md:gap-4">
                    <Award className="w-6 h-6 md:w-8 md:h-8 text-accent-500" />
                    Consistent Placement Records
                  </h2>
                  <div className="space-y-3 md:space-y-4 relative z-10">
                    {placementRecords.map((year, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-primary-800/50 p-4 md:p-6 rounded-xl md:rounded-2xl hover:bg-primary-800 transition-colors border border-primary-700/50">
                        <span className="text-base md:text-xl font-bold text-gray-100">{year}</span>
                        <div className="flex items-center gap-1 md:gap-2 text-accent-400 text-xs md:text-base font-medium">
                          <span>Verified Highlights</span>
                          <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
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
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-5 sm:p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                        <div className="bg-primary-100 p-2 md:p-3 rounded-xl text-primary-600">
                          <CalendarIcon className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                        <h2 className="text-xl md:text-3xl font-bold text-gray-900">TAP Events</h2>
                      </div>
                      <ul className="space-y-4 md:space-y-8">
                        {tapEventsData.map((event, index) => (
                          <li key={index} className="flex gap-2.5 md:gap-4 items-start bg-gray-50 p-3 md:p-4 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors">
                            <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-accent-500 shrink-0 mt-0.5 md:mt-1" />
                            <p className="text-gray-700 text-xs md:text-sm leading-relaxed">{event}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="h-64 sm:h-96 lg:h-auto overflow-hidden relative w-full min-h-[300px] sm:min-h-[500px] bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-100 flex items-center justify-center p-4 sm:p-8">
                      <AnimatePresence mode="popLayout">
                        <motion.img 
                          key={currentEventImage}
                          src={eventImages[currentEventImage]}
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.8 }}
                          alt="TAP Events Gallery" 
                          className="w-full h-full object-contain absolute inset-0 p-4 md:p-8 filter drop-shadow-xl"
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
    </div>
  );
};

export default TapPage;
