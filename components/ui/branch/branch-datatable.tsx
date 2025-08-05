import React from 'react'
import DataTable from '../datatable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { BranchPayloadType } from '@/types/branchTypes';

interface BranchDatatableProps {
  columns: ColumnDef<BranchPayloadType>[];
  payload: BranchPayloadType[]
}
const BranchDatatable: React.FC<BranchDatatableProps> = ({ columns, payload }) => {
  return (
    <>
      <DataTable
        columns={columns}
        data={payload}
        title="List of all agents in the system"
      />
    </>
  )
}

export default BranchDatatable