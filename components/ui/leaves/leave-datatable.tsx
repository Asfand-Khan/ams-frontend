import React from "react";
import DataTable from "../datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { LeavePayload } from "@/types/leaveTypes";

interface LeaveDatatableProps {
  columns: ColumnDef<LeavePayload>[];
  payload: LeavePayload[];
  isRefetching: boolean;
  handleRefetch: () => void;
}
const LeaveDatatable: React.FC<LeaveDatatableProps> = ({
  columns,
  payload,
  handleRefetch,
  isRefetching
}) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all leave in the system"
        handleRefetch={handleRefetch}
        isRefetching={isRefetching}
        showRefetch
      />
    </>
  );
};

export default LeaveDatatable;
