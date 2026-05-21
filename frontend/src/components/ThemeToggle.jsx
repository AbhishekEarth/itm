import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { dark, toggle } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800000] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 ${
        dark ? "bg-slate-800 border-slate-600" : "bg-slate-200 border-slate-300"
      } ${className}`}
    >
      <motion.span
        animate={{ x: dark ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`flex h-5 w-5 items-center justify-center rounded-full shadow-sm ${
          dark ? "bg-slate-700" : "bg-white"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={dark ? "moon" : "sun"}
            initial={{ opacity: 0, rotate: dark ? -45 : 45, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: dark ? 45 : -45, scale: 0.6 }}
            transition={{ duration: 0.12 }}
            className="flex items-center justify-center"
          >
            {dark
              ? <Moon size={11} strokeWidth={2} className="text-amber-400" />
              : <Sun size={11} strokeWidth={2} className="text-slate-500" />
            }
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </button>
  );
}
