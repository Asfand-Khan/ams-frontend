"use client";

import useCallUsIdStore from "@/hooks/useCallUsIdStore"
import Error from "../foundations/error"
import EditCallUsForm from "./edit-call-us-form"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { fetchSingleCallUs } from "@/helperFunctions/callUsFunction"
import Empty from "../foundations/empty"
import { CallUsResponseType } from "@/types/callUsTypes"
import SubNav from "../foundations/sub-nav";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Button } from "../shadcn/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LoadingState from "../foundations/loading-state";

const EditCallUs = () => {
  // Constants
  const LISTING_URL = '/customer-service/call-us'

  const { callUsId } = useCallUsIdStore()
  const router = useRouter()

  // Fetch single call us
  const { data: singleCallUsResponse, isLoading: singleCallUsLoading, isError: singleCallUsIsError, error } = useQuery<CallUsResponseType | null>({
    queryKey: ["single-call-us", callUsId],
    queryFn: () => fetchSingleCallUs(callUsId!),
    enabled: !!callUsId // Only fetch if callUsId is available
  })

  // Loading state
  if (singleCallUsLoading) {
    return <LoadingState />
  }

  // Error state
  if (singleCallUsIsError) {
    return <Error err={error?.message} />
  }

  // Empty and redirect state
  if (!callUsId) {
    setTimeout(() => {
      router.push(LISTING_URL)
    })
    return <Empty title="Not Found" description="Call us Id not Found. Redirecting to Call us List..." />;
  }

  return (
    <>
      <SubNav
        title='Edit Call Us'
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
              Edit existing call us data to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'>
            <EditCallUsForm singleCallUs={singleCallUsResponse?.payload[0]} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default EditCallUs
