"use client";

import React, { useMemo } from 'react'
import SubNav from '../foundations/sub-nav'
import AddAgentForm from './add-agent-form'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import { Button } from '../shadcn/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getRights } from '@/utils/getRights'
import Empty from '../foundations/empty'
import { DevelopmentOfficerResponseTypes } from '@/types/developmentOfficerTypes'
import { fetchDevelopmentOfficerList } from '@/helperFunctions/developmentOfficerFunction'
import { useQuery } from '@tanstack/react-query'
import { BranchResponseType } from '@/types/branchTypes'
import { fetchBranchList } from '@/helperFunctions/branchFunction'
import LoadingState from '../foundations/loading-state'
import Error from '../foundations/error'

const AddAgent = () => {
  // Constants
  const LISTING_ROUTE = '/agents-dos/agents'

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

  // Fetch development officer list data using react-query
  const { data: developmentOfficerListResponse, isLoading: developmentOfficerListLoading, isError: developmentOfficerListIsError, error: developmentOfficerListError } = useQuery<DevelopmentOfficerResponseTypes | null>({
    queryKey: ['get-development-officers-list'],
    queryFn: fetchDevelopmentOfficerList,
  });

  // Rights Redirection
  if (rights?.can_create !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return <Empty title="Permission Denied" description="You do not have permission to add new agent." />;
  }

  // loading state
  if (developmentOfficerListLoading || branchListLoading) {
    return <LoadingState />
  }

  // error state
  if (branchListIsError || developmentOfficerListIsError) {
    return <Error err={branchListError?.message || developmentOfficerListError?.message} />
  }

  // empty state
  if ((branchListResponse?.payload?.length === 0 || !branchListResponse?.payload) &&
    (developmentOfficerListResponse?.payload?.length === 0 || !developmentOfficerListResponse?.payload)) {
    return <Empty title="Not Found" description="No branches or development officers found to populate the form." />;
  }

  return (
    <>
      <SubNav title="Add Agent" />
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
              Add a new agent to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <AddAgentForm branchList={branchListResponse?.payload} developmentOfficerList={developmentOfficerListResponse?.payload} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default AddAgent
