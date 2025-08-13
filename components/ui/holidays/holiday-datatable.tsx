import React from "react";
import DataTable from "../datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { HolidayPayload } from "@/types/holidayTypes";

interface HolidayDatatableProps {
  columns: ColumnDef<HolidayPayload>[];
  payload: HolidayPayload[];
  isRefetching: boolean;
  handleRefetch: () => void;
}
const HolidayDatatable: React.FC<HolidayDatatableProps> = ({
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
        title="List of all holiday in the system"
        handleRefetch={handleRefetch}
        isRefetching={isRefetching}
        showRefetch
      />
    </>
  );
};

export default HolidayDatatable;
