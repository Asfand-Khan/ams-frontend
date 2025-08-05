"use client";

import React from 'react';
import { Button } from '../shadcn/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import BranchSchema, { BranchSchemaType } from '@/schemas/branchSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Textarea } from '../shadcn/textarea';
import { axiosFunction } from '@/utils/axiosFunction';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { BranchResponseType } from '@/types/branchTypes';

const AddBranchForm = () => {
  // Constants
  const LISTING_ROUTE = '/branches-clients/branch-list'

  const queryClient = useQueryClient();
  const router = useRouter();

  // Form
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(BranchSchema),
    defaultValues: {
      name: "",
      igis_branch_code: "",
      igis_takaful_code: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      his_code: "",
      his_code_takaful: "",
      sales_tax_perc: "",
      fed_insurance_fee: "",
      stamp_duty: undefined,
      admin_rate: "",
    },
  });

  // mutation
  const addBranchMutation = useMutation<
    BranchResponseType,
    AxiosError<BranchResponseType>,
    BranchSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/branches",
        data: record,
        isServer: true
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      console.log('Add branch mutation error', err)
      toast.error(message)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      reset()
      queryClient.invalidateQueries({ queryKey: ['branch-list'] })
      router.push(LISTING_ROUTE)
    }
  })

  // Submit handler
  const onSubmit = (data: BranchSchemaType) => {
    console.log("Form submitted:", data);
    addBranchMutation.mutate(data)
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
              placeholder="Enter branch name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* IGIS Branch Code */}
          <div className="space-y-2">
            <Label htmlFor="igis_branch_code" className="gap-1 text-gray-600">
              IGIS Branch Code<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="igis_branch_code"
              {...register("igis_branch_code")}
              placeholder="Enter IGIS branch code"
              maxLength={8}
            />
            {errors.igis_branch_code && (
              <p className="text-red-500 text-sm">{errors.igis_branch_code.message}</p>
            )}
          </div>

          {/* IGIS Takaful Code */}
          <div className="space-y-2">
            <Label htmlFor="igis_takaful_code" className="gap-1 text-gray-600">
              IGIS Takaful Code<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="igis_takaful_code"
              {...register("igis_takaful_code")}
              placeholder="Enter IGIS takaful code"
              maxLength={8}
            />
            {errors.igis_takaful_code && (
              <p className="text-red-500 text-sm">{errors.igis_takaful_code.message}</p>
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
              Phone<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="phone"
              {...register("phone")}
              placeholder="Enter phone number"
              maxLength={11}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="gap-1 text-gray-600">
              Email<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="email"
              id="email"
              {...register("email")}
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website" className="gap-1 text-gray-600">
              Website<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="url"
              id="website"
              {...register("website")}
              placeholder="Enter website URL"
            />
            {errors.website && (
              <p className="text-red-500 text-sm">{errors.website.message}</p>
            )}
          </div>

          {/* HIS Code */}
          <div className="space-y-2">
            <Label htmlFor="his_code" className="gap-1 text-gray-600">
              HIS Code<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="his_code"
              {...register("his_code")}
              placeholder="Enter HIS code"
              maxLength={10}
            />
            {errors.his_code && (
              <p className="text-red-500 text-sm">{errors.his_code.message}</p>
            )}
          </div>

          {/* HIS Takaful Code */}
          <div className="space-y-2">
            <Label htmlFor="his_code_takaful" className="gap-1 text-gray-600">
              HIS Takaful Code<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="his_code_takaful"
              {...register("his_code_takaful")}
              placeholder="Enter HIS takaful code"
              maxLength={10}
            />
            {errors.his_code_takaful && (
              <p className="text-red-500 text-sm">{errors.his_code_takaful.message}</p>
            )}
          </div>

          {/* Sales Tax Percentage */}
          <div className="space-y-2">
            <Label htmlFor="sales_tax_perc" className="gap-1 text-gray-600">
              Sales Tax Percentage
            </Label>
            <Input
              type="text"
              id="sales_tax_perc"
              {...register("sales_tax_perc")}
              placeholder="Enter sales tax percentage"
            />
            {errors.sales_tax_perc && (
              <p className="text-red-500 text-sm">{errors.sales_tax_perc.message}</p>
            )}
          </div>

          {/* Federal Insurance Fee */}
          <div className="space-y-2">
            <Label htmlFor="fed_insurance_fee" className="gap-1 text-gray-600">
              Federal Insurance Fee
            </Label>
            <Input
              type="type"
              id="fed_insurance_fee"
              {...register("fed_insurance_fee")}
              placeholder="Enter federal insurance fee"
            />
            {errors.fed_insurance_fee && (
              <p className="text-red-500 text-sm">{errors.fed_insurance_fee.message}</p>
            )}
          </div>

          {/* Stamp Duty */}
          <div className="space-y-2">
            <Label htmlFor="stamp_duty" className="gap-1 text-gray-600">
              Stamp Duty
            </Label>
            <Input
              type="number"
              id="stamp_duty"
              {...register("stamp_duty", { valueAsNumber: true })}
              placeholder="Enter stamp duty"
              step="1"
            />
            {errors.stamp_duty && (
              <p className="text-red-500 text-sm">{errors.stamp_duty.message}</p>
            )}
          </div>

          {/* Admin Rate */}
          <div className="space-y-2">
            <Label htmlFor="admin_rate" className="gap-1 text-gray-600">
              Admin Rate
            </Label>
            <Input
              type="text"
              id="admin_rate"
              {...register("admin_rate")}
              placeholder="Enter admin rate"
            />
            {errors.admin_rate && (
              <p className="text-red-500 text-sm">{errors.admin_rate.message}</p>
            )}
          </div>

          {/* Form Action */}
          <div>
            <Button type="submit" className='min-w-[150px] cursor-pointer' size='lg' disabled={addBranchMutation.isPending}>
              {addBranchMutation.isPending ? 'Submiting' : 'Submit'}
              {addBranchMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddBranchForm;
