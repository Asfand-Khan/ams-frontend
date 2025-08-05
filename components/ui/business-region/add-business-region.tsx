"use client";

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getRights } from '@/utils/getRights'
import SubNav from '../foundations/sub-nav'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import { Button } from '../shadcn/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AddBusinessRegionForm from './add-business-region-form';

const AddBusinessRegion = () => {
  // Constants
  const LISTING_URL = '/branches-clients/business-regions-list'

  const router = useRouter()

  // Rights
  const rights = useMemo(() => {
    return getRights(LISTING_URL)
  }, [LISTING_URL])


  if (rights?.can_create !== "1") {
    router.push(LISTING_URL)
  }

  return (
    <>
      <SubNav
        title='Add Business Regions'
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
              Add a new business region to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'>
            <AddBusinessRegionForm />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default AddBusinessRegion
