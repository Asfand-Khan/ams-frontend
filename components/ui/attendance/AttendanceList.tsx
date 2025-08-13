"use client";

import {
  AttendanceRecord,
  AttendanceResponse,
  DailyAttendanceSummaryResponse,
} from "@/types/attendanceTypes";
import { getRights } from "@/utils/getRights";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";
import React, { useMemo } from "react";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnMeta } from "@/types/dataTableTypes";
import Empty from "../foundations/empty";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import SubNav from "../foundations/sub-nav";
import AttendancesDatatable from "./attendance-datatable";
import {
  fetchAttendanceListByDate,
  fetchDailyAttendanceSummary,
} from "@/helperFunctions/attendanceFunction";
import { format } from "date-fns";
import { toast } from "sonner";
import { Badge } from "../foundations/badge";

const AttendanceList = () => {
  // Constants
  const ADD_URL = "/hr/attendance/add-attendance";
  // const EDIT_URL = "/hr/attendance/edit-attendance";

  // zustand
  // const { setAttendanceId } = useAttendanceIdStore();
  const [currentDate] = React.useState<Date>(new Date());

  const router = useRouter();
  const pathname = usePathname();

  // Rights
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  // Fetch attendance list data using react-query
  const {
    data: dailyAttendanceSummaryResponse,
    isLoading: dailyAttendanceSummaryLoading,
    refetch: refetchDailyAttendanceSummary,
    isFetching: isFetchingDailyAttendanceSummary,
  } = useQuery<DailyAttendanceSummaryResponse | null>({
    queryKey: ["daily-attendance-summary"],
    queryFn: fetchDailyAttendanceSummary,
  });

  const {
    data: attendanceListResponse,
    isLoading: attendanceListLoading,
    isError: attendanceListIsError,
    error,
    refetch,
    isFetching,
  } = useQuery<AttendanceResponse | null>({
    queryKey: ["attendance-list"],
    queryFn: () =>
      fetchAttendanceListByDate({
        attendance_date: format(currentDate, "yyyy-MM-dd"),
      }),
  });

  const fullNameFilterOptions = useMemo(() => {
    const allFullName =
      attendanceListResponse?.payload?.map((item) => item.full_name) || [];
    const uniqueData = Array.from(new Set(allFullName));
    return uniqueData.map((item) => ({
      label: item,
      value: item,
    }));
  }, [attendanceListResponse]);

  const employeeCodeFilterOptions = useMemo(() => {
    const allEmployeeCode =
      attendanceListResponse?.payload?.map((item) => item.employee_code) || [];
    const uniqueEmployeeCode = Array.from(new Set(allEmployeeCode));
    return uniqueEmployeeCode.map((code) => ({
      label: code,
      value: code,
    }));
  }, [attendanceListResponse]);

  const columns: ColumnDef<AttendanceRecord>[] = [
    {
      accessorKey: "full_name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => <div>{row.getValue("full_name")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: fullNameFilterOptions,
        filterPlaceholder: "Filter name...",
      } as ColumnMeta,
    },
    {
      accessorKey: "employee_code",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Employee Code" />
      ),
      cell: ({ row }) => <div>{row.getValue("employee_code")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: employeeCodeFilterOptions,
        filterPlaceholder: "Filter employee code...",
      },
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
      accessorKey: "check_in_time",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Check In" />
      ),
      cell: ({ row }) => <div>{row.getValue("check_in_time") ?? "---"}</div>,
    },
    {
      accessorKey: "check_in_status",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Check In Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.check_in_status?.split("_").join(" ");
        return (
          <>
            {status !== undefined ? (
              <Badge variant="outline" className="px-3 py-1 capitalize">
                {status}
              </Badge>
            ) : (
              "---"
            )}
          </>
        );
      },
    },
    {
      accessorKey: "check_out_time",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Check Out" />
      ),
      cell: ({ row }) => <div>{row.getValue("check_out_time") ?? "---"}</div>,
    },
    {
      accessorKey: "check_out_status",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Check Out Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.check_out_status?.split("_").join(" ");
        return (
          <>
            {status !== undefined ? (
              <Badge variant="outline" className="px-3 py-1 capitalize">
                {status}
              </Badge>
            ) : (
              "---"
            )}
          </>
        );
      },
    },
    {
      accessorKey: "work_hours",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Working Hours" />
      ),
      cell: ({ row }) => <div>{row.getValue("work_hours") ?? "---"}</div>,
    },
    {
      accessorKey: "day_status",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Day Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.day_status?.split("_").join(" ");
        return (
          <>
            {status !== undefined ? (
              <Badge
                variant={
                  status === "present"
                    ? "success"
                    : status === "absent"
                    ? "danger"
                    : "outline"
                }
                className="px-3 py-1 capitalize"
              >
                {status}
              </Badge>
            ) : (
              "---"
            )}
          </>
        );
      },
    },
    // {
    //   id: "actions",
    //   header: "Actions",
    //   cell: ({ row }) => {
    //     const record = row.original;
    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <MoreHorizontal />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //           <DropdownMenuSeparator />
    //           {rights?.can_edit === "1" && (
    //             <DropdownMenuItem
    //               onClick={() => {
    //                 if (record.id == null || record.id === undefined) {
    //                   toast.info("Attendance Does not exist, try adding.");
    //                 } else {
    //                   setAttendanceId(record.id);
    //                 }
    //               }}
    //               asChild
    //             >
    //               <Link
    //                 href={
    //                   record.id == null || record.id === undefined
    //                     ? "#"
    //                     : EDIT_URL
    //                 }
    //               >
    //                 <Edit className="mr-2 h-4 w-4" />
    //                 Edit
    //               </Link>
    //             </DropdownMenuItem>
    //           )}
    //           {rights?.can_edit === "1" && (
    //             <DropdownMenuItem>
    //               <Trash className="mr-2 h-4 w-4" />
    //               Delete
    //             </DropdownMenuItem>
    //           )}
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    // },
  ];

  // Rights Redirection
  if (rights?.can_view !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission to view attendance listing."
      />
    );
  }

  // Loading state
  if (attendanceListLoading || dailyAttendanceSummaryLoading) {
    return <LoadingState />;
  }

  // Error state
  if (attendanceListIsError) {
    return <Error err={error?.message} />;
  }

  // Empty state
  if (
    !attendanceListResponse?.payload ||
    attendanceListResponse.payload.length === 0
  ) {
    return <Empty title="Not Found" description="No Attendance Found" />;
  }

  const handleRefetch = async () => {
    const { isSuccess } = await refetch();
    const { isSuccess: isSuccess2 } = await refetchDailyAttendanceSummary();
    if (isSuccess && isSuccess2) {
      toast.success("Refetched successfully");
    }
  };

  return (
    <>
      <SubNav
        title="Attendance List"
        urlPath={ADD_URL}
        addBtnTitle="Add Attendance"
      />
      {dailyAttendanceSummaryResponse?.payload && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {/* Total Employees */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              Total Employees
            </p>
            <p className="text-xl font-semibold">
              {dailyAttendanceSummaryResponse.payload[0].total_employees}
            </p>
          </div>

          {/* Present */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Present</p>
            <p className="text-xl font-semibold">
              {dailyAttendanceSummaryResponse.payload[0].present}
            </p>
          </div>

          {/* Absent */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Absent</p>
            <p className="text-xl font-semibold">
              {dailyAttendanceSummaryResponse.payload[0].absent}
            </p>
          </div>

          {/* Work From Home */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Work From Home</p>
            <p className="text-xl font-semibold">
              {dailyAttendanceSummaryResponse.payload[0].work_from_home}
            </p>
          </div>

          {/* Late Arrivals */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Late Arrivals</p>
            <p className="text-xl font-semibold">
              {dailyAttendanceSummaryResponse.payload[0].late_arrivals}
            </p>
          </div>

          {/* On Leave */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">On Leave</p>
            <p className="text-xl font-semibold">
              {dailyAttendanceSummaryResponse.payload[0].on_leave}
            </p>
          </div>
        </div>
      )}
      <AttendancesDatatable
        columns={columns}
        payload={attendanceListResponse.payload}
        handleRefetch={handleRefetch}
        isRefetching={
          isFetching || isFetchingDailyAttendanceSummary ? true : false
        }
      />
    </>
  );
};

export default AttendanceList;
