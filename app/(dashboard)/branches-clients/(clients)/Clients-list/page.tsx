
import ClientList from '@/components/ui/client/client-list'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Client List | Jubilee Retail',
  description: 'View clients in the Jubilee Retail system.',
}

const page = () => {
  return (
    <>
      <ClientList />
    </>
  )
}

export default page