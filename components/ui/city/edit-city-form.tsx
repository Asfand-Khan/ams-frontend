"use client";

import { CityPayloadType, CityResponseType } from '@/types/cityTypes';
import { axiosFunction } from '@/utils/axiosFunction';
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner';
import { Button } from '../shadcn/button';
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import { Checkbox } from '../shadcn/checkbox';
import { CitySchema, CitySchemaType } from '@/schemas/citySchema';
import Select from 'react-select';
import useCityIdStore from '@/hooks/useCityIdStore';
import { selectStyles } from '@/utils/selectStyles';

interface EditCityForm {
  singleCity: CityPayloadType | undefined
}

const EditCityForm: React.FC<EditCityForm> = ({ singleCity }) => {
  // Constants
  const LISTING_URL = '/cites-couiers/cities'

  const { cityId } = useCityIdStore()
  const queryClient = useQueryClient()
  const router = useRouter()

  // Form via react hook form
  const { handleSubmit, register, formState: { errors }, control } = useForm({
    resolver: zodResolver(CitySchema),
    defaultValues: {
      country_id: singleCity ? singleCity?.country_id : undefined,
      igis_city_code: singleCity ? singleCity?.igis_city_code : "",
      city_name: singleCity ? singleCity?.city_name : "",
      city_code: singleCity ? singleCity?.city_code : "",
      priority: singleCity ? singleCity?.priority : undefined,
      is_tcs: singleCity ? singleCity?.is_tcs : undefined,
      is_blueEx: singleCity ? singleCity?.is_blueEx : undefined,
      is_leopard: singleCity ? singleCity?.is_leopard : undefined,
    }
  })

  // Country options
  const countryOptions = [{ value: 1, label: "Pakistan" }]
  // Priority options
  const priorityOptions = [{ value: 1, label: "Yes" }, { value: 0, label: "No" }]

  // Mutation handler
  const editCityMutation = useMutation<
    CityResponseType,
    AxiosError<CityResponseType>,
    CitySchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "PUT",
        urlPath: "/cities",
        isServer: true,
        data: record
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      toast.error(message)
      console.log('Add city mutation error', err)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ["single-city", cityId] })
      queryClient.invalidateQueries({ queryKey: ["city-list"] })
      router.push(LISTING_URL)

    }
  })

  // Submit Form
  const onSubmit = (data: CitySchemaType) => {
    const finalData = {
      ...data,
      city_id: cityId
    }

    editCityMutation.mutate(finalData);
  }


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-2 gap-6'>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='country_id' className='gap-1 text-gray-600'>
              Country<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Controller
                control={control}
                name='country_id'
                render={({ field }) => (
                  <Select
                    options={countryOptions}
                    value={countryOptions.find((item) => item.value === field.value)}
                    onChange={(selectedVal) => field.onChange(selectedVal ? selectedVal.value : undefined)}
                    id="country_id"
                    placeholder="Select Country"
                    styles={selectStyles}
                  />
                )}
              />
              {errors.country_id && (
                <p className='text-red-500 text-sm'>
                  {errors.country_id.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='igis_city_code' className='gap-1 text-gray-600'>
              Igis city code<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='igis_city_code'
                placeholder='Enter Igis city code'
                {...register('igis_city_code')}
              />
              {errors.igis_city_code && (
                <p className='text-red-500 text-sm'>
                  {errors.igis_city_code.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='city_name' className='gap-1 text-gray-600'>
              City Name<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='city_name'
                placeholder='Enter city name'
                {...register('city_name')}
              />
              {errors.city_name && (
                <p className='text-red-500 text-sm'>
                  {errors.city_name.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='city_code' className='gap-1 text-gray-600'>
              City Code<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='city_code'
                placeholder='Enter city code'
                {...register('city_code')}
              />
              {errors.city_code && (
                <p className='text-red-500 text-sm'>
                  {errors.city_code.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='priority' className='gap-1 text-gray-600'>Priority</Label>
            <div className='space-y-2'>
              <Controller
                control={control}
                name='priority'
                render={({ field }) => (
                  <Select
                    options={priorityOptions}
                    value={priorityOptions.find((item) => item.value === field.value)}
                    onChange={(selectedVal) => field.onChange(selectedVal?.value)}
                    id="priority"
                    placeholder="Select Priority"
                    styles={selectStyles}
                  />
                )}
              />
              {errors.priority && (
                <p className='text-red-500 text-sm'>
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label className='gap-1 text-gray-600'>Courier Services</Label>
            <div className='space-y-4'>
              <div className='flex items-center space-x-2'>
                <Controller
                  control={control}
                  name='is_tcs'
                  render={({ field }) => (
                    <Checkbox
                      id='is_tcs'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor='is_tcs' className='text-gray-600'>
                  TCS
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Controller
                  control={control}
                  name='is_blueEx'
                  render={({ field }) => (
                    <Checkbox
                      id='is_blueEx'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor='is_blueEx' className='text-gray-600'>
                  BlueEx
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Controller
                  control={control}
                  name='is_leopard'
                  render={({ field }) => (
                    <Checkbox
                      id='is_leopard'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor='is_leopard' className='text-gray-600'>
                  Leopard
                </Label>
              </div>
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={editCityMutation.isPending}
            >
              {editCityMutation.isPending ? 'Submitting' : 'Submit'}
              {editCityMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default EditCityForm