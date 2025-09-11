"use client";

import React from "react";
import { Button } from "../shadcn/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "../shadcn/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { axiosFunction, axiosReturnType } from "@/utils/axiosFunction";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  attendanceCorrectionCreateSchema,
  AttendanceCorrectionCreateSchemaType,
} from "@/schemas/attendanceCorrectionSchema";
import Select from "react-select";
import { EmployeePayloadType } from "@/types/employeeTypes";
import { selectStyles } from "@/utils/selectStyles";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { Calendar } from "../shadcn/calendar";
import { format, parse } from "date-fns";
import { TimePicker12Demo } from "../foundations/time-picker";
import { Input } from "../shadcn/input";

interface AddAttendanceCorrectionFormProps {
  employeeList: EmployeePayloadType[];
}

const AddAttendanceCorrectionForm: React.FC<
  AddAttendanceCorrectionFormProps
> = ({ employeeList }) => {
  // Constants
  const LISTING_ROUTE = "/hr/attendance-corrections";

  const queryClient = useQueryClient();
  const router = useRouter();

  // Employee List options
  const employeeOptions = employeeList?.map((item) => ({
    value: item.id,
    label: item.full_name,
  }));

  // Request Type options
  const requestTypeOptions = [
    { value: "missed_check_in", label: "Missed Check In" },
    { value: "missed_check_out", label: "Missed Check Out" },
    { value: "wrong_time", label: "Wrong Time" },
    { value: "both", label: "Both" },
    { value: "work_from_home", label: "Work From Home" },
  ];

  // Form
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<AttendanceCorrectionCreateSchemaType>({
    resolver: zodResolver(attendanceCorrectionCreateSchema),
    defaultValues: {
      employee_id: undefined,
      attendance_date: "",
      request_type: undefined,
      reason: "",
      requested_check_in_time: "",
      requested_check_out_time: "",
    },
  });

  // Watch request_type to conditionally render fields
  const requestType = useWatch({ control, name: "request_type" });

  // Mutation
  const addAttendanceMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    AttendanceCorrectionCreateSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/attendance-corrections",
        data: {
          employee_id: record.employee_id,
          attendance_date: record.attendance_date,
          request_type: record.request_type,
          reason: record.reason,
          requested_check_in_time: record.requested_check_in_time || null,
          requested_check_out_time: record.requested_check_out_time || null,
        },
        isServer: true,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Add attendance mutation error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["attendance-correction-list"],
      });
      router.push(LISTING_ROUTE);
    },
  });

  // Submit handler
  const onSubmit = (data: AttendanceCorrectionCreateSchemaType) => {
    // Additional validation for mandatory fields based on request_type
    if (
      (data.request_type === "wrong_time" ||
        data.request_type === "both" ||
        data.request_type === "work_from_home") &&
      (!data.requested_check_in_time || !data.requested_check_out_time)
    ) {
      toast.error(
        "Both check-in and check-out times are required for 'Wrong Time' or 'Both' request types."
      );
      return;
    }
    if (
      data.request_type === "missed_check_in" &&
      !data.requested_check_in_time
    ) {
      toast.error(
        "Check-in time is required for 'Missed Check In' request type."
      );
      return;
    }
    if (
      data.request_type === "missed_check_out" &&
      !data.requested_check_out_time
    ) {
      toast.error(
        "Check-out time is required for 'Missed Check Out' request type."
      );
      return;
    }
    addAttendanceMutation.mutate(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-1/2">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="employee_id" className="gap-1 text-gray-600">
              Employee<span className="text-red-500 text-md">*</span>
            </Label>
            <Controller
              control={control}
              name="employee_id"
              render={({ field }) => (
                <Select
                  id="employee_id"
                  options={employeeOptions}
                  value={
                    employeeOptions?.find(
                      (option) => option.value === field.value
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption ? selectedOption.value : null)
                  }
                  placeholder="Select employee"
                  className="w-full"
                  styles={selectStyles}
                />
              )}
            />
            {errors.employee_id && (
              <p className="text-red-500 text-sm">
                {errors.employee_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Controller
              control={control}
              name="attendance_date"
              render={({ field }) => (
                <div className="space-y-2 lg:col-span-2">
                  <Label
                    htmlFor="attendance_date"
                    className="gap-1 text-gray-600"
                  >
                    Attendance Date
                    <span className="text-red-500 text-md">*</span>
                  </Label>
                  <div className={cn("grid gap-2")}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal w-full",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(
                              parse(field.value, "yyyy-MM-dd", new Date()),
                              "PPP"
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value
                              ? parse(field.value, "yyyy-MM-dd", new Date())
                              : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd") : ""
                            )
                          }
                          disabled={(date) => date > new Date()} // Disable future dates
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            />
            {errors.attendance_date && (
              <p className="text-red-500 text-sm">
                {errors.attendance_date.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Controller
              control={control}
              name="request_type"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="request_type" className="gap-1 text-gray-600">
                    Request Type<span className="text-red-500 text-md">*</span>
                  </Label>
                  <Select
                    id="request_type"
                    options={requestTypeOptions}
                    value={
                      requestTypeOptions.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      field.onChange(
                        selectedOption ? selectedOption.value : null
                      )
                    }
                    placeholder="Select request type"
                    className="w-full"
                    styles={selectStyles}
                  />
                </div>
              )}
            />
            {errors.request_type && (
              <p className="text-red-500 text-sm">
                {errors.request_type.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Controller
              control={control}
              name="reason"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="reason" className="gap-1 text-gray-600">
                    Reason<span className="text-red-500 text-md">*</span>
                  </Label>
                  <Input
                    id="reason"
                    placeholder="Enter reason for correction"
                    {...field}
                  />
                </div>
              )}
            />
            {errors.reason && (
              <p className="text-red-500 text-sm">{errors.reason.message}</p>
            )}
          </div>

          {(requestType === "missed_check_in" ||
            requestType === "wrong_time" ||
            requestType === "both" ||
            requestType === "work_from_home") && (
            <div className="space-y-2">
              <Controller
                control={control}
                name="requested_check_in_time"
                render={({ field }) => (
                  <div className="space-y-2 lg:col-span-2">
                    <Label
                      htmlFor="requested_check_in_time"
                      className="gap-1 text-gray-600"
                    >
                      Requested Check In Time
                      {(requestType === "wrong_time" ||
                        requestType === "both" ||
                        requestType === "work_from_home") && (
                        <span className="text-red-500 text-md">*</span>
                      )}
                    </Label>
                    <div className="flex gap-2 w-full">
                      <TimePicker12Demo
                        setDate={(date) =>
                          field.onChange(date ? format(date, "HH:mm:ss") : "")
                        }
                        date={
                          field.value
                            ? parse(field.value, "HH:mm:ss", new Date())
                            : undefined
                        }
                      />
                    </div>
                  </div>
                )}
              />
              {errors.requested_check_in_time && (
                <p className="text-red-500 text-sm">
                  {errors.requested_check_in_time.message}
                </p>
              )}
            </div>
          )}

          {(requestType === "missed_check_out" ||
            requestType === "wrong_time" ||
            requestType === "both" ||
            requestType === "work_from_home") && (
            <div className="space-y-2">
              <Controller
                control={control}
                name="requested_check_out_time"
                render={({ field }) => (
                  <div className="space-y-2 lg:col-span-2">
                    <Label
                      htmlFor="requested_check_out_time"
                      className="gap-1 text-gray-600"
                    >
                      Requested Check Out Time
                      {(requestType === "wrong_time" ||
                        requestType === "both" ||
                        requestType === "work_from_home") && (
                        <span className="text-red-500 text-md">*</span>
                      )}
                    </Label>
                    <div className="flex gap-2 w-full">
                      <TimePicker12Demo
                        setDate={(date) =>
                          field.onChange(date ? format(date, "HH:mm:ss") : "")
                        }
                        date={
                          field.value
                            ? parse(field.value, "HH:mm:ss", new Date())
                            : undefined
                        }
                      />
                    </div>
                  </div>
                )}
              />
              {errors.requested_check_out_time && (
                <p className="text-red-500 text-sm">
                  {errors.requested_check_out_time.message}
                </p>
              )}
            </div>
          )}

          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={addAttendanceMutation.isPending}
            >
              {addAttendanceMutation.isPending ? "Submitting" : "Submit"}
              {addAttendanceMutation.isPending && (
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

export default AddAttendanceCorrectionForm;
