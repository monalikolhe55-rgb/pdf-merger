import { useState, useCallback } from 'react'
import { loadPDF, mergePDFs, parsePageRange, downloadBytes } from '../utils/pdfUtils'
import toast from 'react-hot-toast'

/**
 * Core hook managing PDF list, validation, drag-reorder, and merge logic.
 */
export function usePDFMerger() {
  const [pdfs, setPdfs] = useState([]) // Array of PDF entry objects
  const [merging, setMerging] = useState(false)
  const [progress, setProgress] = useState(0)

  // Add PDFs from File[] — loads page counts
  const addFiles = useCallback(async (files) => {
    const validFiles = files.filter(f => {
      if (f.type !== 'application/pdf') {
        toast.error(`"${f.name}" is not a PDF`)
        return false
      }
      return true
    })

    if (!validFiles.length) return

    const loadPromises = validFiles.map(async (file) => {
      try {
        const { arrayBuffer, pageCount } = await loadPDF(file)
        return {
          id: crypto.randomUUID(),
          file,
          arrayBuffer,
          pageCount,
          pageRange: '',      // Empty = all pages
          rangeError: null,
        }
      } catch (err) {
        toast.error(`Failed to read "${file.name}": ${err.message}`)
        return null
      }
    })

    const loaded = (await Promise.all(loadPromises)).filter(Boolean)

    if (loaded.length > 0) {
      setPdfs(prev => [...prev, ...loaded])
      toast.success(`Added ${loaded.length} PDF${loaded.length > 1 ? 's' : ''}`)
    }
  }, [])

  // Remove a PDF by id
  const removePDF = useCallback((id) => {
    setPdfs(prev => prev.filter(p => p.id !== id))
  }, [])

  // Update page range string for a PDF
  const updatePageRange = useCallback((id, rangeStr) => {
    setPdfs(prev => prev.map(p => {
      if (p.id !== id) return p
      // Validate inline
      let rangeError = null
      if (rangeStr.trim()) {
        const parts = rangeStr.split(',').map(s => s.trim()).filter(Boolean)
        for (const part of parts) {
          if (part.includes('-')) {
            const segs = part.split('-')
            if (segs.length !== 2) { rangeError = `Invalid range "${part}"`; break }
            const [a, b] = segs.map(Number)
            if (isNaN(a) || isNaN(b)) { rangeError = `Non-numeric in "${part}"`; break }
            if (a < 1 || b > p.pageCount || a > b) {
              rangeError = a > b
                ? `Start > end in "${part}"`
                : `Out of range (1–${p.pageCount})`
              break
            }
          } else {
            const n = Number(part)
            if (isNaN(n) || n < 1 || n > p.pageCount) {
              rangeError = `"${part}" out of range (1–${p.pageCount})`
              break
            }
          }
        }
      }
      return { ...p, pageRange: rangeStr, rangeError }
    }))
  }, [])

  // Reorder via drag-drop swap
  const reorder = useCallback((fromIndex, toIndex) => {
    setPdfs(prev => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }, [])

  // Get selected page count for a pdf entry
  const getSelectedPages = useCallback((pdf) => {
    const parsed = parsePageRange(pdf.pageRange, pdf.pageCount)
    return parsed ? parsed.length : pdf.pageCount
  }, [])

  // Merge all PDFs
  const merge = useCallback(async () => {
    if (pdfs.length < 2) {
      toast.error('Add at least 2 PDFs to merge')
      return
    }

    // Validate all ranges
    for (const pdf of pdfs) {
      if (pdf.rangeError) {
        toast.error(`Fix page range error in "${pdf.file.name}"`)
        return
      }
    }

    setMerging(true)
    setProgress(0)

    try {
      const items = pdfs.map(pdf => ({
        arrayBuffer: pdf.arrayBuffer,
        pages: parsePageRange(pdf.pageRange, pdf.pageCount),
      }))

      const bytes = await mergePDFs(items, setProgress)

      // Build filename
      const timestamp = new Date().toISOString().slice(0, 10)
      downloadBytes(bytes, `merged-${timestamp}.pdf`)

      toast.success(`Merged successfully! (${(bytes.length / 1024).toFixed(0)} KB)`)
    } catch (err) {
      console.error(err)
      toast.error(`Merge failed: ${err.message}`)
    } finally {
      setMerging(false)
      setProgress(0)
    }
  }, [pdfs])

  const canMerge = pdfs.length >= 2 && !merging && pdfs.every(p => !p.rangeError)

  return {
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
  }
}
