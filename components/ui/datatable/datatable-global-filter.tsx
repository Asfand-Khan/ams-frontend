import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/shadcn/input"


interface DataTableGlobalFilterProps<TData> {
    table: Table<TData>
}

const DataTableGlobalFilter = <TData,>({ table }: DataTableGlobalFilterProps<TData>) => {
    return (
        <>
            <Input
                placeholder="Global Search..."
                value={(table.getState().globalFilter as string) ?? ""}
                onChange={(e) => table.setGlobalFilter(e.target.value)}
                className="max-w-md"
            />
        </>
    )
}

export default DataTableGlobalFilter