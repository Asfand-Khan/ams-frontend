import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import DataTable from '../datatable/data-table'
import { ApiUsersPayloadType } from '@/types/usersTypes'

interface ApiUserDatatableProps {
  columns: ColumnDef<ApiUsersPayloadType>[]
  payload: ApiUsersPayloadType[]
}

const ApiUserDatatable: React.FC<ApiUserDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all api users in the system"
      />
    </>
  )
}

export default ApiUserDatatable