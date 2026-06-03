import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import SectionHeading from '../components/SectionHeading';
import Card from '../components/Card';
import { usePublicDepartment } from '../hooks/usePublicDepartment';

// ─── Dummy Data ──────────────────────────────────────────────────────────────
const aimlData = {
  about: "Artificial Intelligence and Machine Learning (AI-ML) is a sub-field of Computer Science that focuses on creating systems capable of performing tasks that typically require human intelligence. This includes learning, reasoning, problem-solving, perception, and language understanding. At ITM, our AIML program is designed to create future-ready engineers who can build autonomous systems, intelligent agents, and data-driven solutions.",
  curriculum: [
    { sem: 'Sem III & IV', subjects: ['Mathematics for Machine Learning', 'Data Structures & Algorithms', 'Python for AI', 'Statistical Methods'] },
    { sem: 'Sem V & VI', subjects: ['Neural Networks', 'Computer Vision', 'Natural Language Processing', 'Pattern Recognition'] },
    { sem: 'Sem VII & VIII', subjects: ['Deep Learning', 'Reinforcement Learning', 'AI Ethics', 'Major Project (AI focused)'] },
  ],
  labs: [
    { name: 'NVIDIA AI Lab', equipment: 'High-end GPUs (A100/RTX 4090), CUDA Toolkit, TensorRT' },
    { name: 'Robotics & Vision Lab', equipment: 'Industrial Robots, 3D Cameras, LiDAR Sensors, OpenCV Integration' },
    { name: 'Data Intelligence Lab', equipment: 'Apache Spark, Hadoop, Jupyter Notebooks Cluster, Cloud AI Tools' },
  ],
  careers: [
    { role: 'AI Engineer', description: 'Design and implement AI models and systems.' },
    { role: 'ML Researcher', description: 'Develop new algorithms and push the boundaries of ML.' },
    { role: 'Data Scientist', description: 'Analyze large datasets to extract actionable insights.' },
    { role: 'Robotics Specialist', description: 'Integrate AI with physical hardware for automation.' },
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
              <p className="text-[11px] text-gray-600 dark:text-gray-400 font-bold">To lead the world in intelligent system development and ethical AI implementation.</p>
            </div>
            <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-400 rounded-r-xl">
              <h4 className="font-black text-gray-700 dark:text-gray-300 text-xs uppercase mb-1">Mission</h4>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 font-bold">Empowering students with deep technical roots and innovative problem-solving skills.</p>
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
