import React from 'react';

// The "export default" keywords are what fix your error!
export default function FloatingSidebar() {
  const actions = [
    { icon: "💬", label: "WhatsApp", color: "bg-[#25D366]", link: "#" },
    { icon: "📞", label: "Call Us", color: "bg-[#0b2a4a]", link: "#" },
    { icon: "✉️", label: "Contact", color: "bg-amber-500", link: "#" },
    { icon: "🎓", label: "Apply Online", color: "bg-red-600", link: "#" },
  ];

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-[2px]">
      {actions.map((action, index) => (
        <a
          key={index}
          href={action.link}
          className="group relative flex items-center justify-end"
        >
          {/* Label: Slides out on hover */}
          <div className="absolute right-full pr-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 pointer-events-none">
            <div className="bg-white dark:bg-gray-900 text-black dark:text-white px-4 py-2 rounded-l-xl shadow-2xl border border-gray-200 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
              {action.label}
            </div>
          </div>

          {/* Icon Box */}
          <div className={`w-12 h-12 ${action.color} text-white flex items-center justify-center text-lg shadow-lg cursor-pointer transition-all duration-300 group-hover:w-16 origin-right`}>
            {action.icon}
          </div>
        </a>
      ))}
    </div>
  );
}