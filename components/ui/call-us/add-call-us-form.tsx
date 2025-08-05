"use client";

import { CallUsSchema, CallUsSchemaType } from '@/schemas/callUsSchema';
import { CallUsResponseType } from '@/types/callUsTypes';
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

const AddCallUsForm = () => {
  // Constants
  const LISTING_URL = '/customer-service/call-us'

  const queryClient = useQueryClient()

  const router = useRouter()

  // Form via react hook form
  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(CallUsSchema),
    defaultValues: {
      name: "",
      contact: "",
      email: ""
    }
  })

  // Mutation handler
  const addCallUsMutation = useMutation<
    CallUsResponseType,
    AxiosError<CallUsResponseType>,
    CallUsSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/call-us-data",
        isServer: true,
        data: record
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      toast.error(message)
      console.log('Add call us mutation error', err)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ["call-us-list"] })
      router.push(LISTING_URL)

    }
  })

  // Submit Form
  const onSubmit = (data: CallUsSchemaType) => {
    addCallUsMutation.mutate(data);
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-2'>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='name' className='gap-1 text-gray-600'>
              Name<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='name'
                placeholder='Enter Name'
                {...register('name')}
              />
              {errors.name && (
                <p className='text-red-500 text-sm'>
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email' className='gap-1 text-gray-600'>
              Email<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='email'
                placeholder='Enter Email'
                {...register('email')}
              />
              {errors.email && (
                <p className='text-red-500 text-sm'>
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='contact' className='gap-1 text-gray-600'>
              Contact<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='contact'
                placeholder='Enter Contact'
                {...register('contact')}
              />
              {errors.contact && (
                <p className='text-red-500 text-sm'>
                  {errors.contact.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={addCallUsMutation.isPending}
            >
              {addCallUsMutation.isPending ? 'Submitting' : 'Submit'}
              {addCallUsMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default AddCallUsForm