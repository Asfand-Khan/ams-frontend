import EditAgent from "@/components/ui/agent/edit-agent"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Edit Agent | Jubilee Retail',
  description: 'Edit existing Agent in the Jubilee Retail system',
}

const page = () => {
  return (
    <>
      <EditAgent />
    </>
  )
}

export default page