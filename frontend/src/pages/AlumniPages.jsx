import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Users2, HeartHandshake, Award, MapPin, Quote, ExternalLink,
  ArrowUpRight, Sparkles,
} from "lucide-react";
import PageShell, { SectionTitle, Card, Prose, FactRow } from "./_PageShell";
import { publicComplianceApi } from "../api/compliance";

/* ============================================================
   ALUMNI SPEAKS — testimonials grouped by year
   ============================================================ */
const TESTIMONIALS = [
  {
    year: "2024",
    items: [
      { name: "Riya Singh",   batch: "MBA",  company: "Niva Bupa Health Insurance", quote: "Education at ITM was about cultivating wisdom, leadership and integrity." },
      { name: "Sana Khan",    batch: "MBA",  company: "Eteams Info Service",         quote: "ITM laid a robust foundation for technical expertise and ethical values." },
    ],
  },
  {
    year: "2023",
    items: [
      { name: "Anshika Sharma", batch: "MBA", company: "ICICI Bank",         quote: "Value-centric education ingrained strong workplace ethics alongside technical skill." },
      { name: "Rohit Prajapati", batch: "CSE", company: "TCS",                quote: "TAP Cell and Alumni Cell support was instrumental in professional growth." },
      { name: "Tarini Shrivastava", batch: "CSE", company: "Hexaware",       quote: "ITM's journey was a transformation shaping personal and professional identity." },
    ],
  },
  {
    year: "2022",
    items: [
      { name: "Ashni Tiwari",        batch: "ECE", company: "Microsoft",     quote: "ITM fostered holistic development integrating academic excellence with morality." },
      { name: "Abhishek Singh Tomar", batch: "CSE", company: "Cognizant",    quote: "TAP Cell's training programs shaped my professional identity." },
      { name: "Mansi Gupta",          batch: "CSE", company: "Cognizant",    quote: "Alumni mentorship initiatives provided a platform for career advancement." },
      { name: "Keshav Sharma",        batch: "ME",  company: "Capgemini",    quote: "Programs focusing on personal integrity shaped personality and career." },
      { name: "Anmol Jain",            batch: "MBA", company: "Kurlon",       quote: "ITM nurtured intellect and character, creating principled professionals." },
    ],
  },
  {
    year: "2021",
    items: [
      { name: "Kritika Rupauliha", batch: "CSE", company: "Microsoft",        quote: "Value-driven framework instilled understanding of workplace ethics." },
      { name: "Harshit Vishwakarma", batch: "CSE", company: "Infosys",        quote: "Industry leaders' insights profoundly shaped my perspective on leadership." },
      { name: "Deepakshi Jain",      batch: "IT",  company: "Nagarro Software", quote: "Alumni Relations Cell provided invaluable mentorship and confidence." },
    ],
  },
  {
    year: "2020",
    items: [
      { name: "Akash Prajapati", batch: "Civil", company: "Wipro Technologies", quote: "ITM's vibrant campus life enhanced my skills for successful placement." },
      { name: "Neeraj Batra",    batch: "CSE",   company: "Infosys",            quote: "TAP Cell provided resources and mentorship shaping my professional skills." },
      { name: "Chandan Hayaran", batch: "IT",    company: "Capgemini",          quote: "Alumni Cell connected me with experienced professionals guiding my career." },
      { name: "Shrey Arora",     batch: "CSE",   company: "TCS",                quote: "TAP Cell's training refined my communication and analytical abilities." },
    ],
  },
];

