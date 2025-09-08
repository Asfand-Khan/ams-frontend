import React from "react";
import DataTable from "../datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { MeetingInstancePayload } from "@/types/scheduleTypes";

interface ScheduleDatatableProps {
  columns: ColumnDef<MeetingInstancePayload>[];
  payload: MeetingInstancePayload[];
  isRefetching: boolean;
  handleRefetch: () => void;
}
const ScheduleInstanceDatatable: React.FC<ScheduleDatatableProps> = ({
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
        title="List of all meetings instances in the system"
         handleRefetch={handleRefetch}
        isRefetching={isRefetching}
        showRefetch
      />
    </>
  );
};

export default ScheduleInstanceDatatable;
