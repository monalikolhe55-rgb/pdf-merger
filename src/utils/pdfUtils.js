import { PDFDocument } from 'pdf-lib'

/**
 * Read PDF file as ArrayBuffer and return page count + document
 */
export async function loadPDF(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
  return {
    arrayBuffer,
    pageCount: pdfDoc.getPageCount(),
  }
}

/**
 * Parse a page range string like "1-3,5,7-9" into array of 0-based indices.
 * Returns null if invalid.
 * @param {string} rangeStr - e.g. "1-3,5"
 * @param {number} totalPages - max page count for validation
 */
export function parsePageRange(rangeStr, totalPages) {
  if (!rangeStr || rangeStr.trim() === '') {
    // Default: all pages
    return Array.from({ length: totalPages }, (_, i) => i)
  }

  const parts = rangeStr.split(',').map(s => s.trim()).filter(Boolean)
  const pages = []

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map(s => s.trim())
      const start = parseInt(startStr, 10)
      const end = parseInt(endStr, 10)

      if (isNaN(start) || isNaN(end)) return null
      if (start < 1 || end > totalPages || start > end) return null

      for (let i = start; i <= end; i++) {
        pages.push(i - 1) // Convert to 0-based
      }
    } else {
      const page = parseInt(part, 10)
      if (isNaN(page)) return null
      if (page < 1 || page > totalPages) return null
      pages.push(page - 1) // Convert to 0-based
    }
  }

  // Remove duplicates, keep order
  return [...new Set(pages)]
}

/**
 * Validate page range string — returns error message or null if valid
 */
export function validatePageRange(rangeStr, totalPages) {
  if (!rangeStr || rangeStr.trim() === '') return null // empty = all pages, valid

  const parts = rangeStr.split(',').map(s => s.trim()).filter(Boolean)

  for (const part of parts) {
    if (part.includes('-')) {
      const segments = part.split('-')
      if (segments.length !== 2) return `Invalid range: "${part}"`

      const [startStr, endStr] = segments.map(s => s.trim())
      const start = parseInt(startStr, 10)
      const end = parseInt(endStr, 10)

      if (isNaN(start) || isNaN(end)) return `Non-numeric value in "${part}"`
      if (start < 1) return `Page numbers start at 1`
      if (end > totalPages) return `PDF only has ${totalPages} page${totalPages > 1 ? 's' : ''}`
      if (start > end) return `Start must be ≤ end in "${part}"`
    } else {
      const page = parseInt(part, 10)
      if (isNaN(page)) return `"${part}" is not a valid page number`
      if (page < 1) return `Page numbers start at 1`
      if (page > totalPages) return `PDF only has ${totalPages} page${totalPages > 1 ? 's' : ''}`
    }
  }

  return null // valid
}

/**
 * Merge selected pages from multiple PDFs into one.
 * @param {Array<{arrayBuffer: ArrayBuffer, pages: number[]}>} items
 * @param {function} onProgress - called with 0-100
 * @returns {Uint8Array} merged PDF bytes
 */
export async function mergePDFs(items, onProgress) {
  const merged = await PDFDocument.create()

  let totalPages = items.reduce((sum, item) => sum + item.pages.length, 0)
  let processedPages = 0

  for (let i = 0; i < items.length; i++) {
    const { arrayBuffer, pages } = items[i]

    // Load source PDF
    const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })

    // Copy selected pages (pdf-lib uses 0-based indices here too)
    const copiedPages = await merged.copyPages(srcDoc, pages)

    for (const page of copiedPages) {
      merged.addPage(page)
      processedPages++
      onProgress(Math.round((processedPages / totalPages) * 90))
    }
  }

  onProgress(95)

  // Serialize to bytes
  const bytes = await merged.save()

  onProgress(100)

  return bytes
}

/**
 * Estimate size of merged PDF in human-readable form.
 * Rough estimate: sum of (file_size * fraction_of_pages_selected)
 */
export function estimateMergedSize(files) {
  let totalBytes = 0

  for (const f of files) {
    const fraction = f.selectedPageCount / f.pageCount
    totalBytes += f.file.size * fraction
  }

  if (totalBytes < 1024) return `~${totalBytes.toFixed(0)} B`
  if (totalBytes < 1024 * 1024) return `~${(totalBytes / 1024).toFixed(1)} KB`
  return `~${(totalBytes / (1024 * 1024)).toFixed(2)} MB`
}

/**
 * Trigger browser download of bytes as filename
 */
export function downloadBytes(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Format file size nicely
 */
export function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
