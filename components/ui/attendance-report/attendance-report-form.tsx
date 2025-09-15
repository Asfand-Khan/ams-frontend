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
import { format, parse, differenceInSeconds, parseISO } from "date-fns";
import * as XLSX from "xlsx";

import {
  OverallAttendanceSummaryReport,
  OverallAttendanceSummaryReportSchema,
} from "@/schemas/attendanceReportSchema";

// Helper function to calculate work hours
const calculateWorkHours = (
  checkInTime: string | null | undefined,
  checkOutTime: string | null | undefined
): string => {
  if (!checkInTime || !checkOutTime) return "---";
  try {
    // Parse times assuming HH:mm:ss format
    const checkIn = parse(checkInTime, "HH:mm:ss", new Date());
    const checkOut = parse(checkOutTime, "HH:mm:ss", new Date());
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return "---";
    const seconds = differenceInSeconds(checkOut, checkIn);
    if (seconds < 0) return "---"; // Handle invalid time ranges
    return (seconds / 3600).toFixed(2); // Convert to hours, 2 decimal places
  } catch {
    return "---";
  }
};

// Helper function to convert data to Excel
const convertToExcel = (
  summaryData: any[],
  detailData: any[]
): XLSX.WorkBook => {
  const wb = XLSX.utils.book_new();

  // Summary report
  const summaryHeaders = [
    "Employee Name",
    "Department Name",
    "Designation Title",
    "Total Days",
    "Working Days",
    "Present Days",
    "Absent Days",
    "Leave Days",
    "Weekend Days",
    "Weekend Attendance Days",
    "Holiday Days",
    "Work From Home Days",
    "On Time Check Ins",
    "Late Check Ins",
    "Manual Check Ins",
    "On Time Check Outs",
    "Early Leave Check Outs",
    "Early Go Check Outs",
    "Overtime Check Outs",
    "Half Day Check Outs",
    "Manual Check Outs",
    "Expected Work Hours",
    "Actual Work Hours",
  ];

  const summaryRows = summaryData.map((item) => ({
    "Employee Name": item.employee_name ?? "---",
    "Department Name": item.department_name ?? "---",
    "Designation Title": item.designation_title ?? "---",
    "Total Days": item.total_days ?? "---",
    "Working Days": item.working_days ?? "---",
    "Present Days": item.present_days ?? "---",
    "Absent Days": item.absent_days ?? "---",
    "Leave Days": item.leave_days ?? "---",
    "Weekend Days": item.weekend_days ?? "---",
    "Weekend Attendance Days": item.weekend_attendance_days ?? "---",
    "Holiday Days": item.holiday_days ?? "---",
    "Work From Home Days": item.work_from_home_days ?? "---",
    "On Time Check Ins": item.on_time_check_ins ?? "---",
    "Late Check Ins": item.late_check_ins ?? "---",
    "Manual Check Ins": item.manual_check_ins ?? "---",
    "On Time Check Outs": item.on_time_check_outs ?? "---",
    "Early Leave Check Outs": item.early_leave_check_outs ?? "---",
    "Early Go Check Outs": item.early_go_check_outs ?? "---",
    "Overtime Check Outs": item.overtime_check_outs ?? "---",
    "Half Day Check Outs": item.half_day_check_outs ?? "---",
    "Manual Check Outs": item.manual_check_outs ?? "---",
    "Expected Work Hours": item.expected_work_hours
      ? Number(item.expected_work_hours)
      : "---",
    "Actual Work Hours": item.actual_work_hours,
  }));

  const summarySheetData = [summaryHeaders, ...summaryRows.map(Object.values)];

  const wsSummary = XLSX.utils.aoa_to_sheet(summarySheetData);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

  // Detail report
  const detailHeaders = [
    "Employee ID",
    "Employee Code",
    "Full Name",
    "Date",
    "Check In Time",
    "Check Out Time",
    "Check In Status",
    "Check Out Status",
    "Day Status",
    "Work Hours",
  ];

  const detailRows = detailData.map((item) => ({
    "Employee ID": item.employee_id ?? "---",
    "Employee Code": item.employee_code ?? "---",
    "Full Name": item.full_name ?? "---",
    Date: item.date ? format(parseISO(item.date), "dd-MMMM-yyyy") : "---",
    "Check In Time": item.check_in_time
      ? format(parse(item.check_in_time, "HH:mm:ss", new Date()), "h:mm a")
      : "---",
    "Check Out Time": item.check_out_time
      ? format(parse(item.check_out_time, "HH:mm:ss", new Date()), "h:mm a")
      : "---",
    "Check In Status": item.check_in_status ?? "---",
    "Check Out Status": item.check_out_status ?? "---",
    "Day Status": item.day_status ?? "---",
    "Work Hours":
      item.work_hours && !isNaN(Number(item.work_hours))
        ? Number(item.work_hours)
        : calculateWorkHours(item.check_in_time, item.check_out_time),
  }));

  const detailSheetData = [detailHeaders, ...detailRows.map(Object.values)];

  const wsDetail = XLSX.utils.aoa_to_sheet(detailSheetData);
  XLSX.utils.book_append_sheet(wb, wsDetail, "Detail");

  return wb;
};

