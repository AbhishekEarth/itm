import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, Trophy, Building2, Users2, Image as ImageIcon, Video, Camera,
  GraduationCap, ArrowUpRight, Play,
} from "lucide-react";
import PageShell, { SectionTitle, Card } from "./_PageShell";

/* ----- Stock-image utility (Unsplash) — used until photos are uploaded ----- */
const PLACEHOLDER = (q, w = 1200) =>
  `https://images.unsplash.com/${q}?w=${w}&q=80&auto=format&fit=crop`;

/* ============================================================
   Categories — used by the hub page
   ============================================================ */
const CATEGORIES = [
  { slug: "cultural",       label: "Cultural Events",  Icon: Sparkles,      tint: "from-rose-500 to-pink-700",       sample: "photo-1514525253161-7a46d19cd819" },
  { slug: "experts",        label: "Expert Visits",     Icon: GraduationCap, tint: "from-amber-500 to-orange-700",    sample: "photo-1577896851231-70ef18881754" },
  { slug: "infrastructure", label: "Infrastructure",    Icon: Building2,     tint: "from-sky-500 to-blue-700",        sample: "photo-1562774053-701939374585" },
  { slug: "sports",          label: "Sports",            Icon: Trophy,        tint: "from-emerald-500 to-teal-700",    sample: "photo-1543326727-cf6c39e8f84c" },
  { slug: "students",        label: "Student Photos",    Icon: Users2,        tint: "from-indigo-500 to-violet-700",   sample: "photo-1523240795612-9a054b0db644" },
  { slug: "life",             label: "Life @ ITM",        Icon: ImageIcon,     tint: "from-fuchsia-500 to-purple-700",  sample: "photo-1523050854058-8df90110c9f1" },
  { slug: "videos",           label: "Video Gallery",     Icon: Video,         tint: "from-yellow-500 to-amber-700",    sample: "photo-1485846234645-a62644f84728" },
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} to={`/gallery/${c.slug}`}
            className="group relative aspect-square rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
            <img src={PLACEHOLDER(c.sample, 600)} alt={c.label} loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className={`absolute inset-0 bg-gradient-to-br ${c.tint} mix-blend-multiply opacity-60`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="relative h-full flex flex-col justify-between p-5 text-white">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur ring-1 ring-white/30 flex items-center justify-center">
                <c.Icon size={20} strokeWidth={2.2} />
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.25em] text-white/70 mb-1">Gallery</div>
                <div className="text-lg font-black tracking-tight leading-tight">{c.label}</div>
              </div>
            </div>
            <ArrowUpRight size={14} className="absolute top-5 right-5 text-white/70 group-hover:text-white transition-colors" />
          </Link>
        ))}
      </div>
    </PageShell>
  );
}

/* ============================================================
   Reusable photo grid + sub-gallery template
   ============================================================ */
function PhotoGrid({ images, label }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((img, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
          transition={{ delay: (i % 8) * 0.03 }}
          className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
        >
          <img src={PLACEHOLDER(img, 600)} alt={label} loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      ))}
    </div>
  );
}

function SubGalleryShell({ eyebrow, title, accent, intro, slug, images, count }) {
  return (
    <PageShell eyebrow={eyebrow} title={title} accentTitle={accent} intro={intro}
      chips={[`${count} photos`, "Updated regularly"]}>
      <div className="flex items-center justify-between mb-2">
        <SectionTitle eyebrow="Photo Gallery" title="Full" accent="archive." />
        <Link to="/gallery" className="text-[11px] font-black uppercase tracking-widest text-[#800000] dark:text-amber-300 hover:underline">← All galleries</Link>
      </div>
      <PhotoGrid images={images} label={title} />
      <Card className="mt-10 text-center">
        <Camera className="mx-auto text-[#800000] dark:text-amber-300 mb-2" size={26} />
        <h3 className="font-black text-lg text-[#1a0606] dark:text-white">Have a photo from this event?</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1 mb-4">Email photos to gallery@itmgoi.in and we'll add them to the next refresh.</p>
        <a href="mailto:gallery@itmgoi.in" className="inline-flex items-center gap-2 bg-[#800000] hover:bg-[#5c0202] text-white px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase">gallery@itmgoi.in</a>
      </Card>
    </PageShell>
  );
}

/* ============================================================
   Sub-galleries (7) — placeholder images from Unsplash, easy to swap later
   ============================================================ */
const cultural = [
  "photo-1514525253161-7a46d19cd819", "photo-1493225457124-a3eb161ffa5f",
  "photo-1531058020387-3be344556be6", "photo-1530023367847-a683933f4172",
  "photo-1492684223066-81342ee5ff30", "photo-1551763140-3c4a814e60ff",
  "photo-1429962714451-bb934ecdc4ec", "photo-1547153760-18fc86324498",
  "photo-1505236858219-8359eb29e329", "photo-1518609571773-39b7d303a87b",
  "photo-1583847268964-b28dc8f51f92", "photo-1496337589254-7e19d01cec44",
];
export function CulturalGalleryPage() {
  return <SubGalleryShell eyebrow="Cultural Events" title="The colour of" accent="cultural life." slug="cultural"
    intro="DiversITM, Megh Malhar, Nritya Mahotsav, Ibarat — the festivals and celebrations that anchor the ITM cultural calendar."
    count={cultural.length} images={cultural} />;
}

