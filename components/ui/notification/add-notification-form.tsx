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
import Select from "react-select";
import { selectStyles } from "@/utils/selectStyles";
import { UserPayload } from "@/types/userTypes";
import {
  notificationSchema,
  NotificationType,
} from "@/schemas/notificationSchema";
import { Textarea } from "../shadcn/textarea";

interface AddNotificationFormProps {
  users: UserPayload[] | undefined;
}

const AddNotificationForm: React.FC<AddNotificationFormProps> = ({ users }) => {
  // Constants
  const LISTING_ROUTE = "/hr/notifications";

  const queryClient = useQueryClient();
  const router = useRouter();

  // Employee List options
  const userOptions = users?.map((item) => ({
    value: item.id,
    label: item.employee.full_name,
  }));

  const [priorityOptions] = React.useState([
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ]);

  const [typeOptions] = React.useState([
    { value: "holiday", label: "Holiday" },
    { value: "alert", label: "Alert" },
    { value: "general", label: "General" },
    { value: "shift", label: "Shift" },
    { value: "leave", label: "Leave" },
    { value: "attendance", label: "Attendance" },
  ]);

  // Form
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(notificationSchema),
  });

  const addNotificationMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    NotificationType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/notifications/add",
        data: record,
        isServer: true,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Add notification mutation error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      reset();
      queryClient.invalidateQueries({ queryKey: ["notification-list"] });
      router.push(LISTING_ROUTE);
    },
  });

  // Submit handler
  const onSubmit = (data: NotificationType) => {
    addNotificationMutation.mutate(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-1/2">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="gap-1 text-gray-600">
              Title<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="title"
              placeholder="Enter Notification Title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="gap-1 text-gray-600">
              Priority
              <span className="text-red-500 text-md">*</span>
            </Label>
            <Controller
              control={control}
              name="priority"
              rules={{ required: true }}
              render={({ field }) => {
                const selectedOption = priorityOptions.find(
                  (option) => option.value === field.value
                );

                return (
                  <Select
                    inputId="priority"
                    options={priorityOptions}
                    value={selectedOption || null}
                    onChange={(selectedOption) =>
                      field.onChange(selectedOption?.value || "")
                    }
                    placeholder="Select priority"
                    className="w-full"
                    styles={selectStyles}
                  />
                );
              }}
            />
            {errors.priority && (
              <p className="text-red-500 text-sm">{errors.priority.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="gap-1 text-gray-600">
              Type
              <span className="text-red-500 text-md">*</span>
            </Label>
            <Controller
              control={control}
              name="type"
              rules={{ required: true }}
              render={({ field }) => {
                const selectedOption = typeOptions.find(
                  (option) => option.value === field.value
                );

                return (
                  <Select
                    inputId="type"
                    options={typeOptions}
                    value={selectedOption || null}
                    onChange={(selectedOption) =>
                      field.onChange(selectedOption?.value || "")
                    }
                    placeholder="Select type"
                    className="w-full"
                    styles={selectStyles}
                  />
                );
              }}
            />
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="gap-1 text-gray-600">
              Notification Message
              <span className="text-red-500 text-md">*</span>
            </Label>
            <Textarea
              placeholder="Enter Notification Message"
              {...register("message")}
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="user_id" className="gap-1 text-gray-600">
              Employee<span className="text-red-500 text-md"></span>
            </Label>
            <Controller
              control={control}
              name="user_id"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  id="user_id"
                  options={userOptions}
                  value={
                    userOptions?.find(
                      (option) => option.value === field.value
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption ? selectedOption.value : null)
                  }
                  placeholder="Select Employee"
                  className="w-full"
                  styles={selectStyles}
                />
              )}
            />
            {errors.user_id && (
              <p className="text-red-500 text-sm">{errors.user_id.message}</p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={addNotificationMutation.isPending}
            >
              {addNotificationMutation.isPending ? "Submiting" : "Submit"}
              {addNotificationMutation.isPending && (
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

export default AddNotificationForm;
