import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export const parseDownload = <T extends BlobPart>(
  data: T,
  fileNameWithFormat?: string
) => {
  const link = document.createElement('a')

  // Tell the browser to associate the response data to
  // the URL of the link we created above.
  link.href = window.URL.createObjectURL(new Blob([data]))

  // Tell the browser to download, not render, the file.
  link.setAttribute('download', fileNameWithFormat ?? 'report.xlsx')

  // Place the link in the DOM.
  document.body.appendChild(link)

  // Make the magic happen!
  link.click()
}

export async function exportElement(
  elementIds: string | string[],
  type: string,
  fileName: string = 'export',
  isRemoveHeight: boolean = false
): Promise<void> {
  // Convert to array if single string
  const ids = Array.isArray(elementIds) ? elementIds : [elementIds]

  // Get all elements
  const elements: HTMLElement[] = []
  for (const id of ids) {
    const element = document.getElementById(id)
    if (element) {
      elements.push(element)
    } else {
      console.warn(`Element with ID "${id}" not found.`)
    }
  }

  if (elements.length === 0) {
    console.error('No elements found to export.')
    return
  }

  // If only one element, capture it directly
  if (elements.length === 1) {
    const element = elements[0]

    let originalClassName = ''
    let originalStyle = ''

    if (isRemoveHeight) {
      // Store original class and styles
      originalClassName = element.className
      originalStyle = element.getAttribute('style') || ''

      // Remove height/overflow constraints by adding override styles
      element.style.cssText =
        originalStyle +
        '; max-height: none !important; height: auto !important; overflow: visible !important;'

      // Wait for reflow
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        ...(isRemoveHeight && {
          height: element.scrollHeight,
          windowHeight: element.scrollHeight,
        }),
      })
      downloadCanvas(canvas, type, fileName)
    } finally {
      if (isRemoveHeight) {
        // Restore original styles
        element.className = originalClassName
        if (originalStyle) {
          element.setAttribute('style', originalStyle)
        } else {
          element.removeAttribute('style')
        }
      }
    }
    return
  }

  // Multiple elements - create wrapper
  const wrapper = document.createElement('div')
  wrapper.style.position = 'absolute'
  wrapper.style.left = '-9999px'
  wrapper.style.top = '0'

  // Clone all elements with canvas content
  elements.forEach((element) => {
    const clonedElement = cloneElementWithCanvas(element)
    clonedElement.style.padding = '0 4px'

    if (isRemoveHeight) {
      // Force remove all height and overflow constraints
      clonedElement.style.cssText +=
        '; max-height: none !important; height: auto !important; overflow: visible !important;'

      // Also remove constraints from all children
      const allChildren = clonedElement.querySelectorAll('*')
      allChildren.forEach((child: Element) => {
        const htmlChild = child as HTMLElement
        htmlChild.style.cssText +=
          '; max-height: none !important; overflow: visible !important;'
      })
    }

    wrapper.appendChild(clonedElement)
  })

  // Temporarily add wrapper to body
  document.body.appendChild(wrapper)

  // Wait for rendering
  await new Promise((resolve) =>
    setTimeout(resolve, isRemoveHeight ? 200 : 100)
  )

  try {
    const canvas = await html2canvas(wrapper, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      ...(isRemoveHeight && {
        height: wrapper.scrollHeight,
        windowHeight: wrapper.scrollHeight,
      }),
    })

    downloadCanvas(canvas, type, fileName)
  } finally {
    document.body.removeChild(wrapper)
  }
}

// Helper function to clone element and preserve canvas content
function cloneElementWithCanvas(element: HTMLElement): HTMLElement {
  const clone = element.cloneNode(true) as HTMLElement

  // Find all canvas elements in original and cloned elements
  const originalCanvases = element.querySelectorAll('canvas')
  const clonedCanvases = clone.querySelectorAll('canvas')

  // Copy canvas content from original to cloned
  originalCanvases.forEach((originalCanvas, index) => {
    const clonedCanvas = clonedCanvases[index]
    if (clonedCanvas) {
      const context = clonedCanvas.getContext('2d')
      if (context) {
        // Set the same dimensions
        clonedCanvas.width = originalCanvas.width
        clonedCanvas.height = originalCanvas.height

        // Draw the original canvas content onto the cloned canvas
        context.drawImage(originalCanvas, 0, 0)
      }
    }
  })

  return clone
}

// Helper function to handle download
function downloadCanvas(
  canvas: HTMLCanvasElement,
  type: string,
  fileName: string
) {
  const dataUrl = canvas.toDataURL('image/png')

  switch (type) {
    case 'jpg': {
      const jpgData = canvas.toDataURL('image/jpeg', 1.0)
      const link = document.createElement('a')
      link.href = jpgData
      link.download = `${fileName}.jpg`
      link.click()
      break
    }

    case 'png': {
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `${fileName}.png`
      link.click()
      break
    }

    case 'pdf': {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`${fileName}.pdf`)
      break
    }

    default:
      console.warn('Tipe file tidak didukung:', type)
  }
}
