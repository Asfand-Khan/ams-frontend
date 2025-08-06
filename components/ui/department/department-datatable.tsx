import React from "react";
import DataTable from "../datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DepartmentPayload } from "@/types/departmentTypes";

interface DepartmentDatatableProps {
  columns: ColumnDef<DepartmentPayload>[];
  payload: DepartmentPayload[];
}
const DepartmentDatatable: React.FC<DepartmentDatatableProps> = ({
  columns,
  payload,
}) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all departments in the system"
      />
    </>
  );
};

export default DepartmentDatatable;
