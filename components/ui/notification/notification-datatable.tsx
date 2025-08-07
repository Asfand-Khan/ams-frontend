import React from "react";
import DataTable from "../datatable/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { NotificationPayload } from "@/types/notificationTypes";

interface NotificationDatatableProps {
  columns: ColumnDef<NotificationPayload>[];
  payload: NotificationPayload[];
}
const NotificationDatatable: React.FC<NotificationDatatableProps> = ({
  columns,
  payload,
}) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all notifications in the system"
      />
    </>
  );
};

export default NotificationDatatable;
