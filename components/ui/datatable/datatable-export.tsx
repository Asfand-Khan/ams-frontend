"use client"

import { useState } from "react"
import type { HeaderContext, Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/shadcn/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/shadcn/dropdown-menu"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/shadcn/tooltip"
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react"

import { toast } from "sonner"


interface DataTableExportProps<TData> {
  table: Table<TData>
  filename?: string
  excludeColumns?: string[]
}

const DataTableExport = <TData,>({
  table,
  filename = "data-export",
  excludeColumns = [],
}: DataTableExportProps<TData>) => {
  const [isExporting, setIsExporting] = useState(false)

  // Get visible and non-excluded columns
  const getExportColumns = () => {
    return table.getVisibleLeafColumns().filter((column) => !excludeColumns.includes(column.id))
  }

  // Get export data (respects current filters and sorting)
  const getExportData = () => {
    const columns = getExportColumns()
    const rows = table.getFilteredRowModel().rows

    const headers = columns.map((column) => {
      const header = column.columnDef.header
      if (typeof header === "string") return header
      if (typeof header === "function") {
        // Try to extract text from header function
        const headerContent = header({ column, table } as HeaderContext<TData, unknown>)
        if (typeof headerContent === "string") return headerContent
        return column.id
      }
      return column.id
    })

    const data = rows.map((row) => {
      return columns.map((column) => {
        const cellValue = row.getValue(column.id)
        // Handle different data types
        if (cellValue === null || cellValue === undefined) return ""
        if (typeof cellValue === "object") return JSON.stringify(cellValue)
        return String(cellValue)
      })
    })

    return { headers, data }
  }

  // Export to CSV
  const exportToCSV = async () => {
    try {
      setIsExporting(true)
      const { headers, data } = getExportData()

      // Create CSV content
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          row
            .map((cell) => {
              // Escape quotes and wrap in quotes if contains comma, quote, or newline
              const escaped = String(cell).replace(/"/g, '""')
              return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped
            })
            .join(","),
        ),
      ].join("\n")

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)

      link.setAttribute("href", url)
      link.setAttribute("download", `${filename}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success("Export Successful", {
        description: "CSV file has been downloaded successfully.",
      })
    } catch (error) {
      console.error("CSV Export Error:", error)
      toast.error("Export Failed", {
        description: "Failed to export CSV file. Please try again.",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Export to Excel
  const exportToExcel = async () => {
    try {
      setIsExporting(true)

      // Dynamic import to reduce bundle size
      const XLSX = await import("xlsx")

      const { headers, data } = getExportData()

      // Create worksheet data
      const wsData = [headers, ...data]
      const ws = XLSX.utils.aoa_to_sheet(wsData)

      // Set column widths
      const colWidths = headers.map(() => ({ wch: 15 }))
      ws["!cols"] = colWidths

      // Style the header row
      const headerRange = XLSX.utils.decode_range(ws["!ref"] || "A1")
      for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
        if (!ws[cellAddress]) continue
        ws[cellAddress].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "EEEEEE" } },
        }
      }

      // Create workbook and add worksheet
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Data")

      // Write file
      XLSX.writeFile(wb, `${filename}.xlsx`)

      toast.success("Export Successful", {
        description: "Excel file has been downloaded successfully.",
      })
    } catch (error) {
      console.error("Excel Export Error:", error)
      toast.error("Export Failed", {
        description: "Failed to export Excel file. Please try again.",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const exportCount = table.getFilteredRowModel().rows.length

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isExporting || exportCount === 0} className="ml-auto">
                {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export</p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={exportToCSV} disabled={isExporting} className="cursor-pointer">
            <FileText className="h-4 w-4 mr-2" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportToExcel} disabled={isExporting} className="cursor-pointer">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export as Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}

export default DataTableExport
