"use client";

import { getRights } from "@/utils/getRights";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { Button } from "../shadcn/button";
import Empty from "../foundations/empty";
import SubNav from "../foundations/sub-nav";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { axiosFunction, axiosReturnType } from "@/utils/axiosFunction";
import { AxiosError } from "axios";
import {
  AttendanceHistorySchema,
  AttendanceHistoryType,
} from "@/schemas/attendanceSchema";
import Select from "react-select";
import { EmployeesResponseType } from "@/types/employeeTypes";
import { fetchEmployeeList } from "@/helperFunctions/employeeFunction";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import { selectStyles } from "@/utils/selectStyles";
import { format, startOfMonth } from "date-fns";
import { Loader2 } from "lucide-react";
import {
  AttendanceRecord,
  AttendanceSummaryPayload,
} from "@/types/attendanceTypes";
import { ColumnDef } from "@tanstack/react-table";
import { ColumnMeta } from "@/types/dataTableTypes";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import AttendanceHistoryDatatable from "./attendancehistory-datatable";
import { Badge } from "../foundations/badge";
import { DateRangePicker } from "@/lib/date-picker";

const AttendanceHistoryList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [attendanceHistoryData, setAttendanceHistoryData] = React.useState<
    AttendanceRecord[]
  >([]);
  const [attendanceSummaryData, setAttendanceSummaryData] = React.useState<
    AttendanceSummaryPayload[]
  >([]);

  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  const {
    data: employeeListResponse,
    isLoading: employeeListLoading,
    isError: employeeListIsError,
    error: employeeListError,
  } = useQuery<EmployeesResponseType | null>({
    queryKey: ["history-employee-list"],
    queryFn: fetchEmployeeList,
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AttendanceHistoryType>({
    resolver: zodResolver(AttendanceHistorySchema),
    defaultValues: {
      dateRange: {
        from: startOfMonth(new Date()),
        to: new Date(),
      },
    },
  });
  const fetchAttendanceHistoryMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    AttendanceHistoryType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/attendances",
        data: {
          ...record,
          start_date: record.dateRange?.from
            ? format(record.dateRange.from, "yyyy-MM-dd")
            : "",
          end_date: record.dateRange?.to
            ? format(record.dateRange.to, "yyyy-MM-dd")
            : "",
        },
        isServer: true,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Fetch attendance history mutation error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      setAttendanceHistoryData(data?.payload);
    },
  });

  const fetchAttendanceSummaryMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    AttendanceHistoryType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/attendances/summary",
        data: {
          ...record,
          start_date: record.dateRange?.from
            ? format(record.dateRange.from, "yyyy-MM-dd")
            : "",
          end_date: record.dateRange?.to
            ? format(record.dateRange.to, "yyyy-MM-dd")
            : "",
        },
        isServer: true,
        apiVersion: true,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Fetch attendance summary mutation error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      setAttendanceSummaryData(data?.payload);
    },
  });

  const onSubmit = (data: AttendanceHistoryType) => {
    fetchAttendanceSummaryMutation.mutate(data);
    fetchAttendanceHistoryMutation.mutate(data);
  };
  /* --------------------------- FILTER OPTIONS --------------------------- */
  const dateFilterOptions = useMemo(() => {
    const dates = attendanceHistoryData.map((r) => r.date.split("T")[0]);
    return Array.from(new Set(dates)).map((d) => ({ label: d, value: d }));
  }, [attendanceHistoryData]);
  const dayStatusFilterOptions = useMemo(() => {
    const statuses = attendanceHistoryData
      .map((r) => r.day_status)
      .filter(Boolean);
    return Array.from(new Set(statuses)).map((s) => ({
      label: s!
        .split("_")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" "),
      value: s!,
    }));
  }, [attendanceHistoryData]);
  const checkInStatusFilterOptions = useMemo(() => {
    const statuses = attendanceHistoryData
      .map((r) => r.check_in_status)
      .filter(Boolean);
    return Array.from(new Set(statuses)).map((s) => ({
      label: s!
        .split("_")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" "),
      value: s!,
    }));
  }, [attendanceHistoryData]);
  const checkOutStatusFilterOptions = useMemo(() => {
    const statuses = attendanceHistoryData
      .map((r) => r.check_out_status)
      .filter(Boolean);
    return Array.from(new Set(statuses)).map((s) => ({
      label: s!
        .split("_")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" "),
      value: s!,
    }));
  }, [attendanceHistoryData]);

  const getCheckInVariant = (status: string | null) => {
  switch (status) {
    case "on time":
      return "success";
    case "late":
      return "warning";
    case "absent":
      return "danger";
    case "manual":
      return "neutral";
    default:
      return "outline";
  }
};

