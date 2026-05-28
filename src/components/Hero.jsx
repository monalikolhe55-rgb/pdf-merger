import { motion } from 'framer-motion'

/**
 * Hero section — headline, subtext, floating decorative elements.
 */
export default function Hero({ darkMode }) {
  return (
    <section className="pt-32 pb-10 px-6 text-center relative overflow-hidden">
      {/* Decorative floating orbs */}
      <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-accent/10 blur-3xl pointer-events-none animate-float" />
      <div className="absolute top-40 right-[8%] w-48 h-48 rounded-full bg-accent/6 blur-2xl pointer-events-none" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="relative z-10 max-w-3xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-body font-medium mb-6 ${
            darkMode
              ? 'bg-accent/10 text-accent border border-accent/20'
              : 'bg-accent/10 text-accent-dark border border-accent/20'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
          Free · Private · No server uploads
        </motion.div>

        {/* Headline */}
        <h1 className={`font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-5 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Merge PDFs{' '}
          <span className="relative inline-block">
            <span className="relative z-10 text-accent">precisely.</span>
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 200 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 8 C50 2, 150 2, 198 8"
                stroke="#FF6B35"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
              />
            </svg>
          </span>
        </h1>

        {/* Subtext */}
        <p className={`text-lg sm:text-xl font-body font-light max-w-xl mx-auto leading-relaxed ${
          darkMode ? 'text-white/50' : 'text-gray-500'
        }`}>
          Upload PDFs, pick your pages, drag to reorder — merge in seconds.
          Everything runs locally in your browser.
        </p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-8 mt-8"
        >
          {[
            { label: 'Page Range Support', icon: '⚡' },
            { label: 'Drag & Drop Order', icon: '↕' },
            { label: 'Instant Download', icon: '↓' },
          ].map(item => (
            <div key={item.label} className={`flex flex-col items-center gap-1 text-center ${
              darkMode ? 'text-white/40' : 'text-gray-400'
            }`}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-body hidden sm:block">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
