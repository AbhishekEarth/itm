import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import SectionHeading from '../components/SectionHeading';
import Card from '../components/Card';
import { usePublicDepartment } from '../hooks/usePublicDepartment';

// ─── Dummy Data ──────────────────────────────────────────────────────────────
const cyberData = {
  about: "Cyber Security is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information; extorting money from users; or interrupting normal business processes. At ITM, we train students in defensive and offensive security strategies to secure the digital frontier.",
  curriculum: [
    { sem: 'Sem III & IV', subjects: ['Foundations of Cyber Security', 'Data Structures', 'Network Protocols', 'Discrete Mathematics'] },
    { sem: 'Sem V & VI', subjects: ['Cryptography', 'Ethical Hacking', 'Digital Forensics', 'Web Application Security'] },
    { sem: 'Sem VII & VIII', subjects: ['Cloud Security', 'Blockchain Technology', 'Security Compliance & Laws', 'Major Project (Security focused)'] },
  ],
  labs: [
    { name: 'Red Team Ops Lab', equipment: 'Kali Linux Workstations, Metasploit Framework, Burp Suite Enterprise' },
    { name: 'Forensics & Recovery Lab', equipment: 'EnCase, FTK Imager, Write Blockers, Logic Analyzers' },
    { name: 'Network Defense Lab', equipment: 'Cisco Firewalls, IDS/IPS Systems, SIEM (Splunk/ELK Stack) Cluster' },
  ],
  careers: [
    { role: 'Security Analyst', description: 'Monitor and respond to security incidents in a SOC environment.' },
    { role: 'Ethical Hacker', description: 'Perform penetration testing to identify and fix vulnerabilities.' },
    { role: 'Security Architect', description: 'Design secure network and system infrastructures.' },
    { role: 'Forensic Investigator', description: 'Analyze digital evidence to trace cyber crimes.' },
  ],
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CyberSecurityPage() {
  const [activeTab, setActiveTab] = useState('About Department');
  const { data: live } = usePublicDepartment('CYBER');

  const menuItems = ['About Department', 'Curriculum', 'Laboratories', 'Career Opportunities'];

  const aboutCopy = live?.intro || cyberData.about;

  return (
    <PageLayout
      name={
        live?.name ? <>{live.name}</> : <>Cyber <br /><span className="text-red-200">Security</span></>
      }
      shortName={live?.short || 'CyberSec'}
      badge={live?.badge || 'Defending the Future'}
      subtitle={live?.subtitle || 'Ethical Hacking · Cryptography · Digital Forensics · Network Defense'}
      chips={live?.chips?.length ? live.chips : [['🛡️', 'Security Focused'], ['🔑', 'Cryptography'], ['🕵️', 'Ethical Hacking'], ['🏆', 'Industry Standard']]}
      menuItems={menuItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* ══ ABOUT ═════════════════════════════════════════════ */}
      {activeTab === 'About Department' && (
        <Card className="p-4 sm:p-8">
          <SectionHeading>About the Specialization</SectionHeading>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
            {aboutCopy}
          </p>
          <div className="mt-4 sm:mt-8 grid sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/10 border-l-4 border-[#800000] rounded-r-xl">
              <h4 className="font-black text-[#800000] dark:text-red-400 text-xs uppercase mb-1">Vision</h4>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 font-bold">To create a resilient digital world by empowering the next generation of security experts.</p>
            </div>
            <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-400 rounded-r-xl">
              <h4 className="font-black text-gray-700 dark:text-gray-300 text-xs uppercase mb-1">Mission</h4>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 font-bold">Providing hands-on training in offensive and defensive paradigms of cyber security.</p>
            </div>
          </div>
        </Card>
      )}

      {/* ══ CURRICULUM ════════════════════════════════════════ */}
      {activeTab === 'Curriculum' && (
        <Card className="p-4 sm:p-8">
          <SectionHeading>Academic Curriculum</SectionHeading>
          <div className="space-y-4 sm:space-y-6">
            {cyberData.curriculum.map((item, i) => (
              <div key={i} className="relative pl-6 sm:pl-8 border-l-2 border-red-100 dark:border-red-900/30">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#800000] border-4 border-white dark:border-gray-900 shadow-sm" />
                <h4 className="font-black text-[#0b2a4a] dark:text-white text-sm sm:text-base mb-2 sm:mb-3">{item.sem}</h4>
                <div className="flex flex-wrap gap-2">
                  {item.subjects.map((sub, j) => (
                    <span key={j} className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold border border-gray-100 dark:border-gray-700">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ══ LABORATORIES ══════════════════════════════════════ */}
      {activeTab === 'Laboratories' && (
        <Card className="p-4 sm:p-8">
          <SectionHeading>Specialized Laboratories</SectionHeading>
          <div className="grid gap-3 sm:gap-6">
            {cyberData.labs.map((lab, i) => (
              <div key={i} className="p-3 sm:p-5 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-red-200 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">🔬</span>
                  <h4 className="font-black text-[#0b2a4a] dark:text-white text-sm uppercase tracking-tight">{lab.name}</h4>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold ml-8">
                  <span className="text-[#800000] dark:text-red-400">Environment:</span> {lab.equipment}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ══ CAREERS ═══════════════════════════════════════════ */}
      {activeTab === 'Career Opportunities' && (
        <Card className="p-4 sm:p-8">
          <SectionHeading>Career Opportunities</SectionHeading>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {cyberData.careers.map((career, i) => (
              <div key={i} className="p-3 sm:p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/60 dark:to-gray-900/20 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-50 dark:bg-red-900/20 text-[#800000] dark:text-red-400 flex items-center justify-center text-base sm:text-lg mb-2 sm:mb-4 group-hover:scale-110 transition-transform">
                  💼
                </div>
                <h4 className="font-black text-[#0b2a4a] dark:text-white text-sm sm:text-base mb-1 sm:mb-2">{career.role}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{career.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </PageLayout>
  );
}
