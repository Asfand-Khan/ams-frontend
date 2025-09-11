"use client";

import React, { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { getRights } from "@/utils/getRights";
import { fetchAttendanceCorrectionList } from "@/helperFunctions/attendanceCorrectionFunctions";
import { axiosFunction, axiosReturnType } from "@/utils/axiosFunction";
import {
  AttendanceCorrection,
  AttendanceCorrectionResponse,
} from "@/types/attendanceCorrectionTypes";
import {
  AttendanceCorrectionApproveReject,
  attendanceCorrectionApproveRejectSchema,
} from "@/schemas/attendanceCorrectionSchema";
import { ColumnMeta } from "@/types/dataTableTypes";
import { Button } from "../shadcn/button";
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
import { Input } from "../shadcn/input";
import { Badge } from "../foundations/badge";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import AttendanceCorrectionDatatable from "./attendance-correction-datatable";
import SubNav from "../foundations/sub-nav";
import Empty from "../foundations/empty";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";

const AttendanceCorrectionList: React.FC = () => {
  const ADD_URL = "/hr/attendance-corrections/add-attendance-correction";
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Form management for approve/reject actions
  const {
    register,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<AttendanceCorrectionApproveReject>({
    resolver: zodResolver(attendanceCorrectionApproveRejectSchema),
  });

  // Fetch user rights based on pathname
  const rights = useMemo(() => getRights(pathname), [pathname]);

  // Fetch attendance correction data
  const {
    data: attendanceCorrectionListResponse,
    isLoading: attendanceCorrectionListLoading,
    isError: attendanceCorrectionListIsError,
    error,
    refetch,
    isFetching,
  } = useQuery<AttendanceCorrectionResponse | null>({
    queryKey: ["attendance-correction-list"],
    queryFn: fetchAttendanceCorrectionList,
  });

  // Memoized filter options for datatable
  const fullNameFilterOptions = useMemo(
    () =>
      Array.from(
        new Set(
          attendanceCorrectionListResponse?.payload?.map(
            (item) => item.employee.full_name
          ) || []
        )
      ).map((name) => ({ label: name, value: name })),
    [attendanceCorrectionListResponse]
  );

  const attendanceDateFilterOptions = useMemo(
    () =>
      Array.from(
        new Set(
          attendanceCorrectionListResponse?.payload?.map(
            (item) => item.attendance_date.split("T")[0]
          ) || []
        )
      ).map((date) => ({ label: date, value: date })),
    [attendanceCorrectionListResponse]
  );
  const requestTypeFilterOptions = useMemo(() => {
    const allRequestTypes =
      attendanceCorrectionListResponse?.payload?.map(
        (item) => item.request_type
      ) || [];
    const uniqueRequestTypes = Array.from(new Set(allRequestTypes));
    return uniqueRequestTypes.map((type) => ({
      label: type
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      value: type,
    }));
  }, [attendanceCorrectionListResponse]);

  const createDateFilterOptions = useMemo(
    () =>
      Array.from(
        new Set(
          attendanceCorrectionListResponse?.payload?.map(
            (item) => item.created_at.split("T")[0]
          ) || []
        )
      ).map((date) => ({ label: date, value: date })),
    [attendanceCorrectionListResponse]
  );
  const mergedDateFilterOptions = useMemo(() => {
    const all = [
      ...(attendanceDateFilterOptions || []),
      ...(createDateFilterOptions || []),
    ];
    const map = new Map<string, { label: string; value: string }>();
    all.forEach((opt) => {
      if (opt?.value) map.set(opt.value, opt);
    });
    return Array.from(map.values());
  }, [attendanceDateFilterOptions, createDateFilterOptions]);
  const attendanceCorrectionApproveRejectMutation = useMutation<
    axiosReturnType,
    AxiosError<{ message: string }>,
    AttendanceCorrectionApproveReject
  >({
    onMutate: () => {
      toast.info("Processing request...");
    },
    mutationFn: (record) =>
      axiosFunction({
        method: "POST",
        urlPath: "/attendance-corrections/approve-reject",
        data: record,
        isServer: true,
      }),
    onError: (err) => {
      toast.error(err.response?.data?.message || "An error occurred");
    },
    onSuccess: (data) => {
      toast.success(data.message || "Action completed successfully");
      queryClient.invalidateQueries({
        queryKey: ["attendance-correction-list"],
      });
    },
  });

  const onSubmit = (data: AttendanceCorrectionApproveReject) => {
    attendanceCorrectionApproveRejectMutation.mutate(data);
  };

  // Handle data refetch
  const handleRefetch = async () => {
    const { isSuccess } = await refetch();
    if (isSuccess) {
      toast.success("Data refreshed successfully");
    }
  };

  // Define table columns
  const columns: ColumnDef<AttendanceCorrection>[] = [
    {
      accessorKey: "Name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => <div>{row.original.employee.full_name}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: fullNameFilterOptions,
        filterPlaceholder: "Filter by name...",
      } as ColumnMeta,
    },
    {
      id: "dates",
      accessorKey:"Dates",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Dates" />
      ),
      cell: ({ row }) => {
        const attendanceDate = row.original.attendance_date ?? "—";
        const createdDate = row.original.created_at
          ? row.original.created_at.split("T")[0]
          : "—";

        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm">
              <strong>Attendance:</strong> {attendanceDate}
            </span>
            <span className="text-sm">
              <strong>Created At:</strong> {createdDate}
            </span>
          </div>
        );
      },
      filterFn: (row: any, _columnId: string, filterValue: any) => {
        if (
          !filterValue ||
          (Array.isArray(filterValue) && filterValue.length === 0)
        )
          return true;

        const selected = Array.isArray(filterValue)
          ? filterValue
          : [filterValue];

        const attendanceDate = row.original.attendance_date
          ? row.original.attendance_date.split("T")[0]
          : null;
        const createdDate = row.original.created_at
          ? row.original.created_at.split("T")[0]
          : null;

        return selected.some(
          (v: string) => v === attendanceDate || v === createdDate
        );
      },

      meta: {
        filterType: "multiselect",
        filterOptions: mergedDateFilterOptions,
        filterPlaceholder: "Filter by dates...",
      } as ColumnMeta,
    },
    {
      accessorKey:"Original Time",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Original In/Out" />
      ),
      cell: ({ row }) => {
        const checkIn = row.original.original_check_in ?? "—";
        const checkOut = row.original.original_check_out ?? "—";
        return (
          <div className="flex flex-col">
            <span>
              <strong>In: </strong>
              {checkIn}
            </span>
            <span>
              <strong>Out: </strong>
              {checkOut}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey:"Requested Time",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Requested In/Out" />
      ),
      cell: ({ row }) => {
        const checkIn = row.original.requested_check_in ?? "—";
        const checkOut = row.original.requested_check_out ?? "—";
        return (
          <div className="flex flex-col">
            <span className="text-sm">
              <strong>In: </strong>
              {checkIn}
            </span>
            <span className="text-sm">
              <strong>Out: </strong>
              {checkOut}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: "reason",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Reason" />
      ),
      cell: ({ row }) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="link">
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reason for Correction</DialogTitle>
              <DialogDescription>
                The reason provided for the attendance correction request.
              </DialogDescription>
              <hr />
            </DialogHeader>
            <div className="flex items-center gap-2">
              <div className="grid flex-1 gap-2">
                {row.getValue("reason") ?? "—"}
              </div>
            </div>
            <DialogFooter className="sm:justify-start mt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
    {
      accessorKey: "Request Type",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Request Type" />
      ),
      cell: ({ row }) => {
        const requestType = row.original.request_type as string | undefined;
        const formattedType = requestType
          ? requestType
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : "—";
        return (
          <Badge
            variant={
              requestType === "missed_check_in" ||
              requestType === "missed_check_out"
                ? "danger"
                : requestType === "wrong_time" || requestType === "both"
                ? "danger"
                : requestType === "work_from_home"
                ? "success"
                : "outline"
            }
            className="px-3 py-1 capitalize"
          >
            {formattedType}
          </Badge>
        );
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: requestTypeFilterOptions,
        filterPlaceholder: "Filter request type...",
      } as ColumnMeta,
    },
    {
       accessorKey:"Review Info",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Review Info" />
      ),
      cell: ({ row }) => {
        const reviewer = row.original.reviewer?.full_name ?? "—";
        const remarks = row.original.remarks ?? "—";
        const reviewDate = row.original.reviewed_on
          ? row.original.reviewed_on.split("T")[0]
          : "—";

        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm">
              <strong>Reviewer:</strong> {reviewer}
            </span>
            <span className="text-sm">
              <strong>Date:</strong> {reviewDate}
            </span>
            <span className="text-sm w-[200px] whitespace-pre-wrap break-words">
              <strong>Remarks:</strong> {remarks ?? "—"}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: "status",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const record = row.original;

        if (record.status === "pending") {
          return (
            <div className="flex items-center gap-2">
              {/* Approve Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="default">
                    Approve
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Approve Attendance Correction</DialogTitle>
                    <DialogDescription>
                      Provide remarks for approving this correction request.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                      <Input
                        type="text"
                        placeholder="Enter approval remarks"
                        {...register("remarks")}
                      />
                      {errors.remarks && (
                        <span className="text-destructive text-sm">
                          {errors.remarks.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={async () => {
                        setValue("attendance_correction_id", record.id);
                        setValue("status", "approved");
                        setValue("employee_id", record.employee_id);
                        const remarks = getValues("remarks");
                        if (!remarks) {
                          toast.error("Remarks are required");
                          return;
                        }
                        const isValid = await trigger();
                        if (isValid) {
                          onSubmit(getValues());
                        }
                      }}
                    >
                      Submit
                    </Button>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Reject Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Reject Attendance Correction</DialogTitle>
                    <DialogDescription>
                      Provide remarks for rejecting this correction request.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                      <Input
                        type="text"
                        placeholder="Enter rejection remarks"
                        {...register("remarks")}
                      />
                      {errors.remarks && (
                        <span className="text-destructive text-sm">
                          {errors.remarks.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={async () => {
                        setValue("attendance_correction_id", record.id);
                        setValue("status", "rejected");
                        setValue("employee_id", record.employee_id);
                        const remarks = getValues("remarks");
                        if (!remarks) {
                          toast.error("Remarks are required");
                          return;
                        }
                        const isValid = await trigger();
                        if (isValid) {
                          onSubmit(getValues());
                        }
                      }}
                    >
                      Submit
                    </Button>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          );
        }

        if (record.status === "approved") {
          return (
            <div className="flex items-center gap-2">
              <Badge variant="success" className="px-3 py-1 capitalize">
                Approved
              </Badge>
            </div>
          );
        }

        if (record.status === "rejected") {
          return (
            <div className="flex items-center gap-2">
              <Badge variant="danger" className="px-3 py-1 capitalize">
                Rejected
              </Badge>
            </div>
          );
        }
        return null;
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
  ];

  // Redirect if user lacks view permissions
  if (rights?.can_view !== "1") {
    setTimeout(() => router.back(), 1500);
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission to view the attendance correction list."
      />
    );
  }

  // Display loading state
  if (attendanceCorrectionListLoading) {
    return <LoadingState />;
  }

  // Display error state
  if (attendanceCorrectionListIsError) {
    return (
      <Error err={error?.message || "An error occurred while fetching data"} />
    );
  }

  // Display empty state
  if (
    !attendanceCorrectionListResponse?.payload ||
    attendanceCorrectionListResponse.payload.length === 0
  ) {
    return (
      <Empty
        title="No Data Found"
        description="No attendance correction requests are available."
      />
    );
  }

  return (
    <div className="space-y-4">
      <SubNav
        title="Attendance Correction List"
        urlPath={ADD_URL}
        addBtnTitle="Add Correction"
      />
      <AttendanceCorrectionDatatable
        columns={columns}
        payload={attendanceCorrectionListResponse.payload}
        handleRefetch={handleRefetch}
        isRefetching={isFetching}
      />
    </div>
  );
};

export default AttendanceCorrectionList;
