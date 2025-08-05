'use client';

import React, { useMemo } from 'react'
import SubNav from '../foundations/sub-nav'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import { Button } from '../shadcn/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AddDevelopmentOfficerForm from './add-developmentOfficer-form'
import { getRights } from '@/utils/getRights'
import Empty from '../foundations/empty'
import LoadingState from '../foundations/loading-state'
import Error from '../foundations/error'
import { fetchBranchList } from '@/helperFunctions/branchFunction'
import { BranchResponseType } from '@/types/branchTypes'
import { useQuery } from '@tanstack/react-query'

const AddDevelopmentOfficer = () => {
  // Constants
  const LISTING_ROUTE = '/agents-dos/development-officers'

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
    return <Empty title="Permission Denied" description="You do not have permission to add a new development officer." />;
  }

  // Loading State
  if (branchListLoading) {
    return <LoadingState />
  }

  // Error State
  if (branchListIsError) {
    return <Error err={branchListError?.message} />
  }

  // Empty State
  if (branchListResponse?.payload?.length === 0 || !branchListResponse?.payload) {
    return <Empty title="Not Found" description="No branches found to populate the form." />;
  }


  return (
    <>
      <SubNav title="Add Development Officer" />

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
              Add a new development officer to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <AddDevelopmentOfficerForm branchList={branchListResponse?.payload} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default AddDevelopmentOfficer
