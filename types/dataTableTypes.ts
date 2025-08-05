import type { Column, FilterFn } from "@tanstack/react-table";

export type FilterType = "multiselect" | "none";

export interface FilterOption {
  label: string;
  value: string;
}

export interface ColumnMeta {
  filterType?: FilterType;
  filterOptions?: FilterOption[];
  filterPlaceholder?: string;
}

export interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

declare module "@tanstack/react-table" {
  interface FilterFns {
    multiSelect: FilterFn<any>;
  }
}
