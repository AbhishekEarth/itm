import React from 'react';
import { Info, MessageSquare, BookOpen, FlaskConical, Users, Briefcase, Building, Search, Award, Layers } from 'lucide-react';

const iconMap = {
  about: <Info size={16} />,
  hod: <MessageSquare size={16} />,
  course: <BookOpen size={16} />,
  labs: <FlaskConical size={16} />,
  laboratories: <FlaskConical size={16} />,
  faculty: <Users size={16} />,
  placement: <Briefcase size={16} />,
  infrastructure: <Building size={16} />,
  research: <Search size={16} />,
  obe: <Award size={16} />,
  curriculum: <BookOpen size={16} />,
  careers: <Layers size={16} />,
};

// Normalize menuItems — accepts both string[] and {id, label}[]
function normalizeItems(menuItems) {
  return menuItems.map((item) => {
    if (typeof item === 'string') {
      const id = item.toLowerCase().replace(/[^a-z0-9]/g, '');
      return { id, label: item };
    }
    // Skip dropdown children items — only return flat items
    if (item.children) return null;
    return { id: item.id, label: item.label };
  }).filter(Boolean);
}

export default function DepartmentSidebar({ menuItems = [], activeTab, onTabChange }) {
  const flatItems = normalizeItems(menuItems);

  return (
    <div className="sticky top-32 space-y-4">
      <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#800000] via-red-500 to-[#800000]"></div>
        <div className="p-5">
          <h3 className="font-black text-xs uppercase tracking-widest mb-4 text-[#800000]">Department Menu</h3>
          <nav className="flex flex-col gap-1">
            {flatItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.label)}
                className={`text-left py-2.5 px-5 rounded-full transition-all duration-200 flex items-center gap-2 text-xs font-bold ${
                  activeTab === item.label
                    ? 'bg-[#800000] text-white shadow-md shadow-red-900/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-[#800000] dark:hover:text-red-400'
                }`}
              >
                <span className="opacity-70">{iconMap[item.id] || <Info size={16} />}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Quick Info Card */}
      <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-5">
        <h3 className="font-black text-xs uppercase tracking-widest mb-4 text-[#800000]">Quick Info</h3>
        <div className="space-y-3">
          {[
            ['📍', 'Location', 'Block-A, ITM'],
            ['📞', 'Contact', '0751-2432977'],
            ['📧', 'Email', 'admission@itm.edu'],
          ].map(([icon, label, value]) => (
            <div key={label} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-medium">
                <span>{icon}</span> {label}
              </span>
              <span className="font-black text-[#800000] dark:text-red-400">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
