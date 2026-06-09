import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles, Trophy, Building2, Users2, Image as ImageIcon, Video, Camera,
  GraduationCap, ArrowUpRight, Play,
} from "lucide-react";
import PageShell, { SectionTitle, Card } from "./_PageShell";
import { publicEventsApi } from "../api/events";

/* ----- Real ITM gallery photos (served from itmgoi.in) — fallback until ----
   admin uploads fresh photos via /admin/gallery, which surface through the
   publicEventsApi.galleryCategory query below. */
const ITM = (path) => `https://pub-127dc462e0864e8981d24768d4ba7822.r2.dev/include/gallery/${path}`;

/* ============================================================
   Categories — used by the hub page
   ============================================================ */
const CATEGORIES = [
  { slug: "cultural",       label: "Cultural Events",  Icon: Sparkles,      tint: "from-rose-500 to-pink-700",       sample: ITM("cultural_gallery/cultural_events/_DSC0963.jpg") },
  { slug: "experts",        label: "Expert Visits",     Icon: GraduationCap, tint: "from-amber-500 to-orange-700",    sample: ITM("Experts_from_industry_and_academia/experts_from_industry_and_academia/_DSC0583.jpg") },
  { slug: "infrastructure", label: "Infrastructure",    Icon: Building2,     tint: "from-sky-500 to-blue-700",        sample: ITM("infrastructure/infrastructure/DSC_0161.jpg") },
  { slug: "sports",          label: "Sports",            Icon: Trophy,        tint: "from-emerald-500 to-teal-700",    sample: ITM("Sports/Sports/_DSC0929.jpg") },
  { slug: "students",        label: "Student Photos",    Icon: Users2,        tint: "from-indigo-500 to-violet-700",   sample: ITM("Student_photos/Student_photos/_DSC1151.jpg") },
  { slug: "life",             label: "Life @ ITM",        Icon: ImageIcon,     tint: "from-fuchsia-500 to-purple-700",  sample: ITM("cultural_gallery/cultural_events/_DSC2435.jpg") },
  { slug: "videos",           label: "Video Gallery",     Icon: Video,         tint: "from-yellow-500 to-amber-700",    sample: ITM("PAC_pics/Baasan_1.jpg") },
];

/* ============================================================
   GALLERY HUB
   ============================================================ */
export function GalleryHubPage() {
  return (
    <PageShell
      eyebrow="Gallery"
      title="Campus through"
      accentTitle="the lens."
      intro="Cultural festivals, expert visits, infrastructure, sport, student life — every part of ITM Gwalior captured and archived across seven curated collections."
      chips={["7 collections", "Cultural · Sport · Life"]}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} to={`/gallery/${c.slug}`}
            className="group relative aspect-square rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
            <img src={c.sample} alt={c.label} loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className={`absolute inset-0 bg-gradient-to-br ${c.tint} mix-blend-multiply opacity-60`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="relative h-full flex flex-col justify-between p-3 sm:p-5 text-white">
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-2xl bg-white/20 backdrop-blur ring-1 ring-white/30 flex items-center justify-center">
                <c.Icon size={20} strokeWidth={2.2} />
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.25em] text-white/70 mb-1">Gallery</div>
                <div className="text-sm sm:text-lg font-black tracking-tight leading-tight">{c.label}</div>
              </div>
            </div>
            <ArrowUpRight size={14} className="absolute top-3 right-3 sm:top-5 sm:right-5 text-white/70 group-hover:text-white transition-colors" />
          </Link>
        ))}
      </div>
    </PageShell>
  );
}

/* ============================================================
   Reusable photo grid + sub-gallery template
   ============================================================ */
