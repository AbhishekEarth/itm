import React from "react";
import { motion } from "framer-motion";
import Reveal from "./Reveal";

const companies = [
  "Google", "Microsoft", "Amazon", "TCS", "Infosys", 
  "Wipro", "Accenture", "Adobe", "IBM", "Oracle"
];

export default function Placements() {
  return (
    <section className="py-20 bg-white dark:bg-[#020617] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header - Centered & Bold */}
        <div className="text-center mb-16">
          <Reveal>
            <span className="text-[#800000] dark:text-red-400 font-black uppercase tracking-[0.4em] text-[10px]">
              Career Outcomes
            </span>
          </Reveal>
          <Reveal delay={0.2}>
            <h2 className="text-4xl md:text-6xl font-black text-[#3e0202] dark:text-white mt-2 tracking-tighter">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#800000] to-red-600">Alumni</span> Network
            </h2>
          </Reveal>
        </div>

        {/* Stats Grid - Balanced Weight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Highest Package Card */}
          <Reveal delay={0.2}>
            <motion.div 
              whileHover={{ y: -8 }}
              className="p-10 rounded-[3rem] bg-gradient-to-br from-[#800000] to-[#5a0101] text-white shadow-[0_30px_60px_-15px_rgba(128,0,0,0.3)] relative overflow-hidden flex items-center justify-between group"
            >
              <div className="relative z-10">
                <p className="text-[10px] uppercase font-black tracking-widest text-red-200/60 mb-2">Highest Package</p>
                <div className="text-6xl font-black tracking-tighter">45.0 <span className="text-2xl text-red-300">LPA</span></div>
              </div>
              {/* Prestige Watermark */}
              <div className="text-white/10 text-9xl font-black absolute right-8 group-hover:scale-110 group-hover:text-white/20 transition-all duration-700 select-none pointer-events-none">
                ₹
              </div>
            </motion.div>
          </Reveal>

          {/* Placement Rate Card */}
          <Reveal delay={0.4}>
            <motion.div 
              whileHover={{ y: -8 }}
              className="p-10 rounded-[3rem] bg-gray-50 dark:bg-white/[0.03] border border-red-100/50 dark:border-white/10 flex items-center justify-between group"
            >
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-[#800000] dark:text-red-400 mb-2">Placement Rate</p>
                <div className="text-6xl font-black text-[#3e0202] dark:text-white tracking-tighter">92%</div>
              </div>
              <div className="w-28 h-28 relative flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="44" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-gray-200 dark:text-white/5" />
                    <motion.circle 
                        initial={{ strokeDasharray: "0 280" }}
                        whileInView={{ strokeDasharray: "258 280" }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        cx="56" cy="56" r="44" stroke="#800000" strokeWidth="10" fill="transparent" strokeLinecap="round"
                    />
                 </svg>
                 <span className="absolute text-xs font-black text-[#800000] dark:text-red-500 group-hover:scale-125 transition-transform">ITM</span>
              </div>
            </motion.div>
          </Reveal>
        </div>

        {/* --- ULTRA-BOLD BLACK MARQUEE --- */}
        <div className="relative flex overflow-hidden py-14 border-y-2 border-black/5 dark:border-white/10 bg-gray-50/30 dark:bg-white/[0.01]">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 20, repeat: Infinity }}
            className="flex whitespace-nowrap gap-20 items-center"
          >
            {[...companies, ...companies].map((company, i) => (
              <span 
                key={i} 
                className="text-3xl font-[1000] tracking-tighter uppercase 
                           text-black dark:text-white 
                           hover:text-[#800000] dark:hover:text-red-500
                           transition-all duration-300 cursor-default hover:scale-110"
              >
                {company}
              </span>
            ))}
          </motion.div>

          {/* Smooth Fades */}
          <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-white dark:from-[#020617] via-white/90 dark:via-[#020617]/90 to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-white dark:from-[#020617] via-white/90 dark:via-[#020617]/90 to-transparent z-10"></div>
        </div>
      </div>
    </section>
  );
}