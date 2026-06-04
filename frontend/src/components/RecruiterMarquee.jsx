import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, ArrowUpRight } from "lucide-react";
import { usePublicRecruiters } from "../hooks/usePublicTap";

const FALLBACK_CATEGORIES = [
  { id: "eng_it",     label: "Engineering & IT", short: "Engg / IT", folder: "Engineering_Computer_Applications", count: 39, accent: "from-rose-500 to-[#800000]" },
  { id: "management", label: "Management",       short: "MBA",       folder: "Management",                        count: 37, accent: "from-amber-500 to-orange-600" },
];
const ACCENT_BY_KEY = {
  eng_it: "from-rose-500 to-[#800000]",
  management: "from-amber-500 to-orange-600",
};
const ICON_BY_KEY = { eng_it: Briefcase, management: GraduationCap };
// Folder under /public/images/company_logos that stores the bundled PNGs.
// Used only as an offline placeholder when the API itself is unreachable.
const FOLDER_BY_KEY = {
  eng_it: "Engineering_Computer_Applications",
  management: "Management",
};
const FALLBACK_LOGO_COUNT = { eng_it: 39, management: 37 };

// ── Recruiter-name → corporate domain map ────────────────────────────────
// Used to fetch real, transparent-background logos via the Clearbit Logo API
// (https://logo.clearbit.com/{domain}, free, no auth). The match is normalized
// (lowercase + strip non-alphanumeric) so "Bajaj FinServ" and "bajaj-finserv"
// both resolve. If a recruiter isn't mapped here, the card falls through to
// the styled text-chip rendering — never to a mismatched logo.
const RECRUITER_DOMAIN_MAP = {
  // Engineering & IT
  accenture:           "accenture.com",
  adobe:               "adobe.com",
  amazon:              "amazon.com",
  amdocs:              "amdocs.com",
  bitwise:             "bitwiseglobal.com",
  bosch:               "bosch.com",
  capgemini:           "capgemini.com",
  cognizant:           "cognizant.com",
  drdo:                "drdo.gov.in",
  genpact:             "genpact.com",
  google:              "google.com",
  hexaware:            "hexaware.com",
  hikeeducation:       "hikeeducation.com",
  hp:                  "hp.com",
  ibmindia:            "ibm.com",
  infosyslimited:      "infosys.com",
  infosystechnologies: "infosys.com",
  infosys:             "infosys.com",
  intel:               "intel.com",
  intellipaat:         "intellipaat.com",
  isro:                "isro.gov.in",
  jktyre:              "jktyre.com",
  lt:                  "larsentoubro.com",   // "L&T"
  microsoft:           "microsoft.com",
  mindtree:            "ltimindtree.com",
  mphasis:             "mphasis.com",
  navalgroupindia:     "naval-group.com",
  navalgroup:          "naval-group.com",
  nttdata:             "nttdata.com",
  oracle:              "oracle.com",
  saplabs:             "sap.com",
  sap:                 "sap.com",
  sasken:              "sasken.com",
  sgs:                 "sgs.com",
  siemens:             "siemens.com",
  tcs:                 "tcs.com",
  techmahindra:        "techmahindra.com",
  wipro:               "wipro.com",
  zoho:                "zoho.com",
  // Management
  axisbank:            "axisbank.com",
  bajajfinserv:        "bajajfinserv.in",
  bhartiairtel:        "airtel.in",
  airtel:              "airtel.in",
  canarabank:          "canarabank.com",
  fedex:               "fedex.com",
  havells:             "havells.com",
  hcl:                 "hcltech.com",
  hdfc:                "hdfcbank.com",
  hdfcbank:            "hdfcbank.com",
  icici:               "icicibank.com",
  icicibank:           "icicibank.com",
  idfcfirst:           "idfcfirstbank.com",
  kotakmahindra:       "kotak.com",
  mahindragroup:       "mahindra.com",
  mahindra:            "mahindra.com",
  mastercard:          "mastercard.com",
  paytm:               "paytm.com",
  reliancejio:         "jio.com",
  jio:                 "jio.com",
  relianceretail:      "relianceretail.com",
  reliance:            "ril.com",
  sbi:                 "sbi.co.in",
  tatacapital:         "tatacapital.com",
  tatapower:           "tatapower.com",
  thermax:             "thermaxglobal.com",
  visasteel:           "visasteel.com",
  xiaomi:              "mi.com",
  yesbank:             "yesbank.in",
};

