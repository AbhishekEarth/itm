import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Calendar, ExternalLink, X, ArrowLeft, Sparkles } from "lucide-react";
import { usePublicWhatsNew } from "../hooks/usePublicEvents";

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function Lightbox({ item, onClose }) {
  if (!item) return null;
  const src = item.resolved_image_url || item.image_url;
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div onClick={(e) => e.stopPropagation()} className="relative max-w-5xl w-full">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white text-[#3e0202] flex items-center justify-center shadow-2xl hover:scale-110 transition"
        >
          <X size={18} />
        </button>
        {src && (
          <img
            src={src}
            alt={item.title}
            className="w-full max-h-[80vh] object-contain rounded-2xl bg-black"
          />
        )}
        <div className="mt-3 text-white">
          <h3 className="text-lg font-black tracking-tight">{item.title}</h3>
          {item.event_date && (
            <p className="text-xs text-amber-300 font-bold uppercase tracking-widest mt-1">
              {formatDate(item.event_date)}
            </p>
          )}
          {item.caption && (
            <p className="text-sm text-gray-200 mt-2 leading-relaxed">{item.caption}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ item, onOpen }) {
  const src = item.resolved_image_url || item.image_url;
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-rose-50 dark:border-gray-800 shadow-sm hover:shadow-2xl overflow-hidden transition-shadow"
    >
      {item.is_featured && (
        <span className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-300 to-amber-400 text-[#3e0202] text-[9px] font-black uppercase tracking-widest shadow-md">
          <Sparkles size={10} /> Featured
        </span>
      )}

      <button
        type="button"
        onClick={() => onOpen(item)}
        className="block w-full aspect-[4/3] bg-gray-100 dark:bg-gray-800 overflow-hidden"
        aria-label={`View ${item.title}`}
      >
        {src ? (
          <img
            src={src}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Bell size={28} />
          </div>
        )}
      </button>

      <div className="p-4 sm:p-5 flex flex-col gap-2 flex-1">
        {item.event_date && (
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#800000]">
            <Calendar size={11} />
            {formatDate(item.event_date)}
          </div>
        )}
        <h3 className="text-sm sm:text-base font-black text-[#1a0606] dark:text-white tracking-tight leading-snug">
          {item.title}
        </h3>
        {item.caption && (
          <p className="text-xs sm:text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
            {item.caption}
          </p>
        )}
        {item.link_url && (
          <a
            href={item.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#800000] hover:text-[#5a0000] transition"
          >
            Read more <ExternalLink size={11} />
          </a>
        )}
      </div>
    </motion.article>
  );
}

export default function WhatsNew() {
  const { data: items = [], isLoading, isError } = usePublicWhatsNew();
  const [active, setActive] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbf7f2] via-white to-white dark:from-[#0a0a14] dark:to-[#020617]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1a0606] via-[#3e0202] to-[#800000] text-white py-12 sm:py-16 px-4 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative max-w-6xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-rose-200/70 hover:text-rose-100 text-xs font-bold uppercase tracking-widest transition"
          >
            <ArrowLeft size={12} /> Back to home
          </Link>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-[10px] font-black uppercase tracking-[0.25em] mb-3">
            <Bell size={11} /> Latest
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.02em] leading-[1.05]">
            What&apos;s New at <span className="bg-gradient-to-br from-amber-200 to-amber-400 bg-clip-text text-transparent">ITM Gwalior</span>
          </h1>
          <p className="text-rose-200/80 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            Events, achievements and announcements straight from campus. Tap any photo to view it full-size.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-16 text-gray-500 text-sm">
            Couldn&apos;t load the latest updates. Please refresh and try again.
          </div>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <div className="text-center py-16">
            <Bell size={36} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm font-medium">
              No updates yet. Check back soon.
            </p>
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <Card key={item.id} item={item} onOpen={setActive} />
            ))}
          </div>
        )}
      </section>

      <Lightbox item={active} onClose={() => setActive(null)} />
    </div>
  );
}
