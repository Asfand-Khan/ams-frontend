"use client";

import { IgisMakeSchema, IgisMakeSchemaType } from '@/schemas/IgisMakeSchema';
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
import { IgisMakeResponseType } from '@/types/igisTypes';

const AddIgisMakeForm = () => {
  // Constants
  const LISTING_URL = '/igis/igis-makes'

  const queryClient = useQueryClient()

  const router = useRouter()

  // Form via react hook form
  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(IgisMakeSchema),
    defaultValues: {
      make_name: "",
      igis_make_code: "",
    }
  })

  // Mutation handler
  const addIgisMakeMutation = useMutation<
    IgisMakeResponseType,
    AxiosError<IgisMakeResponseType>,
    IgisMakeSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/igis-makes",
        isServer: true,
        data: record
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      toast.error(message)
      console.log('Add igis make mutation error', err)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['igis-make-list'] })
      router.push(LISTING_URL)

    }
  })

  // Submit Form
  const onSubmit = (data: IgisMakeSchemaType) => {
    addIgisMakeMutation.mutate(data);
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-2'>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='make_name' className='gap-1 text-gray-600'>
              Make name<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='make_name'
                placeholder='Enter Make name'
                {...register('make_name')}
              />
              {errors.make_name && (
                <p className='text-red-500 text-sm'>
                  {errors.make_name.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='igis_make_code' className='gap-1 text-gray-600'>
              Igis Make Code<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='igis_make_code'
                placeholder='Enter Igis Make Code'
                {...register('igis_make_code')}
              />
              {errors.igis_make_code && (
                <p className='text-red-500 text-sm'>
                  {errors.igis_make_code.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={addIgisMakeMutation.isPending}
            >
              {addIgisMakeMutation.isPending ? 'Submitting' : 'Submit'}
              {addIgisMakeMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default AddIgisMakeForm