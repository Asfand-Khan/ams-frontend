import React from 'react'
import DataTable from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { IgisSubMakePayloadType } from '@/types/igisTypes'

interface ClientDatatableProps {
  columns: ColumnDef<IgisSubMakePayloadType>[]
  payload: IgisSubMakePayloadType[]
}

const IgisSubMakeDatatable: React.FC<ClientDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all igis sub make in the system"
      />
    </>
  )
}

export default IgisSubMakeDatatable