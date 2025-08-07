import React from "react";
import DataTable from "../datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { AssetComplaintPayload } from "@/types/assetComplaintTypes";

interface AssetComplaintDatatableProps {
  columns: ColumnDef<AssetComplaintPayload>[];
  payload: AssetComplaintPayload[];
}
const AssetComplaintDatatable: React.FC<AssetComplaintDatatableProps> = ({
  columns,
  payload,
}) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all asset complaint in the system"
      />
    </>
  );
};

export default AssetComplaintDatatable;
