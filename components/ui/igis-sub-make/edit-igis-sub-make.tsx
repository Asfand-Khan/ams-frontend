"use client";

import Error from "../foundations/error"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { fetchIgisMakeList, fetchSingleIgisSubMake } from "@/helperFunctions/igisFunction"
import Empty from "../foundations/empty"
import { IgisMakeResponseType, IgisSubMakeResponseType } from "@/types/igisTypes"
import SubNav from "../foundations/sub-nav";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Button } from "../shadcn/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LoadingState from "../foundations/loading-state";
import useIgisSubMakeIdStore from "@/hooks/useIgisSubMakeIdStore";
import EditIgisSubMakeForm from "./edit-igis-sub-make-form";

const EditIgisSubMake = () => {
  // Constants
  const LISTING_URL = '/igis/igis-sub-makes'

  const { igisSubMakeId } = useIgisSubMakeIdStore()
  const router = useRouter()

  // Fetch single igis make
  const { data: singleIgisSubMakeResponse, isLoading: singleIgisSubMakeLoading, isError: singleIgisSubMakeIsError, error: singleIgisSubMakeError } = useQuery<IgisSubMakeResponseType | null>({
    queryKey: ["single-igis-sub-make", igisSubMakeId],
    queryFn: () => fetchSingleIgisSubMake(igisSubMakeId!),
    enabled: !!igisSubMakeId // Only fetch if igisSubMakeId is available
  })

  // Fetch make name list
  const { data: igisMakeListResponse, isLoading: igisMakeListLoading, isError: igisMakeListIsError, error: igisMakeListError } = useQuery<IgisMakeResponseType | null>({
    queryKey: ['get-make-list'],
    queryFn: fetchIgisMakeList
  })

  // Loading state
  if (singleIgisSubMakeLoading || igisMakeListLoading) {
    return <LoadingState />
  }

  // Error state
  if (singleIgisSubMakeIsError || igisMakeListIsError) {
    return <Error err={igisMakeListError?.message || singleIgisSubMakeError?.message} />
  }

  // Empty and redirect state
  if (!igisSubMakeId) {
    setTimeout(() => {
      router.push(LISTING_URL)
    })
    return <Empty title="Not Found" description="Igis sub make Id not Found. Redirecting to Igis make List..." />;
  }

  return (
    <>
      <SubNav
        title='Edit Igis Sub Make'
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
              Edit existing igis sub make to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'>
            <EditIgisSubMakeForm singleIgisSubMake={singleIgisSubMakeResponse?.payload[0]} makeList={igisMakeListResponse?.payload} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default EditIgisSubMake
