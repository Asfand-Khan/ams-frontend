import React from "react";
import DataTable from "../datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { MeetingPayload } from "@/types/scheduleTypes";

interface ScheduleDatatableProps {
  columns: ColumnDef<MeetingPayload>[];
  payload: MeetingPayload[];
}
const ScheduleDatatable: React.FC<ScheduleDatatableProps> = ({
  columns,
  payload,
}) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all meetings in the system"
      />
    </>
  );
};

export default ScheduleDatatable;