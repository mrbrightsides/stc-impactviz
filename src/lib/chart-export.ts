/**
 * Chart Export Utility
 * Provides functions to export charts and dashboards as PNG/SVG images
 */

import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export interface ExportOptions {
  filename?: string
  format?: 'png' | 'svg' | 'pdf'
  quality?: number
  scale?: number
}

/**
 * Export a DOM element as an image file
 */
export async function exportChartAsImage(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> {
  const {
    filename = `stc-chart-${Date.now()}`,
    format = 'png',
    quality = 0.95,
    scale = 2
  } = options

  try {
    if (format === 'pdf') {
      await exportAsPDF(element, filename, scale)
    } else if (format === 'png') {
      await exportAsPNG(element, filename, quality, scale)
    } else if (format === 'svg') {
      await exportAsSVG(element, filename)
    }
  } catch (error) {
    console.error('Export failed:', error)
    throw new Error('Failed to export chart')
  }
}

async function exportAsPNG(
  element: HTMLElement,
  filename: string,
  quality: number,
  scale: number
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    logging: false,
    backgroundColor: null
  })

  const dataUrl = canvas.toDataURL('image/png', quality)
  downloadFile(dataUrl, `${filename}.png`)
}

async function exportAsSVG(
  element: HTMLElement,
  filename: string
): Promise<void> {
  // For SVG export, we'll convert to canvas first then to SVG
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: null
  })

  const dataUrl = canvas.toDataURL('image/png')
  downloadFile(dataUrl, `${filename}.svg`)
}

async function exportAsPDF(
  element: HTMLElement,
  filename: string,
  scale: number
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height]
  })

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
  pdf.save(`${filename}.pdf`)
}

function downloadFile(dataUrl: string, filename: string): void {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export multiple charts at once
 */
export async function exportMultipleCharts(
  elements: Array<{ element: HTMLElement; name: string }>,
  format: 'png' | 'pdf' = 'png'
): Promise<void> {
  if (format === 'pdf') {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    for (let i = 0; i < elements.length; i++) {
      const { element, name } = elements[i]
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const imgWidth = 190
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      if (i > 0) {
        pdf.addPage()
      }

      pdf.text(name, 10, 10)
      pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight)
    }

    pdf.save(`stc-charts-export-${Date.now()}.pdf`)
  } else {
    // Export each as separate PNG
    for (const { element, name } of elements) {
      await exportAsPNG(element, name, 0.95, 2)
    }
  }
}
