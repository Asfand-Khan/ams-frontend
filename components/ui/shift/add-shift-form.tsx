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
import { format } from "date-fns";
import { TimePicker12Demo } from "../foundations/time-picker";
import { shiftSchema, ShiftType } from "@/schemas/shiftSchema";
import { Input } from "../shadcn/input";

const AddShiftForm = () => {
  // Constants
  const LISTING_ROUTE = "/organization/shifts";

  const queryClient = useQueryClient();
  const router = useRouter();

  // Form
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    register,
  } = useForm({
    resolver: zodResolver(shiftSchema),
  });

  const addShiftMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    ShiftType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/shifts",
        data: {
          ...record,
          start_time: format(record.start_time, "HH:mm:ss"),
          end_time: format(record.end_time, "HH:mm:ss"),
        },
        isServer: true,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Add Shift mutation error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      reset();
      queryClient.invalidateQueries({ queryKey: ["shift-list"] });
      router.push(LISTING_ROUTE);
    },
  });

  // Submit handler
  const onSubmit = (data: ShiftType) => {
    addShiftMutation.mutate(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-1/2">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="gap-1 text-gray-600">
              Name<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="name"
              placeholder="Enter shift name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Controller
              control={control}
              name="start_time"
              render={({ field }) => (
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="start_time" className="gap-1 text-gray-600">
                    Start Time
                  </Label>
                  <div className="flex gap-2 w-full">
                    <TimePicker12Demo
                      setDate={field.onChange}
                      date={field.value ? new Date(field.value) : undefined}
                    />
                  </div>
                </div>
              )}
            />
            {errors.start_time && (
              <p className="text-red-500 text-sm">
                {errors.start_time.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Controller
              control={control}
              name="end_time"
              render={({ field }) => (
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="end_time" className="gap-1 text-gray-600">
                    End Time
                  </Label>
                  <div className="flex gap-2 w-full">
                    <TimePicker12Demo
                      setDate={field.onChange}
                      date={field.value ? new Date(field.value) : undefined}
                    />
                  </div>
                </div>
              )}
            />
            {errors.end_time && (
              <p className="text-red-500 text-sm">{errors.end_time.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="grace_minutes" className="gap-1 text-gray-600">
              Grace Minutes<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="grace_minutes"
              placeholder="Enter grace minutes"
              {...register("grace_minutes", { valueAsNumber: true })}
            />
            {errors.grace_minutes && (
              <p className="text-red-500 text-sm">
                {errors.grace_minutes.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="break_duration_minutes"
              className="gap-1 text-gray-600"
            >
              Break Duration Minutes
              <span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="break_duration_minutes"
              placeholder="Enter break duration minutes"
              {...register("break_duration_minutes", { valueAsNumber: true })}
            />
            {errors.break_duration_minutes && (
              <p className="text-red-500 text-sm">
                {errors.break_duration_minutes.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="early_leave_threshold_minutes"
              className="gap-1 text-gray-600"
            >
              Early Leave Threshold Minutes
              <span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="early_leave_threshold_minutes"
              placeholder="Enter early leave threshold minutes"
              {...register("early_leave_threshold_minutes", {
                valueAsNumber: true,
              })}
            />
            {errors.early_leave_threshold_minutes && (
              <p className="text-red-500 text-sm">
                {errors.early_leave_threshold_minutes.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="half_day_hours" className="gap-1 text-gray-600">
              Half day hours<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="half_day_hours"
              placeholder="Enter half day hours"
              {...register("half_day_hours")}
            />
            {errors.half_day_hours && (
              <p className="text-red-500 text-sm">
                {errors.half_day_hours.message}
              </p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={addShiftMutation.isPending}
            >
              {addShiftMutation.isPending ? "Submiting" : "Submit"}
              {addShiftMutation.isPending && (
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

export default AddShiftForm;
