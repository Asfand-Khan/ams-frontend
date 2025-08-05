import EditDevelopmentOfficer from '@/components/ui/development-officers/edit-development-officer'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Edit Development Officer | Jubilee Retail',
  description: 'Edit existing Development Officer in the Jubilee Retail system',
}


const page = () => {
  return (
    <>
      <EditDevelopmentOfficer />
    </>
  )
}

export default page