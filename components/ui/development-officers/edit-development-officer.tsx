'use client';

import { fetchBranchList } from '@/helperFunctions/branchFunction';
import { fetchSingleDevelopmentOfficer } from '@/helperFunctions/developmentOfficerFunction';
import useDevelopmentOfficerIdStore from '@/hooks/useDevelopmentOfficerStore';
import { BranchResponseType } from '@/types/branchTypes';
import { DevelopmentOfficerResponseTypes } from '@/types/developmentOfficerTypes';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react'
import LoadingState from '../foundations/loading-state';
import Error from '../foundations/error';
import Empty from '../foundations/empty';
import SubNav from '../foundations/sub-nav';
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card';
import { Button } from '../shadcn/button';
import { ArrowLeft } from 'lucide-react';
import EditDevelopmentOfficerForm from './edit-development-officer-form';
import { getRights } from '@/utils/getRights';

const EditDevelopmentOfficer = () => {
  // Constants
  const LISTING_ROUTE = '/agents-dos/development-officers'

  const router = useRouter();
  const { developmentOfficerId } = useDevelopmentOfficerIdStore();

  // Rights
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE)
  }, [LISTING_ROUTE])

  // Fetch single development officer data using react-query
  const { data: singleDevelopmentOfficerResponse, isLoading: singleDevelopmentOfficerLoading, isError: singleDevelopmentOfficerIsError, error: singleDevelopmentOfficerError } = useQuery<DevelopmentOfficerResponseTypes | null>({
    queryKey: ['single-development-officer', developmentOfficerId],
    queryFn: () => fetchSingleDevelopmentOfficer(developmentOfficerId!),
    enabled: !!developmentOfficerId // Only fetch if agentId is available
  })

  // Fetch branch list data using react-query
  const { data: branchListResponse, isLoading: branchListLoading, isError: branchListIsError, error: branchListError } = useQuery<BranchResponseType | null>({
    queryKey: ['get-branch-list'],
    queryFn: fetchBranchList
  })

  // Rights Redirection
  if (rights?.can_edit !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return <Empty title="Permission Denied" description="You do not have permission to edit existing development officer." />;
  }

  // Loading State
  if (branchListLoading || singleDevelopmentOfficerLoading) {
    return <LoadingState />
  }

  // Error State
  if (branchListIsError || singleDevelopmentOfficerIsError) {
    return <Error err={branchListError?.message || singleDevelopmentOfficerError?.message} />
  }

  // Empty State
  if (!developmentOfficerId) {
    setTimeout(() => {
      router.push(LISTING_ROUTE)
    }, 1500);

    return <Empty title="Not Found" description="Development Officer Id not Found. Redirecting to Development Officer List..." />;
  }

  return (
    <>
      <SubNav title="Edit Development Officer" />
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
              Edit existing development officer to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <EditDevelopmentOfficerForm singleDevelopmentOfficer={singleDevelopmentOfficerResponse?.payload[0]} branchList={branchListResponse?.payload} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default EditDevelopmentOfficer
