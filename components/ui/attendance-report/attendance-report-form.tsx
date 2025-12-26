"use client";

import React from "react";
import { Button } from "../shadcn/button";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { axiosFunction, axiosReturnType } from "@/utils/axiosFunction";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { format, parse, differenceInSeconds, parseISO } from "date-fns";
import * as XLSX from "xlsx";

import { DateRangePicker } from "@/lib/date-picker"; // Your existing reusable component

import {
  OverallAttendanceSummaryReport,
  OverallAttendanceSummaryReportSchema,
} from "@/schemas/attendanceReportSchema";

// Helper: Calculate work hours
const calculateWorkHours = (
  checkInTime: string | null | undefined,
  checkOutTime: string | null | undefined
): string => {
  if (!checkInTime || !checkOutTime) return "---";
  try {
    const checkIn = parse(checkInTime, "HH:mm:ss", new Date());
    const checkOut = parse(checkOutTime, "HH:mm:ss", new Date());
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return "---";
    const seconds = differenceInSeconds(checkOut, checkIn);
    if (seconds < 0) return "---";
    return (seconds / 3600).toFixed(2);
  } catch {
    return "---";
  }
};

// Convert to Excel (Summary + Detail sheets)
const convertToExcel = (summaryData: any[], detailData: any[]): XLSX.WorkBook => {
  const wb = XLSX.utils.book_new();

  const summaryHeaders = [
    "Employee Name", "Department Name", "Designation Title", "Total Days",
    "Working Days", "Present Days", "Absent Days", "Leave Days",
    "Weekend Days", "Weekend Attendance Days", "Holiday Days",
    "Work From Home Days", "On Time Check Ins", "Late Check Ins",
    "Manual Check Ins", "On Time Check Outs", "Early Leave Check Outs",
    "Early Go Check Outs", "Overtime Check Outs", "Half Day Check Outs",
    "Manual Check Outs", "Expected Work Hours", "Actual Work Hours",
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
    "Expected Work Hours": item.expected_work_hours ? Number(item.expected_work_hours) : "---",
    "Actual Work Hours": item.actual_work_hours ?? "---",
  }));

  const wsSummary = XLSX.utils.aoa_to_sheet([summaryHeaders, ...summaryRows.map(Object.values)]);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

  const detailHeaders = [
    "Employee ID", "Employee Code", "Full Name", "Date",
    "Check In Time", "Check Out Time", "Check In Status",
    "Check Out Status", "Day Status", "Work Hours",
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
    "Work Hours": item.work_hours && !isNaN(Number(item.work_hours))
      ? Number(item.work_hours)
      : calculateWorkHours(item.check_in_time, item.check_out_time),
  }));

  const wsDetail = XLSX.utils.aoa_to_sheet([detailHeaders, ...detailRows.map(Object.values)]);
  XLSX.utils.book_append_sheet(wb, wsDetail, "Detail");

  return wb;
};

const triggerExcelDownload = (workbook: XLSX.WorkBook, fileName: string) => {
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const AttendanceReportForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OverallAttendanceSummaryReport>({
    resolver: zodResolver(OverallAttendanceSummaryReportSchema),
    defaultValues: {
      dateRange: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // 1st of current month
        to: new Date(),
      },
    },
  });

  const fetchOverallAttendanceSummaryMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    OverallAttendanceSummaryReport
  >({
    mutationFn: (data) => {
      if (!data.dateRange?.from || !data.dateRange?.to) {
        throw new Error("Date range is required");
      }
      return axiosFunction({
        method: "POST",
        urlPath: "/reporting/overall-attendance-summary",
        data: {
          start_date: format(data.dateRange.from, "yyyy-MM-dd"),
          end_date: format(data.dateRange.to, "yyyy-MM-dd"),
        },
        isServer: true,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to fetch summary report");
    },
  });

  const fetchAttendanceDetailMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    OverallAttendanceSummaryReport
  >({
    mutationFn: (data) => {
      if (!data.dateRange?.from || !data.dateRange?.to) {
        throw new Error("Date range is required");
      }
      return axiosFunction({
        method: "POST",
        urlPath: "/reporting/attendance-detail",
        data: {
          start_date: format(data.dateRange.from, "yyyy-MM-dd"),
          end_date: format(data.dateRange.to, "yyyy-MM-dd"),
        },
        isServer: true,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to fetch detail report");
    },
  });

  const onSubmit = async (data: OverallAttendanceSummaryReport) => {
    try {
      const [summaryRes, detailRes] = await Promise.all([
        fetchOverallAttendanceSummaryMutation.mutateAsync(data),
        fetchAttendanceDetailMutation.mutateAsync(data),
      ]);

      toast.success("Report generated successfully!");

      const summaryData = Array.isArray(summaryRes?.payload) ? summaryRes.payload : [];
      const detailData = Array.isArray(detailRes?.payload) ? detailRes.payload : [];

      const workbook = convertToExcel(summaryData, detailData);
      const fileName = `Attendance_Report_${format(data.dateRange!.from!, "dd-MMMM-yyyy")}_to_${format(data.dateRange!.to!, "dd-MMMM-yyyy")}.xlsx`;

      triggerExcelDownload(workbook, fileName);
    } catch (error) {
      console.error("Report generation error:", error);
      toast.error("Failed to generate report");
    }
  };

  const isLoading =
    fetchOverallAttendanceSummaryMutation.isPending ||
    fetchAttendanceDetailMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-3xl mx-auto space-y-8"
    >
      <div className="bg-white gap-4 w-full">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Generate Overall Attendance Report
        </h2>

        <Controller
          control={control}
          name="dateRange"
          rules={{ required: "Date range is required" }}
          render={({ field }) => (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Date Range <span className="text-red-500">*</span>
              </label>
              <DateRangePicker
                date={field.value}
                setDate={field.onChange}
                className="w-full"
              />
              {errors.dateRange && (
                <p className="text-sm text-red-500">
                  {errors.dateRange.message || "Please select a valid date range"}
                </p>
              )}
            </div>
          )}
        />

        <div className="flex justify-end mt-10">
          <Button
            type="submit"
            size="lg"
            className="min-w-64"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Report...
              </>
            ) : (
              "Generate & Download Report"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AttendanceReportForm;