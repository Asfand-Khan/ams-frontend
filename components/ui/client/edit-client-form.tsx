"use client";

import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '../shadcn/button';
import { Loader2 } from 'lucide-react';
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import { BranchPayloadType } from '@/types/branchTypes';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClientSchema, ClientSchemaType } from '@/schemas/clientSchema';
import { toast } from 'sonner';
import { ClientPayloadType, ClientResponseType } from '@/types/clientTypes';
import { AxiosError } from 'axios';
import { axiosFunction } from '@/utils/axiosFunction';
import { Textarea } from '../shadcn/textarea';
import Select from 'react-select'
import useClientIdStore from '@/hooks/useClientIdStore';
import { selectStyles } from '@/utils/selectStyles';

interface EditClientFormProps {
  singleClient: ClientPayloadType | undefined
  branchList: BranchPayloadType[] | undefined
}

const EditClientForm: React.FC<EditClientFormProps> = ({ singleClient, branchList }) => {
  // Constants
  const LISTING_ROUTE = '/branches-clients/Clients-list'

  const queryClient = useQueryClient();
  const router = useRouter();
  const { clientId } = useClientIdStore();

  // Branch List Options
  const branchOptions = branchList?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  // Initialize form with React Hook Form and Zod validation
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      name: singleClient ? singleClient.name : "",
      igis_client_code: singleClient ? singleClient.igis_client_code : "",
      address: singleClient ? singleClient.address : "",
      telephone: singleClient ? singleClient.telephone : "",
      contact_person: singleClient ? singleClient.contact_person : "",
      branch_id: singleClient ? singleClient.branch_id : undefined,
    },
  });

  // Mutation
  const editClientMutation = useMutation<
    ClientResponseType,
    AxiosError<ClientResponseType>,
    ClientSchemaType
  >({
    mutationKey: ['edit-client', clientId],
    mutationFn: (record) => {
      return axiosFunction({
        method: "PUT",
        urlPath: "/clients",
        data: record,
        isServer: true
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      console.log('Edit client mutation error', err)
      toast.error(message)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      reset()
      queryClient.invalidateQueries({ queryKey: ['clients-list'] });
      queryClient.invalidateQueries({ queryKey: ['single-client', clientId] });
      router.push(LISTING_ROUTE)
    }
  })

  // Submit handler
  const onSubmit = (data: ClientSchemaType) => {
    editClientMutation.mutate({ ...data, client_id: clientId! })
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2">
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
              placeholder="Enter client name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* IGIS Client Code */}
          <div className="space-y-2">
            <Label htmlFor="igis_client_code" className="gap-1 text-gray-600">
              IGIS Client Code<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="igis_client_code"
              {...register("igis_client_code")}
              placeholder="Enter IGIS client code"
            />
            {errors.igis_client_code && (
              <p className="text-red-500 text-sm">{errors.igis_client_code.message}</p>
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
          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="gap-1 text-gray-600">
              Address<span className="text-red-500 text-md">*</span>
            </Label>
            <Textarea
              id="address"
              {...register("address")}
              placeholder="Enter address"
              className='resize-none'
              rows={6}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="gap-1 text-gray-600">
              Telephone<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="phone"
              {...register("telephone")}
              placeholder="Enter telephone"
              maxLength={11}
            />
            {errors.telephone && (
              <p className="text-red-500 text-sm">{errors.telephone.message}</p>
            )}
          </div>

          {/* Contact Person */}
          <div className="space-y-2">
            <Label htmlFor="contact_person" className="gap-1 text-gray-600">
              Contact Person<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="contact_person"
              {...register("contact_person")}
              placeholder="Enter contact person"
            />
            {errors.contact_person && (
              <p className="text-red-500 text-sm">{errors.contact_person.message}</p>
            )}
          </div>

          {/* Form Action */}
          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={editClientMutation.isPending}
            >
              {editClientMutation.isPending ? 'Submitting' : 'Submit'}
              {editClientMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default EditClientForm