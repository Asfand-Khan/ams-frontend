import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import DataTable from '../datatable/data-table'
import { ClientPayloadType } from '@/types/clientTypes'

interface ClientDatatableProps {
  columns: ColumnDef<ClientPayloadType>[]
  payload: ClientPayloadType[]
}

const ClientDatatable: React.FC<ClientDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all clients in the system"
      />
    </>
  )
}

export default ClientDatatable