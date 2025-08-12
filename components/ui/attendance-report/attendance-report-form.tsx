"use client";

import React from "react";
import { Button } from "../shadcn/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Label } from "../shadcn/label";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { axiosFunction, axiosReturnType } from "@/utils/axiosFunction";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { Calendar } from "../shadcn/calendar";
import { format } from "date-fns";
import {
  OverallAttendanceSummaryReport,
  OverallAttendanceSummaryReportSchema,
} from "@/schemas/attendanceReportSchema";
import { convertToCSV, triggerCSVDownload } from "@/utils/csvHelpers";

const AttendanceReportForm = () => {
  // Form
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    getValues,
    trigger,
  } = useForm({
    resolver: zodResolver(OverallAttendanceSummaryReportSchema),
  });

  const fetchOverallAttendanceSummaryMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    OverallAttendanceSummaryReport
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/reporting/overall-attendance-summary",
        data: {
          start_date: format(record.start_date, "yyyy-MM-dd"),
          end_date: format(record.end_date, "yyyy-MM-dd"),
        },
        isServer: true,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Fetch overall attendance summary mutation error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);

      // Example: assuming your API returns `data.payload` as an array of objects
      if (data?.payload && Array.isArray(data.payload)) {
        const csvContent = convertToCSV(data.payload);
        triggerCSVDownload(
          csvContent,
          `Overall Attendance Summary (${format(
            getValues("start_date"),
            "dd-MMMM-yyyy"
          )} to ${format(getValues("end_date"), "dd-MMMM-yyyy")}) Report.csv`
        );
      }

      reset();
    },
  });

  const fetchAttendanceDetailMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    OverallAttendanceSummaryReport
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/reporting/attendance-detail",
        data: {
          start_date: format(record.start_date, "yyyy-MM-dd"),
          end_date: format(record.end_date, "yyyy-MM-dd"),
        },
        isServer: true,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Fetch Attendance detail mutation error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);

      // Example: assuming your API returns `data.payload` as an array of objects
      if (data?.payload && Array.isArray(data.payload)) {
        const csvContent = convertToCSV(data.payload);
        triggerCSVDownload(
          csvContent,
          `Attendance Detail (${format(
            getValues("start_date"),
            "dd-MMMM-yyyy"
          )} to ${format(getValues("end_date"), "dd-MMMM-yyyy")}) Report.csv`
        );
      }

      reset();
    },
  });

  // Submit handler
  const onOverallAttendanceSummarySubmit = (
    data: OverallAttendanceSummaryReport
  ) => {
    fetchOverallAttendanceSummaryMutation.mutate(data);
  };

  const onAttendanceDetailSubmit = (data: OverallAttendanceSummaryReport) => {
    fetchAttendanceDetailMutation.mutate(data);
  };

  return (
    <>
      <form className="w-3/4">
        <div className="flex gap-2 items-center w-full">
          <div className="flex gap-2 items-start w-full">
            <div className="w-full">
              <Controller
                control={control}
                name="start_date"
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="start_date" className="gap-1 text-gray-600">
                      Start Date
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
            </div>

            <div className="w-full">
              <Controller
                control={control}
                name="end_date"
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="end_date" className="gap-1 text-gray-600">
                      End Date
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
            </div>
          </div>

          <div className="flex gap-2 items-end w-full h-16">
            <div>
              <Button
                type="button"
                className="min-w-[150px] cursor-pointer w-52"
                size="lg"
                disabled={fetchOverallAttendanceSummaryMutation.isPending}
                onClick={async () => {
                  const isValid = await trigger();
                  if (isValid) {
                    onOverallAttendanceSummarySubmit(getValues());
                    return;
                  }
                  toast.error("Please select start date and end date");
                }}
              >
                {fetchOverallAttendanceSummaryMutation.isPending
                  ? "Fetching"
                  : "Attendance Summary Report"}
                {fetchOverallAttendanceSummaryMutation.isPending && (
                  <span className="animate-spin">
                    <Loader2 />
                  </span>
                )}
              </Button>
            </div>

            <div>
              <Button
                type="button"
                className="min-w-[150px] cursor-pointer w-52"
                size="lg"
                disabled={fetchAttendanceDetailMutation.isPending}
                onClick={async () => {
                  const isValid = await trigger();
                  if (isValid) {
                    onAttendanceDetailSubmit(getValues());
                    return;
                  }
                  toast.error("Please select start date and end date");
                }}
              >
                {fetchAttendanceDetailMutation.isPending
                  ? "Fetching"
                  : "Detail Attendance Report"}
                {fetchAttendanceDetailMutation.isPending && (
                  <span className="animate-spin">
                    <Loader2 />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default AttendanceReportForm;
