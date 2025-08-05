import EditClient from "@/components/ui/client/edit-client"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Edit Client | Jubilee Retail',
  description: 'Edit existing client to the Jubilee Retail system.',
}

const page = () => {
  return (
    <>
      <EditClient />
    </>
  )
}

export default page