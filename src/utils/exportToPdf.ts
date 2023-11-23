import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export const exportTableToPdf = async (tableId: string, fileName: string) => {
  const table = document.getElementById(tableId)

  if (table !== null) {
    const canvas = await html2canvas(table)
    const dataUrl = canvas.toDataURL()

    // eslint-disable-next-line new-cap
    const pdf = new jsPDF({
      orientation: 'landscape'
    })

    const imgProps = pdf.getImageProperties(dataUrl)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`${fileName}.pdf`)
  }
}
