"use client";

import React, { useMemo } from 'react'
import SubNav from '../foundations/sub-nav'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import { Button } from '../shadcn/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import AddUsersForm from './add-users-form'
import { useQuery } from '@tanstack/react-query';
import { fetchAllMenus } from '@/helperFunctions/allMenusFunction';
import { allMenusResponse } from '@/types/menus';
import Error from '../foundations/error';
import Empty from '../foundations/empty';
import { getRights } from '@/utils/getRights';
import { useRouter } from 'next/navigation';
import LoadingState from '../foundations/loading-state';

const AddUser = () => {
  // Constants
  const LISTING_URL = '/users/user-list'
  
  const router = useRouter()

  // Rights
  const rights = useMemo(() => {
    return getRights(LISTING_URL)
  }, [LISTING_URL])


  // Fetch all menus
  const { data: allMenusResponse, isLoading: allMenusLoading, isError: allMenusError, error } = useQuery<allMenusResponse | null>({
    queryKey: ["all-menus"],
    queryFn: fetchAllMenus
  })

  if (rights?.can_create !== "1") {
    router.push(LISTING_URL)
  }

  // Loading State
  if (allMenusLoading) {
    return <LoadingState />
  }

  // Error State
  if (allMenusError) {
    return <Error err={error?.message} />
  }

  // Empty State
  if (allMenusResponse?.payload?.length === 0 || !allMenusResponse?.payload) {
    return <Empty title="Not Found" description="No Menus found to populate the form." />;
  }

  return (
    <>
      <SubNav
        title='Add User'
      />

      <Card className='w-full shadow-none border-none'>
        <CardHeader className='border-b gap-0'>
          <CardTitle>
            <div className='flex items-center gap-2'>
              <Button variant="ghost" size="icon" className='rounded-full border border-gray-200' asChild>
                <Link href={LISTING_URL}>
                  <ArrowLeft className='size-6' />
                </Link>
              </Button>
              Add a new user to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'>
            <AddUsersForm allMenus={allMenusResponse?.payload} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default AddUser