// Helper function to trigger Excel download
const triggerExcelDownload = (
  workbook: XLSX.WorkBook,
  fileName: string
): void => {
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const AttendanceReportForm = () => {
  // Form
  const { reset, control, getValues, trigger } =
    useForm<OverallAttendanceSummaryReport>({
      resolver: zodResolver(OverallAttendanceSummaryReportSchema),
    });

  // Mutation for summary report
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
      const message = err?.response?.data?.message || "An error occurred";
      console.log("Fetch overall attendance summary mutation error", err);
      toast.error(message);
    },
  });

  // Mutation for detail report
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
      const message = err?.response?.data?.message || "An error occurred";
      console.log("Fetch Attendance detail mutation error", err);
      toast.error(message);
    },
  });

  // Combined submit handler
  const onCombinedReportSubmit = async (
    data: OverallAttendanceSummaryReport
  ) => {
    const isValid = await trigger();
    if (!isValid) {
      toast.error("Please select start date and end date");
      return;
    }

    try {
      // Fetch both reports concurrently
      const [summaryResponse, detailResponse] = await Promise.all([
        fetchOverallAttendanceSummaryMutation.mutateAsync(data),
        fetchAttendanceDetailMutation.mutateAsync(data),
      ]);

      const summaryMessage =
        summaryResponse?.message || "Summary report generated";
      const detailMessage =
        detailResponse?.message || "Detail report generated";
      toast.success(`${summaryMessage} and ${detailMessage}`);

      const summaryData =
        summaryResponse?.payload && Array.isArray(summaryResponse.payload)
          ? summaryResponse.payload
          : [];
      const detailData =
        detailResponse?.payload && Array.isArray(detailResponse.payload)
          ? detailResponse.payload
          : [];

      const workbook = convertToExcel(summaryData, detailData);

      triggerExcelDownload(
        workbook,
        `Report (${format(getValues("start_date"), "dd-MMMM-yyyy")} to ${format(
          getValues("end_date"),
          "dd-MMMM-yyyy"
        )}) Report.xlsx`
      );

      reset();
    } catch (error) {
      console.log("Combined report error", error);
      toast.error("Failed to generate combined report");
    }
  };

  return (
    <form className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Start Date */}
        <div className="w-full md:w-1/2">
          <Controller
            control={control}
            name="start_date"
            rules={{ required: true }}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="start_date" className="gap-1 text-gray-600">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
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
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ?? null)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          />
        </div>

        {/* End Date */}
        <div className="w-full md:w-1/2">
          <Controller
            control={control}
            name="end_date"
            rules={{ required: true }}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="end_date" className="gap-1 text-gray-600">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
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
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ?? null)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end mt-6">
        <Button
          type="button"
          className="w-full sm:w-64"
          size="lg"
          disabled={
            fetchOverallAttendanceSummaryMutation.isPending ||
            fetchAttendanceDetailMutation.isPending
          }
          onClick={() => onCombinedReportSubmit(getValues())}
        >
          {fetchOverallAttendanceSummaryMutation.isPending ||
          fetchAttendanceDetailMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fetching
            </>
          ) : (
            "Generate Report"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AttendanceReportForm;
