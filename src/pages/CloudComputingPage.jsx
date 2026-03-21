import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import SectionHeading from '../components/SectionHeading';
import Card from '../components/Card';

// ─── Dummy Data ──────────────────────────────────────────────────────────────
const cloudData = {
  about: "Cloud Computing is the on-demand delivery of IT resources over the internet with pay-as-you-go pricing. Instead of buying, owning, and maintaining physical data centers and servers, you can access technology services, such as computing power, storage, and databases. Our program focuses on AWS, Azure, and Google Cloud platforms to prepare students for the distributed future.",
  curriculum: [
    { sem: 'Sem III & IV', subjects: ['Introduction to Cloud', 'Virtualization Technologies', 'Linux Administration', 'Computer Networks'] },
    { sem: 'Sem V & VI', subjects: ['Cloud Architecture', 'DevOps & SRE', 'Serverless Computing', 'Containerization (Docker/K8s)'] },
    { sem: 'Sem VII & VIII', subjects: ['Cloud Security', 'Big Data on Cloud', 'Cloud Migration Strategies', 'Major Project (Cloud focused)'] },
  ],
  labs: [
    { name: 'Cloud Infrastructure Lab', equipment: 'AWS Academy Access, Azure Dev Tools, OpenStack Private Cloud' },
    { name: 'DevOps & Automation Lab', equipment: 'Jenkins, Terraform, Ansible, Docker Hub, Kubernetes Cluster' },
    { name: 'Storage & DB Lab', equipment: 'MongoDB, Redis, AWS S3 Interface, SQL & NoSQL Distributed Systems' },
  ],
  careers: [
    { role: 'Cloud Architect', description: 'Design complex cloud infrastructures and solutions.' },
    { role: 'DevOps Engineer', description: 'Automate deployment pipelines and manage infrastructure.' },
    { role: 'Cloud Consultant', description: 'Advise organizations on cloud migration and cost optimization.' },
    { role: 'SRE Specialist', description: 'Ensure the reliability and scalability of cloud systems.' },
  ],
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CloudComputingPage() {
  const [activeTab, setActiveTab] = useState('About Department');

  const menuItems = ['About Department', 'Curriculum', 'Laboratories', 'Career Opportunities'];

  return (
    <PageLayout
      name={<>Cloud <br /><span className="text-red-200">Computing</span></>}
      shortName="Cloud"
      badge="Scale the Future"
      subtitle="AWS · Azure · DevOps · Kubernetes · Distributed Systems"
      chips={[['☁️', 'Cloud Native'], ['🏗️', 'Architecture'], ['🚀', 'DevOps'], ['🏆', 'Industry Standard']]}
      menuItems={menuItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* ══ ABOUT ═════════════════════════════════════════════ */}
      {activeTab === 'About Department' && (
        <Card className="p-8">
          <SectionHeading>About the Specialization</SectionHeading>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
            {cloudData.about}
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border-l-4 border-[#800000] rounded-r-xl">
              <h4 className="font-black text-[#800000] dark:text-red-400 text-xs uppercase mb-1">Vision</h4>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 font-bold">To empower students to build and manage the world's most scalable and reliable digital infrastructures.</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-400 rounded-r-xl">
              <h4 className="font-black text-gray-700 dark:text-gray-300 text-xs uppercase mb-1">Mission</h4>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 font-bold">Integrating deep cloud concepts with practical DevOps and automation skills.</p>
            </div>
          </div>
        </Card>
      )}

      {/* ══ CURRICULUM ════════════════════════════════════════ */}
      {activeTab === 'Curriculum' && (
        <Card className="p-8">
          <SectionHeading>Academic Curriculum</SectionHeading>
          <div className="space-y-6">
            {cloudData.curriculum.map((item, i) => (
              <div key={i} className="relative pl-8 border-l-2 border-red-100 dark:border-red-900/30">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#800000] border-4 border-white dark:border-gray-900 shadow-sm" />
                <h4 className="font-black text-[#0b2a4a] dark:text-white text-base mb-3">{item.sem}</h4>
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
        <Card className="p-8">
          <SectionHeading>Specialized Laboratories</SectionHeading>
          <div className="grid gap-6">
            {cloudData.labs.map((lab, i) => (
              <div key={i} className="p-5 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-red-200 transition-colors">
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
        <Card className="p-8">
          <SectionHeading>Career Opportunities</SectionHeading>
          <div className="grid sm:grid-cols-2 gap-4">
            {cloudData.careers.map((career, i) => (
              <div key={i} className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/60 dark:to-gray-900/20 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 text-[#800000] dark:text-red-400 flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition-transform">
                  💼
                </div>
                <h4 className="font-black text-[#0b2a4a] dark:text-white text-base mb-2">{career.role}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{career.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </PageLayout>
  );
}
