export function exportToCSV(data: any[], filename: string = "export.csv") {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const rows = data.map((d) => headers.map((h) => d[h] ?? ""))

  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

export function printReport() {
  window.print()
}
