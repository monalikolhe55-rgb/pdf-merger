import { motion } from 'framer-motion'

/**
 * Top navigation bar.
 * Contains: logo, credit (name + email), "Built for Digital Heroes" link, dark/light toggle.
 */
export default function Navbar({ darkMode, toggleDark }) {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 ${
        darkMode
          ? 'bg-[#0F0F13]/80 border-b border-white/5'
          : 'bg-white/60 border-b border-black/5'
      } backdrop-blur-xl`}
    >
      {/* LEFT — Logo */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth={2.5}>
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span className={`font-display font-bold text-lg tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Merge<span className="text-accent">PDF</span>
        </span>
      </div>

      {/* CENTER — Name + email (hidden on very small screens) */}
      <div className="hidden sm:flex flex-col items-center leading-tight">
        <span className={`text-xs font-display font-semibold ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
          Monali Dilip Kolhe
        </span>
        <a
          href="mailto:monalikolhe55@gmail.com"
          className={`text-[10px] font-body transition-colors ${
            darkMode
              ? 'text-white/40 hover:text-accent'
              : 'text-gray-400 hover:text-accent-dark'
          }`}
        >
          monalikolhe55@gmail.com
        </a>
      </div>

      {/* RIGHT — Built for Digital Heroes + dark toggle */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {/* "Built for Digital Heroes" button */}
        <motion.a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className={`
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-body font-semibold
            transition-colors duration-150
            ${darkMode
              ? 'bg-accent/15 text-orange-300 border border-accent/25 hover:bg-accent/25'
              : 'bg-accent/10 text-accent-dark border border-accent/20 hover:bg-accent/20'
            }
          `}
        >
          {/* Lightning bolt icon */}
          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          Built for Digital Heroes
        </motion.a>

        {/* Dark/light toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDark}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            darkMode
              ? 'bg-white/10 hover:bg-white/15 text-white'
              : 'bg-black/5 hover:bg-black/10 text-gray-700'
          }`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
        </motion.button>
      </div>
    </motion.nav>
  )
}
