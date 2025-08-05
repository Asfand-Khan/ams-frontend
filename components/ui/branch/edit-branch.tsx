'use client';

import { fetchSingleBranch } from '@/helperFunctions/branchFunction';
import useBranchIdStore from '@/hooks/useBranchIdStore';
import { BranchResponseType } from '@/types/branchTypes';
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
import EditBranchForm from './edit-branch-form';
import { getRights } from '@/utils/getRights';

const EditBranch = () => {
  // Constants
  const LISTING_ROUTE = '/branches-clients/branch-list';

  const router = useRouter();
  const { branchId } = useBranchIdStore();

  // Rights
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE)
  }, [LISTING_ROUTE])

  // Fetch single branch data using React Query
  const { data: singleBranchResponse, isLoading: singleBranchLoading, isError: singleBranchIsError, error } = useQuery<BranchResponseType | null>({
    queryKey: ['single-branch', branchId],
    queryFn: () => fetchSingleBranch(branchId!),
    enabled: !!branchId // Only fetch if branchId is available
  })

  // Rights Redirection
  if (rights?.can_edit !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return <Empty title="Permission Denied" description="You do not have permission to edit existing branch" />;
  }

  // Loading state
  if (singleBranchLoading) {
    return <LoadingState />
  }

  // Error state
  if (singleBranchIsError) {
    return <Error err={error?.message} />
  }

  // Empty and redirect state
  if (!branchId) {
    setTimeout(() => {
      router.push(LISTING_ROUTE)
    }, 1500);

    return <Empty title="Not Found" description="Branch Id not Found. Redirecting to Branch List..." />;
  }

  return (
    <>
      <SubNav title="Edit Branch" />

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
              Edit branch to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <EditBranchForm singleBranch={singleBranchResponse?.payload[0]} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default EditBranch