function PhotoGrid({ items, label }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
      {items.map((it, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
          transition={{ delay: (i % 8) * 0.03 }}
          className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
        >
          <img src={it.src} alt={it.caption || label} loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
            {it.caption && <span className="text-[10px] text-white font-bold line-clamp-2">{it.caption}</span>}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SubGalleryShell({ eyebrow, title, accent, intro, slug, images }) {
  const { data: live } = useQuery({
    queryKey: ["public-gallery-cat", slug],
    queryFn: () => publicEventsApi.galleryCategory(slug),
    enabled: !!slug,
  });
  const items = (live?.items?.length
    ? live.items.map((i) => ({ src: i.src, caption: i.caption }))
    : (images || []).map((q) => ({ src: q, caption: null }))
  );
  return (
    <PageShell eyebrow={eyebrow} title={title} accentTitle={accent} intro={intro}
      chips={[`${items.length} photos`, "Updated regularly"]}>
      <div className="flex items-center justify-between mb-2">
        <SectionTitle eyebrow="Photo Gallery" title="Full" accent="archive." />
        <Link to="/gallery" className="text-[11px] font-black uppercase tracking-widest text-[#800000] dark:text-amber-300 hover:underline">← All galleries</Link>
      </div>
      <PhotoGrid items={items} label={title} />
      <Card className="mt-6 sm:mt-10 text-center">
        <Camera className="mx-auto text-[#800000] dark:text-amber-300 mb-2" size={26} />
        <h3 className="font-black text-base sm:text-lg text-[#1a0606] dark:text-white">Have a photo from this event?</h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mt-1 mb-3 sm:mb-4">Email photos to gallery@itmgoi.in and we'll add them to the next refresh.</p>
        <a href="mailto:gallery@itmgoi.in" className="inline-flex items-center gap-2 bg-[#800000] hover:bg-[#5c0202] text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase">gallery@itmgoi.in</a>
      </Card>
    </PageShell>
  );
}

/* ============================================================
   Sub-galleries (7) — placeholder images from Unsplash, easy to swap later
   ============================================================ */
const cultural = [
  ITM("cultural_gallery/cultural_events/_DSC0963.jpg"),
  ITM("cultural_gallery/cultural_events/_DSC0983.jpg"),
  ITM("cultural_gallery/cultural_events/_DSC1015.jpg"),
  ITM("cultural_gallery/cultural_events/_DSC1045.jpg"),
  ITM("cultural_gallery/cultural_events/_DSC1955.jpg"),
  ITM("cultural_gallery/cultural_events/_DSC2067.jpg"),
  ITM("cultural_gallery/cultural_events/_DSC2435.jpg"),
  ITM("cultural_gallery/cultural_events/_DSC2552.jpg"),
  ITM("cultural_gallery/cultural_events/_DSC2797.jpg"),
  ITM("cultural_gallery/cultural_events/_DSC3248.jpg"),
  ITM("cultural_gallery/cultural_events/_DSC3255.jpg"),
  ITM("cultural_gallery/cultural_events/_DSC3977.jpg"),
];
export function CulturalGalleryPage() {
  return <SubGalleryShell eyebrow="Cultural Events" title="The colour of" accent="cultural life." slug="cultural"
    intro="DiversITM, Megh Malhar, Nritya Mahotsav, Ibarat — the festivals and celebrations that anchor the ITM cultural calendar."
    count={cultural.length} images={cultural} />;
}

const experts = [
  ITM("Experts_from_industry_and_academia/experts_from_industry_and_academia/_DSC0583.jpg"),
  ITM("Experts_from_industry_and_academia/experts_from_industry_and_academia/_DSC0704.jpg"),
  ITM("Experts_from_industry_and_academia/experts_from_industry_and_academia/_DSC1443.jpg"),
  ITM("Experts_from_industry_and_academia/experts_from_industry_and_academia/_DSC1697.jpg"),
  ITM("Experts_from_industry_and_academia/experts_from_industry_and_academia/_DSC1708.jpg"),
  ITM("Experts_from_industry_and_academia/experts_from_industry_and_academia/_DSC1728.jpg"),
  ITM("Experts_from_industry_and_academia/experts_from_industry_and_academia/_DSC1795.jpg"),
  ITM("Experts_from_industry_and_academia/experts_from_industry_and_academia/_DSC2185.jpg"),
];
export function ExpertsGalleryPage() {
  return <SubGalleryShell eyebrow="Experts from Industry & Academia" title="Visits, talks &" accent="guest sessions." slug="experts"
    intro="Industry leaders and academic visitors who've taught a class, judged a competition or delivered a talk on campus."
    count={experts.length} images={experts} />;
}

const infra = [
  ITM("infrastructure/infrastructure/DSC_0161.jpg"),
  ITM("infrastructure/infrastructure/DSC_0164.jpg"),
  ITM("infrastructure/infrastructure/DSC_0258.jpg"),
  ITM("infrastructure/infrastructure/DSC_0291.jpg"),
  ITM("infrastructure/infrastructure/DSC_0317.jpg"),
  ITM("infrastructure/infrastructure/DSC_0322.jpg"),
  ITM("infrastructure/infrastructure/DSC_0522.jpg"),
  ITM("infrastructure/infrastructure/DSC_2290.jpg"),
];
export function InfraGalleryPage() {
  return <SubGalleryShell eyebrow="Infrastructure" title="Labs, library &" accent="the amphitheatre." slug="infrastructure"
    intro="42 labs, 728 computers, a 2,500-seat amphitheatre, a 64,000-book library — captured from across the campus."
    count={infra.length} images={infra} />;
}

const sports = [
  ITM("Sports/Sports/_DSC0929.jpg"),
  ITM("Sports/Sports/_DSC0978.jpg"),
  ITM("Sports/Sports/_DSC1062.jpg"),
  ITM("Sports/Sports/_DSC1075.jpg"),
  ITM("Sports/Sports/_DSC1089.jpg"),
  ITM("Sports/Sports/_DSC8842.jpg"),
  ITM("Sports/Sports/_DSC8940.jpg"),
  ITM("Sports/Sports/_DSC9015.jpg"),
];
export function SportsGalleryPage() {
  return <SubGalleryShell eyebrow="Sports" title="The field, the gym &" accent="every podium." slug="sports"
    intro="Inter-college tournaments, the annual sports meet and the daily life of the ITM sports complex."
    count={sports.length} images={sports} />;
}

const students = [
  ITM("Student_photos/Student_photos/_DSC1151.jpg"),
  ITM("Student_photos/Student_photos/_DSC1175.jpg"),
  ITM("Student_photos/Student_photos/_DSC1207.jpg"),
  ITM("Student_photos/Student_photos/_DSC1209.jpg"),
  ITM("Student_photos/Student_photos/_DSC1212.jpg"),
  ITM("Student_photos/Student_photos/_DSC1242.jpg"),
  ITM("Student_photos/Student_photos/_DSC1274.jpg"),
  ITM("Student_photos/Student_photos/_DSC1289.jpg"),
];
export function StudentsGalleryPage() {
  return <SubGalleryShell eyebrow="Student Photos" title="The people who" accent="make ITM, ITM." slug="students"
    intro="Candid and posed shots from across the academic year — group photos, study sessions and the everyday life of a student here."
    count={students.length} images={students} />;
}

const life = [
  ITM("cultural_gallery/cultural_events/_DSC2435.jpg"),
  ITM("Student_photos/Student_photos/_DSC1207.jpg"),
  ITM("PAC_pics/Baasan_1.jpg"),
  ITM("PAC_pics/bajan_1.jpg"),
  ITM("PAC_pics/Chandani_1.jpg"),
  ITM("Sports/Sports/_DSC0978.jpg"),
  ITM("infrastructure/infrastructure/DSC_0317.jpg"),
  ITM("cultural_gallery/cultural_events/_DSC3977.jpg"),
];
export function LifeAtITMPage() {
  return <SubGalleryShell eyebrow="Life @ ITM" title="The everyday side of" accent="campus." slug="life"
    intro="Morning coffee, library afternoons, mess dinners, late-night code sprints, the in-between moments that make a campus a home."
    count={life.length} images={life} />;
}

/* ============================================================
   VIDEO GALLERY — separate template
   ============================================================ */
const VIDEOS = [
  { id: 1, title: "DiversITM Highlights",                duration: "3:42", cover: ITM("cultural_gallery/cultural_events/_DSC1955.jpg") },
  { id: 2, title: "Director's Independence Day Address", duration: "8:15", cover: ITM("Experts_from_industry_and_academia/experts_from_industry_and_academia/_DSC1697.jpg") },
  { id: 3, title: "Inside Akshardaam Library",            duration: "2:08", cover: ITM("infrastructure/infrastructure/DSC_0258.jpg") },
  { id: 4, title: "Campus Walkthrough 2026",              duration: "5:30", cover: ITM("infrastructure/infrastructure/DSC_0317.jpg") },
  { id: 5, title: "NAAD Amphitheatre — Megh Malhar 2024", duration: "4:55", cover: ITM("cultural_gallery/cultural_events/_DSC2435.jpg") },
  { id: 6, title: "Alumni Meet Highlights",                duration: "6:12", cover: ITM("Student_photos/Student_photos/_DSC1207.jpg") },
];

export function VideoGalleryPage() {
  return (
    <PageShell
      eyebrow="Video Gallery"
      title="Moving pictures"
      accentTitle="from campus."
      intro="Highlight reels, walkthroughs, addresses and full event films — curated across years and updated each session."
      chips={[`${VIDEOS.length} videos`, "Updated each session"]}
    >
      <div className="flex items-center justify-between mb-2">
        <SectionTitle eyebrow="Watch" title="Video" accent="archive." />
        <Link to="/gallery" className="text-[11px] font-black uppercase tracking-widest text-[#800000] dark:text-amber-300 hover:underline">← All galleries</Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        {VIDEOS.map((v, i) => (
          <motion.button key={v.id}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: (i % 6) * 0.04 }}
            className="group relative aspect-video rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow text-left">
            <img src={v.cover} alt={v.title} loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur ring-1 ring-white/40 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Play size={26} fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
              <div className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-200 mb-1">{v.duration}</div>
              <div className="font-black text-sm sm:text-base leading-tight">{v.title}</div>
            </div>
          </motion.button>
        ))}
      </div>
    </PageShell>
  );
}
