"use client";

import React, { useState } from 'react'
import { Button } from '../shadcn/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AgentSchema, { AgentSchemaType } from '@/schemas/agentSchema'
import { Loader2 } from 'lucide-react'
import { AgentResponseTypes } from '@/types/agentTypes';
import { AxiosError } from 'axios';
import { axiosFunction } from '@/utils/axiosFunction';
import { toast } from 'sonner';
import { Label } from '../shadcn/label';
import { Input } from '../shadcn/input';
import Select from 'react-select';
import { BranchPayloadType } from '@/types/branchTypes';
import { DevelopmentOfficerPayloadTypes } from '@/types/developmentOfficerTypes';
import { Checkbox } from '../shadcn/checkbox';
import { selectStyles } from '@/utils/selectStyles';

interface AddAgentFormProps {
  branchList: BranchPayloadType[] | undefined
  developmentOfficerList: DevelopmentOfficerPayloadTypes[] | undefined
}

const AddAgentForm: React.FC<AddAgentFormProps> = ({ branchList, developmentOfficerList }) => {
  // Constants
  const LISTING_ROUTE = '/agents-dos/agents'

  const queryClient = useQueryClient();
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  // Branch List Options

  const branchOptions = branchList?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  // Development Officer List Options
  const developmentOfficerOptions = developmentOfficerList?.map((item) => ({
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
    setValue,
  } = useForm({
    resolver: zodResolver(AgentSchema),
    defaultValues: {
      name: "",
      igis_code: "",
      igis_agent_code: "",
      branch_id: undefined,
      development_officer_id: undefined,
      idev_affiliate: false,
      idev_id: null,
    },
  });

  // mutation
  const addAgentMutation = useMutation<
    AgentResponseTypes,
    AxiosError<AgentResponseTypes>,
    AgentSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/agents",
        data: record,
        isServer: true
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      console.log('Add agent mutation error', err)
      toast.error(message)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      reset()
      queryClient.invalidateQueries({ queryKey: ['agent-list'] })
      router.push(LISTING_ROUTE)
    }
  })

  // Submit handler
  const onSubmit = (data: AgentSchemaType) => {
    addAgentMutation.mutate(data)
  };

  // Controller for React Select (Branch ID)
  const {
    field: { onChange: onChangeBranch, value: branchValue },
  } = useController({
    name: "branch_id",
    control,
    defaultValue: undefined,
    rules: { required: true },
  });

  // Controller for React Select (Development Officer ID)
  const {
    field: { onChange: onChangeOfficer, value: developmentOfficerValue },
  } = useController({
    name: "development_officer_id",
    control,
    defaultValue: undefined,
    rules: { required: true },
  });

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
              placeholder="Enter agent name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
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

          {/* IGIS Agent Code */}
          <div className="space-y-2">
            <Label htmlFor="igis_agent_code" className="gap-1 text-gray-600">
              IGIS Agent Code<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="igis_agent_code"
              {...register("igis_agent_code")}
              placeholder="Enter IGIS agent code"
            />
            {errors.igis_agent_code && (
              <p className="text-red-500 text-sm">{errors.igis_agent_code.message}</p>
            )}
          </div>

          {/* Branch ID */}
          <div className="space-y-2">
            <Label htmlFor="branch_id" className="gap-1 text-gray-600">
              Branch ID<span className="text-red-500 text-md">*</span>
            </Label>
            <Select
              id="branch_id"
              options={branchOptions}
              value={branchOptions?.find(option => option.value === branchValue) || null}
              onChange={(selectedOption) => onChangeBranch(selectedOption ? selectedOption.value : null)}
              placeholder="Select Branch"
              className="w-full"
              styles={selectStyles}
            />
            {errors.branch_id && (
              <p className="text-red-500 text-sm">{errors.branch_id.message}</p>
            )}
          </div>

          {/* Development Officer ID */}
          <div className="space-y-2">
            <Label htmlFor="development_officer_id" className="gap-1 text-gray-600">
              Development Officer ID<span className="text-red-500 text-md">*</span>
            </Label>
            <Select
              id="development_officer_id"
              options={developmentOfficerOptions}
              value={developmentOfficerOptions?.find(option => option.value === developmentOfficerValue) || null}
              onChange={(selectedOption) => onChangeOfficer(selectedOption ? selectedOption.value : null)}
              placeholder="Select Officer"
              className="w-full"
              styles={selectStyles}
            />
            {errors.development_officer_id && (
              <p className="text-red-500 text-sm">{errors.development_officer_id.message}</p>
            )}
          </div>

          {/* IDEV Affiliate */}
          <div className="flex gap-2">
            <Checkbox
              id="idev_affiliate"
              onCheckedChange={(checked) => {
                setValue("idev_affiliate", checked as boolean);
                setIsChecked(checked as boolean)
              }}
            />
            <Label htmlFor="idev_affiliate" className="gap-1 text-gray-600">
              IDEV Affiliate
            </Label>
            {errors.idev_affiliate && (
              <p className="text-red-500 text-sm">{errors.idev_affiliate.message}</p>
            )}
          </div>

          {/* IDEV ID */}
          {isChecked && (
            <div className="space-y-2">
              <Label htmlFor="idev_id" className="gap-1 text-gray-600">
                IDEV ID
              </Label>
              <Input
                type="number"
                id="idev_id"
                {...register("idev_id", { valueAsNumber: true })}
                placeholder="Enter IDEV ID"
              />
              {errors.idev_id && (
                <p className="text-red-500 text-sm">{errors.idev_id.message}</p>
              )}
            </div>

          )}

          {/* Form Action */}
          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={addAgentMutation.isPending}
            >
              {addAgentMutation.isPending ? 'Submitting' : 'Submit'}
              {addAgentMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
            </Button>
          </div>
        </div>
      </form>

    </>
  )
}

export default AddAgentForm