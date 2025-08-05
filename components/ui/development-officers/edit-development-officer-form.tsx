"use client";

import React from 'react'
import { BranchPayloadType } from '@/types/branchTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { DevelopmentOfficerSchema, DevelopmentOfficerSchemaType } from '@/schemas/developmentOfficerSchema';
import { toast } from 'sonner';
import { DevelopmentOfficerPayloadTypes, DevelopmentOfficerResponseTypes } from '@/types/developmentOfficerTypes';
import { AxiosError } from 'axios';
import { axiosFunction } from '@/utils/axiosFunction';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../shadcn/button';
import { Loader2 } from 'lucide-react';
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import Select from 'react-select'
import useDevelopmentOfficerIdStore from '@/hooks/useDevelopmentOfficerStore';
import { selectStyles } from '@/utils/selectStyles';

interface EditDevelopmentOfficerFormProps {
  singleDevelopmentOfficer: DevelopmentOfficerPayloadTypes | undefined
  branchList: BranchPayloadType[] | undefined
}

const EditDevelopmentOfficerForm: React.FC<EditDevelopmentOfficerFormProps> = ({ singleDevelopmentOfficer, branchList }) => {
  // Constants
  const LISTING_ROUTE = '/agents-dos/development-officers'

  const queryClient = useQueryClient();
  const router = useRouter();
  const { developmentOfficerId } = useDevelopmentOfficerIdStore();

  // Branch List options
  const branchOptions = branchList?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  // Form
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(DevelopmentOfficerSchema),
    defaultValues: {
      name: singleDevelopmentOfficer ? singleDevelopmentOfficer.name : "",
      branch_id: singleDevelopmentOfficer ? singleDevelopmentOfficer.branch_id : undefined,
      igis_do_code: singleDevelopmentOfficer ? singleDevelopmentOfficer.igis_do_code : "",
      igis_code: singleDevelopmentOfficer ? singleDevelopmentOfficer.igis_code : "",
    },
  });

  // mutation
  const editDevelopmentOfficerMutation = useMutation<
    DevelopmentOfficerResponseTypes,
    AxiosError<DevelopmentOfficerResponseTypes>,
    DevelopmentOfficerSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "PUT",
        urlPath: "/development-officers",
        data: record,
        isServer: true
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      console.log('Edit Development Officer mutation error', err)
      toast.error(message)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      reset()
      queryClient.invalidateQueries({ queryKey: ['single-development-officer', developmentOfficerId] })
      queryClient.invalidateQueries({ queryKey: ['development-officers-list'] })
      router.push(LISTING_ROUTE)
    }
  })

  // Submit handler
  const onSubmit = (data: DevelopmentOfficerSchemaType) => {
    editDevelopmentOfficerMutation.mutate({ ...data, do_id: developmentOfficerId! })
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-1/2">
        <div className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="gap-1 text-gray-600">
              Name<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="name"
              {...register("name")}
              placeholder="Enter development officer name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* IGIS DO Code */}
          <div className="space-y-2">
            <Label htmlFor="igis_do_code" className="gap-1 text-gray-600">
              IGIS DO Code<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="igis_do_code"
              {...register("igis_do_code")}
              placeholder="Enter IGIS DO code"
            />
            {errors.igis_do_code && (
              <p className="text-red-500 text-sm">{errors.igis_do_code.message}</p>
            )}
          </div>

          {/* IGIS Code */}
          <div className="space-y-2">
            <Label htmlFor="igis_code" className="gap-1 text-gray-600">
              IGIS Code<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="igis_code"
              {...register("igis_code")}
              placeholder="Enter IGIS code"
            />
            {errors.igis_code && (
              <p className="text-red-500 text-sm">{errors.igis_code.message}</p>
            )}
          </div>

          {/* Branch ID */}
          <div className="space-y-2">
            <Label htmlFor="branch_id" className="gap-1 text-gray-600">
              Branch ID<span className="text-red-500 text-md">*</span>
            </Label>
            <Controller
              control={control}
              name='branch_id'
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  id="branch_id"
                  options={branchOptions}
                  value={branchOptions?.find(option => option.value === field.value) || null}
                  onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : null)}
                  placeholder="Select Branch"
                  className="w-full"
                  styles={selectStyles}
                />
              )}
            />
            {errors.branch_id && (
              <p className="text-red-500 text-sm">{errors.branch_id.message}</p>
            )}
          </div>

          {/* Form Action */}
          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={editDevelopmentOfficerMutation.isPending}
            >
              {editDevelopmentOfficerMutation.isPending ? 'Updating' : 'Update'}
              {editDevelopmentOfficerMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default EditDevelopmentOfficerForm