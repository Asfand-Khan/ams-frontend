import AddClient from "@/components/ui/client/add-client"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Add Client | Jubilee Retail',
  description: 'Add a new client to the Jubilee Retail system.',
}

const page = () => {
  return (
    <>
      <AddClient />
    </>
  )
}

export default page