import AddBranch from "@/components/ui/branch/add-branch"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Add Branch | Jubilee Retail',
  description: 'Add a new branch to the Jubilee Retail system.',
}

const page = () => {
  return (
    <>
      <AddBranch />
    </>
  )
}

export default page