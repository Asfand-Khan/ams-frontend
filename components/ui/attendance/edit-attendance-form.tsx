"use client";

import React from "react";
import { Button } from "../shadcn/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "../shadcn/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { axiosFunction, axiosReturnType } from "@/utils/axiosFunction";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  AttendanceSchema,
  AttendanceSchemaType,
} from "@/schemas/attendanceSchema";
import Select from "react-select";
import { EmployeePayloadType } from "@/types/employeeTypes";
import { singleSelectStyle} from "@/utils/selectStyles";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { Calendar } from "../shadcn/calendar";
import { format } from "date-fns";
import { TimePicker12Demo } from "../foundations/time-picker";
import { SingleAttendanceRecord } from "@/types/attendanceTypes";

interface EditAttendanceFormProps {
  employeeList: EmployeePayloadType[] | undefined;
  singleAttendance: SingleAttendanceRecord[] | undefined;
}

const EditAttendanceForm: React.FC<EditAttendanceFormProps> = ({
  employeeList,
}) => {
  // Constants
  const LISTING_ROUTE = "/hr/attendance";

  const queryClient = useQueryClient();
  const router = useRouter();

  // Employee List options
  const employeeOptions = employeeList?.map((item) => ({
    value: item.id,
    label: item.full_name,
  }));

  // Form
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(AttendanceSchema),
  });

  const addAttendanceMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    AttendanceSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/attendances/add",
        data: {
          attendance_date: format(record.attendance_date, "yyyy-MM-dd"),
          employee_id: record.employee_id,
          check_in_time: record.check_in_time?.toTimeString().split(" ")[0],
          check_out_time: record.check_out_time?.toTimeString().split(" ")[0],
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
      queryClient.invalidateQueries({ queryKey: ["attendance-list"] });
      router.push(LISTING_ROUTE);
    },
  });

  // Submit handler
  const onSubmit = (data: AttendanceSchemaType) => {
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
              rules={{ required: true }}
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
                  styles={singleSelectStyle}
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
              rules={{ required: true }}
              render={({ field }) => (
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="employee_id" className="gap-1 text-gray-600">
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
                            format(new Date(field.value), "PPP")
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
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date ? date : null)
                          }
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
              name="check_in_time"
              render={({ field }) => (
                <div className="space-y-2 lg:col-span-2">
                  <Label
                    htmlFor="check_in_time"
                    className="gap-1 text-gray-600"
                  >
                    Check In Time
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
            {errors.check_in_time && (
              <p className="text-red-500 text-sm">
                {errors.check_in_time.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Controller
              control={control}
              name="check_out_time"
              render={({ field }) => (
                <div className="space-y-2 lg:col-span-2">
                  <Label
                    htmlFor="check_out_time"
                    className="gap-1 text-gray-600"
                  >
                    Check Out Time
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
            {errors.check_out_time && (
              <p className="text-red-500 text-sm">
                {errors.check_out_time.message}
              </p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={addAttendanceMutation.isPending}
            >
              {addAttendanceMutation.isPending ? "Submiting" : "Submit"}
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

export default EditAttendanceForm;
