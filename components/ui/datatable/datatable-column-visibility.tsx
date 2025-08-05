import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Table } from "@tanstack/react-table"
import { Columns2Icon } from "lucide-react"

import { Button } from "@/components/ui/shadcn/button"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
} from "@/components/ui/shadcn/dropdown-menu"

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/shadcn/tooltip"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

const DataTableColumnVisibility = <TData,>({ table }: DataTableViewOptionsProps<TData>) => {
  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="ml-auto hidden h-8 lg:flex"
                aria-label="Toggle column visibility"
              >
                <Columns2Icon />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Column Visibility</p>
          </TooltipContent>
        </Tooltip>


        <DropdownMenuContent align="end" className="w-[150px]">
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}

export default DataTableColumnVisibility
