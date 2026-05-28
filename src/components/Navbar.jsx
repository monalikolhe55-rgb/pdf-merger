import { motion } from 'framer-motion'

/**
 * Top navigation bar with logo and dark/light mode toggle.
 */
export default function Navbar({ darkMode, toggleDark }) {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between ${
        darkMode
          ? 'bg-[#0F0F13]/80 border-b border-white/5'
          : 'bg-white/60 border-b border-black/5'
      } backdrop-blur-xl`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth={2.5}>
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span className={`font-display font-bold text-lg tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Merge<span className="text-accent">PDF</span>
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        <span className={`hidden sm:block text-sm font-body ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
          100% client-side · no uploads
        </span>

        {/* Dark/light toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDark}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            darkMode
              ? 'bg-white/10 hover:bg-white/15 text-white'
              : 'bg-black/5 hover:bg-black/10 text-gray-700'
          }`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
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
