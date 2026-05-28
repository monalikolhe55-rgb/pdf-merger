import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import DropZone from './components/DropZone'
import PDFList from './components/PDFList'
import MergeButton from './components/MergeButton'
import { usePDFMerger } from './hooks/usePDFMerger'
import { estimateMergedSize, parsePageRange } from './utils/pdfUtils'

export default function App() {
  const [darkMode, setDarkMode] = useState(true)

  const {
    pdfs,
    merging,
    progress,
    addFiles,
    removePDF,
    updatePageRange,
    reorder,
    getSelectedPages,
    merge,
    canMerge,
  } = usePDFMerger()

  // Build size estimate from current selections
  const sizeEstimate = pdfs.length >= 2
    ? estimateMergedSize(
        pdfs.map(p => ({
          file: p.file,
          pageCount: p.pageCount,
          selectedPageCount: (() => {
            const parsed = parsePageRange(p.pageRange, p.pageCount)
            return parsed ? parsed.length : p.pageCount
          })(),
        }))
      )
    : null

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className={`min-h-screen relative ${darkMode ? 'mesh-bg text-white' : 'mesh-bg-light text-gray-900'}`}>
        {/* Noise texture overlay */}
        <div className="noise" aria-hidden />

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: darkMode
              ? {
                  background: '#1A1A22',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '14px',
                }
              : {
                  background: '#fff',
                  color: '#111',
                  border: '1px solid rgba(0,0,0,0.06)',
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '14px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                },
            success: { iconTheme: { primary: '#FF6B35', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />

        {/* Navbar */}
        <Navbar darkMode={darkMode} toggleDark={() => setDarkMode(d => !d)} />

        {/* Page content */}
        <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pb-24">
          {/* Hero */}
          <Hero darkMode={darkMode} />

          {/* Main card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            className={`rounded-3xl p-6 sm:p-8 ${
              darkMode ? 'glass' : 'glass-light shadow-xl shadow-black/5'
            }`}
          >
            {/* Upload area */}
            <AnimatePresence mode="wait">
              {pdfs.length === 0 ? (
                <motion.div key="empty" exit={{ opacity: 0, y: -10 }}>
                  <DropZone onFiles={addFiles} darkMode={darkMode} />
                </motion.div>
              ) : (
                <motion.div
                  key="has-files"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* PDF list */}
                  <PDFList
                    pdfs={pdfs}
                    darkMode={darkMode}
                    onRemove={removePDF}
                    onRangeChange={updatePageRange}
                    onReorder={reorder}
                  />

                  {/* Add more button */}
                  <DropZone onFiles={addFiles} darkMode={darkMode} compact />

                  {/* Divider */}
                  <div className={`h-px ${darkMode ? 'bg-white/6' : 'bg-gray-100'}`} />

                  {/* Merge controls */}
                  <MergeButton
                    canMerge={canMerge}
                    merging={merging}
                    progress={progress}
                    onMerge={merge}
                    darkMode={darkMode}
                    estimatedSize={sizeEstimate}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 grid grid-cols-3 gap-4 text-center"
          >
            {[
              { step: '01', title: 'Upload', desc: 'Drop 2+ PDFs', icon: '⬆' },
              { step: '02', title: 'Customize', desc: 'Set pages & order', icon: '✏' },
              { step: '03', title: 'Download', desc: 'Merged instantly', icon: '⬇' },
            ].map(item => (
              <div
                key={item.step}
                className={`rounded-2xl p-4 ${
                  darkMode ? 'bg-white/3 border border-white/6' : 'bg-white/60 border border-gray-100'
                }`}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-accent font-mono text-xs font-medium mb-1">{item.step}</div>
                <div className={`font-display font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.title}
                </div>
                <div className={`text-xs font-body mt-0.5 ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
                  {item.desc}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={`text-center text-xs font-body mt-8 ${darkMode ? 'text-white/20' : 'text-gray-300'}`}
          >
            Built with pdf-lib · All processing happens in your browser · No files sent to any server
          </motion.p>
        </main>
      </div>
    </div>
  )
}