const experts = [
  "photo-1577896851231-70ef18881754", "photo-1559223607-b4d0555ae8b5",
  "photo-1556761175-5973dc0f32e7", "photo-1551836022-deb4988cc6c0",
  "photo-1573164574572-cb89e39749b4", "photo-1542744173-8e7e53415bb0",
  "photo-1517245386807-bb43f82c33c4", "photo-1551836022-aadb801c60f9",
];
export function ExpertsGalleryPage() {
  return <SubGalleryShell eyebrow="Experts from Industry & Academia" title="Visits, talks &" accent="guest sessions." slug="experts"
    intro="Industry leaders and academic visitors who've taught a class, judged a competition or delivered a talk on campus."
    count={experts.length} images={experts} />;
}

const infra = [
  "photo-1562774053-701939374585", "photo-1525921429624-479b6a26d84d",
  "photo-1564981797816-1043664bf78d", "photo-1568667256549-094345857637",
  "photo-1583356067017-d8f9bf81f6a7", "photo-1571115764595-644a1f56a55c",
  "photo-1497486751825-1233686f5d54", "photo-1545987796-200677ee1011",
];
export function InfraGalleryPage() {
  return <SubGalleryShell eyebrow="Infrastructure" title="Labs, library &" accent="the amphitheatre." slug="infrastructure"
    intro="42 labs, 728 computers, a 2,500-seat amphitheatre, a 64,000-book library — captured from across the campus."
    count={infra.length} images={infra} />;
}

const sports = [
  "photo-1543326727-cf6c39e8f84c", "photo-1574629810360-7efbbe195018",
  "photo-1521412644187-c49fa049e84d", "photo-1551958219-acbc608c6377",
  "photo-1517649763962-0c623066013b", "photo-1571902943202-507ec2618e8f",
  "photo-1546519638-68e109498ffc", "photo-1535131749006-b7f58c99034b",
];
export function SportsGalleryPage() {
  return <SubGalleryShell eyebrow="Sports" title="The field, the gym &" accent="every podium." slug="sports"
    intro="Inter-college tournaments, the annual sports meet and the daily life of the ITM sports complex."
    count={sports.length} images={sports} />;
}

const students = [
  "photo-1523240795612-9a054b0db644", "photo-1517486808906-6ca8b3f04846",
  "photo-1543269664-7eef42226a21", "photo-1523580494863-6f3031224c94",
  "photo-1531545514256-b1400bc00f31", "photo-1571260899304-425eee4c7efc",
  "photo-1522202176988-66273c2fd55f", "photo-1540575467063-178a50c2df87",
];
export function StudentsGalleryPage() {
  return <SubGalleryShell eyebrow="Student Photos" title="The people who" accent="make ITM, ITM." slug="students"
    intro="Candid and posed shots from across the academic year — group photos, study sessions and the everyday life of a student here."
    count={students.length} images={students} />;
}

const life = [
  "photo-1523050854058-8df90110c9f1", "photo-1571260899304-425eee4c7efc",
  "photo-1488521787991-ed7bbaae773c", "photo-1486325212027-8081e485255e",
  "photo-1518770660439-4636190af475", "photo-1505236858219-8359eb29e329",
  "photo-1500382017468-9049fed747ef", "photo-1517457373958-b7bdd4587205",
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
  { id: 1, title: "DiversITM Highlights", duration: "3:42", cover: "photo-1492684223066-81342ee5ff30" },
  { id: 2, title: "Director's Independence Day Address", duration: "8:15", cover: "photo-1577896851231-70ef18881754" },
  { id: 3, title: "Inside Akshardaam Library", duration: "2:08", cover: "photo-1568667256549-094345857637" },
  { id: 4, title: "Campus Walkthrough 2026", duration: "5:30", cover: "photo-1562774053-701939374585" },
  { id: 5, title: "NAAD Amphitheatre — Megh Malhar 2024", duration: "4:55", cover: "photo-1514525253161-7a46d19cd819" },
  { id: 6, title: "Alumni Meet Highlights", duration: "6:12", cover: "photo-1523240795612-9a054b0db644" },
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {VIDEOS.map((v, i) => (
          <motion.button key={v.id}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: (i % 6) * 0.04 }}
            className="group relative aspect-video rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow text-left">
            <img src={PLACEHOLDER(v.cover, 800)} alt={v.title} loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur ring-1 ring-white/40 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Play size={26} fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-200 mb-1">{v.duration}</div>
              <div className="font-black text-base leading-tight">{v.title}</div>
            </div>
          </motion.button>
        ))}
      </div>
    </PageShell>
  );
}
