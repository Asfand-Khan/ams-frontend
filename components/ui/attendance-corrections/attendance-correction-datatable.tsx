import React from 'react';
import DataTable from '../datatable/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { AttendanceCorrection } from '@/types/attendanceCorrectionTypes';

interface AttendanceCorrectionDatatableProps {
  columns: ColumnDef<AttendanceCorrection>[];
  payload: AttendanceCorrection[];
  isRefetching: boolean;
  handleRefetch: () => void;
}

const AttendanceCorrectionDatatable: React.FC<AttendanceCorrectionDatatableProps> = ({
  columns,
  payload,
  handleRefetch,
  isRefetching,
}) => {
  return (
    <DataTable
      columns={columns}
      data={payload}
      title="List of all attendance corrections in the system"
      handleRefetch={handleRefetch}
      isRefetching={isRefetching}
      showRefetch
    />
  );
};

export default AttendanceCorrectionDatatable;