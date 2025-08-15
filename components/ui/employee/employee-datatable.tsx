import React from "react";
import DataTable from "../datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { UserPayload } from "@/types/userTypes";

interface EmployeeDatatableProps {
  columns: ColumnDef<UserPayload>[];
  payload: UserPayload[];
  isRefetching: boolean;
  handleRefetch: () => void;
}
const EmployeeDatatable: React.FC<EmployeeDatatableProps> = ({
  columns,
  payload,
  handleRefetch,
  isRefetching,
}) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all employees in the system"
        showRefetch
        handleRefetch={handleRefetch}
        isRefetching={isRefetching}
      />
    </>
  );
};

export default EmployeeDatatable;
