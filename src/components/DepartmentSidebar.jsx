import React from 'react';
import { Info, MessageSquare, BookOpen, FlaskConical, Users, Briefcase, Building, Search, Award } from 'lucide-react';
import Card from './Card';

const iconMap = {
  about: <Info size={16} />,
  hod: <MessageSquare size={16} />,
  course: <BookOpen size={16} />,
  labs: <FlaskConical size={16} />,
  faculty: <Users size={16} />,
  placement: <Briefcase size={16} />,
  infrastructure: <Building size={16} />,
  research: <Search size={16} />,
  obe: <Award size={16} />,
};

export default function DepartmentSidebar({ menuItems, activeTab, onTabChange }) {
  // Filter out any dropdown items (Emerging Branches) — show only flat menu items
  const flatItems = menuItems.filter(item => !item.children);

  return (
    <div className="sticky top-32 space-y-4">
      <Card className="overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#800000] via-red-500 to-[#800000]"></div>
        <div className="p-5">
          <h3 className="font-black text-xs uppercase tracking-widest mb-4 text-[#800000]">Department Menu</h3>
          <nav className="flex flex-col gap-1">
            {flatItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.label)}
                className={`text-left py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === item.label
                    ? 'bg-[#800000] text-white shadow-md shadow-red-900/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-[#800000] dark:hover:text-red-400'
                }`}
              >
                {iconMap[item.id]}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </Card>

      {/* Quick Stats Card */}
      <Card className="p-5">
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
      </Card>
    </div>
  );
}
