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
import { LeaveTypeSchema, LeaveTypeType } from "@/schemas/addLeaveTypeSchema";
import { Input } from "../shadcn/input";

const AddLeaveTypeForm = () => {
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
    resolver: zodResolver(LeaveTypeSchema),
  });

  const addLeaveTypeMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    LeaveTypeType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/leave-types",
        data: record,
        isServer: true,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Add leave type mutation error", err);
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
  const onSubmit = (data: LeaveTypeType) => {
    addLeaveTypeMutation.mutate(data);
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
              disabled={addLeaveTypeMutation.isPending}
            >
              {addLeaveTypeMutation.isPending ? "Submiting" : "Submit"}
              {addLeaveTypeMutation.isPending && (
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

export default AddLeaveTypeForm;
