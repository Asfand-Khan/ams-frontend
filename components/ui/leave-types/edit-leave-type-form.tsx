"use client";

import React from "react";
import { Button } from "../shadcn/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "../shadcn/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { axiosFunction, axiosReturnType } from "@/utils/axiosFunction";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  EditLeaveTypeSchema,
  EditLeaveTypeType
} from "@/schemas/addLeaveTypeSchema";
import { Input } from "../shadcn/input";
import { LeaveTypePayload } from "@/types/leaveTypeTypes";

interface EditLeaveTypeFormProps {
  singleLeaveType: LeaveTypePayload | undefined;
}

const EditLeaveTypeForm: React.FC<EditLeaveTypeFormProps> = ({
  singleLeaveType,
}) => {
  // Constants
  const LISTING_ROUTE = "/hr/leave-types";

  const queryClient = useQueryClient();
  const router = useRouter();

  // Form
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(EditLeaveTypeSchema),
    defaultValues: {
      leave_type_id: singleLeaveType ? singleLeaveType.id : 0,
      name: singleLeaveType ? singleLeaveType.name : "",
      total_quota: singleLeaveType ? singleLeaveType.total_quota : 0,
    },
  });

  const editLeaveTypeMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    EditLeaveTypeType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "PUT",
        urlPath: "/leave-types",
        data: record,
        isServer: true,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Edit leave type mutation error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      reset();
      queryClient.invalidateQueries({ queryKey: ["leave-type-list"] });
      router.push(LISTING_ROUTE);
    },
  });

  // Submit handler
  const onSubmit = (data: EditLeaveTypeType) => {
    editLeaveTypeMutation.mutate(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-1/2">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="gap-1 text-gray-600">
              Leave Type Name<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="name"
              placeholder="Enter Leave Type Name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="total_quota" className="gap-1 text-gray-600">
              Leave Quota<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="number"
              id="total_quota"
              placeholder="Enter Total Quota"
              {...register("total_quota", { valueAsNumber: true })}
            />
            {errors.total_quota && (
              <p className="text-red-500 text-sm">
                {errors.total_quota.message}
              </p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={editLeaveTypeMutation.isPending}
            >
              {editLeaveTypeMutation.isPending ? "Submiting" : "Submit"}
              {editLeaveTypeMutation.isPending && (
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

export default EditLeaveTypeForm;
