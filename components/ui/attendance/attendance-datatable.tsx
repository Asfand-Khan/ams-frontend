import React from 'react'
import DataTable from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { AttendanceRecord } from '@/types/attendanceTypes';

interface AttendanceDatatableProps {
  columns: ColumnDef<AttendanceRecord>[];
  payload: AttendanceRecord[]
}
const AttendancesDatatable: React.FC<AttendanceDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all attendances in the system"
      />
    </>
  )
}

export default AttendancesDatatable