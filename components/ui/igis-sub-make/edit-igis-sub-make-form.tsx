"use client";

import { IgisSubMakeSchema, IgisSubMakeSchemaType } from '@/schemas/igisSubMakeSchema';
import { IgisMakePayloadType, IgisSubMakePayloadType, IgisSubMakeResponseType } from '@/types/igisTypes';
import { axiosFunction } from '@/utils/axiosFunction';
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner';
import { Button } from '../shadcn/button';
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import useIgisSubMakeIdStore from '@/hooks/useIgisSubMakeIdStore';
import Select from 'react-select';
import { selectStyles } from '@/utils/selectStyles';

interface EditIgisSubMakeForm {
  singleIgisSubMake: IgisSubMakePayloadType | undefined
  makeList: IgisMakePayloadType[] | undefined
}

const EditIgisSubMakeForm: React.FC<EditIgisSubMakeForm> = ({ singleIgisSubMake, makeList }) => {
  // Constants
  const LISTING_URL = '/igis/igis-sub-makes'

  const { igisSubMakeId } = useIgisSubMakeIdStore()
  const queryClient = useQueryClient()
  const router = useRouter()

  // Form via react hook form
  const { handleSubmit, register, formState: { errors }, control } = useForm({
    resolver: zodResolver(IgisSubMakeSchema),
    defaultValues: {
      make_id: singleIgisSubMake ? singleIgisSubMake?.make_id : 0,
      sub_make_name: singleIgisSubMake ? singleIgisSubMake?.sub_make_name : "",
      igis_sub_make_code: singleIgisSubMake ? singleIgisSubMake?.igis_sub_make_code : "",
      seating_capacity: singleIgisSubMake ? singleIgisSubMake?.seating_capacity : 0,
      cubic_capacity: singleIgisSubMake ? singleIgisSubMake?.cubic_capacity : "",
      coi_type_code: singleIgisSubMake ? singleIgisSubMake?.coi_type_code : "",
    }
  })

  // Make name options
  const makeOptions = makeList?.map((item) => ({
    label: item.make_name,
    value: item.id
  }))

  // Mutation handler
  const editIgisSubMakeMutation = useMutation<
    IgisSubMakeResponseType,
    AxiosError<IgisSubMakeResponseType>,
    IgisSubMakeSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "PUT",
        urlPath: '/igis-sub-makes',
        isServer: true,
        data: record
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      toast.error(message)
      console.log('Add igis sub make mutation error', err)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ["single-igis-sub-make", igisSubMakeId] })
      queryClient.invalidateQueries({ queryKey: ['igis-sub-make-list'] })
      router.push(LISTING_URL)
    }
  })

  // Submit Form
  const onSubmit = (data: IgisSubMakeSchemaType) => {
    const finalData = {
      ...data,
      sub_make_id: igisSubMakeId
    }
    editIgisSubMakeMutation.mutate(finalData);
  }


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-2'>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='make_id' className='gap-1 text-gray-600'>
              Make name<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Controller
                name="make_id"
                control={control}
                render={({ field }) => (
                  <Select
                    id="make_id"
                    options={makeOptions}
                    value={makeOptions?.find((item) => item.value === field.value)}
                    onChange={(selectedOption) => { field.onChange(selectedOption?.value) }}
                    placeholder="Select Make name"
                    className="w-full"
                    styles={selectStyles}
                  />
                )}
              />

              {errors.make_id && (
                <p className='text-red-500 text-sm'>
                  {errors.make_id.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='sub_make_name' className='gap-1 text-gray-600'>
              Sub Make Name<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='sub_make_name'
                placeholder='Enter Sub make name'
                {...register('sub_make_name')}
              />
              {errors.sub_make_name && (
                <p className='text-red-500 text-sm'>
                  {errors.sub_make_name.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='igis_sub_make_code' className='gap-1 text-gray-600'>
              Igis Sub Make Code<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='igis_sub_make_code'
                placeholder='Enter Igis sub make code'
                {...register('igis_sub_make_code')}
              />
              {errors.igis_sub_make_code && (
                <p className='text-red-500 text-sm'>
                  {errors.igis_sub_make_code.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='seating_capacity' className='gap-1 text-gray-600'>
              Seating Capacity<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='number'
                id='seating_capacity'
                placeholder='Enter Seating capacity'
                {...register('seating_capacity', { valueAsNumber: true })}
              />
              {errors.seating_capacity && (
                <p className='text-red-500 text-sm'>
                  {errors.seating_capacity.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='cubic_capacity' className='gap-1 text-gray-600'>
              Cubic Capacity<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='cubic_capacity'
                placeholder='Enter Cubic capacity'
                {...register('cubic_capacity')}
              />
              {errors.cubic_capacity && (
                <p className='text-red-500 text-sm'>
                  {errors.cubic_capacity.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='coi_type_code' className='gap-1 text-gray-600'>
              COI Type Code<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='coi_type_code'
                placeholder='Enter COI type code'
                {...register('coi_type_code')}
              />
              {errors.coi_type_code && (
                <p className='text-red-500 text-sm'>
                  {errors.coi_type_code.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={editIgisSubMakeMutation.isPending}
            >
              {editIgisSubMakeMutation.isPending ? 'Submitting' : 'Submit'}
              {editIgisSubMakeMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default EditIgisSubMakeForm