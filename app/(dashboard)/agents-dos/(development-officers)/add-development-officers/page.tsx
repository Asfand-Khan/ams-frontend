import AddDevelopmentOfficer from "@/components/ui/development-officers/add-development-officer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Add Development Officer | Jubilee Retail',
  description: 'Add a new Development Officer in the Jubilee Retail system',
}


const page = () => {
  return (
    <>
      <AddDevelopmentOfficer />
    </>
  )
}

export default page