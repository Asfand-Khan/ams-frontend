"use client";

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getRights } from '@/utils/getRights'
import SubNav from '../foundations/sub-nav'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import { Button } from '../shadcn/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AddIgisSubMakeForm from './add-igis-sub-make-form';
import { useQuery } from '@tanstack/react-query';
import { fetchIgisMakeList } from '@/helperFunctions/igisFunction';
import LoadingState from '../foundations/loading-state';
import Empty from '../foundations/empty';
import { IgisMakeResponseType } from '@/types/igisTypes';
import Error from '../foundations/error';

const AddIgisSubMake = () => {
  // Constants
  const LISTING_URL = '/igis/igis-sub-makes'

  const router = useRouter()

  // Rights
  const rights = useMemo(() => {
    return getRights(LISTING_URL)
  }, [LISTING_URL])

  // Fetch make name list
  const { data: igisMakeListResponse, isLoading: igisMakeListLoading, isError: igisMakeListIsError, error } = useQuery<IgisMakeResponseType | null>({
    queryKey: ['get-make-list'],
    queryFn: fetchIgisMakeList
  })

  // Redirection
  if (rights?.can_create !== "1") {
    router.push(LISTING_URL)
  }

  // Loading state
  if (igisMakeListLoading) {
    return <LoadingState />
  }

  // Error state
  if (igisMakeListIsError) {
    return <Error err={error?.message} />
  }

  // Empty state
  if (igisMakeListResponse?.payload.length === 0 || !igisMakeListResponse?.payload) {
    return <Empty title="Not Found" description="No make list found to populate the form." />
  }


  return (
    <>
      <SubNav
        title='Add Igis Sub Make'
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
              Add a new igis sub make to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'>
            <AddIgisSubMakeForm makeList={igisMakeListResponse?.payload} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default AddIgisSubMake
