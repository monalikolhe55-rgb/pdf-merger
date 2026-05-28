import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Drag-and-drop upload zone.
 * Accepts only PDF files and calls onFiles with File[].
 */
export default function DropZone({ onFiles, darkMode, compact = false }) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    onDrop: (accepted) => {
      if (accepted.length > 0) onFiles(accepted)
    },
    multiple: true,
  })

  return (
    <motion.div
      {...getRootProps()}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.998 }}
      className={`
        relative cursor-pointer rounded-2xl transition-all duration-200 select-none
        ${compact ? 'p-5' : 'p-10 sm:p-14'}
        ${darkMode
          ? isDragActive
            ? 'bg-accent/10 border-2 border-accent border-dashed'
            : isDragReject
              ? 'bg-red-500/10 border-2 border-red-500 border-dashed'
              : 'bg-white/4 border-2 border-white/10 border-dashed hover:border-accent/40 hover:bg-white/6'
          : isDragActive
            ? 'bg-accent/8 border-2 border-accent border-dashed'
            : isDragReject
              ? 'bg-red-100 border-2 border-red-400 border-dashed'
              : 'bg-white/70 border-2 border-gray-200 border-dashed hover:border-accent/50 hover:bg-white/80 shadow-sm'
        }
      `}
    >
      <input {...getInputProps()} />

      <AnimatePresence mode="wait">
        {isDragActive ? (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 text-accent"
          >
            <div className="text-4xl">📄</div>
            <p className="font-display font-semibold text-lg">Drop PDFs here!</p>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex flex-col items-center gap-3 text-center ${
              darkMode ? 'text-white/40' : 'text-gray-400'
            }`}
          >
            {/* Upload icon */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-1 ${
              darkMode ? 'bg-white/8' : 'bg-gray-100'
            }`}>
              <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
            </div>

            {compact ? (
              <p className={`font-body text-sm font-medium ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                Click or drop more PDFs
              </p>
            ) : (
              <>
                <p className={`font-display font-semibold text-xl ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                  Drop PDF files here
                </p>
                <p className="font-body text-sm">
                  or <span className="text-accent font-medium">click to browse</span> — multiple PDFs welcome
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-white/25' : 'text-gray-300'}`}>
                  Supports any PDF · Processed locally in your browser
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
