import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, Mail, GraduationCap, ChevronUp } from 'lucide-react';

const FloatingSidebar = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show "Back to Top" button after scrolling 300px
  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const actions = [
    { icon: <MessageCircle size={20} />, label: "WhatsApp", link: "#", color: "hover:text-green-400" },
    { icon: <Phone size={20} />, label: "Call Us", link: "#", color: "hover:text-blue-400" },
    { icon: <Mail size={20} />, label: "Inquiry", link: "#", color: "hover:text-amber-400" },
    { icon: <GraduationCap size={20} />, label: "Apply Now", link: "#", color: "hover:text-red-400" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-4 items-end">
      {actions.map((action, index) => (
        <a
          key={index}
          href={action.link}
          className="group relative flex items-center justify-center w-12 h-12 
                     bg-slate-900/90 dark:bg-white/10 backdrop-blur-xl
                     text-slate-300 border border-white/10
                     rounded-full shadow-2xl transition-all duration-300 
                     hover:w-14 hover:rounded-2xl hover:-translate-x-1"
        >
          {/* Label Tooltip */}
          <span className="absolute right-full mr-4 px-3 py-1 
                           bg-slate-900 text-white text-[10px] font-bold tracking-widest uppercase
                           rounded-md opacity-0 -translate-x-2 
                           group-hover:opacity-100 group-hover:translate-x-0 
                           transition-all duration-200 pointer-events-none whitespace-nowrap">
            {action.label}
          </span>
          
          <div className={`transition-colors duration-300 ${action.color}`}>
            {action.icon}
          </div>
        </a>
      ))}

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`flex items-center justify-center w-12 h-12 
                   bg-indigo-600 text-white rounded-full shadow-lg
                   transition-all duration-500 transform
                   ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
                   hover:bg-indigo-500 hover:scale-110 active:scale-95`}
      >
        <ChevronUp size={24} />
      </button>
    </div>
  );
};

export default FloatingSidebar;