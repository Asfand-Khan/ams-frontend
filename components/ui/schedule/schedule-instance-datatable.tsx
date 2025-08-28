import React from "react";
import DataTable from "../datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { MeetingInstancePayload } from "@/types/scheduleTypes";

interface ScheduleDatatableProps {
  columns: ColumnDef<MeetingInstancePayload>[];
  payload: MeetingInstancePayload[];
}
const ScheduleInstanceDatatable: React.FC<ScheduleDatatableProps> = ({
  columns,
  payload,
}) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all meetings instances in the system"
      />
    </>
  );
};

export default ScheduleInstanceDatatable;
