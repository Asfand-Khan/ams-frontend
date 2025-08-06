import React from "react";
import DataTable from "../datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DesignationPayload } from "@/types/designationTypes";

interface DesignationDatatableProps {
  columns: ColumnDef<DesignationPayload>[];
  payload: DesignationPayload[];
}
const DesignationDatatable: React.FC<DesignationDatatableProps> = ({
  columns,
  payload,
}) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all designations in the system"
      />
    </>
  );
};

export default DesignationDatatable;