export function AlumniSpeaksPage() {
  const { data: live } = useQuery({
    queryKey: ["public-alumni-speaks"],
    queryFn: publicComplianceApi.alumniSpeaks,
  });
  // Group live alumni by batch_year; if API returns nothing, fall back to bundled.
  const liveGroups = (() => {
    if (!live || !live.length) return null;
    const by = new Map();
    for (const a of live) {
      const year = String(a.batch_year || "Recent");
      if (!by.has(year)) by.set(year, []);
      by.get(year).push({
        name: a.name, batch: a.programme_code || "—",
        company: a.company || a.current_role || "",
        quote: a.quote || "",
      });
    }
    return [...by.entries()].sort((a, b) => b[0].localeCompare(a[0]))
      .map(([year, items]) => ({ year, items }));
  })();
  const groups = liveGroups || TESTIMONIALS;
  return (
    <PageShell
      eyebrow="Alumni Speaks"
      title="In their"
      accentTitle="own words."
      intro="Eighteen years of graduate voices from across batches, branches and companies. The recurring theme: TAP Cell mentorship and the values that hold up long after graduation."
      chips={["30K+ alumni", "Across 6 batches", "Microsoft · Infy · TCS · MS-equivalents"]}
    >
      {groups.map((batch) => (
        <section key={batch.year}>
          <SectionTitle eyebrow={`Class of ${batch.year}`} title={`Alumni Speaks · `} accent={batch.year} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {batch.items.map((t, i) => (
              <motion.div key={t.name + i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
                className="bg-white dark:bg-gray-900 rounded-3xl border border-rose-50 dark:border-gray-800 p-3 sm:p-6 hover:shadow-xl transition-shadow"
              >
                <Quote className="text-[#800000]/30 dark:text-amber-300/30 mb-2 sm:mb-3" size={28} />
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium italic mb-3 sm:mb-5 line-clamp-4 sm:line-clamp-none">"{t.quote}"</p>
                <div className="pt-3 sm:pt-4 border-t border-rose-50 dark:border-gray-800">
                  <div className="font-black text-base text-[#1a0606] dark:text-white">{t.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-0.5">
                    {t.batch} · {t.company}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      ))}

      <Card className="text-center bg-gradient-to-br from-[#fbf7f2] to-rose-50/40 dark:from-gray-900 dark:to-gray-900">
        <Sparkles className="mx-auto text-[#800000] dark:text-amber-300 mb-3" size={28} />
        <h3 className="text-xl sm:text-2xl font-black text-[#1a0606] dark:text-white mb-2">Share your story.</h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-4 sm:mb-5 max-w-lg mx-auto">
          We're always collecting alumni testimonials. Reach out to the Alumni Cell with your quote
          and we'll feature you in the next class chronicle.
        </p>
        <a href="mailto:alumni@itmgoi.in" className="inline-flex items-center gap-2 bg-[#800000] hover:bg-[#5c0202] text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl font-black text-[11px] tracking-widest uppercase">
          alumni@itmgoi.in
        </a>
      </Card>
    </PageShell>
  );
}

/* ============================================================
   MENTORSHIP
   ============================================================ */
export function MentorshipPage() {
  return (
    <PageShell
      eyebrow="Alumni Mentorship"
      title="Learn from those who"
      accentTitle="were exactly where you are."
      intro="The ITM Alumni Mentorship Program pairs current students with graduates working at top tech, finance and management companies. Career advice, interview prep, mock screens and a friendly second opinion when you need one."
      chips={["1:1 matching", "Six-month cycles", "Online + in-person"]}
    >
      <section className="grid lg:grid-cols-3 gap-3 sm:gap-5">
        <Card>
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-2xl bg-rose-500/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 flex items-center justify-center mb-3 sm:mb-4">
            <Users2 size={22} />
          </div>
          <h3 className="font-black text-lg text-[#1a0606] dark:text-white mb-2">Get matched</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">Tell us your goal — career switch, FAANG prep, founder track. We match you with an alumnus in that exact lane.</p>
        </Card>
        <Card>
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 flex items-center justify-center mb-3 sm:mb-4">
            <HeartHandshake size={22} />
          </div>
          <h3 className="font-black text-lg text-[#1a0606] dark:text-white mb-2">Meet regularly</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">Bi-monthly online calls or quarterly in-person meets at the chapter nearest your mentor.</p>
        </Card>
        <Card>
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 flex items-center justify-center mb-3 sm:mb-4">
            <Award size={22} />
          </div>
          <h3 className="font-black text-lg text-[#1a0606] dark:text-white mb-2">Graduate forward</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">After your first job, you sign up as a mentor — most ITM alumni do. The cycle closes itself.</p>
        </Card>
      </section>

      <Card className="bg-gradient-to-br from-[#1a0606] to-[#3e0202] text-white border-amber-300/30 text-center">
        <h3 className="text-xl sm:text-3xl font-black text-white mb-2">Apply for mentorship.</h3>
        <p className="text-xs sm:text-base text-rose-100/80 font-medium mb-4 sm:mb-5 max-w-lg mx-auto">Open to all current students. Three intakes per year — write to the Alumni Cell to be matched in the next cycle.</p>
        <a href="mailto:alumni@itmgoi.in" className="inline-flex items-center gap-2 bg-amber-300 hover:bg-amber-400 text-[#1a0606] px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl font-black text-[11px] tracking-widest uppercase">
          Email Alumni Cell <ArrowUpRight size={13} />
        </a>
      </Card>
    </PageShell>
  );
}

/* ============================================================
   LIFE MEMBERSHIP
   ============================================================ */
export function MembershipPage() {
  return (
    <PageShell
      eyebrow="Alumni Life Membership"
      title="Stay connected"
      accentTitle="for life."
      intro="A one-time membership that keeps you on the Alumni roster — invitations to meets, networking access, mentorship opportunities and a permanent place in the institute's events calendar."
    >
      <div className="grid md:grid-cols-2 gap-3 sm:gap-6">
        <Card>
          <Award className="text-[#800000] dark:text-amber-300 mb-3" size={28} />
          <h3 className="text-lg sm:text-xl font-black text-[#1a0606] dark:text-white mb-2 sm:mb-3">What you get</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium space-y-2">
            <li>· Lifetime membership card (digital + physical).</li>
            <li>· Invitations to every alumni meet across all 3 chapters.</li>
            <li>· Access to mentorship cycles (mentee + mentor sides).</li>
            <li>· Job/internship listings curated by the TAP Cell.</li>
            <li>· Discounts on FDP and conference registrations.</li>
            <li>· Voting rights for Alumni Association elections.</li>
          </ul>
        </Card>
        <Card>
          <Sparkles className="text-[#800000] dark:text-amber-300 mb-3" size={28} />
          <h3 className="text-lg sm:text-xl font-black text-[#1a0606] dark:text-white mb-2 sm:mb-3">How to join</h3>
          <Prose>
            <p>
              Open to anyone who completed any UG or PG programme at ITM Gwalior. Sign up via the
              Alumni Online Portal — your status is verified against the registrar's records,
              and your card ships within 30 days.
            </p>
          </Prose>
          <a href="https://www.itmalumni.in/" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 mt-4 bg-[#800000] hover:bg-[#5c0202] text-white px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase">
            Join via Alumni Portal <ExternalLink size={13} />
          </a>
        </Card>
      </div>
    </PageShell>
  );
}

/* ============================================================
   ALUMNI CHAPTERS
   ============================================================ */
const CHAPTERS = [
  { city: "Delhi NCR",  body: "Quarterly Sunday meets at rotating venues across Gurgaon, Noida and South Delhi. Networking dinner + a guest talk." },
  { city: "Bengaluru",  body: "Monthly evening meets in Indiranagar / Koramangala. Heavy startup and SaaS contingent." },
  { city: "Gwalior",    body: "On-campus alumni day every March — coincides with DiversITM and the Annual Foundation Day." },
];

export function ChaptersPage() {
  const { data: live } = useQuery({
    queryKey: ["public-alumni-chapters"],
    queryFn: publicComplianceApi.alumniChapters,
  });
  const chapters = (live && live.length
    ? live.map((c) => ({
        city: c.city,
        body: c.notes
          ? c.notes
          : `${c.coordinator ? `Coordinator: ${c.coordinator}. ` : ""}${c.members_count ? `${c.members_count}+ alumni.` : ""}${c.contact_email ? ` Reach ${c.contact_email}.` : ""}`.trim() || "Active chapter — reach out to the Alumni Cell for the next meet.",
      }))
    : CHAPTERS);
  return (
    <PageShell
      eyebrow="Alumni Chapters"
      title={`${chapters.length} cities.`}
      accentTitle="One ITM."
      intro="Active chapters across India — each with its own meeting cadence, organising committee and signature events."
      chips={[`${chapters.length} chapters`, "Quarterly + monthly meets", "Annual Gwalior day"]}
    >
      <div className="grid md:grid-cols-3 gap-3 sm:gap-5">
        {chapters.map((c) => (
          <Card key={c.city}>
            <MapPin className="text-[#800000] dark:text-amber-300 mb-3" size={24} />
            <h3 className="text-lg sm:text-xl font-black text-[#1a0606] dark:text-white mb-1.5 sm:mb-2">{c.city}</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{c.body}</p>
          </Card>
        ))}
      </div>
      <Card className="text-center">
        <h3 className="font-black text-xl text-[#1a0606] dark:text-white mb-1">Don't see your city?</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-4">Tell the Alumni Cell — if there are 20+ ITM alumni in your city, we'll help you charter a chapter.</p>
        <a href="mailto:alumni@itmgoi.in" className="inline-flex items-center gap-2 bg-[#800000] hover:bg-[#5c0202] text-white px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase">
          alumni@itmgoi.in
        </a>
      </Card>
    </PageShell>
  );
}
