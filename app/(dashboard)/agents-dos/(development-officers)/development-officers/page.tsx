import DevelopmentOfficersList from '@/components/ui/development-officers/development-officers-list'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Development Officer List | Jubilee Retail',
  description: 'View all Development Officer List in the Jubilee Retail system',
}

const page = () => {
  return (
    <>
      <DevelopmentOfficersList />
    </>
  )
}

export default page