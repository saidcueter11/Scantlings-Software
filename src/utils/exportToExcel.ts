import * as XLSX from 'xlsx'

export const exportToExcel = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  // Buffer
  // const buf = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })

  // Binary string
  XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' })

  // Download
  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}