const getCheckOutVariant = (status: string | null) => {
  switch (status) {
    case "on time":
      return "success";
    case "early leave":
    case "early go":
      return "warning";
    case "overtime":
      return "info";
    case "manual":
      return "neutral";
    case "half day":
      return "pending";
    default:
      return "outline";
  }
};

const getDayStatusVariant = (status: string | null) => {
  switch (status) {
    case "present":
      return "success";
    case "absent":
      return "danger";
    case "leave":
      return "warning";
    case "weekend":
    case "holiday":
      return "secondary";
    case "work from home":
      return "info";
    default:
      return "neutral";
  }
};

  /* ----------------------------- COLUMNS ----------------------------- */
  const columns: ColumnDef<AttendanceRecord>[] = [
    {
      accessorKey: "employee_id",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Employee Info" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="text-sm">
            <strong>Name: </strong> {row.original.full_name ?? "---"}
          </span>
          <span className="text-sm">
            <strong>Code: </strong> {row.original.employee_code ?? "---"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Attendance Date" />
      ),
      cell: ({ row }) => {
        const iso = row.getValue("date") as string;
        const dateObj = new Date(iso);
        const dayName = format(dateObj, "EEEE");
        const dateStr = iso.split("T")[0];
        return (
          <div className="flex flex-col">
            <span className="text-sm">
              <strong>Day: </strong>
              {dayName}
            </span>
            <span className="text-sm">
              <strong>Date: </strong>
              {dateStr}
            </span>
          </div>
        );
      },
      filterFn: (row, _columnId, filterValue) => {
        if (
          !filterValue ||
          (Array.isArray(filterValue) && filterValue.length === 0)
        )
          return true;
        const selected = Array.isArray(filterValue)
          ? filterValue
          : [filterValue];
        const cellDate = row.original.date.split("T")[0]; 
        return selected.includes(cellDate);
      },
      meta: {
        filterType: "multiselect",
        filterOptions: dateFilterOptions,
        filterPlaceholder: "Filter by date...",
      } as ColumnMeta,
    },

    {
      accessorKey: "check_in_status",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Check In" />
      ),
      cell: ({ row }) => {
        const time = row.original.check_in_time ?? "---";
        const statusRaw = row.original.check_in_status;
        const status = statusRaw ? statusRaw.split("_").join(" ") : null;

        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm">
              <strong>Time: </strong> {time}
            </span>
            <span className="text-sm">
              <strong>Status: </strong>
              {status ? (
                <Badge
                  variant={getCheckInVariant(status)}
                  className="px-3 py-1 capitalize w-fit"
                >
                  {status}
                </Badge>
              ) : (
                <span className="text-muted-foreground">---</span>
              )}
            </span>
          </div>
        );
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: checkInStatusFilterOptions,
        filterPlaceholder: "Filter by check-in status...",
      } as ColumnMeta,
    },

    {
      accessorKey: "check_out_status", 
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Check Out" />
      ),
      cell: ({ row }) => {
        const time = row.original.check_out_time ?? "---";
        const statusRaw = row.original.check_out_status;
        const status = statusRaw ? statusRaw.split("_").join(" ") : null;

        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm">
              <strong>Time: </strong> {time}
            </span>
            <span className="text-sm">
              <strong>Status: </strong>
              {status ? (
               <Badge
                  variant={getCheckOutVariant(status)}
                  className="px-3 py-1 capitalize w-fit"
                >
                  {status}
                </Badge>
              ) : (
                <span className="text-muted-foreground">---</span>
              )}
            </span>
          </div>
        );
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: checkOutStatusFilterOptions,
        filterPlaceholder: "Filter by check-out status...",
      } as ColumnMeta,
    },

    {
      accessorKey: "day_status", 
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Hours / Status" />
      ),
      cell: ({ row }) => {
        const workHours = row.original.work_hours ?? "---";
        const statusRaw = row.original.day_status;
        const status = statusRaw ? statusRaw.split("_").join(" ") : null;
        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm">
              <strong>Hours: </strong> {workHours}
            </span>
            <span className="text-sm">
              <strong>Day Status: </strong>
              {status ? (
                  <Badge
                  variant={getDayStatusVariant(status)}
                  className="px-3 py-1 capitalize w-fit"
                >
                  {status}
                </Badge>
              ) : (
                <span className="text-muted-foreground">---</span>
              )}
            </span>
          </div>
        );
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: dayStatusFilterOptions,
        filterPlaceholder: "Filter by day status...",
      } as ColumnMeta,
    },
  ];
  if (rights?.can_view !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission to view attendance history listing."
      />
    );
  }
  if (employeeListLoading) {
    return <LoadingState />;
  }
  if (employeeListIsError) {
    return <Error err={employeeListError?.message} />;
  }
  if (
    employeeListResponse?.payload?.length === 0 ||
    !employeeListResponse?.payload
  ) {
    return <Empty title="Not Found" description="No employees found." />;
  }

  return (
    <>
      <SubNav title="Attendance History List" />

      <>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-wrap items-start justify-center gap-4 md:gap-6 lg:flex-nowrap">
            <div className="w-full sm:w-[48%] lg:w-1/4 space-y-2">
              <Controller
                control={control}
                name="employee_id"
                rules={{ required: true }}
                render={({ field }) => {
                  const employeeOptions = employeeListResponse?.payload?.map(
                    (item) => ({
                      value: item.id,
                      label: item.full_name,
                    })
                  );
                  return (
                    <Select
                      id="employee_id"
                      options={employeeOptions}
                      value={
                        employeeOptions?.find(
                          (option) => option.value === field.value
                        ) || null
                      }
                      onChange={(selectedOption) =>
                        field.onChange(
                          selectedOption ? selectedOption.value : null
                        )
                      }
                      placeholder="Select employee"
                      className="w-full z-20"
                      styles={selectStyles}
                    />
                  );
                }}
              />
              {errors.employee_id && (
                <p className="text-red-500 text-sm">
                  {errors.employee_id.message}
                </p>
              )}
            </div>
            <div className="w-full sm:w-[48%] lg:w-1/4 space-y-2">
              <Controller
                control={control}
                name="dateRange"
                rules={{ required: true }}
                render={({ field }) => (
                  <DateRangePicker
                    date={field.value}
                    setDate={(date) => field.onChange(date)}
                    className="w-full"
                  />
                )}
              />
              {errors.dateRange && (
                <p className="text-red-500 text-sm">Date range is required.</p>
              )}
            </div>
            <div className="w-full sm:w-auto flex items-end">
              <Button
                type="submit"
                className="w-full sm:w-auto min-w-[150px] cursor-pointer"
                size="lg"
                disabled={fetchAttendanceHistoryMutation.isPending}
              >
                {fetchAttendanceHistoryMutation.isPending
                  ? "Submitting"
                  : "Submit"}
                {fetchAttendanceHistoryMutation.isPending && (
                  <span className="animate-spin ml-2">
                    <Loader2 />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </>
      {attendanceSummaryData && attendanceSummaryData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {/* Total Days */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Total Days</p>
            <p className="text-xl font-semibold">
              {attendanceSummaryData[0].total_days}
            </p>
          </div>

          {/* Working Days */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Working Days</p>
            <p className="text-xl font-semibold">
              {attendanceSummaryData[0].working_days}
            </p>
          </div>

          {/* Present Days */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Present</p>
            <p className="text-xl font-semibold">
              {attendanceSummaryData[0].present_days}
            </p>
          </div>

          {/* Absent Days */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Absent</p>
            <p className="text-xl font-semibold">
              {attendanceSummaryData[0].absent_days}
            </p>
          </div>

          {/* Leave Days */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Leave</p>
            <p className="text-xl font-semibold">
              {attendanceSummaryData[0].leave_days}
            </p>
          </div>

          {/* Weekend Attendance Days */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              Weekend Attendance
            </p>
            <p className="text-xl font-semibold">
              {attendanceSummaryData[0].weekend_attendance_days}
            </p>
          </div>

          {/* Work From Home */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Work From Home</p>
            <p className="text-xl font-semibold">
              {attendanceSummaryData[0].work_from_home_days}
            </p>
          </div>

          {/* On Time Check Ins */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              On Time Check Ins
            </p>
            <p className="text-xl font-semibold">
              {attendanceSummaryData[0].on_time_check_ins}
            </p>
          </div>

          {/* Late Check Ins */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Late Check Ins</p>
            <p className="text-xl font-semibold">
              {attendanceSummaryData[0].late_check_ins}
            </p>
          </div>

          {/* Overtime Checkouts */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              Overtime Checkouts
            </p>
            <p className="text-xl font-semibold">
              {attendanceSummaryData[0].overtime_check_outs}
            </p>
          </div>

          {/* Expected Working Hours */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              Expected Working Hours
            </p>
            <p className="text-xl font-semibold">
              {attendanceSummaryData[0].expected_work_hours}
            </p>
          </div>

          {/* Actual Working Hours */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Working Hours</p>
            <p className="text-xl font-semibold">
              {attendanceSummaryData[0].actual_work_hours}
            </p>
          </div>
        </div>
      )}

      <AttendanceHistoryDatatable
        columns={columns}
        payload={attendanceHistoryData}
      />
    </>
  );
};

export default AttendanceHistoryList;
