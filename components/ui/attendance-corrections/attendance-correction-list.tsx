"use client";

import { getRights } from "@/utils/getRights";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";
import React, { useMemo } from "react";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnMeta } from "@/types/dataTableTypes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { Button } from "../shadcn/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import Empty from "../foundations/empty";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import SubNav from "../foundations/sub-nav";
import { fetchAttendanceCorrectionList } from "@/helperFunctions/attendanceCorrectionFunctions";
import {
  AttendanceCorrection,
  AttendanceCorrectionResponse,
} from "@/types/attendanceCorrectionTypes";
import AttendanceCorrectionDatatable from "./attendance-correction-datatable";
import { Badge } from "../foundations/badge";
import { axiosFunction, axiosReturnType } from "@/utils/axiosFunction";
import { AxiosError } from "axios";
import { toast } from "sonner";

const AttendanceCorrectionList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Rights
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  // Fetch attendance correction list data using react-query
  const {
    data: attendanceCorrectionListResponse,
    isLoading: attendanceCorrectionListLoading,
    isError: attendanceCorrectionListIsError,
    error,
  } = useQuery<AttendanceCorrectionResponse | null>({
    queryKey: ["attendance-correction-list"],
    queryFn: fetchAttendanceCorrectionList,
  });

  const fullNameFilterOptions = useMemo(() => {
    const allFullName =
      attendanceCorrectionListResponse?.payload?.map(
        (item) => item.employee.full_name
      ) || [];
    const uniqueData = Array.from(new Set(allFullName));
    return uniqueData.map((item) => ({
      label: item,
      value: item,
    }));
  }, [attendanceCorrectionListResponse]);

  const attendanceDateFilterOptions = useMemo(() => {
    const allAttendanceDate =
      attendanceCorrectionListResponse?.payload?.map(
        (item) => item.attendance_date.split("T")[0]
      ) || [];
    const uniqueEmployeeCode = Array.from(new Set(allAttendanceDate));
    return uniqueEmployeeCode.map((code) => ({
      label: code,
      value: code,
    }));
  }, [attendanceCorrectionListResponse]);

  const createDateFilterOptions = useMemo(() => {
    const allCreateDate =
      attendanceCorrectionListResponse?.payload?.map(
        (item) => item.created_at.split("T")[0]
      ) || [];
    const uniqueEmployeeCode = Array.from(new Set(allCreateDate));
    return uniqueEmployeeCode.map((code) => ({
      label: code,
      value: code,
    }));
  }, [attendanceCorrectionListResponse]);

  // Mutations
  const addAttendanceMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    {
      attendance_correction_id: number;
      employee_id: number;
      status: string;
      remarks: string;
    }
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/attendance-corrections/approve-reject",
        data: record,
        isServer: true,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Attendance correction mutation error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      queryClient.invalidateQueries({
        queryKey: ["attendance-correction-list"],
      });
    },
  });

  const columns: ColumnDef<AttendanceCorrection>[] = [
    {
      accessorKey: "employee.full_name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const employeeName = row.original.employee.full_name;
        return <div>{employeeName}</div>;
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: fullNameFilterOptions,
        filterPlaceholder: "Filter name...",
      } as ColumnMeta,
    },
    {
      accessorKey: "attendance_date",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Attendance Date" />
      ),
      cell: ({ row }) => <div>{row.getValue("attendance_date")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: attendanceDateFilterOptions,
        filterPlaceholder: "Filter date...",
      },
    },
    {
      accessorKey: "original_check_in",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Original Check In" />
      ),
      cell: ({ row }) => (
        <div>{row.getValue("original_check_in") ?? "---"}</div>
      ),
    },
    {
      accessorKey: "requested_check_in",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Requested Check In" />
      ),
      cell: ({ row }) => (
        <div>{row.getValue("requested_check_in") ?? "---"}</div>
      ),
    },
    {
      accessorKey: "original_check_out",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Original Check Out" />
      ),
      cell: ({ row }) => (
        <div>{row.getValue("original_check_out") ?? "---"}</div>
      ),
    },
    {
      accessorKey: "requested_check_out",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Requested Check Out" />
      ),
      cell: ({ row }) => (
        <div>{row.getValue("requested_check_out") ?? "---"}</div>
      ),
    },
    {
      accessorKey: "request_type",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Request Type" />
      ),
      cell: ({ row }) => <div>{row.getValue("request_type") ?? "---"}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={`${
              status === "approved"
                ? "success"
                : status === "rejected"
                ? "danger"
                : "pending"
            }`}
            className="px-3 py-1 capitalize"
          >
            {status ?? "---"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "reviewer.full_name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Reviewed By" />
      ),
      cell: ({ row }) => {
        const reveiwerName = row.original.reviewer?.full_name ?? "---";
        return <div>{reveiwerName}</div>;
      },
    },
    {
      accessorKey: "reviewed_on",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Review Date" />
      ),
      cell: ({ row }) => {
        const reveiwDate = row.original.reviewed_on?.split("T")[0] ?? "---";
        return <div>{reveiwDate}</div>;
      },
    },
    {
      id: "approveReject",
      header: "Approve/Reject",
      cell: ({ row }) => {
        const record = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => {
                toast.info("Please wait...");
                addAttendanceMutation.mutate({
                  attendance_correction_id: record.id,
                  employee_id: record.employee_id,
                  remarks: "Approved",
                  status: "approved",
                });
              }}
              disabled={record.status !== "pending"}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                toast.info("Please wait...");
                addAttendanceMutation.mutate({
                  attendance_correction_id: record.id,
                  employee_id: record.employee_id,
                  remarks: "Rejected",
                  status: "rejected",
                });
              }}
              disabled={record.status !== "pending"}
            >
              Reject
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Create Date" />
      ),
      cell: ({ row }) => {
        const createDate = row.original.created_at?.split("T")[0] ?? "---";
        return <div>{createDate}</div>;
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: createDateFilterOptions,
        filterPlaceholder: "Filter create date...",
      } as ColumnMeta,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const record = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {rights?.can_edit === "1" && (
                <DropdownMenuItem
                  onClick={() => {
                    console.log("Edit: ", record.id);
                  }}
                  asChild
                >
                  <Link href={"#"}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
              )}
              {rights?.can_edit === "1" && (
                <DropdownMenuItem>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
        description="You do not have permission to view branch listing."
      />
    );
  }

  // Loading state
  if (attendanceCorrectionListLoading) {
    return <LoadingState />;
  }

  // Error state
  if (attendanceCorrectionListIsError) {
    return <Error err={error?.message} />;
  }

  // Empty state
  if (
    !attendanceCorrectionListResponse?.payload ||
    attendanceCorrectionListResponse.payload.length === 0
  ) {
    return (
      <Empty title="Not Found" description="No Attendance Correction Found" />
    );
  }

  return (
    <>
      <SubNav title="Attendance Correction List" />
      <AttendanceCorrectionDatatable
        columns={columns}
        payload={attendanceCorrectionListResponse.payload}
      />
    </>
  );
};

export default AttendanceCorrectionList;
