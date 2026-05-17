import React from "react";
import Reveal from "./Reveal";
import PlacementData from "./PlacementData"; // Naya component import karein

export default function Placements() {
  return (
    <section className="py-20 bg-white dark:bg-[#020617] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <Reveal>
            <span className="text-[#800000] dark:text-red-400 font-black uppercase tracking-[0.4em] text-[10px]">Career Outcomes</span>
          </Reveal>
          <Reveal delay={0.2}>
            <h2 className="text-4xl md:text-6xl font-black text-[#3e0202] dark:text-white mt-2 tracking-tighter">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#800000] to-red-600">Alumni</span> Network
            </h2>
          </Reveal>
        </div>

        {/* Yaha Backend Data load hoga */}
        <Reveal delay={0.3}>
          <PlacementData />
        </Reveal>

        {/* Marquee remains the same... */}
      </div>
    </section>
  );
}