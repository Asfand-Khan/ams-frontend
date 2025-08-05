import { ColumnMeta } from '@/types/dataTableTypes'
import { Column } from '@tanstack/react-table'
import { Check, Funnel, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/shadcn/scroll-area'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/shadcn/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/shadcn/popover'
import { Badge } from '@/components/ui/shadcn/badge'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/shadcn/command'

interface DataTableColumnFilterProps<TData, TValue> {
    column: Column<TData, TValue>
}

const DataTableColumnFilter = <TData, TValue>({ column }: DataTableColumnFilterProps<TData, TValue>) => {
    const columnMeta = column.columnDef.meta as ColumnMeta | undefined
    const filterType = columnMeta?.filterType || "none"
    const filterOptions = columnMeta?.filterOptions || []
    // const filterPlaceholder = columnMeta?.filterPlaceholder || "Filter..."

    const [open, setOpen] = useState(false)
    const [selectedValues, setSelectedValues] = useState<string[]>([])
    const [searchValue, setSearchValue] = useState("")

    // Get current filter value
    const filterValue = column.getFilterValue() as string[] | string | undefined;

    useEffect(() => {
        if (Array.isArray(filterValue)) {
            setSelectedValues(filterValue);
        } else if (typeof filterValue === "string") {
            setSelectedValues([filterValue]);
        } else {
            setSelectedValues([]);
        }
    }, [filterValue]);

    const handleMultiSelectChange = (value: string) => {
        const newSelectedValues = selectedValues.includes(value)
            ? selectedValues.filter((item) => item !== value)
            : [...selectedValues, value]

        setSelectedValues(newSelectedValues)
        column.setFilterValue(newSelectedValues.length > 0 ? newSelectedValues : undefined)
    }

    // const handleCheckboxChange = (value: string, checked: boolean) => {
    //     const newSelectedValues = checked ? [...selectedValues, value] : selectedValues.filter((item) => item !== value)

    //     setSelectedValues(newSelectedValues)
    //     column.setFilterValue(newSelectedValues.length > 0 ? newSelectedValues : undefined)
    // }

    const clearFilters = () => {
        setSelectedValues([]);
        column.setFilterValue(undefined);
        setSearchValue("");
        setOpen(false);
    }

    const clearSpecificFilter = (value: string) => {
        const newSelectedValues = selectedValues.filter((item) => item !== value)
        setSelectedValues(newSelectedValues)
        column.setFilterValue(newSelectedValues.length > 0 ? newSelectedValues : undefined)
    }

    if (filterType === "none") {
        return null
    }

    const filteredOptions = filterOptions.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase()),
    )

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className={cn("border-dashed relative", selectedValues.length > 0 && "border-solid bg-accent")}
                    >
                        {/* {filterPlaceholder} */}
                        <Funnel className="h-4 w-4" />
                        {selectedValues.length > 0 && (
                            <span
                                className="absolute -top-1.5 -left-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-gray-50 text-xs font-semibold shadow-[0px_2px_8px_0px_rgba(99,99,99,0.2)] text-primary"
                            >
                                {selectedValues.length}
                            </span>

                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0 border-none shadow-[0px_2px_8px_0px_rgba(99,99,99,0.2)]" align="start">
                    <div className="border-b p-3">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">Filter Options</h4>
                            {selectedValues.length > 0 && (
                                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
                                    Clear
                                    <X className="ml-1 h-3 w-3" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {filterType === "multiselect" && (
                        <Command>
                            <CommandInput
                                placeholder="Search options..."
                                value={searchValue}
                                onValueChange={setSearchValue}
                                className="h-10"
                            />
                            <CommandList>
                                <CommandEmpty>No options found.</CommandEmpty>
                                <CommandGroup>
                                    <ScrollArea className="h-52">
                                        {filteredOptions.map((option) => {
                                            const isSelected = selectedValues.includes(option.value)
                                            return (
                                                <CommandItem
                                                    key={option.value}
                                                    onSelect={() => handleMultiSelectChange(option.value)}
                                                    className="cursor-pointer"
                                                >
                                                    <div
                                                        className={cn(
                                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-xs border border-primary",
                                                            isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
                                                        )}
                                                    >
                                                        <Check className="h-3 w-3 text-white" />
                                                    </div>
                                                    <span className="truncate max-w-[168px]">
                                                        {option.label}
                                                    </span>
                                                </CommandItem>
                                            )
                                        })}
                                    </ScrollArea>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    )}

                    {selectedValues.length > 0 && (
                        <div className="border-t p-3">
                            <div className="flex flex-wrap gap-1">
                                {selectedValues.slice(0, 3).map((value) => {
                                    const option = filterOptions.find((opt) => opt.value === value)
                                    return (
                                        <Badge
                                            key={value}
                                            variant="secondary"
                                            className="text-xs flex items-center gap-1"
                                        >
                                            <span className="truncate max-w-20" title={option?.label || value}>
                                                {option?.label || value}
                                            </span>
                                            <button
                                                onClick={() => clearSpecificFilter(value)}
                                                className="ml-1 hover:text-red-500 focus:outline-none cursor-pointer"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    )
                                })}
                                {selectedValues.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                        +{selectedValues.length - 3} more
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                </PopoverContent>
            </Popover>
        </>
    )
}

export default DataTableColumnFilter