import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import SectionHeading from '../components/SectionHeading';
import Card from '../components/Card';

const libPosterMaking = "/images/lib_poster_making.webp";
const libGroupPhoto = "/images/lib_group_photo.webp";

// ─── Data ────────────────────────────────────────────────────────────────────
const libraryStats = [
  { label: 'Total Print Books', value: '64,407' },
  { label: 'Print Book Titles', value: '12,417' },
  { label: 'e-Books (EBSCO 2023-24)', value: '16,124' },
  { label: 'Journals (Print & Online)', value: '1,785' },
  { label: 'Project Reports / Dissertations', value: '2,872' },
  { label: 'CD & DVD', value: '2,562' },
  { label: 'Video Lectures', value: '2,694' },
  { label: 'Databases', value: 'Web of Science' },
  { label: 'Plagiarism Tool', value: 'Turnitin' },
  { label: 'Magazines', value: '21' },
  { label: 'Newspapers', value: '07' },
  { label: 'Institute Moodle', value: 'LMS' },
  { label: 'Network Library', value: 'NDLI & RGPV' },
  { label: 'Other Resources', value: 'e-Kumbh, Delnet, SodhGanga…' },
];

const loanPrivileges = [
  { category: 'Books', type: 'Faculty Members', count: 8 },
  { category: '', type: 'Non-Teaching Staff', count: 4 },
  { category: '', type: 'PG Students', count: 8 },
  { category: '', type: 'UG Students', count: 6 },
];

const services = [
  'Orientation Programme', 'Information Literacy', 'User Education',
  'Reference and Information Service', 'Electronic Database and Online Journals',
  'Digital Archiving', 'OPAC (Online Public Access Catalogue)',
  'Internet Facility', 'Current Awareness Service', 'Lending Service',
  'Extension Service', 'Reprographic Service',
];

const teamMembers = [
  { sno: 1, name: 'Dr. Vikas Dwivedi (Dy. Librarian)', contact: '9425771913', email: 'headcentrallibrary@itmgoi.in' },
  { sno: 2, name: 'Ms. Neetu Gupta (Asst. Librarian)', contact: '7415937454', email: 'neetu.gupta@itmgoi.in' },
  { sno: 3, name: 'Mr. Dinesh Mahaur (Library Asst.)', contact: '9926497349', email: 'Dineshmahaur.lib@itmgoi.in' },
  { sno: 4, name: 'Mr. Soheb Khan (Library Attendant)', contact: '9977486342', email: 'sohebkhan2911@gmail.com' },
  { sno: 5, name: 'Mr. Laxmi Narayan (Book Lifter)', contact: '8602752483', email: '—' },
];

const openAccess = {
  'Online Courses': ['Swayam', 'Infoport', 'UG/PG MOOCs', 'MIT Open Courseware', 'e-PG Pathshala', 'e-Content courseware in UG subjects'],
  'E-Journals': ['Oxford Open', 'e-Shodh Sindhu', 'Directory of Open Access Journals', 'Cambridge University Press', 'Science Direct Open Access', 'Springer Open Journals', 'Taylor & Francis Open Access', 'Wiley Open Access Journals'],
  'E-Books': ['Directory of Open Access Books', 'Open Textbook Library'],
  'Digital Resources': ['National Knowledge Network', 'Talks to Teacher', 'A-VIEW', 'Virtual Labs', 'FOSSEE', 'E-Kalpa', 'e-Yantra', 'ILOSTAT', 'Project Euclid', 'Vidwan'],
  'Thesis & Dissertations': ['E-Shodhganga – Indian Thesis', 'Networked Digital Library of Thesis and Dissertations (NDLTD)', 'Open Access Thesis & Dissertations'],
};

const newspapers = ['The Hindustan Times', 'Indian Express', 'The Times of India', 'The Hindu', 'The Economic Times', 'Business Standard', 'The Financial Express'];

const magazines = ['India Today', 'The Week', 'Digit', 'Electronic for You', 'Outlook', 'Dataquest', 'Business World', 'C.Quest', 'Overdrive', 'Pratiyogita Darpan', 'Careers 360', 'Competition Success Review', 'Current Affairs Dristhi', 'G.K. Today', 'Sport Star', 'Engineering S R', 'Ghatna Chakra', 'Physics for You'];

