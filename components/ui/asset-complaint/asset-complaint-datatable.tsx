import React from "react";
import DataTable from "../datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { AssetComplaintPayload } from "@/types/assetComplaintTypes";

interface AssetComplaintDatatableProps {
  columns: ColumnDef<AssetComplaintPayload>[];
  payload: AssetComplaintPayload[];
  isRefetching: boolean;
  handleRefetch: () => void;
}
const AssetComplaintDatatable: React.FC<AssetComplaintDatatableProps> = ({
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
        title="List of all asset complaint in the system"
        showRefetch
        handleRefetch={handleRefetch}
        isRefetching={isRefetching}
      />
    </>
  );
};

export default AssetComplaintDatatable;
