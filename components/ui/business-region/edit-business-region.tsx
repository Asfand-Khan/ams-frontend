"use client";

import Error from "../foundations/error"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { fetchSingleBusinessRegion } from "@/helperFunctions/businessRegionFunction"
import Empty from "../foundations/empty"
import SubNav from "../foundations/sub-nav";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Button } from "../shadcn/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LoadingState from "../foundations/loading-state";
import useBusinessRegionIdStore from "@/hooks/useBusinessRegionIdStore";
import { BusinessRegionResponseType } from "@/types/businessRegionTypes";
import EditBusinessRegionForm from "./edit-business-region-form";

const EditBusinessRegion = () => {
  // Constants
  const LISTING_URL = '/branches-clients/business-regions-list'

  const { businessRegionId } = useBusinessRegionIdStore();
  const router = useRouter()

  // Fetch single business region
  const { data: singleBusinessRegionResponse, isLoading: singleBusinessRegionLoading, isError: singleBusinessRegionIsError, error } = useQuery<BusinessRegionResponseType | null>({
    queryKey: ["single-business-region", businessRegionId],
    queryFn: () => fetchSingleBusinessRegion(businessRegionId!),
    enabled: !!businessRegionId // Only fetch if businessRegionId is available
  })

  // Loading state
  if (singleBusinessRegionLoading) {
    return <LoadingState />
  }

  // Error state
  if (singleBusinessRegionIsError) {
    return <Error err={error?.message} />
  }

  // Empty and redirect state
  if (!businessRegionId) {
    setTimeout(() => {
      router.push(LISTING_URL)
    })
    return <Empty title="Not Found" description="Business Region Id not Found. Redirecting to business region List..." />;
  }

  return (
    <>
      <SubNav
        title='Edit Business Region'
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
              Edit existing business region to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'>
            <EditBusinessRegionForm singleBusinessRegion={singleBusinessRegionResponse?.payload[0]} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default EditBusinessRegion
