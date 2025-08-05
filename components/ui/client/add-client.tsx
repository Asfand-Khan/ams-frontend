'use client'

import React, { useMemo } from 'react'
import SubNav from '../foundations/sub-nav'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import { Button } from '../shadcn/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getRights } from '@/utils/getRights'
import Empty from '../foundations/empty'
import LoadingState from '../foundations/loading-state'
import Error from '../foundations/error'
import AddClientForm from './add-client-form'
import { fetchBranchList } from '@/helperFunctions/branchFunction'
import { BranchResponseType } from '@/types/branchTypes'
import { useQuery } from '@tanstack/react-query'

const AddClient = () => {

  // Constants
  const LISTING_ROUTE = '/branches-clients/Clients-list'

  const router = useRouter();

  // Rights
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE)
  }, [LISTING_ROUTE])

  // Fetch branch list data using react-query
  const { data: branchListResponse, isLoading: branchListLoading, isError: branchListIsError, error: branchListError } = useQuery<BranchResponseType | null>({
    queryKey: ['get-branch-list'],
    queryFn: fetchBranchList
  })

  // Rights Redirection
  if (rights?.can_create !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return <Empty title="Permission Denied" description="You do not have permission to add a new client." />;
  }


  // loading state
  if (branchListLoading) {
    return <LoadingState />
  }

  // error state
  if (branchListIsError) {
    return <Error err={branchListError?.message} />
  }

  // empty state
  if (branchListResponse?.payload?.length === 0 || !branchListResponse?.payload) {
    return <Empty title="Not Found" description="No branches found to populate the form." />;
  }


  return (
    <>
      <SubNav title="Add Client" />

      <Card className="w-full shadow-none border-none">
        <CardHeader className="border-b gap-0">
          <CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-gray-200 cursor-pointer"
                onClick={() => router.push(LISTING_ROUTE)}
              >
                <ArrowLeft className="size-6" />
              </Button>
              Add a new client to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <AddClientForm branchList={branchListResponse?.payload} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default AddClient
