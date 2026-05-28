import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PDFCard from './PDFCard'

/**
 * Renders the list of PDF cards.
 * Manages drag-over state and delegates reorder up to parent.
 */
export default function PDFList({ pdfs, darkMode, onRemove, onRangeChange, onReorder }) {
  const [draggingFrom, setDraggingFrom] = useState(null)
  const [draggingOver, setDraggingOver] = useState(null)

  function handleDragStart(index) {
    setDraggingFrom(index)
  }

  function handleDragOver(index) {
    if (index !== draggingFrom) setDraggingOver(index)
  }

  function handleDrop(index) {
    if (draggingFrom !== null && draggingFrom !== index) {
      onReorder(draggingFrom, index)
    }
    setDraggingFrom(null)
    setDraggingOver(null)
  }

  if (pdfs.length === 0) return null

  return (
    <div className="space-y-3">
      {/* List header */}
      <div className="flex items-center justify-between px-1">
        <h2 className={`font-display font-semibold text-sm ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
          {pdfs.length} PDF{pdfs.length !== 1 ? 's' : ''} queued
        </h2>
        <span className={`text-xs font-body ${darkMode ? 'text-white/25' : 'text-gray-300'}`}>
          Drag ⠿ to reorder
        </span>
      </div>

      <AnimatePresence>
        {pdfs.map((pdf, index) => (
          <PDFCard
            key={pdf.id}
            pdf={pdf}
            index={index}
            total={pdfs.length}
            darkMode={darkMode}
            onRemove={onRemove}
            onRangeChange={onRangeChange}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isDraggingOver={draggingOver === index}
          />
        ))}
      </AnimatePresence>

      {/* Drop indicator at bottom when dragging */}
      {draggingFrom !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`h-1 rounded-full mx-4 ${darkMode ? 'bg-accent/20' : 'bg-accent/15'}`}
        />
      )}
    </div>
  )
}
