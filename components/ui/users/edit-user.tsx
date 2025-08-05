"use client";

import { useMemo } from 'react'
import EditUserForm from '@/components/ui/users/edit-user-form'
import useUserIdStore from '@/hooks/useAddUserIdStore'
import { allMenusResponse } from '@/types/menus';
import { SingleUserResponseType } from '@/types/usersTypes';
import { useQuery } from '@tanstack/react-query';
import { fetchAllMenus } from '@/helperFunctions/allMenusFunction';
import { fetchSingleUser } from '@/helperFunctions/userFunction';
import { getRights } from '@/utils/getRights';
import Empty from '@/components/ui/foundations/empty';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card';
import { Button } from '../shadcn/button';
import { ArrowLeft } from 'lucide-react';
import SubNav from '../foundations/sub-nav';
import Link from 'next/link';
import LoadingState from '@/components/ui/foundations/loading-state';

const EditUser = () => {
  // Constants
  const LISTING_ROUTE = '/users/user-list'

  const { userId } = useUserIdStore()
  const router = useRouter()

  // Rights
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE)
  }, [LISTING_ROUTE])

  // fetch all menus
  const { data: allMenusResponse, isLoading: allMenusLoading } = useQuery<allMenusResponse | null>({
    queryKey: ["all-menus"],
    queryFn: fetchAllMenus
  })

  // fetch single user 
  const { data: singleUserResponse, isLoading: singleUserLoading } = useQuery<SingleUserResponseType | null>({
    queryKey: ["single-user", userId],
    queryFn: () => fetchSingleUser(userId),
    enabled: !!userId,
  });


  if (rights?.can_edit !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return <Empty title="Permission Denied" description="You do not have permission to edit a existing user." />;
  }

  if (!userId) {
    setTimeout(() => {
      router.push(LISTING_ROUTE)
    }, 1500);

    return <Empty title="Not Found" description="User ID is missing. Redirecting to user list..." />
  }

  // loading state while fetching user list data
  if (allMenusLoading || singleUserLoading) {
    return <LoadingState />
  }

  return (
    <>
      <SubNav
        title='Edit User'
      />

      <Card className='w-full shadow-none border-none'>
        <CardHeader className='border-b gap-0'>
          <CardTitle>
            <div className='flex items-center gap-2'>
              <Button variant="ghost" size="icon" className='rounded-full border border-gray-200' asChild>
                <Link href={LISTING_ROUTE}>
                  <ArrowLeft className='size-6' />
                </Link>
              </Button>
              Edit existing user to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'>
            <EditUserForm allMenus={allMenusResponse?.payload} singleUser={singleUserResponse?.payload[0]} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default EditUser