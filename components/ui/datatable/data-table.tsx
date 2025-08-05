"use client";

import React, { useState } from 'react'
import {
  ColumnDef,  // 
  ColumnFiltersState, FilterFn, // State for column filters
  SortingState, // State for sorting
  VisibilityState,  // State for column visibility
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,

  useReactTable,
} from "@tanstack/react-table"

import { ScrollArea, ScrollBar } from "@/components/ui/shadcn/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table"
import DataTablePagination from '@/components/ui/datatable/datatable-pagination';
import DataTableGlobalFilter from '@/components/ui/datatable/datatable-global-filter';
import DataTableColumnVisibility from '@/components/ui/datatable/datatable-column-visibility';
import DataTableExport from '@/components/ui/datatable/datatable-export';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../shadcn/card';


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[],
  excludeExportColumns?: string[]; // Optional prop to exclude specific columns from export
  exportFilename?: string; // Optional prop for export filename
  enableExport?: boolean; // Optional prop to enable export functionality
  enableGlobalFilter?: boolean; // Optional prop to enable global filtering
  enablePagination?: boolean; // Optional prop to enable pagination
  enableColumnVisibility?: boolean; // Optional prop to enable column visibility
  title: string; // Title for the data table
}

// Custom filter function for multi-select
const multiSelectFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  if (!filterValue?.length) return true;
  const cellValue = String(row.getValue(columnId));
  return filterValue.includes(cellValue);
};


const DataTable = <TData, TValue>({
  columns,
  data,
  excludeExportColumns = ["actions"],
  exportFilename = "exported_data",
  enableExport = true,
  enableGlobalFilter = true,
  enablePagination = true,
  enableColumnVisibility = true,
  title = "Data Table",
}: DataTableProps<TData, TValue>) => {

  // State management for sorting, column filters, visibility, and row selection
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState<string>("")


  // Initialize the table with the provided data and columns
  // and the state management functions for sorting, filtering, visibility, and selection
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      multiSelect: multiSelectFilter,
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter
    }
  })

  return (
    <>
      <Card className='w-full shadow-none border-none'>
        <CardHeader className='border-b gap-0'>
          <CardTitle>{title}</CardTitle>
          {/* <CardDescription>List of all users in the system.</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between pb-6">
            <div>
              {enableGlobalFilter && (<DataTableGlobalFilter table={table} />)}
            </div>
            <div className='flex items-center gap-3'>
              {enableColumnVisibility && (<DataTableColumnVisibility table={table} />)}
              {enableExport && (<DataTableExport table={table} filename={exportFilename} excludeColumns={excludeExportColumns} />)}
            </div>
          </div>
          <ScrollArea className="h-[420px] rounded-md w-full">
            <ScrollBar orientation="vertical" />
            <Table className='relative'>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow className='bg-gray-50 sticky z-20 top-0' key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-[380px] text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
        <CardFooter className='border-t'>
          {enablePagination && (
            <DataTablePagination table={table} />
          )}
        </CardFooter>
      </Card>
    </>
  )
}

export default DataTable