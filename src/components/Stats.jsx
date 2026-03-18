import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";

function Counter({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  const numericValue = parseInt(value.replace(/[^0-9]/g, "")) || 0;
  const prefix = value.match(/^[^\d]+/)?.[0] || "";
  const suffix = value.replace(prefix, "").replace(/\d+/, "");

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, numericValue, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
      });
      return controls.stop;
    }
  }, [isInView, numericValue, count]);

  return (
    <span ref={ref}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export default function Stats() {
  const data = [
    { label: "Placement Rate", val: "90%+" },
    { label: "Global Tie-ups", val: "150+" },
    { label: "Scholarships", val: "₹5Cr+" },
    { label: "Research Papers", val: "2000+" }
  ];

  return (
    <div className="relative z-20 -mt-12 max-w-6xl mx-auto px-6 mb-20">
      {/* Background Ambient Glow to blend with Hero */}
      <div className="absolute inset-0 bg-[#800000]/5 blur-[100px] -z-10 rounded-full" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {data.map((item, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group bg-white/70 dark:bg-[#020617]/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-red-100/50 dark:border-red-900/20 shadow-[0_20px_50px_rgba(128,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(128,0,0,0.15)] text-center transition-all"
          >
            {/* Animated Icon/Dot for flair */}
            <div className="w-1.5 h-1.5 bg-[#800000] rounded-full mx-auto mb-4 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="text-3xl md:text-4xl font-black text-[#800000] dark:text-red-500 tracking-tighter">
              <Counter value={item.val} />
            </div>
            
            <div className="text-[10px] uppercase tracking-[0.2em] font-black text-[#3e0202]/60 dark:text-white/40 mt-3 leading-tight">
              {item.label}
            </div>

            {/* Subtle bottom accent line */}
            <div className="mt-6 h-[1px] w-8 bg-gray-100 dark:bg-white/5 mx-auto group-hover:w-16 group-hover:bg-red-500/50 transition-all duration-500" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}