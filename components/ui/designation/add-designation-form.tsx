"use client";

import React from "react";
import { Button } from "../shadcn/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "../shadcn/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { axiosFunction, axiosReturnType } from "@/utils/axiosFunction";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Input } from "../shadcn/input";
import {
  designationSchema,
  DesignationType,
} from "@/schemas/designationSchema";
import { DepartmentPayload } from "@/types/departmentTypes";
import Select from "react-select";
import { selectStyles } from "@/utils/selectStyles";

interface AddDesignationFormProps {
  departments: DepartmentPayload[] | undefined;
}
const AddDesignationForm: React.FC<AddDesignationFormProps> = ({
  departments,
}) => {
  // Constants
  const LISTING_ROUTE = "/organization/designations";

  const queryClient = useQueryClient();
  const router = useRouter();

  // Employee List options
  const departmentOptions = departments?.map((item) => ({
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
    resolver: zodResolver(designationSchema),
  });

  const addDesignationMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    DesignationType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/designations",
        data: record,
        isServer: true,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Add designation mutation error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      reset();
      queryClient.invalidateQueries({ queryKey: ["designation-list"] });
      router.push(LISTING_ROUTE);
    },
  });

  // Submit handler
  const onSubmit = (data: DesignationType) => {
    addDesignationMutation.mutate(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-1/2">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="gap-1 text-gray-600">
              Designation Title<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="title"
              placeholder="Enter Designation Title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="level" className="gap-1 text-gray-600">
              Designation Level
              <span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="level"
              placeholder="Enter level"
              {...register("level",{valueAsNumber: true})}
            />
            {errors.level && (
              <p className="text-red-500 text-sm">{errors.level.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="gap-1 text-gray-600">
              Designation Description
              <span className="text-red-500 text-md"></span>
            </Label>
            <Input
              type="text"
              id="description"
              placeholder="Enter Department Name"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department_id" className="gap-1 text-gray-600">
              Department<span className="text-red-500 text-md"></span>
            </Label>
            <Controller
              control={control}
              name="department_id"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  id="department_id"
                  options={departmentOptions}
                  value={
                    departmentOptions?.find(
                      (option) => option.value === field.value
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption ? selectedOption.value : null)
                  }
                  placeholder="Select department"
                  className="w-full"
                  styles={selectStyles}
                />
              )}
            />
            {errors.department_id && (
              <p className="text-red-500 text-sm">
                {errors.department_id.message}
              </p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={addDesignationMutation.isPending}
            >
              {addDesignationMutation.isPending ? "Submiting" : "Submit"}
              {addDesignationMutation.isPending && (
                <span className="animate-spin">
                  <Loader2 />
                </span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddDesignationForm;
