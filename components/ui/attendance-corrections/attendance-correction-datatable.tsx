import React from 'react'
import DataTable from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { AttendanceCorrection } from '@/types/attendanceCorrectionTypes';

interface AttendanceCorrectionDatatableProps {
  columns: ColumnDef<AttendanceCorrection>[];
  payload: AttendanceCorrection[]
}
const AttendanceCorrectionDatatable: React.FC<AttendanceCorrectionDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all attendance correction in the system"
      />
    </>
  )
}

export default AttendanceCorrectionDatatable