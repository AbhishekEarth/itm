import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { departmentsData } from '../data/departments_data';
import PageLayout from '../components/PageLayout';
import SectionHeading from '../components/SectionHeading';
import Card from '../components/Card';
import { motion } from 'framer-motion';

export default function DynamicDepartmentPage() {
  const { deptId, branchId } = useParams();
  const id = branchId || deptId;
  const data = departmentsData[id];

  const [activeTab, setActiveTab] = useState('');

  // Reset active tab when ID changes
  useEffect(() => {
    if (data && data.menuItems && data.menuItems.length > 0) {
      setActiveTab(data.menuItems[0].label);
    }
  }, [id, data]);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#020617] flex items-center justify-center">
        <div className="text-center p-16">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="font-black text-2xl text-[#0b2a4a] dark:text-white mb-2">Department Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">The department "{id}" does not exist or is being set up.</p>
          <a href="/" className="inline-block px-6 py-3 bg-[#800000] text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#5a0000] transition-colors">
            ← Back to Home
          </a>
        </div>
      </div>
    );
  }

  const isSpecialization = !!data.parent;

  const renderSection = () => {
    const sectionKey = data.menuItems.find(m => m.label === activeTab)?.id;
    const sectionData = data.sections?.[sectionKey];

    if (!sectionData && sectionKey !== 'faculty') {
      return (
        <Card className="p-16 text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h3 className="font-black text-xl text-[#0b2a4a] dark:text-white mb-2">{activeTab}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">This section is coming soon. Content is being prepared.</p>
        </Card>
      );
    }

    switch (sectionKey) {
      case 'about':
        return (
          <div className="space-y-8">
            <Card className="p-8">
              <SectionHeading>{sectionData.title}</SectionHeading>
              <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                {sectionData.description.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </Card>

            <div className="grid sm:grid-cols-2 gap-5">
              {sectionData.features?.map((f, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="text-3xl">{f.icon}</div>
                  <div>
                    <div className="font-black text-[#0b2a4a] dark:text-white text-sm">{f.title}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8 bg-gradient-to-br from-[#800000] to-[#5a0000] rounded-2xl text-white shadow-xl">
                <h3 className="text-lg font-black uppercase tracking-tight mb-4">Vision</h3>
                <p className="text-red-100 text-sm leading-relaxed">{sectionData.vision}</p>
              </div>
              <div className="p-8 bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-2xl">
                <h3 className="text-lg font-black uppercase tracking-tight text-[#0b2a4a] dark:text-red-400 mb-4">Mission</h3>
                <ul className="space-y-3">
                  {sectionData.mission?.map((m, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#800000] shrink-0"></span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      case 'hod':
        return (
          <Card className="p-8">
            <SectionHeading>{sectionData.title}</SectionHeading>
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="shrink-0 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#800000] to-[#5a0000] rounded-2xl flex items-center justify-center text-4xl shadow-xl mx-auto">
                  🎓
                </div>
                <p className="mt-3 font-black text-[#0b2a4a] dark:text-white text-sm">{sectionData.name}</p>
                <p className="text-[#800000] text-xs font-bold uppercase">{sectionData.designation}</p>
              </div>
              <div className="flex-1 space-y-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                {sectionData.message.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          </Card>
        );

      case 'faculty':
        const faculty = data.sections?.faculty || [];
        return (
          <Card className="overflow-hidden">
            <div className="p-8 border-b border-gray-100 dark:border-gray-800">
              <SectionHeading>Faculty Members</SectionHeading>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#800000] text-white">
                    <th className="px-5 py-4 text-center font-black text-xs uppercase w-12">S.No.</th>
                    <th className="px-5 py-4 text-left font-black text-xs uppercase">Name</th>
                    <th className="px-5 py-4 text-center font-black text-xs uppercase">Qualification</th>
                    <th className="px-5 py-4 text-center font-black text-xs uppercase">Designation</th>
                    <th className="px-5 py-4 text-center font-black text-xs uppercase">Experience</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {faculty.map((f, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-800/30' : ''}>
                      <td className="px-5 py-3.5 text-center font-black text-[#800000] text-xs">{f.sno}</td>
                      <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-gray-100">{f.name}</td>
                      <td className="px-5 py-3.5 text-center">{f.qual}</td>
                      <td className="px-5 py-3.5 text-center">{f.desig}</td>
                      <td className="px-5 py-3.5 text-center">{f.exp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        );

      case 'labs':
        const labs = sectionData.list || [];
        return (
          <div className="space-y-6">
            <Card className="p-8 pb-0">
              <SectionHeading>{sectionData.title}</SectionHeading>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 font-medium">{sectionData.description}</p>
            </Card>
            <div className="grid md:grid-cols-2 gap-6">
              {labs.map((lab, i) => (
                <Card key={i} className="p-6 hover:border-red-200 dark:hover:border-red-900/50 transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-gray-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">{lab.icon || '🔬'}</div>
                    <div className="flex-1">
                      <h4 className="font-black text-[#0b2a4a] dark:text-white text-base group-hover:text-[#800000] dark:group-hover:text-red-400 transition-colors">{lab.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{lab.description}</p>
                      {lab.equipment && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 text-center">Equipment</p>
                          <div className="flex flex-wrap gap-1.5">
                            {lab.equipment.map((eq, ei) => (
                              <span key={ei} className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-[10px] font-bold border border-gray-100 dark:border-gray-700">{eq}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'curriculum':
      case 'course':
        return (
          <Card className="p-8">
            <SectionHeading>{sectionData.title}</SectionHeading>
            <div className="space-y-6">
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{sectionData.description}</p>
              <div className="grid gap-4">
                {sectionData.schemes?.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl group hover:border-red-200 dark:hover:border-red-900/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-lg shadow-sm group-hover:bg-[#800000] group-hover:text-white transition-colors">📄</div>
                      <div>
                        <p className="font-black text-sm text-[#0b2a4a] dark:text-white">{s.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{s.type}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[#800000] dark:text-red-400 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-[#800000] hover:text-white transition-all">Download</button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        );

      case 'careers':
        return (
          <div className="space-y-6">
            <Card className="p-8">
              <SectionHeading>{sectionData.title}</SectionHeading>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed mb-6">{sectionData.description}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {sectionData.roles?.map((r, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-red-50/50 dark:bg-gray-800 border border-red-100 dark:border-gray-700 rounded-xl">
                    <div className="text-2xl">{r.icon}</div>
                    <div className="font-black text-sm text-[#800000] dark:text-red-400">{r.name}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'placement':
        return (
          <div className="space-y-6">
            <Card className="p-8">
              <SectionHeading>{sectionData.title}</SectionHeading>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed mb-8">{sectionData.description}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {sectionData.stats?.map((s, i) => (
                  <div key={i} className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-center">
                    <div className="text-2xl font-black text-[#800000] dark:text-red-400">{s.value}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid sm:grid-cols-3 gap-4">
              {sectionData.highlights?.map((h, i) => (
                <div key={i} className="p-5 bg-gradient-to-br from-[#800000] to-[#5a0000] rounded-2xl text-white shadow-lg">
                  <div className="text-2xl mb-2">{h.icon}</div>
                  <div className="font-black text-sm mb-1">{h.title}</div>
                  <div className="text-red-100 text-xs leading-relaxed">{h.sub}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'obe':
        return (
          <div className="space-y-8">
            <Card className="p-8">
              <SectionHeading>Outcome Based Education (OBE)</SectionHeading>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#800000] mb-4">Programme Educational Objectives (PEOs)</h3>
                  <ul className="space-y-4">
                    {sectionData.peos?.map((p, i) => (
                      <li key={i} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs text-gray-700 dark:text-gray-300 font-medium">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-[#800000] text-white flex items-center justify-center font-black">{i+1}</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#800000] mb-4">Programme Specific Outcomes (PSOs)</h3>
                  <ul className="space-y-4">
                    {sectionData.psos?.map((p, i) => (
                      <li key={i} className="flex gap-4 p-4 bg-red-50/50 dark:bg-gray-800 border border-red-100 dark:border-gray-700 rounded-xl text-xs text-gray-700 dark:text-gray-300 font-medium underline-offset-4 decoration-[#800000]">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-white dark:bg-gray-800 text-[#800000] border border-red-100 flex items-center justify-center font-black">{i+1}</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'infrastructure':
      case 'research':
        return (
          <div className="space-y-6">
            <Card className="p-8">
              <SectionHeading>{sectionData.title}</SectionHeading>
              <div className="grid sm:grid-cols-2 gap-6">
                {sectionData.items?.map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden relative group">
                      <div className="absolute inset-0 bg-[#800000]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute inset-0 flex items-center justify-center text-4xl">{item.icon || '🏗️'}</div>
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-[#0b2a4a] dark:text-white">{item.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PageLayout
      name={data.name}
      shortName={data.shortName}
      badge={data.badge}
      subtitle={data.subtitle}
      chips={data.chips}
      menuItems={data.menuItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* Back to Emerging Branches Link for Specializations */}
      {isSpecialization && (
        <a 
          href="/emerging-branches"
          className="inline-flex items-center gap-2 mb-6 text-xs font-black uppercase tracking-widest text-[#800000] dark:text-red-400 hover:gap-3 transition-all group"
        >
          <span className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center group-hover:bg-[#800000] group-hover:text-white transition-colors">←</span>
          Back to Emerging Branches
        </a>
      )}

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderSection()}
      </motion.div>
    </PageLayout>
  );
}