function _normaliseName(name) {
  return String(name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function logoUrlForRecruiter(name) {
  const key = _normaliseName(name);
  if (!key) return null;
  // Exact match first
  if (RECRUITER_DOMAIN_MAP[key]) {
    return `https://logo.clearbit.com/${RECRUITER_DOMAIN_MAP[key]}`;
  }
  // Prefix match — "infosyslimited" / "infosystechnologies" share "infosys".
  for (const [k, domain] of Object.entries(RECRUITER_DOMAIN_MAP)) {
    if (k.length >= 4 && key.startsWith(k)) {
      return `https://logo.clearbit.com/${domain}`;
    }
  }
  return null;
}

// Visual identical to the TAP page tiles — white card, grayscale logo that
// pops into colour on hover, hide the img element entirely if its source
// 404s so the row stays clean.
function LogoCard({ src, name }) {
  return (
    <div className="group shrink-0 w-24 h-16 sm:w-32 sm:h-20 md:w-40 md:h-24 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center p-2 sm:p-3 md:p-4 shadow-sm hover:scale-105 hover:shadow-xl transition-all duration-300">
      <img
        src={src}
        alt={name}
        loading="lazy"
        onError={(e) => (e.target.style.display = "none")}
        className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
      />
    </div>
  );
}

export default function RecruiterMarquee() {
  const { data } = usePublicRecruiters();

  // Build categories. We use the API for category metadata (label + count)
  // when available, but always source the actual recruiter LOGOS from the
  // bundled PNG packs under /public/images/company_logos/<folder>/logo_<i>.png
  // — exactly like the TAP page does. This avoids the name→logo pairing
  // problem (the PNG filenames carry no company info) and is the only way
  // to reliably render real coloured logos without depending on a CDN.
  const categories = useMemo(() => {
    const apiByKey = new Map(
      (data?.categories || []).map((c) => [c.key, c]),
    );
    return FALLBACK_CATEGORIES.map((c, i) => {
      const apiRow = apiByKey.get(c.id);
      const label = apiRow?.name || c.label;
      // The PNG pack is the source of truth for how many tiles to draw —
      // it's the only thing that maps to a real visual asset. We honour
      // the bundled count regardless of how many records the API has.
      const recruiters = Array.from({ length: c.count }, (_, idx) => ({
        name: `Recruiter ${idx + 1}`,
        logo: `/images/company_logos/${c.folder}/logo_${idx}.png`,
      }));
      return {
        id: c.id,
        label,
        short: c.short,
        icon: ICON_BY_KEY[c.id] || Briefcase,
        accent: ACCENT_BY_KEY[c.id] || FALLBACK_CATEGORIES[i % 2].accent,
        recruiters,
        count: apiRow?.recruiters?.length || c.count,
        useFallbackFolder: c.folder,
      };
    });
  }, [data]);

  const [activeId, setActiveId] = useState(categories[0]?.id);
  const active = categories.find((c) => c.id === activeId) || categories[0];
  if (!active) return null;

  const half = Math.ceil(active.recruiters.length / 2);
  const row1 = active.recruiters.slice(0, half);
  const row2 = active.recruiters.slice(half);
  const loop = (arr) => [...arr, ...arr];

  return (
    <section data-section="recruiters" className="relative py-6 sm:py-16 md:py-20 bg-white dark:bg-[#020617] overflow-hidden border-y border-rose-100/60 dark:border-white/5">

      <div className="absolute inset-y-0 left-0 w-24 md:w-44 bg-gradient-to-r from-white dark:from-[#020617] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-24 md:w-44 bg-gradient-to-l from-white dark:from-[#020617] to-transparent z-10 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-4 sm:mb-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-1 bg-gradient-to-r from-[#800000] to-amber-500 rounded-full"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#800000]">Top Recruiters</span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black tracking-[-0.03em] text-[#1a0606] dark:text-white leading-[1.05]">
              Where our students{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-br from-[#800000] to-[#3e0202] bg-clip-text text-transparent">go to work.</span>
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed mt-2 sm:mt-3">
              {active.count}+ partners actively recruiting across {active.label.toLowerCase()}. Click a category to switch.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  activeId === c.id ? "text-white shadow-lg" : "text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {activeId === c.id && (
                  <motion.span layoutId="rec-tab" className="absolute inset-0 bg-[#800000] rounded-full pointer-events-none" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                )}
                <c.icon size={11} className="relative z-10" />
                <span className="relative z-10 hidden sm:inline">{c.label}</span>
                <span className="relative z-10 sm:hidden">{c.short}</span>
                <span className="relative z-10 ml-1 px-1.5 py-0.5 bg-white/30 backdrop-blur rounded-full text-[8px]">{c.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5 sm:mb-8 flex flex-wrap items-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
          <span className="px-3 py-1.5 rounded-full bg-[#800000] text-white inline-flex items-center gap-1.5">
            <active.icon size={11} /> {active.label}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-rose-50 dark:bg-gray-800 text-[#800000] dark:text-rose-400">
            {active.count} verified recruiters
          </span>
          <span className="text-gray-400">· hover any logo to highlight</span>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-4">
        <div className="flex overflow-hidden group">
          <div key={`row1-${activeId}`} className="flex gap-2 sm:gap-3 md:gap-4 animate-[marquee-left_50s_linear_infinite] group-hover:[animation-play-state:paused] whitespace-nowrap">
            {loop(row1).map((r, k) => <LogoCard key={`r1-${k}`} src={r.logo} name={r.name} />)}
          </div>
        </div>

        <div className="flex overflow-hidden group">
          <div key={`row2-${activeId}`} className="flex gap-3 md:gap-4 animate-[marquee-right_55s_linear_infinite] group-hover:[animation-play-state:paused] whitespace-nowrap">
            {loop(row2).map((r, k) => <LogoCard key={`r2-${k}`} src={r.logo} name={r.name} />)}
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 mt-10 text-center">
        <p className="inline-flex items-center gap-2 text-xs text-gray-500 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          Active campus drives going on right now ·
          <a href="/tap" className="text-[#800000] font-black hover:underline inline-flex items-center gap-1">
            View placement records <ArrowUpRight size={11} />
          </a>
        </p>
      </div>

      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
