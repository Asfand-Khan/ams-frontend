import React from "react";
import DataTable from "../datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ShiftPayload } from "@/types/shiftTypes";

interface ShiftDatatableProps {
  columns: ColumnDef<ShiftPayload>[];
  payload: ShiftPayload[];
}
const ShiftDatatable: React.FC<ShiftDatatableProps> = ({
  columns,
  payload,
}) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all shifts in the system"
      />
    </>
  );
};

export default ShiftDatatable;
