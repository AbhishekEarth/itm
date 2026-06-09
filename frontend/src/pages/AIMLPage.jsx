import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import SectionHeading from '../components/SectionHeading';
import Card from '../components/Card';
import { usePublicDepartment } from '../hooks/usePublicDepartment';

// B.Tech CSE — AI & Machine Learning specialisation (90 seats · 4 years · RGPV affiliated).
// Curriculum, labs and career outcomes aligned with ITM Gwalior's CSE department and Microsoft / AWS Academy partnerships.
const aimlData = {
  about: "B.Tech in Computer Science & Engineering with specialisation in Artificial Intelligence and Machine Learning is offered under the CSE umbrella at ITM Gwalior with an intake of 90 seats, affiliated to RGPV Bhopal. The programme builds on the department's NBA-accredited CSE foundation and our partnerships with Microsoft (AI · Green Skills) and AWS Academy (ML · Data Analytics) to prepare students for industry-ready AI engineering, applied ML research and entrepreneurial product development.",
  curriculum: [
    { sem: 'Sem III & IV', subjects: ['Mathematics for Machine Learning', 'Data Structures & Algorithms', 'Python Programming', 'Probability & Statistics', 'Discrete Mathematics'] },
    { sem: 'Sem V & VI', subjects: ['Introduction to AI', 'Machine Learning', 'Database Management Systems', 'Computer Networks', 'Operating Systems'] },
    { sem: 'Sem VII & VIII', subjects: ['Deep Learning', 'Natural Language Processing', 'Computer Vision', 'AI Ethics & Responsible AI', 'Major Project — AI/ML Domain'] },
  ],
  labs: [
    { name: 'AI & ML Lab (Python)', equipment: 'Python · TensorFlow · PyTorch · scikit-learn · Jupyter · GPU-enabled workstations' },
    { name: 'Data Science Lab', equipment: 'Pandas · NumPy · Matplotlib · SQL · MongoDB · Power BI · Tableau' },
    { name: 'Cloud & AWS Academy Lab', equipment: 'AWS Educate · SageMaker · Azure ML Studio · Google Colab Pro' },
    { name: 'Project Lab', equipment: 'IoT kits, Raspberry Pi, Arduino, OpenCV cameras for AI vision projects' },
  ],
  careers: [
    { role: 'AI / ML Engineer', description: 'Build, train and deploy models for vision, NLP and recommender systems at product companies.' },
    { role: 'Data Scientist / Analyst', description: 'Apply ML on real-world datasets across BFSI, healthcare, retail and analytics consulting.' },
    { role: 'Research Associate', description: 'Pursue M.Tech / MS / PhD in AI/ML at IITs, IIITs and global universities — strong GATE pipeline.' },
    { role: 'AI Product Builder', description: 'Found or join early-stage startups solving problems with applied AI — supported by ITM IIC & EDP Cell.' },
  ],
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AIMLPage() {
  const [activeTab, setActiveTab] = useState('About Department');
  const { data: live } = usePublicDepartment('AIML');

  const menuItems = ['About Department', 'Curriculum', 'Laboratories', 'Career Opportunities'];

  const aboutCopy = live?.intro || aimlData.about;

  return (
    <PageLayout
      name={
        live?.name ? (
          <>{live.name}</>
        ) : (
          <>Artificial Intelligence &<br /><span className="text-red-200">Machine Learning</span></>
        )
      }
      shortName={live?.short || 'AI-ML'}
      badge={live?.badge || 'Specialization Excellence'}
      subtitle={live?.subtitle || "Building the brain of tomorrow's machines · Deep Learning · Computer Vision · Robotics"}
      chips={live?.chips?.length ? live.chips : [['🤖', 'AI-ML Focused'], ['🧠', 'Neural Nets'], ['⚙️', 'Automation'], ['🏆', 'Industry Standard']]}
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
              <p className="text-[11px] text-gray-600 dark:text-gray-400 font-bold">Nurturing AI-ML graduates who are technologically proficient, research-competent and socially accountable.</p>
            </div>
            <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-400 rounded-r-xl">
              <h4 className="font-black text-gray-700 dark:text-gray-300 text-xs uppercase mb-1">Mission</h4>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 font-bold">Deliver outcome-based AI/ML education through project-based learning, industry MoUs and ABCAS continuous assessment.</p>
            </div>
          </div>
        </Card>
      )}

      {/* ══ CURRICULUM ════════════════════════════════════════ */}
      {activeTab === 'Curriculum' && (
        <Card className="p-4 sm:p-8">
          <SectionHeading>Academic Curriculum</SectionHeading>
          <div className="space-y-4 sm:space-y-6">
            {aimlData.curriculum.map((item, i) => (
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
            {aimlData.labs.map((lab, i) => (
              <div key={i} className="p-3 sm:p-5 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-red-200 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">🔬</span>
                  <h4 className="font-black text-[#0b2a4a] dark:text-white text-sm uppercase tracking-tight">{lab.name}</h4>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold ml-8">
                  <span className="text-[#800000] dark:text-red-400">Hardware & Software:</span> {lab.equipment}
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
            {aimlData.careers.map((career, i) => (
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
