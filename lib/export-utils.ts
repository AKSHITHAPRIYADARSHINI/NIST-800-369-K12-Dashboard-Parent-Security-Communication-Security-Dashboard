import type { SecurityIncident } from "./nist-mock-data"

export function exportToCSV(data: SecurityIncident[], filename: string = "nist-controls.csv") {
  const headers = ["ID", "Control", "Category", "Status", "Target", "Score", "Reviewer"]
  const rows = data.map((d) => [d.id, d.header, d.type, d.status, d.target, d.limit, d.reviewer])

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
