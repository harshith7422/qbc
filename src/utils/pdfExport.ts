import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports a target HTML element as an executive-grade customer PDF.
 * Uses smart element-aware pagination so tables, rooms, and signatures are never sliced.
 */
export async function exportElementToPdf(
  elementId: string,
  fileName: string = 'BlueCraft_Quotation.pdf'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for PDF export.`);
    return false;
  }

  try {
    // Render element with high resolution scale
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    // Ratio of canvas px to element CSS px
    const scale = canvas.width / element.offsetWidth;
    // The height of one A4 page in canvas pixels
    const pageCanvasHeight = (pdfHeight / pdfWidth) * canvas.width;

    // Identify all sections that must not be split across pages
    const elementRect = element.getBoundingClientRect();
    const avoidBreakEls = Array.from(element.querySelectorAll('.avoid-break'));
    const boxes = avoidBreakEls.map((el) => {
      const rect = el.getBoundingClientRect();
      const topPx = (rect.top - elementRect.top) * scale;
      const bottomPx = (rect.bottom - elementRect.top) * scale;
      return {
        top: topPx,
        bottom: bottomPx,
        height: bottomPx - topPx,
      };
    });

    // Compute smart break points
    const splitPoints: number[] = [0];
    let currentY = 0;

    while (currentY < canvas.height) {
      let targetY = currentY + pageCanvasHeight;

      if (targetY >= canvas.height) {
        splitPoints.push(canvas.height);
        break;
      }

      // Check if targetY cuts through any avoid-break element
      let bestBreak = targetY;
      for (const box of boxes) {
        // If an element starts before targetY and extends beyond targetY
        if (box.top < targetY && box.bottom > targetY) {
          // If the element can fit entirely on the next page, break before it
          if (box.height <= pageCanvasHeight && box.top > currentY + 80) {
            bestBreak = Math.min(bestBreak, Math.floor(box.top - 8));
          }
        }
      }

      // Ensure forward progress (at least 150px)
      if (bestBreak <= currentY + 150) {
        bestBreak = targetY;
      }

      splitPoints.push(bestBreak);
      currentY = bestBreak;
    }

    // Render each slice onto a dedicated PDF page
    for (let i = 0; i < splitPoints.length - 1; i++) {
      const sliceTop = splitPoints[i];
      const sliceBottom = splitPoints[i + 1];
      const sliceHeight = sliceBottom - sliceTop;

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.round(sliceHeight);
      const ctx = pageCanvas.getContext('2d');
      if (!ctx) continue;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(
        canvas,
        0, sliceTop, canvas.width, sliceHeight,
        0, 0, canvas.width, sliceHeight
      );

      const sliceData = pageCanvas.toDataURL('image/jpeg', 0.98);
      const sliceHeightMm = (sliceHeight * pdfWidth) / canvas.width;

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(sliceData, 'JPEG', 0, 0, pdfWidth, sliceHeightMm);
    }

    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback: trigger print dialog if canvas fails
    window.print();
    return false;
  }
}
