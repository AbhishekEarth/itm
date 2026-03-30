import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';

// ─── Department Config Map ────────────────────────────────────────────────────
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
    <PageLayout
      name={dept.name.includes('&')
        ? <>{dept.name.split('&')[0]}&amp;<br /><span className="text-red-200">{dept.name.split('&')[1]}</span></>
        : <>{dept.name.split(' ').slice(0, -1).join(' ')}<br /><span className="text-red-200">{dept.name.split(' ').slice(-1)}</span></>
      }
      shortName={dept.shortName}
      badge={dept.badge}
      subtitle={dept.subtitle}
      chips={dept.chips}
      menuItems={MENU_ITEMS}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      <Card className="p-16 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="font-black text-xl text-[#0b2a4a] dark:text-white mb-2">{activeTab}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Content for <strong className="text-[#800000] dark:text-red-400">{dept.shortName} — {activeTab}</strong> is being prepared.
        </p>
      </Card>
    </PageLayout>
  );
}
