import React from "react";
import DataTable from "../datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { OfficeLocationPayload } from "@/types/officeLocationTypes";

interface OfficeLocationDatatableProps {
  columns: ColumnDef<OfficeLocationPayload>[];
  payload: OfficeLocationPayload[];
}
const OfficeLocationDatatable: React.FC<OfficeLocationDatatableProps> = ({
  columns,
  payload,
}) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all office locations in the system"
      />
    </>
  );
};

export default OfficeLocationDatatable;
