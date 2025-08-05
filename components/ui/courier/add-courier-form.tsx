"use client";

import { axiosFunction } from '@/utils/axiosFunction';
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner';
import { Button } from '../shadcn/button';
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import { Checkbox } from '../shadcn/checkbox';
import { CourierSchema, CourierSchemaType } from '@/schemas/courierSchema';
import { CourierResponseType } from '@/types/courierTypes';

const AddCourierForm = () => {
  // Constants
  const LISTING_URL = '/cites-couiers/couriers'

  const queryClient = useQueryClient()
  const [toggleEye, setToggleEye] = useState(false);
  const router = useRouter()

  // Form via react hook form
  const { handleSubmit, register, formState: { errors }, control } = useForm({
    resolver: zodResolver(CourierSchema),
    defaultValues: {
      name: "",
      api_code: "",
      account_number: "",
      user: "",
      password: "",
      book_url: "",
      tracking_url: "",
      is_takaful: false
    }
  })


  // Mutation handler
  const addCourierMutation = useMutation<
    CourierResponseType,
    AxiosError<CourierResponseType>,
    CourierSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/couriers",
        isServer: true,
        data: record
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      toast.error(message)
      console.log('Add courier mutation error', err)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ["courier-list"] })
      router.push(LISTING_URL)
    }
  })

  // Submit Form
  const onSubmit = (data: CourierSchemaType) => {
    const finalDate = {
      name: data.name,
      api_code: data.api_code,
      account_number: data.account_number,
      user: data.user,
      password: data.password,
      ...(data.book_url && { book_url: data.book_url }),
      ...(data.tracking_url && { tracking_url: data.tracking_url }),
      ...(data.is_takaful && { is_takaful: data.is_takaful })
    }
    addCourierMutation.mutate(finalDate);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-2 gap-6'>
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
            <Label htmlFor='api_code' className='gap-1 text-gray-600'>
              Api Code<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='api_code'
                placeholder='Enter Api code'
                {...register('api_code')}
              />
              {errors.api_code && (
                <p className='text-red-500 text-sm'>
                  {errors.api_code.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='account_number' className='gap-1 text-gray-600'>
              Account Number<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='account_number'
                placeholder='Enter Account number'
                {...register('account_number')}
              />
              {errors.account_number && (
                <p className='text-red-500 text-sm'>
                  {errors.account_number.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='user' className='gap-1 text-gray-600'>
              User<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='user'
                placeholder='Enter User'
                {...register('user')}
              />
              {errors.user && (
                <p className='text-red-500 text-sm'>
                  {errors.user.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password' className='gap-1 text-gray-600'>
              Password<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <div className='relative'>
                <Input id="password" type={toggleEye ? "text" : "password"} {...register('password')} placeholder='Password' />
                <Button
                  type='button'
                  variant="ghost" size="sm" className='absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer' onClick={() => setToggleEye((prevState) => !prevState)}>
                  {toggleEye ? <Eye /> : <EyeOff />}
                </Button>
              </div>
              {errors.password && (
                <p className='text-red-500 text-sm'>
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='book_url' className='gap-1 text-gray-600'>Book Url</Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='book_url'
                placeholder='Enter book url'
                {...register('book_url')}
              />
              {errors.book_url && (
                <p className='text-red-500 text-sm'>
                  {errors.book_url.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='tracking_url' className='gap-1 text-gray-600'>Tracking Url</Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='tracking_url'
                placeholder='Enter tracking url'
                {...register('tracking_url')}
              />
              {errors.tracking_url && (
                <p className='text-red-500 text-sm'>
                  {errors.tracking_url.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label className='gap-1 text-gray-600'>Takaful</Label>
            <div className='flex items-center space-x-2'>
              <Controller
                control={control}
                name='is_takaful'
                render={({ field }) => (
                  <Checkbox
                    id='is_takaful'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor='is_takaful' className='text-gray-600'>
                Yes
              </Label>
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={addCourierMutation.isPending}
            >
              {addCourierMutation.isPending ? 'Submitting' : 'Submit'}
              {addCourierMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default AddCourierForm