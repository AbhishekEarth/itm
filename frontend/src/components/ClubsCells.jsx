import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Music, Leaf, Heart, Trophy, Shield, Users2 } from "lucide-react";

const CLUBS = [
  {
    name: "Performing Arts Club",
    short: "PAC",
    icon: Music,
    emoji: "🎭",
    desc: "Music, dance, drama and stagecraft — the home of KRONOS, Maharathi and our biggest cultural productions.",
    accent: "from-rose-500 to-[#800000]",
    path: "/pac",
    image: "https://www.itmgoi.in/include/gallery/PAC/6.jpg",
    tags: ["50+ Members", "Annual Production", "₹5L Grant"],
  },
  {
    name: "Unnat Bharat Abhiyan",
    short: "UBA",
    icon: Leaf,
    emoji: "🌾",
    desc: "Connecting campus to community — rural development, village adoption, renewable energy and social outreach across 5 adopted villages.",
    accent: "from-emerald-500 to-teal-700",
    path: "/uba",
    image: "https://www.itmgoi.in/include/gallery/UBA/uba1.jpg",
    tags: ["5 Villages", "IIT Delhi Award", "Since 2018"],
  },
  {
    name: "NSS Cell",
    short: "NSS",
    icon: Heart,
    emoji: "🤝",
    desc: "\"Not Me, But You\" — blood donation drives, Swachh Bharat campaigns, plantation drives and social service with 200+ volunteers.",
    accent: "from-blue-500 to-indigo-700",
    path: "/nss",
    image: "https://www.itmgoi.in/include/gallery/NSS/nss1.jpg",
    tags: ["200+ Volunteers", "500+ Units/Year", "2 Units"],
  },
  {
    name: "Sports Cell",
    short: "SPORTS",
    icon: Trophy,
    emoji: "🏆",
    desc: "10+ sports, national-level competitions, inter-departmental tournaments and a vision to make ITM Gwalior a sporting powerhouse.",
    accent: "from-amber-500 to-orange-600",
    path: "/sports",
    image: "https://www.itmgoi.in/include/gallery/Sports/achievement/1.jpg",
    tags: ["10+ Sports", "National Level", "6 Dept Reps"],
  },
  {
    name: "Women Empowerment Cell",
    short: "WEC",
    icon: Shield,
    emoji: "♀️",
    desc: "Creating awareness of women's rights, promoting equality and empowering girl students through events, seminars and community outreach.",
    accent: "from-pink-500 to-rose-700",
    path: "/wec",
    image: "https://www.itmgoi.in/include/gallery/WEC/1.jpg",
    tags: ["4 Members", "9+ Events", "NCW Collaboration"],
  },
];

export default function ClubsCells() {
  return (
    <section id="clubs" className="relative py-20 md:py-28 bg-white dark:bg-[#020617] overflow-hidden">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000]">
                Student Life
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white leading-[1.05]">
              Find your{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-br from-[#800000] to-[#3e0202] bg-clip-text text-transparent">
                  tribe.
                </span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-amber-200/60 -z-0 -skew-x-3"></span>
              </span>
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-md">
            Curated communities for every passion — performing arts, photography, coding,
            entrepreneurship and more. College is what you make of it.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
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
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${c.accent} mix-blend-multiply opacity-65`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                  <div className="absolute top-4 right-4 text-4xl drop-shadow-xl">{c.emoji}</div>

                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/70 mb-1">Club</div>
                    <h3 className="text-2xl font-black tracking-[-0.03em] leading-none">{c.name}</h3>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium mb-4">
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
