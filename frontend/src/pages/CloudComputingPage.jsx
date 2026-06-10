import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import SectionHeading from '../components/SectionHeading';
import Card from '../components/Card';
import { usePublicDepartment } from '../hooks/usePublicDepartment';

// B.Tech CSE — Cloud Computing specialisation, delivered through ITM's
// AWS Academy Membership and Microsoft / EduSkills cloud tracks. 4 years · RGPV affiliated.
const cloudData = {
  about: "B.Tech in Computer Science & Engineering with specialisation in Cloud Computing is offered under the CSE umbrella at ITM Gwalior, affiliated to RGPV Bhopal. The programme is backed by ITM's AWS Academy Membership, Microsoft (AI · Cyber · Green Skills) partnership and EduSkills Foundation (Cloud Computing, Automation, Industry 4.0) — exposing every student to real-world cloud labs from Year 2 onwards through industry-recognised certifications.",
  curriculum: [
    { sem: 'Sem III & IV', subjects: ['Operating Systems', 'Computer Networks', 'Linux & Shell Scripting', 'Database Management Systems', 'Python for DevOps'] },
    { sem: 'Sem V & VI', subjects: ['Cloud Computing Fundamentals', 'Virtualization & Containers', 'AWS Cloud Foundations (AWS Academy)', 'Web Technologies', 'Distributed Systems'] },
    { sem: 'Sem VII & VIII', subjects: ['Cloud Architecture & Microservices', 'DevOps & CI/CD', 'Cloud Security & Compliance', 'Big Data on Cloud', 'Major Project — Cloud-native System'] },
  ],
  labs: [
    { name: 'Networking & Cloud Lab', equipment: 'Cisco networking equipment · AWS Academy console · Azure Dev Tools' },
    { name: 'AWS Academy Lab', equipment: 'AWS Educate sandbox · EC2 · S3 · Lambda · CloudWatch · RDS' },
    { name: 'DevOps Lab', equipment: 'Git · Jenkins · Docker · Kubernetes (Minikube) · Ansible · Terraform' },
    { name: 'Project Lab', equipment: 'Linux workstations, container infra, micro-services prototyping' },
  ],
  careers: [
    { role: 'Cloud Engineer', description: 'Build and operate cloud workloads on AWS, Azure or GCP at MNCs and product firms.' },
    { role: 'DevOps / SRE Engineer', description: 'Automate CI/CD pipelines, monitor reliability and run production cloud systems.' },
    { role: 'Cloud Solutions Consultant', description: 'Advise enterprises on cloud migration, cost optimisation and architecture reviews.' },
    { role: 'Higher Studies / Certs', description: 'AWS Solutions Architect, Azure Administrator, GATE-CSE and M.Tech in distributed systems.' },
  ],
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CloudComputingPage() {
  const [activeTab, setActiveTab] = useState('About Department');
  const { data: live } = usePublicDepartment('CLOUD');

  const menuItems = ['About Department', 'Curriculum', 'Laboratories', 'Career Opportunities'];

  const aboutCopy = live?.intro || cloudData.about;

  return (
    <PageLayout
      name={
        live?.name ? <>{live.name}</> : <>Cloud <br /><span className="text-red-200">Computing</span></>
      }
      shortName={live?.short || 'Cloud'}
      badge={live?.badge || 'Scale the Future'}
      subtitle={live?.subtitle || 'AWS · Azure · DevOps · Kubernetes · Distributed Systems'}
      chips={live?.chips?.length ? live.chips : [['☁️', 'Cloud Native'], ['🏗️', 'Architecture'], ['🚀', 'DevOps'], ['🏆', 'Industry Standard']]}
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
              <p className="text-[11px] text-gray-600 dark:text-gray-400 font-bold">Prepare cloud-native engineers ready for industry, research and entrepreneurship in distributed systems.</p>
            </div>
            <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-400 rounded-r-xl">
              <h4 className="font-black text-gray-700 dark:text-gray-300 text-xs uppercase mb-1">Mission</h4>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 font-bold">Deliver hands-on cloud, DevOps and security training through AWS Academy and Microsoft / EduSkills partnerships.</p>
            </div>
          </div>
        </Card>
      )}

      {/* ══ CURRICULUM ════════════════════════════════════════ */}
      {activeTab === 'Curriculum' && (
        <Card className="p-4 sm:p-8">
          <SectionHeading>Academic Curriculum</SectionHeading>
          <div className="space-y-4 sm:space-y-6">
            {cloudData.curriculum.map((item, i) => (
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
            {cloudData.labs.map((lab, i) => (
              <div key={i} className="p-3 sm:p-5 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-red-200 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">🔬</span>
                  <h4 className="font-black text-[#0b2a4a] dark:text-white text-sm uppercase tracking-tight">{lab.name}</h4>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold ml-8">
                  <span className="text-[#800000] dark:text-red-400">Tools:</span> {lab.equipment}
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
            {cloudData.careers.map((career, i) => (
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
