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
import Image from "next/image";

const AttendanceList = () => {
  const ADD_URL = "/hr/attendance/add-attendance";
  // zustand
  // const { setAttendanceId } = useAttendanceIdStore();
  const [currentDate] = React.useState<Date>(new Date());
  const router = useRouter();
  const pathname = usePathname();
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);
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
  const formatTime12Hour = (time: string | null | undefined) => {
    if (!time || time === "---") return "---";
    try {
      const [hours, minutes] = time.split(":").map(Number);
      const period = hours >= 12 ? "PM" : "AM";
      const hour12 = hours % 12 || 12;
      return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
    } catch {
      return time;
    }
  };
  const fullNameFilterOptions = useMemo(() => {
    const allFullName =
      attendanceListResponse?.payload?.map((item) => item.full_name) || [];
    const uniqueData = Array.from(new Set(allFullName));
    return uniqueData.map((item) => ({
      label: item,
      value: item,
    }));
  }, [attendanceListResponse]);
  const columns: ColumnDef<AttendanceRecord>[] = [
    {
      accessorKey: "full_name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const fullName = row.getValue("full_name") as string;
        const profilePicture = row.original.profile_picture;
        const src = profilePicture
          ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${profilePicture}`
          : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}default.png`;

        return (
          <div className="flex items-center gap-3">
            <Image
              src={src}
              alt={fullName}
              width={100}
              height={100}
              className="h-10 w-10 rounded-full object-cover"
            />
            <span>{fullName}</span>
          </div>
        );
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: fullNameFilterOptions,
        filterPlaceholder: "Filter name...",
      } as ColumnMeta,
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Attendance Date" />
      ),
      cell: ({ row }) => {
        const isoDate = row.getValue("date") as string;
        const date = new Date(isoDate);
        const dayName = format(date, "EEEE");
        const formattedDate = format(date, "dd-MMM-yyyy");
        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm"><strong>Day: </strong>{formattedDate}</span>
            <span className="text-sm"><strong>Date: </strong>{dayName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "CheckIn",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Check In" />
      ),
      cell: ({ row }) => {
        const time = formatTime12Hour(row.original.check_in_time);
        const statusRaw = row.original.check_in_status;
        const status = statusRaw ? statusRaw.split("_").join(" ") : null;

        const getCheckInVariant = (s: string | null) => {
          switch (s) {
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
    },

    {
      accessorKey: "Check Out",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Check Out" />
      ),
      cell: ({ row }) => {
        const time = formatTime12Hour(row.original.check_out_time);
        const statusRaw = row.original.check_out_status;
        const status = statusRaw ? statusRaw.split("_").join(" ") : null;

        const getCheckOutVariant = (s: string | null) => {
          switch (s) {
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
    },

    {
      accessorKey: "workDay",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Hours / Status" />
      ),
      cell: ({ row }) => {
        const workHours = row.original.work_hours ?? "---";
        const statusRaw = row.original.day_status;
        const status = statusRaw ? statusRaw.split("_").join(" ") : null;

        const getDayStatusVariant = (s: string | null) => {
          switch (s) {
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
            <p className="text-sm text-muted-foreground font-medium mb-1">
              Total Employees
            </p>
            <p className="text-xl font-semibold">
              {dailyAttendanceSummaryResponse.payload[0].total_employees}
            </p>
          </div>

          {/* Present */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground font-medium mb-1">Present</p>
            <p className="text-xl font-semibold">
              {dailyAttendanceSummaryResponse.payload[0].present}
            </p>
          </div>

          {/* Absent */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground font-medium mb-1">Absent</p>
            <p className="text-xl font-semibold">
              {dailyAttendanceSummaryResponse.payload[0].absent}
            </p>
          </div>

          {/* Work From Home */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground font-medium mb-1">Work From Home</p>
            <p className="text-xl font-semibold">
              {dailyAttendanceSummaryResponse.payload[0].work_from_home}
            </p>
          </div>

          {/* Late Arrivals */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground font-medium mb-1">Late Arrivals</p>
            <p className="text-xl font-semibold">
              {dailyAttendanceSummaryResponse.payload[0].late_arrivals}
            </p>
          </div>

          {/* On Leave */}
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <p className="text-sm text-muted-foreground font-medium mb-1">On Leave</p>
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
