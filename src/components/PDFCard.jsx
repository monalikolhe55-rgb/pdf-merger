import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { formatSize } from '../utils/pdfUtils'

/**
 * Card for one uploaded PDF.
 * Shows: filename, size, page count, page-range input, remove button.
 * Drag handle for reordering — uses HTML5 drag events passed up via callbacks.
 */
export default function PDFCard({
  pdf,
  index,
  total,
  darkMode,
  onRemove,
  onRangeChange,
  onDragStart,
  onDragOver,
  onDrop,
  isDraggingOver,
}) {
  const [focused, setFocused] = useState(false)
  const dragRef = useRef(null)

  // Selected page count display
  const selectedPages = (() => {
    if (!pdf.pageRange.trim()) return pdf.pageCount
    if (pdf.rangeError) return '?'
    let count = 0
    const parts = pdf.pageRange.split(',').filter(Boolean)
    for (const p of parts) {
      if (p.includes('-')) {
        const [a, b] = p.split('-').map(Number)
        if (!isNaN(a) && !isNaN(b) && a <= b) count += b - a + 1
      } else {
        if (!isNaN(Number(p))) count++
      }
    }
    return count
  })()

  const badgeColors = [
    'bg-orange-500', 'bg-pink-500', 'bg-violet-500',
    'bg-cyan-500', 'bg-emerald-500', 'bg-yellow-500'
  ]
  const badgeColor = badgeColors[index % badgeColors.length]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      ref={dragRef}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => { e.preventDefault(); onDragOver(index) }}
      onDrop={() => onDrop(index)}
      className={`
        rounded-2xl p-4 sm:p-5 transition-all duration-200
        ${isDraggingOver ? 'ring-2 ring-accent scale-[1.01]' : ''}
        ${darkMode
          ? 'bg-white/6 border border-white/10 hover:border-white/20'
          : 'bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-accent/20'
        }
      `}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Drag handle */}
        <div
          className={`drag-handle flex-shrink-0 mt-1 transition-colors ${
            darkMode ? 'text-white/30 hover:text-white/70' : 'text-gray-300 hover:text-gray-500'
          }`}
          title="Drag to reorder"
        >
          <svg viewBox="0 0 16 24" fill="currentColor" className="w-3.5 h-5">
            <circle cx="5" cy="5" r="1.5" />
            <circle cx="11" cy="5" r="1.5" />
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="11" cy="12" r="1.5" />
            <circle cx="5" cy="19" r="1.5" />
            <circle cx="11" cy="19" r="1.5" />
          </svg>
        </div>

        {/* Index badge */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${badgeColor} flex items-center justify-center text-white font-display font-bold text-sm shadow-lg`}>
          {index + 1}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Filename + remove */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p
                className={`font-display font-semibold text-sm leading-tight truncate ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
                title={pdf.file.name}
              >
                {pdf.file.name}
              </p>

              {/* Meta row: size · pages · selected badge */}
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1.5">
                <span className={`text-xs font-body ${darkMode ? 'text-white/55' : 'text-gray-400'}`}>
                  {formatSize(pdf.file.size)}
                </span>
                <span className={`text-xs ${darkMode ? 'text-white/25' : 'text-gray-300'}`}>·</span>
                <span className={`text-xs font-body ${darkMode ? 'text-white/55' : 'text-gray-400'}`}>
                  {pdf.pageCount} page{pdf.pageCount !== 1 ? 's' : ''}
                </span>

                {/* Selected pages pill — always visible when range set */}
                {pdf.pageRange.trim() && !pdf.rangeError && (
                  <span className={`
                    inline-flex items-center gap-1 text-xs font-body font-semibold
                    px-2 py-0.5 rounded-full
                    ${darkMode
                      ? 'bg-accent/25 text-orange-300 border border-accent/30'
                      : 'bg-accent/10 text-accent-dark border border-accent/20'
                    }
                  `}>
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {selectedPages} selected
                  </span>
                )}
              </div>
            </div>

            {/* Remove button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(pdf.id)}
              className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                darkMode
                  ? 'text-white/30 hover:text-red-400 hover:bg-red-500/15'
                  : 'text-gray-300 hover:text-red-500 hover:bg-red-50'
              }`}
              aria-label={`Remove ${pdf.file.name}`}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth={2.5}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </motion.button>
          </div>

          {/* Page range input */}
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <label className={`text-xs font-body font-medium flex-shrink-0 ${
                darkMode ? 'text-white/50' : 'text-gray-400'
              }`}>
                Pages:
              </label>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={`1-${pdf.pageCount} (all)`}
                  value={pdf.pageRange}
                  onChange={(e) => onRangeChange(pdf.id, e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className={`
                    range-input w-full text-xs px-3 py-1.5 rounded-lg transition-all duration-150
                    placeholder:opacity-40 font-mono
                    ${focused ? 'ring-1 ring-accent' : ''}
                    ${pdf.rangeError ? 'ring-1 ring-red-400' : ''}
                    ${darkMode
                      ? 'bg-white/10 text-white border border-white/15 focus:border-accent/50 placeholder:text-white/40'
                      : 'bg-gray-50 text-gray-900 border border-gray-200 focus:border-accent/60'
                    }
                  `}
                />
              </div>
            </div>

            {/* Range error */}
            {pdf.rangeError && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-400 text-xs mt-1 ml-12 font-body"
              >
                ⚠ {pdf.rangeError}
              </motion.p>
            )}

            {/* Range hint on focus */}
            {!pdf.rangeError && focused && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-xs mt-1 ml-12 font-body ${darkMode ? 'text-white/35' : 'text-gray-300'}`}
              >
                e.g. 1-3,5,8-10 · empty = all pages
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
