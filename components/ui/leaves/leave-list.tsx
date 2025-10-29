"use client";

import { getRights } from "@/utils/getRights";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";
import React, { useMemo } from "react";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnMeta } from "@/types/dataTableTypes";
import { Button } from "../shadcn/button";
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
import {
  LeaveRequestApproveReject,
  leaveRequestApproveRejectSchema,
} from "@/schemas/leaveRequestSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../shadcn/dialog";
import { format } from "date-fns";

const LeaveList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Rights
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  const { getValues, setValue } = useForm({
    resolver: zodResolver(leaveRequestApproveRejectSchema),
  });

  // Fetch attendance correction list data using react-query
  const {
    data: leaveListResponse,
    isLoading: leaveListLoading,
    isError: leaveListIsError,
    error,
    refetch,
    isFetching,
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
  const leaveTypeFilterOptions = useMemo(() => {
    const allLeaveTypes =
      leaveListResponse?.payload?.map((item) => item.leave_type_name) || [];
    const uniqueData = Array.from(new Set(allLeaveTypes));
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
  const leaveRequestApproveRejectMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    LeaveRequestApproveReject
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
      cell: ({ row }) => <div>{row.original.full_name}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: fullNameFilterOptions,
        filterPlaceholder: "Filter name...",
      } as ColumnMeta,
    },
    {
      id: "leave Dates",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Leave Period" />
      ),
      cell: ({ row }) => {
        const start = format(row.original.start_date ?? "---", "dd-MMM-yyyy");
        const end = format(row.original.end_date ?? "---", "dd-MMM-yyyy");
        const total = row.original.total_days ?? "---";
        return (
          <div className="flex flex-col gap-1 text-sm">
            <span>
              <strong>Start:</strong> {start}
            </span>
            <span>
              <strong>End:</strong> {end}
            </span>
            <span>
              <strong>Total Days:</strong> {total}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "leave Type",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => <div>{row.original.leave_type_name ?? "---"}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: leaveTypeFilterOptions,
        filterPlaceholder: "Filter leave type...",
      } as ColumnMeta,
    },

    {
      accessorKey: "Status",
      accessorFn: (row) => row.STATUS,
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const record = row.original;
        const status = record.STATUS;

        const getVariant = (s: string | null) => {
          switch (s) {
            case "approved":
              return "success";
            case "rejected":
              return "danger";
            case "pending":
              return "pending";
            default:
              return "outline";
          }
        };

        return (
          <div className="flex flex-col gap-2">
            <Badge
              variant={getVariant(status)}
              className="px-3 py-1 capitalize w-fit"
            >
              {status ?? "---"}
            </Badge>

            {status === "pending" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => {
                    setValue("leave_id", record.leave_id);
                    setValue("leave_type_id", record.leave_type_id);
                    setValue("status", "approved");
                    setValue("employee_id", record.employee_id);
                    onSubmit(getValues());
                  }}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setValue("leave_id", record.leave_id);
                    setValue("leave_type_id", record.leave_type_id);
                    setValue("status", "rejected");
                    setValue("employee_id", record.employee_id);
                    onSubmit(getValues());
                  }}
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        );
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: [
          { label: "Pending", value: "pending" },
          { label: "Approved", value: "approved" },
          { label: "Rejected", value: "rejected" },
        ],
        filterPlaceholder: "Filter status...",
      } as ColumnMeta,
    },

    {
      id: "approval Details",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Approval Info" />
      ),
      cell: ({ row }) => {
        const approver = row.original.approver ?? "---";
        const approveDate = format(
          row.original.applied_on?.split("T")[0] ?? "---",
          "dd-MMM-yyyy"
        );
        return (
          <div className="flex flex-col gap-1 text-sm">
            <span>
              <strong>By:</strong> {approver}
            </span>
            <span>
              <strong>On:</strong> {approveDate}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "Created At",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Created Date" />
      ),
      cell: ({ row }) => {
        const createDate = format(
          row.original.created_at?.split("T")[0] ?? "---",
          "dd-MMM-yyyy"
        );
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
  accessorKey: "reason",
  header: ({ column }) => (
    <DatatableColumnHeader column={column} title="Reason" />
  ),
  cell: ({ row }) => {
    const reason = row.getValue("reason") as string | undefined;
    const preview = reason ? reason.slice(0, 50) : "---";
    const needsMore = reason && reason.length > 50;

    return (
      <div className="relative flex items-center gap-1 max-w-[150px] group">
        {/* Preview Text */}
        <span
          className={`
            text-sm block
            ${needsMore ? "truncate" : "whitespace-normal"}
          `}
          title={reason || ""}
        >
          {preview}
          {needsMore && "..."}
        </span>

        {/* Hover Tooltip – Fixed Position & No Extra Space */}
        {needsMore && (
          <div
            className="
              pointer-events-none absolute left-0 top-full z-50
              mt-1 w-64 max-w-xs rounded-md bg-black p-2 text-xs text-white
              opacity-0 transition-opacity group-hover:opacity-100
              shadow-lg whitespace-pre-wrap break-words
              invisible group-hover:visible
            "
            style={{ transform: "translateX(-50%)", left: "50%" }} // Center tooltip
          >
            {reason}
          </div>
        )}

        {/* View More Button */}
        {needsMore && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="link"
                className="h-auto p-0 text-xs text-primary hover:underline"
              >
                View more
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Reason</DialogTitle>
                <DialogDescription>
                  Below is the given reason for the leave request.
                </DialogDescription>
                <hr />
              </DialogHeader>
              <div className="py-2">
                <p className="text-sm whitespace-pre-wrap break-words">
                  {reason ?? "---"}
                </p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
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

  const onSubmit = (data: LeaveRequestApproveReject) => {
    console.log(data);
    leaveRequestApproveRejectMutation.mutate(data);
  };

  const handleRefetch = async () => {
    const { isSuccess } = await refetch();
    if (isSuccess) {
      toast.success("Refetched successfully");
    }
  };

  return (
    <>
      <SubNav title="Leave List" />
      <LeaveDatatable
        columns={columns}
        payload={leaveListResponse.payload}
        handleRefetch={handleRefetch}
        isRefetching={isFetching}
      />
    </>
  );
};

export default LeaveList;
