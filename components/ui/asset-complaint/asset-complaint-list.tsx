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
import {
  AssetComplaintPayload,
  AssetComplaintsResponse,
} from "@/types/assetComplaintTypes";
import { fetchAssetComplaintList } from "@/helperFunctions/assetComplaintFunction";
import AssetComplaintDatatable from "./asset-complaint-datatable";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AssetComplaintRequest,
  assetComplaintRequestSchema,
} from "@/schemas/assetComplaintSchema";
import { toast } from "sonner";
import { axiosFunction, axiosReturnType } from "@/utils/axiosFunction";
import { AxiosError } from "axios";

const AssetComplaintList = () => {
  const LISTING_ROUTE = "/hr/requests";
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  // Form
  const {
    register,
    trigger,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(assetComplaintRequestSchema),
  });

  const {
    data: assetComplaintListResponse,
    isLoading: assetComplaintListLoading,
    isError: assetComplaintListIsError,
    error,
    isFetching,
    refetch,
  } = useQuery<AssetComplaintsResponse | null>({
    queryKey: ["asset-complaint-list"],
    queryFn: fetchAssetComplaintList,
  });

  const employeeNameFilterOptions = useMemo(() => {
    const allFullName =
      assetComplaintListResponse?.payload?.map(
        (item) => item.requested_by_employee.full_name
      ) || [];
    const uniqueData = Array.from(new Set(allFullName));
    return uniqueData.map((item) => ({
      label: item,
      value: item,
    }));
  }, [assetComplaintListResponse]);

  const assetTypeFilterOptions = useMemo(() => {
    const allFullName =
      assetComplaintListResponse?.payload?.map((item) => item.asset_type) || [];
    const uniqueData = Array.from(new Set(allFullName));
    return uniqueData.map((item) => ({
      label: item,
      value: item,
    }));
  }, [assetComplaintListResponse]);

  const requestTypeFilterOptions = useMemo(() => {
    const allFullName =
      assetComplaintListResponse?.payload?.map((item) => item.request_type) ||
      [];
    const uniqueData = Array.from(new Set(allFullName));
    return uniqueData.map((item) => ({
      label: item,
      value: item,
    }));
  }, [assetComplaintListResponse]);

  const approveRejectComplaintMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    AssetComplaintRequest
  >({
    onMutate: () => {
      reset();
      toast.info("Please wait...");
    },
    mutationFn: (record) => {
      return axiosFunction({
        method: "PUT",
        urlPath: "/asset-complaints",
        data: record,
        isServer: true,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Approve / Reject complaint mutation error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["asset-complaint-list"] });
      router.push(LISTING_ROUTE);
    },
  });

  const onSubmit = (data: AssetComplaintRequest) => {
    console.log(data);
    approveRejectComplaintMutation.mutate(data);
  };

  const columns: ColumnDef<AssetComplaintPayload>[] = [
    {
      accessorKey: "requested_by_employee.full_name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Employee" />
      ),
      cell: ({ row }) => {
        const empName = row.original.requested_by_employee.full_name ?? "---";
        return <div>{empName}</div>;
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: employeeNameFilterOptions,
        filterPlaceholder: "Filter name...",
      } as ColumnMeta,
    },
    {
      accessorKey: "asset_type",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Asset Type" />
      ),
      cell: ({ row }) => <div>{row.getValue("asset_type") ?? "---"}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: assetTypeFilterOptions,
        filterPlaceholder: "Filter asset...",
      } as ColumnMeta,
    },
    {
      accessorKey: "request_type",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Request Type" />
      ),
      cell: ({ row }) => <div>{row.getValue("request_type") ?? "---"}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: requestTypeFilterOptions,
        filterPlaceholder: "Filter request...",
      } as ColumnMeta,
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => <div>{row.getValue("category") ?? "---"}</div>,
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
              <DialogTitle>Reason</DialogTitle>
              <DialogDescription>
                Below is the given reason for the correction.
              </DialogDescription>
              <hr />
            </DialogHeader>
            <div className="flex items-center gap-2">
              <div className="grid flex-1 gap-2">
                {row.getValue("reason") ?? "---"}
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
      accessorKey: "status",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.status as
          | "pending"
          | "resolved"
          | "in_progress"
          | "rejected";
        return (
          <Badge
            variant={`${
              status === "resolved"
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
      id: "approveReject",
      header: "Approve/Reject",
      cell: ({ row }) => {
        const record = row.original;
        return (
          <div className="flex items-center gap-2">
            <form>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="default"
                    disabled={record.status !== "pending"}
                  >
                    Approve
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Approve Remarks</DialogTitle>
                    <DialogDescription>
                      Please enter the remarks for approval.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                      <Input
                        type="text"
                        placeholder="Enter approve remarks"
                        {...register("remarks")}
                      />
                      {errors.remarks && (
                        <span className="text-destructive">
                          {errors.remarks.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <Button
                      type="submit"
                      variant="secondary"
                      onClick={async () => {
                        setValue("complaint_id", record.id);
                        setValue("status", "resolved");
                        const remarks = getValues("remarks");
                        if (remarks.length === 0) {
                          toast.error("Remarks cannot be empty");
                          return;
                        }
                        const isValid = await trigger();
                        if (isValid) {
                          const formData = getValues();
                          onSubmit(formData);
                        }
                      }}
                    >
                      Submit
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </form>
            <form>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={record.status !== "pending"}
                  >
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Reject Remarks</DialogTitle>
                    <DialogDescription>
                      Please enter the remarks for rejection.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                      <Input
                        type="text"
                        placeholder="Enter reject remarks"
                        {...register("remarks")}
                      />
                      {errors.remarks && (
                        <span className="text-destructive">
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
                        setValue("complaint_id", record.id);
                        setValue("status", "rejected");
                        const remarks = getValues("remarks");
                        if (remarks.length === 0) {
                          toast.error("Remarks cannot be empty");
                          return;
                        }
                        const isValid = await trigger();
                        if (isValid) {
                          const formData = getValues();
                          onSubmit(formData);
                        }
                      }}
                    >
                      Submit
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </form>
          </div>
        );
      },
    },
    {
      accessorKey: "resolution_remarks",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Remarks" />
      ),
      cell: ({ row }) => (
        <div>{row.getValue("resolution_remarks") ?? "---"}</div>
      ),
    },
    {
      accessorKey: "is_active",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Active/Inactive" />
      ),
      cell: ({ row }) => {
        const status = row.original.is_active ? "active" : "inactive";
        return (
          <Badge
            variant={`${status === "active" ? "success" : "danger"}`}
            className="px-3 py-1 capitalize"
          >
            {status ?? "---"}
          </Badge>
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
        description="You do not have permission to view asset compaints listing."
      />
    );
  }

  // Loading state
  if (assetComplaintListLoading) {
    return <LoadingState />;
  }

  // Error state
  if (assetComplaintListIsError) {
    return <Error err={error?.message} />;
  }

  // Empty state
  if (
    !assetComplaintListResponse?.payload ||
    assetComplaintListResponse.payload.length === 0
  ) {
    return <Empty title="Not Found" description="No Asset Complaint Found" />;
  }

  const handleRefetch = async () => {
    const { isSuccess } = await refetch();
    if (isSuccess) {
      toast.success("Refetched successfully");
    }
  };

  return (
    <>
      <SubNav title="Asset Complaint List" />
      <AssetComplaintDatatable
        columns={columns}
        payload={assetComplaintListResponse.payload}
        handleRefetch={handleRefetch}
        isRefetching={isFetching}
      />
    </>
  );
};

export default AssetComplaintList;
