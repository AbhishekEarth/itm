import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import SectionHeading from '../components/SectionHeading';
import Card from '../components/Card';
import { usePublicDepartment } from '../hooks/usePublicDepartment';

// B.Tech CSE — Cyber Security specialisation (30 seats · 4 years · RGPV affiliated).
// Aligned with ITM Gwalior's Microsoft Cyber Security and EduSkills Cybersecurity tracks.
const cyberData = {
  about: "B.Tech in Computer Science & Engineering with specialisation in Cyber Security is offered at ITM Gwalior with an intake of 30 seats, affiliated to RGPV Bhopal. The programme leverages ITM's Microsoft partnership (Cyber Security track) and EduSkills Foundation (Networking · Cybersecurity · Industry 4.0) to deliver hands-on training in defensive and ethical-offensive security, preparing students for SOC roles, security engineering, audit and digital forensics.",
  curriculum: [
    { sem: 'Sem III & IV', subjects: ['Operating Systems', 'Computer Networks', 'Discrete Mathematics', 'Data Structures', 'Database Management Systems'] },
    { sem: 'Sem V & VI', subjects: ['Foundations of Cyber Security', 'Cryptography & Network Security', 'Ethical Hacking & Pen-Testing', 'Web Application Security', 'Linux System Administration'] },
    { sem: 'Sem VII & VIII', subjects: ['Cloud & Mobile Security', 'Digital Forensics & Incident Response', 'Security Audit, Compliance & Laws (DPDP, IT Act)', 'Blockchain Fundamentals', 'Major Project — Security Domain'] },
  ],
  labs: [
    { name: 'Information Security Lab', equipment: 'Kali Linux · Wireshark · Nmap · Metasploit · OWASP ZAP · Burp Suite (Community)' },
    { name: 'Networking & Cloud Lab', equipment: 'Cisco Packet Tracer · GNS3 · Firewall configuration · IDS/IPS with Snort' },
    { name: 'Forensics Lab', equipment: 'Autopsy · Volatility · FTK Imager · Wireshark forensics workflows' },
    { name: 'Project Lab', equipment: 'Vulnerable VM lab environment for CTF, secure-coding and red-team exercises' },
  ],
  careers: [
    { role: 'Security Analyst (SOC)', description: 'Monitor, triage and respond to incidents in security operations centres at MNCs and BFSI.' },
    { role: 'Penetration Tester', description: 'Run authorised offensive engagements for product firms, consulting and bug-bounty platforms.' },
    { role: 'Security Engineer / DFIR', description: 'Build secure systems, automate detection, lead digital forensics and incident response.' },
    { role: 'Higher Studies / Certs', description: 'CEH, CompTIA Security+, OSCP, M.Tech in Information Security, GATE-CSE pipeline.' },
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
              <p className="text-[11px] text-gray-600 dark:text-gray-400 font-bold">Build ethically-trained security professionals who protect systems, data and citizens of a digital India.</p>
            </div>
            <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-400 rounded-r-xl">
              <h4 className="font-black text-gray-700 dark:text-gray-300 text-xs uppercase mb-1">Mission</h4>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 font-bold">Deliver hands-on offensive and defensive security training through Microsoft Cyber and EduSkills tracks.</p>
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
