import React from 'react'
import DataTable from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { BusinessRegionPayloadType } from '@/types/businessRegionTypes';

interface BusinessRegionDatatableProps {
  columns: ColumnDef<BusinessRegionPayloadType>[];
  payload: BusinessRegionPayloadType[]
}
const BusinessRegionDatatable: React.FC<BusinessRegionDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all business regions in the system"
      />
    </>
  )
}

export default BusinessRegionDatatable