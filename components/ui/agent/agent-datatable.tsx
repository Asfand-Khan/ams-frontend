import React from 'react'
import DataTable from '../datatable/data-table'
import { AgentPayloadTypes } from '@/types/agentTypes'
import { ColumnDef } from '@tanstack/react-table'

interface AgentDatatableProps {
  columns: ColumnDef<AgentPayloadTypes>[];
  payload: AgentPayloadTypes[]
}

const AgentDatatable: React.FC<AgentDatatableProps> = ({ columns, payload }) => {
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

export default AgentDatatable