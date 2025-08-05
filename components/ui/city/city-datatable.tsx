import React from 'react'
import DataTable from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { CityPayloadType } from '@/types/cityTypes';

interface CityDatatableProps {
  columns: ColumnDef<CityPayloadType>[];
  payload: CityPayloadType[]
}
const CityDatatable: React.FC<CityDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all cities in the system"
      />
    </>
  )
}

export default CityDatatable