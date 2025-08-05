import EditBranch from "@/components/ui/branch/edit-branch"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Edit Branch | Jubilee Retail',
  description: 'Edit branch to the Jubilee Retail system.',
}

const page = () => {
  return (
    <>
      <EditBranch />
    </>
  )
}

export default page