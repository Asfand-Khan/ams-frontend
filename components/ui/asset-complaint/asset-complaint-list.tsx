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
import {
  AssetComplaintPayload,
  AssetComplaintsResponse,
} from "@/types/assetComplaintTypes";
import { fetchAssetComplaintList } from "@/helperFunctions/assetComplaintFunction";
import AssetComplaintDatatable from "./asset-complaint-datatable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
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

  function StatusCell({ record }: { record: any }) {
    const status = record.status as
      | "pending"
      | "in_progress"
      | "resolved"
      | "rejected";

    const [approveRemarks, setApproveRemarks] = React.useState("");
    const [rejectRemarks, setRejectRemarks] = React.useState("");
    const [isApproveModalOpen, setIsApproveModalOpen] = React.useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = React.useState(false);
    const approveInputRef = React.useRef<HTMLInputElement>(null);
    const rejectInputRef = React.useRef<HTMLInputElement>(null);

    // Reset remarks on modal open
    React.useEffect(() => {
      if (isApproveModalOpen) {
        setApproveRemarks("");
        approveInputRef.current?.blur();
      }
    }, [isApproveModalOpen]);

    React.useEffect(() => {
      if (isRejectModalOpen) {
        setRejectRemarks("");
        rejectInputRef.current?.blur();
      }
    }, [isRejectModalOpen]);

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
      const value = e.target.value.replace(/\s+/g, " ").trimStart();
      setter(value);
      if (value.trim().length === 0 && value.length > 0) {
        toast.warning("Leading spaces are not allowed");
      }
    };

    return (
      <div className="flex items-center gap-2">
        {status === "resolved" && (
          <Badge variant="success" className="px-3 py-1 capitalize">
            Approved
          </Badge>
        )}
        {status === "rejected" && (
          <Badge variant="danger" className="px-3 py-1 capitalize">
            Rejected
          </Badge>
        )}

        {(status === "pending" || status === "in_progress") && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  {status === "pending" ? "Pending" : "In Progress"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {status === "pending" && (
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => {
                      approveRejectComplaintMutation.mutate({
                        complaint_id: record.id,
                        status: "in_progress",
                        remarks: "Moved to In Progress",
                      });
                    }}
                  >
                    <Button variant="ghost" className="w-full text-left">
                      In Progress
                    </Button>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Button
                    variant="ghost"
                    className="w-full text-left"
                    onClick={() => setIsApproveModalOpen(true)}
                  >
                    Approved
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Button
                    variant="ghost"
                    className="w-full text-left"
                    onClick={() => setIsRejectModalOpen(true)}
                  >
                    Rejected
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* ✅ Approve Dialog */}
            <Dialog
              open={isApproveModalOpen}
              onOpenChange={(open) => {
                setIsApproveModalOpen(open);
                if (!open) {
                  setApproveRemarks("");
                  approveInputRef.current?.blur();
                }
              }}
            >
              <DialogContent className="sm:max-w-md" data-no-focus-lock>
                <DialogHeader>
                  <DialogTitle>Approve Remarks</DialogTitle>
                  <DialogDescription>
                    Please enter the remarks for approval.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="grid flex-1 gap-2">
                    <Input
                      ref={approveInputRef}
                      type="text"
                      placeholder="Enter approve remarks"
                      value={approveRemarks}
                      onChange={(e) => handleInputChange(e, setApproveRemarks)}
                      autoComplete="new-remarks"
                      autoFocus={false}
                      onFocus={(e) =>
                        (e.target.selectionStart = e.target.value.length)
                      }
                      onBlur={() => approveInputRef.current?.blur()}
                      onKeyDown={(e) => {
                        if (
                          e.key === " " &&
                          e.currentTarget.selectionStart === 0
                        ) {
                          e.preventDefault();
                          toast.warning("Leading spaces are not allowed");
                        }
                      }}
                    />
                  </div>
                </div>
                <DialogFooter className="sm:justify-start">
                  <Button
                    type="submit"
                    variant="secondary"
                    disabled={approveRemarks.trim().length === 0}
                    onClick={() => {
                      if (approveRemarks.trim().length === 0) {
                        toast.error("Remarks cannot be empty");
                        return;
                      }
                      approveRejectComplaintMutation.mutate({
                        complaint_id: record.id,
                        status: "resolved",
                        remarks: approveRemarks.trim(),
                      });
                      setIsApproveModalOpen(false);
                      setApproveRemarks("");
                    }}
                  >
                    Submit
                  </Button>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setApproveRemarks("");
                        approveInputRef.current?.blur();
                      }}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* ✅ Reject Dialog */}
            <Dialog
              open={isRejectModalOpen}
              onOpenChange={(open) => {
                setIsRejectModalOpen(open);
                if (!open) {
                  setRejectRemarks("");
                  rejectInputRef.current?.blur();
                }
              }}
            >
              <DialogContent className="sm:max-w-md" data-no-focus-lock>
                <DialogHeader>
                  <DialogTitle>Reject Remarks</DialogTitle>
                  <DialogDescription>
                    Please enter the remarks for rejection.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="grid flex-1 gap-2">
                    <Input
                      ref={rejectInputRef}
                      type="text"
                      placeholder="Enter reject remarks"
                      value={rejectRemarks}
                      onChange={(e) => handleInputChange(e, setRejectRemarks)}
                      autoComplete="new-remarks"
                      autoFocus={false}
                      onFocus={(e) =>
                        (e.target.selectionStart = e.target.value.length)
                      }
                      onBlur={() => rejectInputRef.current?.blur()}
                      onKeyDown={(e) => {
                        if (
                          e.key === " " &&
                          e.currentTarget.selectionStart === 0
                        ) {
                          e.preventDefault();
                          toast.warning("Leading spaces are not allowed");
                        }
                      }}
                    />
                  </div>
                </div>
                <DialogFooter className="sm:justify-start">
                  <Button
                    type="submit"
                    variant="secondary"
                    disabled={rejectRemarks.trim().length === 0}
                    onClick={() => {
                      if (rejectRemarks.trim().length === 0) {
                        toast.error("Remarks cannot be empty");
                        return;
                      }
                      approveRejectComplaintMutation.mutate({
                        complaint_id: record.id,
                        status: "rejected",
                        remarks: rejectRemarks.trim(),
                      });
                      setIsRejectModalOpen(false);
                      setRejectRemarks("");
                    }}
                  >
                    Submit
                  </Button>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRejectRemarks("");
                        rejectInputRef.current?.blur();
                      }}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    );
  }

  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);
  const { reset } = useForm<AssetComplaintRequest>({
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

  const requestInfoFilterOptions = useMemo(() => {
    const requestTypes =
      assetComplaintListResponse?.payload?.map((item) => item.request_type) ||
      [];
    const categories =
      assetComplaintListResponse?.payload?.map((item) => item.category) || [];
    const assetTypes =
      assetComplaintListResponse?.payload?.map((item) => item.asset_type) || [];
    const createdDates =
      assetComplaintListResponse?.payload?.map((item) =>
        item.created_at ? item.created_at.split("T")[0] : null
      ) || [];

    const uniqueRequestTypes = Array.from(new Set(requestTypes)).map(
      (type) => ({
        label: type
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        value: `request_type:${type}`,
      })
    );
    const uniqueCategories = Array.from(new Set(categories)).map(
      (category) => ({
        label: category
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        value: `category:${category}`,
      })
    );
    const uniqueAssetTypes = Array.from(new Set(assetTypes)).map((type) => ({
      label: type
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      value: `asset_type:${type}`,
    }));
    const uniqueCreatedDates = Array.from(new Set(createdDates))
      .filter((date): date is string => date !== null)
      .map((date) => ({
        label: date,
        value: `created_at:${date}`,
      }));

    return [
      ...uniqueRequestTypes,
      ...uniqueCategories,
      ...uniqueAssetTypes,
      ...uniqueCreatedDates,
    ];
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
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["asset-complaint-list"] });
      router.push(LISTING_ROUTE);
    },
  });

  const handleRefetch = async () => {
    const { isSuccess } = await refetch();
    if (isSuccess) {
      toast.success("Refetched successfully");
    }
  };

  const columns: ColumnDef<AssetComplaintPayload>[] = [
    {
      accessorKey: "requested_by_employee.full_name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Employee" />
      ),
      cell: ({ row }) => {
        const empName = row.original.requested_by_employee.full_name ?? "—";
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
      accessorKey: "request_info",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Request Info" />
      ),
      cell: ({ row }) => {
        const requestType = row.original.request_type
          ? row.original.request_type
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : "—";
        const category = row.original.category
          ? row.original.category
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : "—";
        const assetType = row.original.asset_type
          ? row.original.asset_type
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : "—";
        const createdAt = row.original.created_at
          ? row.original.created_at.split("T")[0]
          : "—";

        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm">
              <strong>Request Type:</strong> {requestType}
            </span>
            <span className="text-sm">
              <strong>Category:</strong> {category}
            </span>
            <span className="text-sm">
              <strong>Asset Type:</strong> {assetType}
            </span>
            <span className="text-sm">
              <strong>Created At:</strong> {createdAt}
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
        const requestType = row.original.request_type;
        const category = row.original.category;
        const assetType = row.original.asset_type;
        const createdAt = row.original.created_at
          ? row.original.created_at.split("T")[0]
          : null;

        return selected.some((v: string) => {
          const [field, value] = v.split(":");
          if (field === "request_type") return value === requestType;
          if (field === "category") return value === category;
          if (field === "asset_type") return value === assetType;
          if (field === "created_at") return value === createdAt;
          return false;
        });
      },
      meta: {
        filterType: "multiselect",
        filterOptions: requestInfoFilterOptions,
        filterPlaceholder: "Filter request info...",
      } as ColumnMeta,
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
                Below is the given reason for the complaint.
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
      accessorKey: "review_info",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Review Info" />
      ),
      cell: ({ row }) => {
        const reviewer = row.original.reviewed_by ?? "—";
        const reviewDate = row.original.reviewed_at
          ? row.original.reviewed_at.split("T")[0]
          : "—";
        const remarks = row.original.resolution_remarks ?? "—";

        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm">
              <strong>Reviewer:</strong> {reviewer}
            </span>
            <span className="text-sm">
              <strong>Date:</strong> {reviewDate}
            </span>
            <span className="text-sm w-[200px] whitespace-pre-wrap break-words">
              <strong>Remarks:</strong> {remarks}
            </span>
          </div>
        );
      },
    },
    // {
    //   accessorKey: "status",
    //   header: ({ column }) => (
    //     <DatatableColumnHeader column={column} title="Status" />
    //   ),
    //   cell: ({ row }) => {
    //     const record = row.original;
    //     const status = record.status as
    //       | "pending"
    //       | "in_progress"
    //       | "resolved"
    //       | "rejected";
    //     const [approveRemarks, setApproveRemarks] = React.useState("");
    //     const [rejectRemarks, setRejectRemarks] = React.useState("");
    //     const [isApproveModalOpen, setIsApproveModalOpen] =
    //       React.useState(false);
    //     const [isRejectModalOpen, setIsRejectModalOpen] = React.useState(false);
    //     const approveInputRef = React.useRef<HTMLInputElement>(null);
    //     const rejectInputRef = React.useRef<HTMLInputElement>(null);

    //     // Reset remarks and blur input when modal opens
    //     React.useEffect(() => {
    //       if (isApproveModalOpen) {
    //         setApproveRemarks("");
    //         if (approveInputRef.current) {
    //           approveInputRef.current.blur();
    //         }
    //       }
    //     }, [isApproveModalOpen]);

    //     React.useEffect(() => {
    //       if (isRejectModalOpen) {
    //         setRejectRemarks("");
    //         if (rejectInputRef.current) {
    //           rejectInputRef.current.blur();
    //         }
    //       }
    //     }, [isRejectModalOpen]);
    //     const handleInputChange = (
    //       e: React.ChangeEvent<HTMLInputElement>,
    //       setter: React.Dispatch<React.SetStateAction<string>>
    //     ) => {
    //       const value = e.target.value.replace(/\s+/g, " ").trimStart();
    //       setter(value);
    //       if (value.trim().length === 0 && value.length > 0) {
    //         toast.warning("Leading spaces are not allowed");
    //       }
    //     };

    //     return (
    //       <div className="flex items-center gap-2">
    //         {status === "resolved" && (
    //           <Badge variant="success" className="px-3 py-1 capitalize">
    //             Approved
    //           </Badge>
    //         )}
    //         {status === "rejected" && (
    //           <Badge variant="danger" className="px-3 py-1 capitalize">
    //             Rejected
    //           </Badge>
    //         )}
    //         {(status === "pending" || status === "in_progress") && (
    //           <>
    //             <DropdownMenu>
    //               <DropdownMenuTrigger asChild>
    //                 <Button size="sm" variant="outline">
    //                   {status === "pending" ? "Pending" : "In Progress"}
    //                 </Button>
    //               </DropdownMenuTrigger>
    //               <DropdownMenuContent>
    //                 {status === "pending" && (
    //                   <DropdownMenuItem
    //                     onSelect={(e) => e.preventDefault()}
    //                     onClick={() => {
    //                       approveRejectComplaintMutation.mutate({
    //                         complaint_id: record.id,
    //                         status: "in_progress",
    //                         remarks: "Moved to In Progress",
    //                       });
    //                     }}
    //                   >
    //                     <Button variant="ghost" className="w-full text-left">
    //                       In Progress
    //                     </Button>
    //                   </DropdownMenuItem>
    //                 )}
    //                 <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
    //                   <Button
    //                     variant="ghost"
    //                     className="w-full text-left"
    //                     onClick={() => {
    //                       setIsApproveModalOpen(true);
    //                     }}
    //                   >
    //                     Approved
    //                   </Button>
    //                 </DropdownMenuItem>
    //                 <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
    //                   <Button
    //                     variant="ghost"
    //                     className="w-full text-left"
    //                     onClick={() => {
    //                       setIsRejectModalOpen(true);
    //                     }}
    //                   >
    //                     Rejected
    //                   </Button>
    //                 </DropdownMenuItem>
    //               </DropdownMenuContent>
    //             </DropdownMenu>
    //             <Dialog
    //               open={isApproveModalOpen}
    //               onOpenChange={(open) => {
    //                 setIsApproveModalOpen(open);
    //                 if (!open) {
    //                   setApproveRemarks("");
    //                   if (approveInputRef.current) {
    //                     approveInputRef.current.blur();
    //                   }
    //                 }
    //               }}
    //             >
    //               <DialogContent
    //                 className="sm:max-w-md"
    //                 data-no-focus-lock
    //               >
    //                 <DialogHeader>
    //                   <DialogTitle>Approve Remarks</DialogTitle>
    //                   <DialogDescription>
    //                     Please enter the remarks for approval.
    //                   </DialogDescription>
    //                 </DialogHeader>
    //                 <div className="flex items-center gap-2">
    //                   <div className="grid flex-1 gap-2">
    //                     <Input
    //                       ref={approveInputRef}
    //                       type="text"
    //                       placeholder="Enter approve remarks"
    //                       value={approveRemarks}
    //                       onChange={(e) =>
    //                         handleInputChange(e, setApproveRemarks)
    //                       }
    //                       autoComplete="new-remarks"
    //                       autoFocus={false}
    //                       onFocus={(e) => {
    //                         e.target.selectionStart = e.target.value.length;
    //                       }}
    //                       onBlur={() => {
    //                         if (approveInputRef.current) {
    //                           approveInputRef.current.blur();
    //                         }
    //                       }}
    //                       onKeyDown={(e) => {
    //                         if (e.key === " ") {
    //                           if (e.currentTarget.selectionStart === 0) {
    //                             e.preventDefault();
    //                             toast.warning("Leading spaces are not allowed");
    //                           }
    //                         }
    //                       }}
    //                     />
    //                   </div>
    //                 </div>
    //                 <DialogFooter className="sm:justify-start">
    //                   <Button
    //                     type="submit"
    //                     variant="secondary"
    //                     disabled={approveRemarks.trim().length === 0}
    //                     onClick={() => {
    //                       if (approveRemarks.trim().length === 0) {
    //                         toast.error("Remarks cannot be empty");
    //                         return;
    //                       }
    //                       approveRejectComplaintMutation.mutate({
    //                         complaint_id: record.id,
    //                         status: "resolved",
    //                         remarks: approveRemarks.trim(),
    //                       });
    //                       setIsApproveModalOpen(false);
    //                       setApproveRemarks("");
    //                     }}
    //                   >
    //                     Submit
    //                   </Button>
    //                   <DialogClose asChild>
    //                     <Button
    //                       variant="outline"
    //                       onClick={() => {
    //                         setApproveRemarks("");
    //                         if (approveInputRef.current) {
    //                           approveInputRef.current.blur();
    //                         }
    //                       }}
    //                     >
    //                       Cancel
    //                     </Button>
    //                   </DialogClose>
    //                 </DialogFooter>
    //               </DialogContent>
    //             </Dialog>
    //             <Dialog
    //               open={isRejectModalOpen}
    //               onOpenChange={(open) => {
    //                 setIsRejectModalOpen(open);
    //                 if (!open) {
    //                   setRejectRemarks("");
    //                   if (rejectInputRef.current) {
    //                     rejectInputRef.current.blur();
    //                   }
    //                 }
    //               }}
    //             >
    //               <DialogContent
    //                 className="sm:max-w-md"
    //                 data-no-focus-lock // Disable Radix UI focus trap
    //               >
    //                 <DialogHeader>
    //                   <DialogTitle>Reject Remarks</DialogTitle>
    //                   <DialogDescription>
    //                     Please enter the remarks for rejection.
    //                   </DialogDescription>
    //                 </DialogHeader>
    //                 <div className="flex items-center gap-2">
    //                   <div className="grid flex-1 gap-2">
    //                     <Input
    //                       ref={rejectInputRef}
    //                       type="text"
    //                       placeholder="Enter reject remarks"
    //                       value={rejectRemarks}
    //                       onChange={(e) =>
    //                         handleInputChange(e, setRejectRemarks)
    //                       }
    //                       autoComplete="new-remarks"
    //                       autoFocus={false}
    //                       onFocus={(e) => {
    //                         e.target.selectionStart = e.target.value.length;
    //                       }}
    //                       onBlur={() => {
    //                         if (rejectInputRef.current) {
    //                           rejectInputRef.current.blur();
    //                         }
    //                       }}
    //                       onKeyDown={(e) => {
    //                         if (e.key === " ") {
    //                           if (e.currentTarget.selectionStart === 0) {
    //                             e.preventDefault();
    //                             toast.warning("Leading spaces are not allowed");
    //                           }
    //                         }
    //                       }}
    //                     />
    //                   </div>
    //                 </div>
    //                 <DialogFooter className="sm:justify-start">
    //                   <Button
    //                     type="submit"
    //                     variant="secondary"
    //                     disabled={rejectRemarks.trim().length === 0}
    //                     onClick={() => {
    //                       if (rejectRemarks.trim().length === 0) {
    //                         toast.error("Remarks cannot be empty");
    //                         return;
    //                       }
    //                       approveRejectComplaintMutation.mutate({
    //                         complaint_id: record.id,
    //                         status: "rejected",
    //                         remarks: rejectRemarks.trim(),
    //                       });
    //                       setIsRejectModalOpen(false);
    //                       setRejectRemarks("");
    //                     }}
    //                   >
    //                     Submit
    //                   </Button>
    //                   <DialogClose asChild>
    //                     <Button
    //                       variant="outline"
    //                       onClick={() => {
    //                         setRejectRemarks("");
    //                         if (rejectInputRef.current) {
    //                           rejectInputRef.current.blur();
    //                         }
    //                       }}
    //                     >
    //                       Cancel
    //                     </Button>
    //                   </DialogClose>
    //                 </DialogFooter>
    //               </DialogContent>
    //             </Dialog>
    //           </>
    //         )}
    //       </div>
    //     );
    //   },
    //   filterFn: "multiSelect",
    //   meta: {
    //     filterType: "multiselect",
    //     filterOptions: [
    //       { label: "Pending", value: "pending" },
    //       { label: "In Progress", value: "in_progress" },
    //       { label: "Approved", value: "resolved" },
    //       { label: "Rejected", value: "rejected" },
    //     ],
    //     filterPlaceholder: "Filter status...",
    //   } as ColumnMeta,
    // },
    // ✅ Column definition
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => <StatusCell record={row.original} />,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: [
          { label: "Pending", value: "pending" },
          { label: "In Progress", value: "in_progress" },
          { label: "Approved", value: "resolved" },
          { label: "Rejected", value: "rejected" },
        ],
        filterPlaceholder: "Filter status...",
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
        description="You do not have permission to view asset complaints listing."
      />
    );
  }

  if (assetComplaintListLoading) {
    return <LoadingState />;
  }

  if (assetComplaintListIsError) {
    return <Error err={error?.message} />;
  }

  if (
    !assetComplaintListResponse?.payload ||
    assetComplaintListResponse.payload.length === 0
  ) {
    return <Empty title="Not Found" description="No Asset Complaint Found" />;
  }

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
