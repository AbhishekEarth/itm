import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  Presentation,
  FlaskConical,
  Cpu,
  Music,
  Briefcase,
  Building2,
  Users,
  Lightbulb,
  Rocket,
  BookOpen,
  Sparkles,
  PartyPopper,
  Network,
  Target,
  Laptop,
} from "lucide-react";
import EditableText from "./admin/EditableText";

// Why ITM Gwalior — fifteen pillars covering academics, infra, placement,
// and student experience. Replaces the older 6-number stats grid.
const data = [
  { icon: Presentation, label: "Smart & Interactive Classrooms",     accent: "from-rose-500 to-[#800000]" },
  { icon: FlaskConical, label: "State-of-the-Art Laboratories",      accent: "from-emerald-500 to-teal-700" },
  { icon: Cpu,          label: "Advanced Computing Infrastructure",  accent: "from-indigo-500 to-violet-700" },
  { icon: Music,        label: "Grand NAAD Amphitheatre",            accent: "from-sky-500 to-blue-700" },
  { icon: Briefcase,    label: "Excellent Placement Opportunities",  accent: "from-amber-500 to-orange-600" },
  { icon: Building2,    label: "Industry-Oriented Learning Environment", accent: "from-rose-500 to-pink-700" },
  { icon: Users,        label: "Experienced and Dedicated Faculty",  accent: "from-fuchsia-500 to-purple-700" },
  { icon: Lightbulb,    label: "Research & Innovation Ecosystem",    accent: "from-yellow-500 to-amber-600" },
  { icon: Rocket,       label: "Entrepreneurship Development Support", accent: "from-orange-500 to-red-700" },
  { icon: BookOpen,     label: "Modern Academic Facilities",         accent: "from-cyan-500 to-teal-700" },
  { icon: Sparkles,     label: "Holistic Student Development",       accent: "from-lime-500 to-green-700" },
  { icon: PartyPopper,  label: "Vibrant Campus Life",                accent: "from-pink-500 to-rose-700" },
  { icon: Network,      label: "Strong Industry Connect",            accent: "from-blue-500 to-indigo-700" },
  { icon: Target,       label: "Career-Focused Education",           accent: "from-red-500 to-[#800000]" },
  { icon: Laptop,       label: "Technology-Enabled Learning",        accent: "from-violet-500 to-fuchsia-700" },
];

export default function Stats() {
  const pageKey = useLocation().pathname;
  return (
    <section data-section="stats" className="relative py-8 sm:py-20 md:py-28 bg-gradient-to-b from-[#fbf7f2] via-white to-white dark:from-[#0a0a14] dark:to-[#020617] overflow-hidden">

      {/* Decorative blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[300px] rounded-full bg-gradient-to-br from-rose-200/30 to-transparent blur-2xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full"></div>
              <EditableText
                pageKey={pageKey}
                tkey="stats.eyebrow"
                as="span"
                value="Why ITM Gwalior"
                className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000] dark:text-rose-300"
              >
                Why ITM Gwalior
              </EditableText>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white leading-[1.05]">
              <EditableText pageKey={pageKey} tkey="stats.title.line1" as="span" value="A campus built on">
                A campus built on
              </EditableText>{" "}
              <EditableText
                pageKey={pageKey}
                tkey="stats.title.line2"
                as="span"
                value="outcomes."
                className="bg-gradient-to-br from-[#800000] to-[#3e0202] dark:from-rose-400 dark:to-amber-200 bg-clip-text text-transparent"
              >
                outcomes.
              </EditableText>
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-md">
            <EditableText
              pageKey={pageKey}
              tkey="stats.intro"
              as="span"
              multiline
              value="Modern facilities, experienced faculty and an active industry network — every part of the campus is tuned to turn curiosity into a career."
            >
              Modern facilities, experienced faculty and an active industry network — every part
              of the campus is tuned to turn curiosity into a career.
            </EditableText>
          </p>
        </div>

        {/* Grid — 5 columns on desktop, 3 on tablet, 2 on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {data.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 5) * 0.05 + Math.floor(i / 5) * 0.08, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden bg-white dark:bg-gray-900 rounded-3xl border border-rose-50 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-rose-950/5 dark:hover:shadow-rose-950/20 transition-all duration-300 ease-out p-4 sm:p-5"
            >
              {/* Glow */}
              <div
                className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${s.accent} opacity-10 group-hover:opacity-25 blur-2xl transition-opacity duration-500`}
              ></div>

              <div className="relative">
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${s.accent} text-white flex items-center justify-center shadow-lg mb-3 sm:mb-4`}
                >
                  <s.icon size={18} />
                </div>

                <div className="text-sm sm:text-[15px] font-black tracking-[-0.01em] text-[#1a0606] dark:text-white leading-snug">
                  {s.label}
                </div>

                <div className="mt-3 sm:mt-4 h-[2px] w-6 bg-gradient-to-r from-[#800000] to-amber-400 group-hover:w-full transition-all duration-500"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
