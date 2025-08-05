import UserList from '@/components/ui/users/user-list'
import React from 'react'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Users List | Jubilee Retail',
  description: 'View and manage all users in the Jubilee Retail system.',
}

const page = () => {
  return (
    <>
      <UserList />
    </>
  )
}

export default page