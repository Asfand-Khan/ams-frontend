import AddAgent from '@/components/ui/agent/add-agent'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Add Agent | Jubilee Retail',
  description: 'Add a new Agent in the Jubilee Retail system',
}

const page = () => {
  return (
    <>
      <AddAgent />
    </>
  )
}

export default page