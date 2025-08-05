import AgentList from '@/components/ui/agent/agent-list'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Agent List | Jubilee Retail',
  description: 'View all Agent List in the Jubilee Retail system',
}

const page = () => {
  return (
    <>
      <AgentList />
    </>
  )
}

export default page