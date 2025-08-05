import React from 'react'
import DataTable from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { CourierPayloadType } from '@/types/courierTypes';

interface CourierDatatableProps {
  columns: ColumnDef<CourierPayloadType>[];
  payload: CourierPayloadType[]
}
const CourierDatatable: React.FC<CourierDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all couriers in the system"
      />
    </>
  )
}

export default CourierDatatable