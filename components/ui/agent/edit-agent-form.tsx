"use client";

import useAgentIdStore from '@/hooks/useAgentIdStore'
import AgentSchema, { AgentSchemaType } from '@/schemas/agentSchema'
import { AgentPayloadTypes, AgentResponseTypes } from '@/types/agentTypes'
import { BranchPayloadType } from '@/types/branchTypes'
import { DevelopmentOfficerPayloadTypes } from '@/types/developmentOfficerTypes'
import { axiosFunction } from '@/utils/axiosFunction'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useController, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Label } from '../shadcn/label'
import { Input } from '../shadcn/input'
import Select from 'react-select'
import { Checkbox } from '../shadcn/checkbox'
import { Button } from '../shadcn/button'
import { Loader2 } from 'lucide-react'

interface EditAgentFormProps {
  branchList: BranchPayloadType[] | undefined
  developmentOfficerList: DevelopmentOfficerPayloadTypes[] | undefined
  singleAgent: AgentPayloadTypes | undefined
}

const EditAgentForm: React.FC<EditAgentFormProps> = ({ branchList, developmentOfficerList, singleAgent }) => {

  // Constants
  const LISTING_ROUTE = '/agents-dos/agents'

  const queryClient = useQueryClient();
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const { agentId } = useAgentIdStore()

  const branchOptions = branchList?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const developmentOfficerOptions = developmentOfficerList?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  // Initialize form with React Hook Form and Zod validation
  const { handleSubmit, formState: { errors }, control, reset, register, setValue } = useForm({
    resolver: zodResolver(AgentSchema),
    defaultValues: {
      name: singleAgent ? singleAgent?.name : "",
      igis_code: singleAgent ? singleAgent?.igis_code : "",
      igis_agent_code: singleAgent ? singleAgent?.igis_agent_code : "",
      branch_id: singleAgent ? singleAgent?.branch_id : undefined,
      development_officer_id: singleAgent ? singleAgent?.development_officer_id : undefined,
      idev_affiliate: singleAgent ? singleAgent?.idev_affiliate : undefined,
      idev_id: singleAgent ? singleAgent?.idev_id : null,
    }
  })

  useEffect(() => {
    if (singleAgent) {
      const affiliateValue = singleAgent.idev_affiliate || false;
      setIsChecked(affiliateValue);
    }
  }, [singleAgent])

  // Mutation to handle agent update via PUT request
  const editAgentMutation = useMutation<
    AgentResponseTypes,
    AxiosError<AgentResponseTypes>,
    AgentSchemaType
  >({
    mutationKey: ['edit-agent', agentId],
    mutationFn: (record) => {
      return axiosFunction({
        method: "PUT",
        urlPath: "/agents",
        data: record,
        isServer: true
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      console.log('Edit agent mutation error', err)
      toast.error(message)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      reset();
      queryClient.invalidateQueries({ queryKey: ['single-agent', agentId] });
      queryClient.invalidateQueries({ queryKey: ['agents-list'] })
      router.push(LISTING_ROUTE)
    }
  })

  // Submit handler to trigger mutation
  const onSubmit = (data: AgentSchemaType) => {
    editAgentMutation.mutate({ ...data, agent_id: agentId! })
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
            styles={{
              control: (provided) => ({
                ...provided,
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                padding: '2px',
                height: '40px'
              }),
            }}
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
            styles={{
              control: (provided) => ({
                ...provided,
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                padding: '2px',
                height: '40px'
              }),
            }}
          />
          {errors.development_officer_id && (
            <p className="text-red-500 text-sm">{errors.development_officer_id.message}</p>
          )}
        </div>

        {/* IDEV Affiliate */}
        <div className="flex gap-2">
          <Checkbox
            id="idev_affiliate"
            checked={isChecked}
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
            disabled={editAgentMutation.isPending}
          >
            {editAgentMutation.isPending ? 'Submitting' : 'Submit'}
            {editAgentMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default EditAgentForm
