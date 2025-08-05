"use client";

import useIgisMakeIdStore from "@/hooks/useIgisMakeIdStore"
import Error from "../foundations/error"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { fetchSingleIgisMake } from "@/helperFunctions/igisFunction"
import Empty from "../foundations/empty"
import { IgisMakeResponseType } from "@/types/igisTypes"
import SubNav from "../foundations/sub-nav";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Button } from "../shadcn/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EditIgisMakeForm from "./edit-igis-make-form";
import LoadingState from "../foundations/loading-state";

const EditIgisMake = () => {
  // Constants
  const LISTING_URL = '/igis/igis-makes'

  const { igisMakeId } = useIgisMakeIdStore()
  const router = useRouter()

  // Fetch single igis make
  const { data: singleIgisMakeResponse, isLoading: singleIgisMakeLoading, isError: singleIgisMakeIsError, error } = useQuery<IgisMakeResponseType | null>({
    queryKey: ["single-igis-make", igisMakeId],
    queryFn: () => fetchSingleIgisMake(igisMakeId!),
    enabled: !!igisMakeId // Only fetch if igisMakeId is available
  })

  // Loading state
  if (singleIgisMakeLoading) {
    return <LoadingState />
  }

  // Error state
  if (singleIgisMakeIsError) {
    return <Error err={error?.message} />
  }

  // Empty and redirect state
  if (!igisMakeId) {
    setTimeout(() => {
      router.push(LISTING_URL)
    })
    return <Empty title="Not Found" description="Igis make Id not Found. Redirecting to Igis make List..." />;
  }

  return (
    <>
      <SubNav
        title='Edit Igis Make'
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
              Edit existing igis make to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'>
            <EditIgisMakeForm singleIgisMake={singleIgisMakeResponse?.payload[0]} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default EditIgisMake
