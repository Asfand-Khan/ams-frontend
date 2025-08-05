import React from "react";
import DataTable from "../datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { LeaveTypePayload } from "@/types/leaveTypeTypes";

interface LeaveTypeDatatableProps {
  columns: ColumnDef<LeaveTypePayload>[];
  payload: LeaveTypePayload[];
}
const LeaveTypeDatatable: React.FC<LeaveTypeDatatableProps> = ({
  columns,
  payload,
}) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all leave types in the system"
      />
    </>
  );
};

export default LeaveTypeDatatable;
