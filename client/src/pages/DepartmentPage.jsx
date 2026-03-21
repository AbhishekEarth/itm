import React, { useState } from 'react';
const labCs1 = "/images/company_logos/Engineering_Computer_Applications/img1.png";

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

// ─── Department Config Map ────────────────────────────────────────────────────
// Each route renders this component with a `deptKey` prop.
// Add real content data here as needed.
const DEPT_CONFIG = {
  ece: {
    name: 'Electronics & Communication Engineering',
    shortName: 'ECE',
    badge: 'AICTE Approved',
    chips: [['📡', 'B.Tech Programme'], ['🔧', 'Advanced Labs'], ['💡', 'Industry Connect'], ['🏅', 'AICTE Approved']],
    subtitle: 'Est. 1997 · B.Tech Programme · Electronics, Communication & Signal Processing',
  },
  me: {
    name: 'Mechanical Engineering',
    shortName: 'ME',
    badge: 'AICTE Approved',
    chips: [['⚙️', 'B.Tech Programme'], ['🏭', 'Industry Connect'], ['🔬', 'Research Labs'], ['🏅', 'AICTE Approved']],
    subtitle: 'Est. 1997 · B.Tech Programme · Design, Manufacturing & Thermal Engineering',
  },
  ce: {
    name: 'Civil Engineering',
    shortName: 'CE',
    badge: 'AICTE Approved',
    chips: [['🏗️', 'B.Tech Programme'], ['🌉', 'Structural Labs'], ['🗺️', 'Field Projects'], ['🏅', 'AICTE Approved']],
    subtitle: 'Est. 1997 · B.Tech Programme · Structures, Geotechnics & Environmental Engineering',
  },
  it: {
    name: 'Information Technology',
    shortName: 'IT',
    badge: 'AICTE Approved',
    chips: [['💻', 'B.Tech Programme'], ['☁️', 'Cloud & AI Labs'], ['🔒', 'Cyber Security'], ['🏅', 'AICTE Approved']],
    subtitle: 'Est. 2001 · B.Tech Programme · Software, Networks & Emerging Technologies',
  },
  mba: {
    name: 'Master of Business Administration',
    shortName: 'MBA',
    badge: 'AICTE & UGC Approved',
    chips: [['📊', 'MBA Programme'], ['🤝', 'Industry Mentors'], ['🌐', 'Global Exposure'], ['🏅', 'AICTE Approved']],
    subtitle: '2-Year Full-Time MBA Programme · Finance, Marketing, HR & Operations',
  },
  esh: {
    name: 'Engineering Sciences & Humanities',
    shortName: 'ES&H',
    badge: 'AICTE Approved',
    chips: [['🔭', 'Science Foundation'], ['📐', 'Mathematics'], ['🗣️', 'Communication'], ['🏅', 'AICTE Approved']],
    subtitle: 'Foundation Sciences · Mathematics, Physics, Chemistry & Communication Skills',
  },
};

const MENU_ITEMS = ['About Department', 'HoD Desk', 'Course', 'Laboratories', 'Faculty', 'Placement', 'OBE'];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DepartmentPage({ deptKey }) {
  const [activeTab, setActiveTab] = useState('About Department');
  const dept = DEPT_CONFIG[deptKey] || DEPT_CONFIG['ece'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] transition-colors duration-500">

      {/* ── HERO BANNER ──────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-[#3e0202] via-[#800000] to-[#5a0000] pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-8 right-32 w-72 h-72 rounded-full border-2 border-white"></div>
          <div className="absolute -bottom-20 -left-10 w-96 h-96 rounded-full border border-white/50"></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-white/20"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <span className="inline-block text-red-200 font-bold tracking-widest text-xs uppercase mb-3 px-3 py-1 bg-white/10 rounded-full border border-white/20">
            {dept.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-tight">
            {dept.name.includes('&')
              ? <>{dept.name.split('&')[0]}&amp;<br /><span className="text-red-200">{dept.name.split('&')[1]}</span></>
              : <>{dept.name.split(' ').slice(0, -1).join(' ')}<br /><span className="text-red-200">{dept.name.split(' ').slice(-1)}</span></>
            }
          </h1>
          <p className="text-red-100/80 max-w-xl text-sm leading-relaxed font-medium">
            {dept.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {dept.chips.map(([icon, label]) => (
              <div key={label} className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-4 py-2 rounded-full text-xs font-bold">
                <span>{icon}</span> {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pb-16 md:pb-24">

        {/* ── MOBILE TAB BAR ───────────────────────────────────── */}
        <div className="lg:hidden bg-gray-50 py-3 -mx-3 px-3 sm:-mx-6 sm:px-6">
          <div className="flex overflow-x-auto gap-2 pb-1 snap-x" style={{scrollbarWidth:'none',msOverflowStyle:'none'}}>
            {MENU_ITEMS.map((item) => (
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

        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8 items-start">

          {/* ── SIDEBAR ──────────────────────────────────────────── */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32">
              <Card className="overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#800000] via-red-500 to-[#800000]"></div>
                <div className="p-5">
                  <h3 className="font-black text-xs uppercase tracking-widest mb-4 text-[#800000]">{dept.shortName} MENU</h3>
                  <nav className="flex flex-col gap-1">
                    {MENU_ITEMS.map((item) => (
                      <button
                        key={item}
                        onClick={() => setActiveTab(item)}
                        className={`text-left py-2.5 px-5 transition-all duration-200 ${
                          activeTab === item
                            ? 'bg-[#800000] text-white shadow-md shadow-red-900/30 rounded-full'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-[#800000] dark:hover:text-red-400 rounded-full'
                        }`}
                      >
                        <span className="font-bold text-xs">{item}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </Card>
            </div>
          </aside>

          {/* ── MAIN CONTENT ─────────────────────────────────────── */}
          <main className="lg:col-span-3">
            <Card className="p-16 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="font-black text-xl text-[#0b2a4a] dark:text-white mb-2">{activeTab}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Content for <strong className="text-[#800000] dark:text-red-400">{dept.shortName} — {activeTab}</strong> is being prepared.
              </p>
            </Card>
          </main>

        </div>
      </div>
    </div>
  );
}
