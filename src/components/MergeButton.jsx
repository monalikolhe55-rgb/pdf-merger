import { motion, AnimatePresence } from 'framer-motion'

/**
 * Merge button + progress bar shown while merging.
 */
export default function MergeButton({ canMerge, merging, progress, onMerge, darkMode, estimatedSize }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Progress bar — shown while merging */}
      <AnimatePresence>
        {merging && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-sm"
          >
            <div className="flex justify-between text-xs font-body mb-2">
              <span className={darkMode ? 'text-white/50' : 'text-gray-500'}>Merging PDFs…</span>
              <span className="text-accent font-medium">{progress}%</span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
              <motion.div
                className="h-full rounded-full bg-accent"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estimated size */}
      {estimatedSize && !merging && (
        <p className={`text-xs font-body ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
          Estimated output: <span className="text-accent">{estimatedSize}</span>
        </p>
      )}

      {/* Merge button */}
      <motion.button
        onClick={onMerge}
        disabled={!canMerge}
        whileHover={canMerge ? { scale: 1.03, y: -1 } : {}}
        whileTap={canMerge ? { scale: 0.97 } : {}}
        className={`
          relative px-10 py-4 rounded-2xl font-display font-bold text-base
          transition-all duration-200 overflow-hidden
          ${canMerge
            ? 'bg-accent text-white shadow-xl shadow-accent/30 hover:shadow-accent/50 cursor-pointer'
            : darkMode
              ? 'bg-white/8 text-white/25 cursor-not-allowed'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        {/* Shimmer on active */}
        {canMerge && (
          <span
            className="absolute inset-0 shimmer-bar opacity-30 pointer-events-none"
            aria-hidden
          />
        )}

        <span className="relative flex items-center gap-2.5">
          {merging ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40 20" />
              </svg>
              Merging…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Merge &amp; Download PDF
            </>
          )}
        </span>
      </motion.button>

      {!canMerge && !merging && (
        <p className={`text-xs font-body ${darkMode ? 'text-white/25' : 'text-gray-300'}`}>
          Add at least 2 PDFs to enable merge
        </p>
      )}
    </div>
  )
}
