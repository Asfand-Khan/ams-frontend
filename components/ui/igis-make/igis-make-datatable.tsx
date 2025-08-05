import React from 'react'
import DataTable from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { IgisMakePayloadType } from '@/types/igisTypes';

interface IgisMakeDatatableProps {
  columns: ColumnDef<IgisMakePayloadType>[];
  payload: IgisMakePayloadType[]
}
const IgisMakeDatatable: React.FC<IgisMakeDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all igis makes in the system"
      />
    </>
  )
}

export default IgisMakeDatatable