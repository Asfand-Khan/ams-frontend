import { DevelopmentOfficerPayloadTypes } from '@/types/developmentOfficerTypes'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import DataTable from '../datatable/data-table'

interface DevelopmentOfficerDatatableProps {
  columns: ColumnDef<DevelopmentOfficerPayloadTypes>[]
  payload: DevelopmentOfficerPayloadTypes[]
}

const DevelopmentOfficerDatatable: React.FC<DevelopmentOfficerDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all development officers in the system"
      />
    </>
  )
}

export default DevelopmentOfficerDatatable