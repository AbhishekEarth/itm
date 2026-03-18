import React from "react";
import { motion } from "framer-motion";

export default function Testimonials() {
  const testimonials = [
    { 
      name: "Rahul Sharma", 
      role: "SDE @ Google", 
      text: "ITM was the perfect launchpad. The faculty and industry exposure here is truly unmatched.",
      initials: "RS"
    },
    { 
      name: "Priya Verma", 
      role: "Lead Architect", 
      text: "The studio culture helped me find my design language and prepare for the global landscape.",
      initials: "PV"
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-[#020617] relative transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header - Aligned with Maroon Theme */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[#800000] dark:text-red-400 font-black uppercase tracking-[0.4em] text-[10px]">
              Alumni Success
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#3e0202] dark:text-white mt-2 tracking-tighter">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#800000] to-red-600">ITM</span> Experience
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative p-10 rounded-[3rem] bg-gray-50/50 dark:bg-white/[0.02] backdrop-blur-xl border border-red-50 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-red-900/5 transition-all duration-500"
            >
              {/* Massive background quote watermark */}
              <span className="absolute -top-10 -right-4 text-[180px] leading-none text-[#800000]/5 dark:text-red-500/10 font-serif pointer-events-none select-none">
                “
              </span>

              <div className="relative z-10">
                {/* Header of the card (Avatar + Name) */}
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#800000] to-[#4a0101] rounded-[1.2rem] flex items-center justify-center text-white text-sm font-black shadow-lg shadow-red-900/20">
                    {item.initials}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-[#3e0202] dark:text-white leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-[#800000] dark:text-red-400 font-black uppercase tracking-widest mt-1">
                      {item.role}
                    </p>
                  </div>
                </div>

                {/* Quote Text */}
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium italic">
                  "{item.text}"
                </p>
              </div>

              {/* Bottom accent bar that grows on hover */}
              <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r from-[#800000] to-red-600 group-hover:w-full transition-all duration-700 ease-in-out" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}