const activities = [
  'Best Library User Award', 'Book Review Competition', 'General Knowledge / Science Quiz Competition',
  'Poster Making Competition', 'Expert Talk "Electronic Resources for Academic Learning Teaching & Research"',
  'Covied-19 Pandemic Time "Providing Online Access to an Offline Collection" Awareness Programme',
  'National Librarian\'s Day Celebration — Special Guest Sanjeev Dutt Sharma, Library In-charge, Hindu College, Delhi University',
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CentralLibrary() {
  const [activeTab, setActiveTab] = useState('About Department');

  const menuItems = [
    'About Department', 'Library Details', 'Loan Privileges',
    'Library Services', 'Library Team', 'Digital Library',
    'Open Access', 'News Papers', 'Magazines', 'Anti-Plagiarism', 'Library Activity',
  ];

  return (
    <PageLayout
      name={<>Akshardham<br /><span className="text-red-200">Central Library</span></>}
      shortName="Library"
      badge="ITM Gwalior"
      subtitle="Spanning 1200 sq. metres across three floors · Seating for 250 · 580 Mbps Wi-Fi · Open 9 AM – 9 PM Daily"
      chips={[['📚', '64,407 Books'], ['📰', '1,785 Journals'], ['💻', '25 Systems'], ['🔬', 'Web of Science']]}
      menuItems={menuItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* ── ABOUT DEPARTMENT ───────────────────────────────── */}
      {activeTab === 'About Department' && (
        <div className="space-y-4 sm:space-y-8 animate-fade-in">
          <Card className="p-4 sm:p-8">
            <SectionHeading>About Department</SectionHeading>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-medium">
              <p>
                The Institute of Technology & Management, Gwalior, is home to the state-of-the-art <strong className="text-[#800000] dark:text-red-400">AKSHARDHAM Central Library</strong>, complemented by five departmental libraries that collectively support the academic and research endeavors of staff, students, and scholars.
              </p>
              <p>
                Spanning <strong>1200 square meters</strong> across three floors, the AKSHARDHAM Library is thoughtfully designed to cater to diverse academic needs, with seating for <strong>250 individuals</strong> and amenities such as water coolers, high-speed internet, and Wi-Fi with <strong>580 Mbps bandwidth</strong>. Operating daily from <strong>9:00 AM to 9:00 PM</strong>, the library provides year-round access to its extensive collection of over <strong>64,000 books</strong>, rare manuscripts, journals, magazines, and more than <strong>12,000 titles</strong>.
              </p>
              <p>
                The library is organized into various sections, including a Reference Section, Journal Section, Reading Hall, Digital Library, and Stack Room. It is fully automated with the <strong>SOUL Integrated Library Management System (ILMS)</strong>, streamlining operations like acquisition, cataloging, and circulation, while the <strong>Online Public Access Catalogue (OPAC)</strong> allows users to efficiently search for resources. The Digital Library, equipped with 25 computers and audio-visual facilities, provides access to a wide range of e-resources, including databases like <strong>Web of Science</strong> and <strong>EBSCO</strong>.
              </p>
              <p>
                Further enhancing its offerings, the library features <strong>LMS-Tattva</strong>, an institutional repository providing open access to e-books, e-magazines, and project documents, while resources like <strong>Turnitin</strong> uphold academic integrity, fostering a culture of originality and excellence within the Institute.
              </p>
            </div>
          </Card>

          {/* Feature highlights */}
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-5">
            {[
              { icon: '🏛️', title: '1200 sq. metres', sub: 'Three-floor state-of-the-art space' },
              { icon: '🪑', title: '250 Seats', sub: 'Comfortable reading & study areas' },
              { icon: '📡', title: '580 Mbps Wi-Fi', sub: 'High-speed internet across floors' },
              { icon: '🕘', title: '9 AM – 9 PM', sub: 'Open every day, year-round' },
            ].map(({ icon, title, sub }) => (
              <div key={title} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-5 bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md hover:border-red-200 dark:hover:border-red-900/50 transition-all duration-200">
                <div className="text-3xl">{icon}</div>
                <div>
                  <div className="font-black text-[#0b2a4a] dark:text-white text-base">{title}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          <Card className="p-3 sm:p-6">
            <h3 className="font-black text-sm uppercase tracking-widest text-[#800000] mb-3">Rich Collection Includes</h3>
            <div className="flex flex-wrap gap-2">
              {['Books', 'Journals', 'Engineering & Technology', 'Management', 'Magazines', 'Reference Books', 'Novels & Fiction', "IIT Video Lectures"].map((tag) => (
                <span key={tag} className="bg-red-50 dark:bg-red-900/20 text-[#800000] dark:text-red-300 border border-red-200/60 dark:border-red-900/40 text-xs font-semibold px-3 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── LIBRARY DETAILS ─────────────────────────────────── */}
      {activeTab === 'Library Details' && (
        <div className="animate-fade-in">
          <Card className="overflow-hidden">
            <div className="p-4 sm:p-8 border-b border-gray-100 dark:border-gray-800">
              <SectionHeading>Library Details</SectionHeading>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {libraryStats.map(({ label, value }, i) => (
                <div key={label} className={`flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 hover:bg-red-50/40 dark:hover:bg-red-900/10 transition-colors ${i % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-900/20' : ''}`}>
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{label}</span>
                  <span className="text-sm font-black text-[#800000] dark:text-red-400 text-right max-w-[50%]">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── LOAN PRIVILEGES ─────────────────────────────────── */}
      {activeTab === 'Loan Privileges' && (
        <div className="animate-fade-in">
          <Card className="overflow-hidden">
            <div className="p-4 sm:p-8 border-b border-gray-100 dark:border-gray-800">
              <SectionHeading>Loan Privileges</SectionHeading>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#800000] text-white">
                    <th className="px-6 py-4 text-left font-black tracking-wide text-xs uppercase">Item Category</th>
                    <th className="px-6 py-4 text-left font-black tracking-wide text-xs uppercase">Borrowers Type</th>
                    <th className="px-6 py-4 text-center font-black tracking-wide text-xs uppercase">No. of Books</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {loanPrivileges.map(({ category, type, count }, i) => (
                    <tr key={type} className={`hover:bg-red-50/30 dark:hover:bg-red-900/10 transition-colors ${i % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-900/20' : ''}`}>
                      <td className="px-6 py-4 font-bold text-[#800000] dark:text-red-400">{category}</td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">{type}</td>
                      <td className="px-6 py-4 text-center font-black text-gray-900 dark:text-white">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── LIBRARY SERVICES ────────────────────────────────── */}
      {activeTab === 'Library Services' && (
        <div className="animate-fade-in">
          <Card className="p-4 sm:p-8">
            <SectionHeading>Library Services</SectionHeading>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 font-medium">
              The central library provides the following services to its clientele:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {services.map((s, i) => (
                <div key={s} className="flex items-center gap-3 p-2.5 sm:p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-[#800000] dark:hover:text-red-400 transition-all duration-200 group">
                  <div className="w-7 h-7 rounded-full bg-[#800000]/10 dark:bg-red-900/30 flex items-center justify-center text-[#800000] dark:text-red-400 font-black text-xs shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-[#800000] dark:group-hover:text-red-400 transition-colors">{s}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── LIBRARY TEAM ────────────────────────────────────── */}
      {activeTab === 'Library Team' && (
        <div className="animate-fade-in">
          <Card className="overflow-hidden">
            <div className="p-4 sm:p-8 border-b border-gray-100 dark:border-gray-800">
              <SectionHeading>Library Team</SectionHeading>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#800000] text-white">
                    <th className="px-5 py-4 text-center font-black text-xs uppercase tracking-wide">S.No.</th>
                    <th className="px-5 py-4 text-left font-black text-xs uppercase tracking-wide">Name & Designation</th>
                    <th className="px-5 py-4 text-left font-black text-xs uppercase tracking-wide">Contact No.</th>
                    <th className="px-5 py-4 text-left font-black text-xs uppercase tracking-wide">Email ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {teamMembers.map(({ sno, name, contact, email }, i) => (
                    <tr key={sno} className={`hover:bg-red-50/30 dark:hover:bg-red-900/10 transition-colors ${i % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-900/20' : ''}`}>
                      <td className="px-5 py-4 text-center font-black text-[#800000] dark:text-red-400">{sno}</td>
                      <td className="px-5 py-4 font-semibold text-gray-800 dark:text-white">{name}</td>
                      <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{contact}</td>
                      <td className="px-5 py-4">
                        {email !== '—' ? (
                          <a href={`mailto:${email}`} className="text-[#800000] dark:text-red-400 hover:underline text-xs">{email}</a>
                        ) : <span className="text-gray-400">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── DIGITAL LIBRARY ─────────────────────────────────── */}
      {activeTab === 'Digital Library' && (
        <div className="space-y-4 sm:space-y-8 animate-fade-in">
          <Card className="p-4 sm:p-8">
            <SectionHeading>Digital Library</SectionHeading>
            <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              <p>
                The institute has a well-equipped digital library with <strong className="text-[#800000] dark:text-red-400">25 systems</strong> accommodated with a smart board and audio-video facility. All nodes have access to the internet through a <strong>580 Mbps leased line</strong>.
              </p>
              <p>
                The Learning Resource Centre of the Institute has automated its routine activities using <strong>SOUL software</strong> — an Integrated Library Management System. SOUL (Software for University Libraries) is developed by INFLIBNET Centre and is cutting-edge software tailored for university libraries.
              </p>
            </div>
          </Card>

          <div className="grid sm:grid-cols-3 gap-3 sm:gap-5">
            {[
              { icon: '🖥️', title: '25 Systems', sub: 'Smart board & audio-video enabled' },
              { icon: '📡', title: '580 Mbps', sub: 'High-speed leased-line internet' },
              { icon: '📦', title: 'SOUL ILMS', sub: 'Integrated Library Management System' },
            ].map(({ icon, title, sub }) => (
              <div key={title} className="p-3 sm:p-6 bg-gradient-to-br from-[#800000] to-[#5a0000] rounded-2xl text-white text-center shadow-lg shadow-red-900/20">
                <div className="text-4xl mb-3">{icon}</div>
                <div className="font-black text-lg">{title}</div>
                <div className="text-red-200 text-xs mt-1">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── OPEN ACCESS RESOURCES ───────────────────────────── */}
      {activeTab === 'Open Access' && (
        <div className="space-y-3 sm:space-y-6 animate-fade-in">
          <SectionHeading>Open Access Resources</SectionHeading>
          {Object.entries(openAccess).map(([category, items]) => (
            <Card key={category} className="p-3 sm:p-6">
              <h3 className="font-black text-sm uppercase tracking-widest text-[#800000] dark:text-red-400 mb-4 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-[#800000] rounded"></span>
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span key={item} className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-default">
                    {item}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── NEWSPAPERS ──────────────────────────────────────── */}
      {activeTab === 'News Papers' && (
        <div className="animate-fade-in">
          <Card className="p-4 sm:p-8">
            <SectionHeading>News Papers</SectionHeading>
            <div className="grid sm:grid-cols-2 gap-3">
              {newspapers.map((np, i) => (
                <div key={np} className="flex items-center gap-3 p-2.5 sm:p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group">
                  <span className="w-7 h-7 rounded-full bg-[#800000] text-white flex items-center justify-center text-xs font-black shrink-0">{i + 1}</span>
                  <span className="font-semibold text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#800000] dark:group-hover:text-red-400 transition-colors">{np}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── MAGAZINES ───────────────────────────────────────── */}
      {activeTab === 'Magazines' && (
        <div className="animate-fade-in">
          <Card className="p-4 sm:p-8">
            <SectionHeading>Magazines</SectionHeading>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {magazines.map((mag, i) => (
                <div key={mag} className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-gray-900/40 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#800000] group-hover:scale-125 transition-transform shrink-0"></span>
                  <span className="font-semibold text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#800000] dark:group-hover:text-red-400 transition-colors">{mag}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── ANTI-PLAGIARISM ─────────────────────────────────── */}
      {activeTab === 'Anti-Plagiarism' && (
        <div className="animate-fade-in">
          <Card className="p-4 sm:p-8">
            <SectionHeading>Anti-Plagiarism Software</SectionHeading>
            <div className="flex items-start gap-3 sm:gap-6 p-3 sm:p-6 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-900/10 border border-red-200/60 dark:border-red-900/30 rounded-2xl">
              <div className="w-10 h-10 sm:w-16 sm:h-16 bg-[#800000] rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg shadow-red-900/30 shrink-0">
                🔍
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-black text-[#800000] dark:text-red-400 mb-2">Turnitin</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-medium">
                  The library uses <strong>Turnitin</strong> to uphold academic integrity, fostering a culture of originality and excellence within the Institute. It helps detect plagiarism across a wide range of academic submissions including theses, dissertations, project reports, and research papers.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── LIBRARY ACTIVITY ────────────────────────────────── */}
      {activeTab === 'Library Activity' && (
        <div className="space-y-4 sm:space-y-8 animate-fade-in">
          <Card className="p-4 sm:p-8">
            <SectionHeading>Library Activity</SectionHeading>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
              Akshardham Central Library Conducts the following Activities:
            </p>
            <div className="space-y-3">
              {activities.map((act, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 sm:p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group">
                  <div className="w-6 h-6 rounded-full bg-[#800000]/10 dark:bg-red-900/30 text-[#800000] dark:text-red-400 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#800000] dark:group-hover:text-red-400 transition-colors leading-relaxed">{act}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Gallery */}
          <div>
            <h3 className="font-black text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">Photo Gallery</h3>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-5">
              <div className="group rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 relative">
                <img
                  src={libPosterMaking}
                  alt="Poster Making Competition 2024 – Central Library Winners"
                  className="w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white text-xs font-bold">Poster Making Competition 2024</p>
                  <p className="text-white/70 text-xs">Central Library — Winners of the Event</p>
                </div>
              </div>

              <div className="group rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 relative">
                <img
                  src={libGroupPhoto}
                  alt="Akshardham Central Library – Group Photo, Sithouli Campus Gwalior"
                  className="w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white text-xs font-bold">Akshardham Central Library</p>
                  <p className="text-white/70 text-xs">Sithouli Campus, Gwalior — Dec 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
