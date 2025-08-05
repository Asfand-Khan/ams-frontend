import AddUser from '@/components/ui/users/add-user'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Add User | Jubilee Retail',
  description: 'Add a new user to the Jubilee Retail system, assigning roles and permissions as needed.',
}
const page = () => {
  return (
    <>
      <AddUser />
    </>
  )
}

export default page