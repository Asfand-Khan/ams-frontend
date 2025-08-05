import React from 'react'
import DataTable from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { CallUsPayloadType } from '@/types/callUsTypes';

interface CallUsDatatableProps {
  columns: ColumnDef<CallUsPayloadType>[];
  payload: CallUsPayloadType[]
}
const CallUsDatatable: React.FC<CallUsDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all call us data in the system"
      />
    </>
  )
}

export default CallUsDatatable