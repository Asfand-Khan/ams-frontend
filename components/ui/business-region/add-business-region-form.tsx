"use client";

import { axiosFunction } from '@/utils/axiosFunction';
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner';
import { Button } from '../shadcn/button';
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import { BusinessRegionSchema, BusinessRegionSchemaType } from '@/schemas/businessRegionSchema';
import { BusinessRegionResponseType } from '@/types/businessRegionTypes';

const AddBusinessRegionForm = () => {
  // Constants
  const LISTING_URL = '/branches-clients/business-regions-list'

  const queryClient = useQueryClient()

  const router = useRouter()

  // Form via react hook form
  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(BusinessRegionSchema),
    defaultValues: {
      business_region_name: "",
      igis_business_region_code: ""
    }
  })

  // Mutation handler
  const addBusinessRegionMutation = useMutation<
    BusinessRegionResponseType,
    AxiosError<BusinessRegionResponseType>,
    BusinessRegionSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/business-regions",
        isServer: true,
        data: record
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      toast.error(message)
      console.log('Add business region mutation error', err)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ["business-region-list"] })
      router.push(LISTING_URL)

    }
  })

  // Submit Form
  const onSubmit = (data: BusinessRegionSchemaType) => {
    addBusinessRegionMutation.mutate(data);
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-2'>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='business_region_name' className='gap-1 text-gray-600'>
              Business Region Name<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='business_region_name'
                placeholder='Enter Business region name'
                {...register('business_region_name')}
              />
              {errors.business_region_name && (
                <p className='text-red-500 text-sm'>
                  {errors.business_region_name.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='igis_business_region_code' className='gap-1 text-gray-600'>
              Igis Business Region Code<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='igis_business_region_code'
                placeholder='Enter Igis business region code'
                {...register('igis_business_region_code')}
              />
              {errors.igis_business_region_code && (
                <p className='text-red-500 text-sm'>
                  {errors.igis_business_region_code.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={addBusinessRegionMutation.isPending}
            >
              {addBusinessRegionMutation.isPending ? 'Submitting' : 'Submit'}
              {addBusinessRegionMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default AddBusinessRegionForm