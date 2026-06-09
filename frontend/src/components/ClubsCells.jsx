import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Music, Camera, Code2, Users2 } from "lucide-react";

const CLUBS = [
  {
    name: "Performing Arts Club",
    short: "PAC",
    Icon: Music,
    desc: "Music, dance, drama and stagecraft — the home of KRONOS, Maharathi and our biggest cultural productions.",
    accent: "from-rose-500 to-[#800000]",
    path: "/pac",
    image: "https://pub-127dc462e0864e8981d24768d4ba7822.r2.dev/include/gallery/PAC_pics/Baasan_1.jpg",
    tags: ["50+ Members", "Annual Production", "₹5L Grant"],
  },
  {
    name: "Photography Club",
    short: "PIX",
    Icon: Camera,
    desc: "Visual storytellers capturing campus life, events and the streets of Gwalior. Regular exhibits and workshops.",
    accent: "from-amber-500 to-orange-600",
    path: "/clubs",
    image: "https://pub-127dc462e0864e8981d24768d4ba7822.r2.dev/include/gallery/cultural_gallery/cultural_events/_DSC2435.jpg",
    tags: ["Weekly Walks", "Print Studio", "Exhibits"],
  },
  {
    name: "Coding Club",
    short: "DEV",
    Icon: Code2,
    desc: "Competitive programming, hackathons, open-source sprints and weekend project hacks across all years.",
    accent: "from-indigo-500 to-violet-700",
    path: "/clubs",
    image: "https://pub-127dc462e0864e8981d24768d4ba7822.r2.dev/assets2/images/CSE_Lab4.jpg",
    tags: ["Hackathons", "ICPC Prep", "Mentor Network"],
  },
];

export default function ClubsCells() {
  return (
    <section id="clubs" className="relative py-8 sm:py-20 md:py-28 bg-white dark:bg-[#020617] overflow-hidden">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000]">
                Student Life
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white leading-[1.05]">
              Find your{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-br from-[#800000] to-[#3e0202] bg-clip-text text-transparent">
                  tribe.
                </span>
              </span>
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-md">
            Curated communities for every passion — performing arts, photography, coding,
            entrepreneurship and more. College is what you make of it.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
          {CLUBS.map((c, i) => (
            <Link to={c.path} key={c.short}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-rose-50 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-shadow h-full"
              >
                {/* Image */}
                <div className="relative h-28 sm:h-52 overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${c.accent} mix-blend-multiply opacity-65`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                  <div className="absolute top-4 right-4 flex items-center justify-center w-11 h-11 rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/30 text-white shadow-xl">
                    <c.Icon size={20} strokeWidth={2.2} />
                  </div>

                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/70 mb-1">Club</div>
                    <h3 className="text-sm sm:text-lg lg:text-2xl font-black tracking-[-0.03em] leading-none">{c.name}</h3>
                  </div>
                </div>

                {/* Body */}
                <div className="p-3 sm:p-5">
                  <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium mb-4 line-clamp-2 sm:line-clamp-none">
                    {c.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] uppercase tracking-widest font-black px-2 py-1 bg-rose-50 dark:bg-gray-800 text-[#800000] dark:text-rose-300 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-rose-50 dark:border-gray-800">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#800000]">
                      View Details
                    </span>
                    <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-gray-800 group-hover:bg-[#800000] flex items-center justify-center text-[#800000] group-hover:text-white transition-colors">
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Footnote band */}
        <div className="mt-10 flex items-center justify-center gap-3 text-xs text-gray-500 font-medium">
          <Users2 size={14} className="text-[#800000]" />
          <span>15+ active clubs and cells · technical, cultural, sports, entrepreneurship</span>
        </div>
      </div>
    </section>
  );
}
