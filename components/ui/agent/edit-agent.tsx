"use client";

import { fetchSingleAgent } from '@/helperFunctions/agentFunction';
import { fetchBranchList } from '@/helperFunctions/branchFunction';
import { fetchDevelopmentOfficerList } from '@/helperFunctions/developmentOfficerFunction';
import useAgentIdStore from '@/hooks/useAgentIdStore';
import { AgentResponseTypes } from '@/types/agentTypes';
import { BranchResponseType } from '@/types/branchTypes';
import { DevelopmentOfficerResponseTypes } from '@/types/developmentOfficerTypes';
import { getRights } from '@/utils/getRights';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react'
import Empty from '../foundations/empty';
import Error from '../foundations/error';
import LoadingState from '../foundations/loading-state';
import SubNav from '../foundations/sub-nav';
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card';
import { Button } from '../shadcn/button';
import { ArrowLeft } from 'lucide-react';
import EditAgentForm from './edit-agent-form';

const EditAgent = () => {
  // Constants
  const LISTING_ROUTE = '/agents-dos/agents'

  const router = useRouter();
  const { agentId } = useAgentIdStore();

  // Rights
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE)
  }, [LISTING_ROUTE])

  // Fetch single agent data using react-query
  const { data: singleAgentResponse, isLoading: singleAgentLoading, isError: singleAgentIsError, error: singleAgentError } = useQuery<AgentResponseTypes | null>({
    queryKey: ['single-agent', agentId],
    queryFn: () => fetchSingleAgent(agentId!),
    enabled: !!agentId // Only fetch if agentId is available
  })

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
  if (rights?.can_edit !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return <Empty title="Permission Denied" description="You do not have permission to edit existing agent" />;
  }

  // Loading state
  if (developmentOfficerListLoading || branchListLoading || singleAgentLoading) {
    return <LoadingState />
  }

  // Error state
  if (branchListIsError || developmentOfficerListIsError || singleAgentIsError) {
    return <Error err={branchListError?.message || developmentOfficerListError?.message || singleAgentError?.message} />
  }

  // Empty and redirect state
  if (!agentId) {
    setTimeout(() => {
      router.push(LISTING_ROUTE)
    })
    return <Empty title="Not Found" description="Agent Id not Found. Redirecting to Agent List..." />;
  }


  return (
    <>
      <SubNav title="Edit Agent" />
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
              Edit existing agent to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <EditAgentForm branchList={branchListResponse?.payload} developmentOfficerList={developmentOfficerListResponse?.payload} singleAgent={singleAgentResponse?.payload[0]} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default EditAgent
