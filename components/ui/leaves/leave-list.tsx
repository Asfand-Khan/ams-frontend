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
import { Badge } from "../foundations/badge";
import { axiosFunction, axiosReturnType } from "@/utils/axiosFunction";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { fetchLeaveList } from "@/helperFunctions/leaveFunction";
import { LeavePayload, LeaveResponse } from "@/types/leaveTypes";
import LeaveDatatable from "./leave-datatable";

const LeaveList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Rights
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  // Fetch attendance correction list data using react-query
  const {
    data: leaveListResponse,
    isLoading: leaveListLoading,
    isError: leaveListIsError,
    error,
  } = useQuery<LeaveResponse | null>({
    queryKey: ["leave-list"],
    queryFn: fetchLeaveList,
  });

  const fullNameFilterOptions = useMemo(() => {
    const allFullName =
      leaveListResponse?.payload?.map((item) => item.full_name) || [];
    const uniqueData = Array.from(new Set(allFullName));
    return uniqueData.map((item) => ({
      label: item,
      value: item,
    }));
  }, [leaveListResponse]);

  const createDateFilterOptions = useMemo(() => {
    const allCreateDate =
      leaveListResponse?.payload?.map(
        (item) => item.created_at.split("T")[0]
      ) || [];
    const uniqueEmployeeCode = Array.from(new Set(allCreateDate));
    return uniqueEmployeeCode.map((code) => ({
      label: code,
      value: code,
    }));
  }, [leaveListResponse]);

  // Mutations
  const approveRejectLeaveMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    {
      leave_id: number;
      leave_type_id: number;
      employee_id: number;
      status: string;
      remarks: string;
    }
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/leaves/approve-reject",
        data: record,
        isServer: true,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Leave mutation error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      queryClient.invalidateQueries({
        queryKey: ["leave-list"],
      });
    },
  });

  const columns: ColumnDef<LeavePayload>[] = [
    {
      accessorKey: "full_name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const employeeName = row.original.full_name;
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
      accessorKey: "start_date",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Start Date" />
      ),
      cell: ({ row }) => <div>{row.getValue("start_date")}</div>,
    },
    {
      accessorKey: "end_date",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="End Date" />
      ),
      cell: ({ row }) => <div>{row.getValue("end_date")}</div>,
    },
    {
      accessorKey: "leave_type_name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => <div>{row.getValue("leave_type_name") ?? "---"}</div>,
    },
    {
      accessorKey: "total_days",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Total Days" />
      ),
      cell: ({ row }) => <div>{row.getValue("total_days") ?? "---"}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.STATUS as string;
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
      accessorKey: "approver",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Approved By" />
      ),
      cell: ({ row }) => {
        const approver = row.original.approver ?? "---";
        return <div>{approver}</div>;
      },
    },
    {
      accessorKey: "applied_on",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Approved On" />
      ),
      cell: ({ row }) => {
        const approveDate = row.original.applied_on?.split("T")[0] ?? "---";
        return <div>{approveDate}</div>;
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
                approveRejectLeaveMutation.mutate({
                  leave_id: record.leave_id,
                  employee_id: record.employee_id,
                  leave_type_id: record.leave_type_id,
                  remarks: "Approved",
                  status: "approved",
                });
              }}
              disabled={record.STATUS !== "pending"}
            >
              {record.STATUS === "approved" ? "Approved" : "Approve"}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                toast.info("Please wait...");
                approveRejectLeaveMutation.mutate({
                  leave_id: record.leave_id,
                  employee_id: record.employee_id,
                  leave_type_id: record.leave_type_id,
                  remarks: "Rejected",
                  status: "rejected",
                });
              }}
              disabled={record.STATUS !== "pending"}
            >
              {record.STATUS === "rejected" ? "Rejected" : "Reject"}
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
                    console.log("Edit: ", record.leave_id);
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
        description="You do not have permission to view leave listing."
      />
    );
  }

  // Loading state
  if (leaveListLoading) {
    return <LoadingState />;
  }

  // Error state
  if (leaveListIsError) {
    return <Error err={error?.message} />;
  }

  // Empty state
  if (!leaveListResponse?.payload || leaveListResponse.payload.length === 0) {
    return <Empty title="Not Found" description="No Leave Found" />;
  }

  return (
    <>
      <SubNav title="Leave List" />
      <LeaveDatatable columns={columns} payload={leaveListResponse.payload} />
    </>
  );
};

export default LeaveList;
