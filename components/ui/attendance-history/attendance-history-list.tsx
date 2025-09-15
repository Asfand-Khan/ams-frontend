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
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "../shadcn/calendar";
import {
  AttendanceRecord,
  AttendanceSummaryPayload,
} from "@/types/attendanceTypes";
import { ColumnDef } from "@tanstack/react-table";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import AttendanceHistoryDatatable from "./attendancehistory-datatable";
import { Badge } from "../foundations/badge";

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

  // Form
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AttendanceHistorySchema),
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
          start_date: format(record.start_date, "yyyy-MM-dd"),
          end_date: format(record.end_date, "yyyy-MM-dd"),
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
          start_date: format(record.start_date, "yyyy-MM-dd"),
          end_date: format(record.end_date, "yyyy-MM-dd"),
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

  const columns: ColumnDef<AttendanceRecord>[] = [
    {
      accessorKey: "employee_info",
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
      cell: ({ row }) => (
        <div>{String(row.getValue("date")).split("T")[0]}</div>
      ),
    },
    {
      accessorKey: "check_in",
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
                <Badge variant="outline" className="px-3 py-1 capitalize w-fit">
                  {status}
                </Badge>
              ) : (
                <span className="text-muted-foreground">---</span>
              )}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "check_out",
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
                <Badge variant="outline" className="px-3 py-1 capitalize w-fit">
                  {status}
                </Badge>
              ) : (
                <span className="text-muted-foreground">---</span>
              )}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "work_day",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Hours / Status" />
      ),
      cell: ({ row }) => {
        const workHours = row.original.work_hours ?? "---";
        const statusRaw = row.original.day_status;
        const status = statusRaw ? statusRaw.split("_").join(" ") : null;

        const getVariant = (s: string | null) => {
          switch (s) {
            case "present":
              return "success";
            case "absent":
              return "danger";
            case "leave":
              return "outline";
            case "weekend":
              return "secondary";
            case "holiday":
              return "secondary";
            case "work from home":
              return "success";
            default:
              return "outline";
          }
        };

        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm">
              <strong>Hours: </strong> {workHours}
            </span>
            <span className="text-sm">
              <strong>Day Status: </strong>
              {status ? (
                <Badge
                  variant={getVariant(status)}
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
    },
  ];

  // Rights Redirection
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

  // loading state
  if (employeeListLoading) {
    return <LoadingState />;
  }

  // error state
  if (employeeListIsError) {
    return <Error err={employeeListError?.message} />;
  }

  // empty state
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
          <div className="space-y-6 flex gap-2 items-start justify-between sm:flex-wrap">
            <div className="space-y-2 w-1/4">
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

            <div className="space-y-2 w-1/4">
              <Controller
                control={control}
                name="start_date"
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="space-y-2 lg:col-span-2">
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
                              <span>Pick a start date</span>
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
              {errors.start_date && (
                <p className="text-red-500 text-sm">
                  {errors.start_date.message}
                </p>
              )}
            </div>

            <div className="space-y-2 w-1/4">
              <Controller
                control={control}
                name="end_date"
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="space-y-2 lg:col-span-2">
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
                              <span>Pick a end date</span>
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
              {errors.end_date && (
                <p className="text-red-500 text-sm">
                  {errors.end_date.message}
                </p>
              )}
            </div>

            <div>
              <Button
                type="submit"
                className="min-w-[150px] cursor-pointer"
                size="lg"
                disabled={fetchAttendanceHistoryMutation.isPending}
              >
                {fetchAttendanceHistoryMutation.isPending
                  ? "Submiting"
                  : "Submit"}
                {fetchAttendanceHistoryMutation.isPending && (
                  <span className="animate-spin">
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
