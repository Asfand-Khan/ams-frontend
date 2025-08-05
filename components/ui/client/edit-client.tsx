'use client'

import React, { useMemo } from 'react'
import EditClientForm from './edit-client-form'
import SubNav from '../foundations/sub-nav'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import { Button } from '../shadcn/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import useClientIdStore from '@/hooks/useClientIdStore'
import { getRights } from '@/utils/getRights'
import { fetchSingleClient } from '@/helperFunctions/clientFunction'
import { ClientResponseType } from '@/types/clientTypes'
import { BranchResponseType } from '@/types/branchTypes'
import { useQuery } from '@tanstack/react-query'
import LoadingState from '../foundations/loading-state'
import Error from '../foundations/error'
import Empty from '../foundations/empty'
import { fetchBranchList } from '@/helperFunctions/branchFunction'

const EditClient = () => {

  // Constants
  const LISTING_ROUTE = '/branches-clients/Clients-list'

  const router = useRouter();
  const { clientId } = useClientIdStore();

  // Rights
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE)
  }, [LISTING_ROUTE])

  // Fetch single client data using react-query
  const { data: singleClientResponse, isLoading: singleClientLoading, isError: singleClientIsError, error: singleClientError } = useQuery<ClientResponseType | null>({
    queryKey: ['single-client', clientId],
    queryFn: () => fetchSingleClient(clientId!),
    enabled: !!clientId // Only fetch if agentId is available
  })

  // Fetch branch list data using react-query
  const { data: branchListResponse, isLoading: branchListLoading, isError: branchListIsError, error: branchListError } = useQuery<BranchResponseType | null>({
    queryKey: ['edit-client-branch-list'],
    queryFn: fetchBranchList
  })


  if (rights?.can_edit !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return <Empty title="Permission Denied" description="You do not have permission to edit existing client." />;
  }

  // loading state
  if (branchListLoading || singleClientLoading) {
    return <LoadingState />
  }

  // error state
  if (branchListIsError || singleClientIsError) {
    return <Error err={branchListError?.message || singleClientError?.message} />
  }

  // empty state
  if (!clientId) {
    setTimeout(() => {
      router.push(LISTING_ROUTE)
    }, 1500);

    return <Empty title="Not Found" description="Client Id not Found. Redirecting to Client List..." />;
  }

  return (
    <>
      <SubNav title="Edit Client" />

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
              Edit existing client to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <EditClientForm branchList={branchListResponse?.payload} singleClient={singleClientResponse?.payload[0]} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default EditClient
