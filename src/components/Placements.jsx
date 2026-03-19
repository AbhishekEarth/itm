import React from 'react';
import { motion } from 'framer-motion';
import { Award, Briefcase, TrendingUp, Globe } from 'lucide-react';

const PlacementSection = () => {
  // Updated with highly stable, public CDN links for the "problem" logos
  const recruiters = [
    { name: "Google", logo: "https://www.vectorlogo.zone/logos/google/google-ar21.svg" },
    { name: "Microsoft", logo: "https://www.vectorlogo.zone/logos/microsoft/microsoft-ar21.svg" },
    { name: "Amazon", logo: "https://www.vectorlogo.zone/logos/amazon/amazon-ar21.svg" },
    { name: "TCS", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg" },
    { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" },
    { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg" },
    { name: "Accenture", logo: "https://www.vectorlogo.zone/logos/accenture/accenture-ar21.svg" },
    { name: "IBM", logo: "https://www.vectorlogo.zone/logos/ibm/ibm-ar21.svg" },
    { name: "Adobe", logo: "https://www.vectorlogo.zone/logos/adobe/adobe-ar21.svg" },
    { name: "HCL", logo: "https://www.vectorlogo.zone/logos/hcltech/hcltech-ar21.svg" },
    { name: "Cognizant", logo: "https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg" },
    { name: "Capgemini", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Capgemini_2017_logo.svg" },
    { name: "Tech Mahindra", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Tech_Mahindra_New_Logo.svg/2560px-Tech_Mahindra_New_Logo.svg.png" },
    { name: "Oracle", logo: "https://www.vectorlogo.zone/logos/oracle/oracle-ar21.svg" },
    { name: "Deloitte", logo: "https://www.vectorlogo.zone/logos/deloitte/deloitte-ar21.svg" },
    { name: "Samsung", logo: "https://www.vectorlogo.zone/logos/samsung/samsung-ar21.svg" },
    { name: "Intel", logo: "https://www.vectorlogo.zone/logos/intel/intel-ar21.svg" },
    { name: "Cisco", logo: "https://www.vectorlogo.zone/logos/cisco/cisco-ar21.svg" },
    { name: "PWC", logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/PricewaterhouseCoopers_Logo.svg" },
    { name: "EY", logo: "https://www.vectorlogo.zone/logos/ey/ey-ar21.svg" }
  ];

  const stats = [
    { icon: <Briefcase className="w-5 h-5" />, label: "Hiring Partners", value: "500+" },
    { icon: <TrendingUp className="w-5 h-5" />, label: "Highest Package", value: "45 LPA" },
    { icon: <Award className="w-5 h-5" />, label: "Average Package", value: "5.5 LPA" },
    { icon: <Globe className="w-5 h-5" />, label: "Global Offers", value: "50+" },
  ];

  // Tripled for seamless infinite loop
  const scrollingLogos = [...recruiters, ...recruiters, ...recruiters];

  return (
    <section className="relative py-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col items-center mb-6">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-4xl font-black text-[#800000] text-center uppercase tracking-tight"
          >
            Placement <span className="text-slate-900">Milestones</span>
          </motion.h2>
          <div className="w-12 h-1 bg-[#FFD700] mt-1 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-10">
          <div className="flex justify-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              <div className="absolute inset-0 border-[8px] border-slate-100 rounded-full" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="absolute inset-0 border-[8px] border-[#800000] rounded-full border-t-transparent"
              />
              <div className="absolute inset-2 bg-white rounded-full shadow-lg flex flex-col items-center justify-center text-center">
                <span className="text-4xl md:text-5xl font-black text-[#800000]">92%</span>
                <div className="h-0.5 w-8 bg-[#FFD700] my-1" />
                <p className="text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-widest">Placements</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, index) => (
              <div key={index} className="p-3 bg-slate-50 rounded-lg border-b-2 border-[#800000] flex flex-col items-center text-center shadow-sm">
                <div className="text-[#800000] mb-1">{stat.icon}</div>
                <p className="text-lg md:text-xl font-black text-slate-900">{stat.value}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* LOGO MARQUEE: Using direct Wikipedia/CDN links for stability */}
        <div className="py-8 bg-slate-50 border-y border-slate-100 relative">
          <div className="flex overflow-hidden w-full">
            <motion.div 
              className="flex whitespace-nowrap"
              animate={{ x: [0, "-100%"] }} 
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
              style={{ display: 'flex', width: 'fit-content' }}
            >
              {scrollingLogos.map((company, index) => (
                <div key={index} className="inline-flex items-center justify-center px-10 md:px-14 shrink-0">
                  <img 
                    src={company.logo} 
                    alt={company.name} 
                    className="h-8 md:h-10 w-auto object-contain hover:scale-110 transition-transform duration-300"
                    style={{ maxWidth: 'none' }}
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.parentNode.innerHTML = `<span class="text-slate-400 font-bold text-sm tracking-tighter">${company.name}</span>`;
                    }}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlacementSection;