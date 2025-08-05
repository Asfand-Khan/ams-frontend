import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import DataTable from '../datatable/data-table'
import { UsersListPayloadType } from '@/types/usersTypes'

interface UserDatatableProps {
  columns: ColumnDef<UsersListPayloadType>[]
  payload: UsersListPayloadType[]
}

const UserDatatable: React.FC<UserDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all users in the system"
      />
    </>
  )
}

export default UserDatatable