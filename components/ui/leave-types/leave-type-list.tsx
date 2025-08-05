"use client";

import { getRights } from "@/utils/getRights";
import { useQuery } from "@tanstack/react-query";
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
import { fetchLeaveTypeList } from "@/helperFunctions/leaveTypeFunction";
import { LeaveTypePayload, LeaveTypeResponse } from "@/types/leaveTypeTypes";
import LeaveTypeDatatable from "./leave-type-datatable";
import useLeaveTypeIdStore from "@/hooks/useLeaveTypeIdStore";

const LeaveTypeList = () => {
  const ADD_URL = "/hr/leave-types/add-leave-type";
  const EDIT_URL = "/hr/leave-types/edit-leave-type";

  const router = useRouter();
  const pathname = usePathname();

  // zustand
  const setLeaveTypeId = useLeaveTypeIdStore((state) => state.setLeaveTypeId);

  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  const {
    data: leaveTypeListResponse,
    isLoading: leaveTypeListLoading,
    isError: leaveTypeListIsError,
    error,
  } = useQuery<LeaveTypeResponse | null>({
    queryKey: ["leave-type-list"],
    queryFn: fetchLeaveTypeList,
  });

  const fullNameFilterOptions = useMemo(() => {
    const allFullName =
      leaveTypeListResponse?.payload?.map((item) => item.name) || [];
    const uniqueData = Array.from(new Set(allFullName));
    return uniqueData.map((item) => ({
      label: item,
      value: item,
    }));
  }, [leaveTypeListResponse]);

  const columns: ColumnDef<LeaveTypePayload>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const name = row.original.name;
        return <div>{name}</div>;
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: fullNameFilterOptions,
        filterPlaceholder: "Filter name...",
      } as ColumnMeta,
    },
    {
      accessorKey: "total_quota",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Leave Quota" />
      ),
      cell: ({ row }) => <div>{row.getValue("total_quota") ?? "---"}</div>,
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
                    setLeaveTypeId(record.id);
                  }}
                  asChild
                >
                  <Link href={EDIT_URL}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
              )}
              {rights?.can_delete === "1" && (
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


  if (rights?.can_view !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission to view leave type listing."
      />
    );
  }

  // Loading state
  if (leaveTypeListLoading) {
    return <LoadingState />;
  }

  // Error state
  if (leaveTypeListIsError) {
    return <Error err={error?.message} />;
  }

  // Empty state
  if (
    !leaveTypeListResponse?.payload ||
    leaveTypeListResponse.payload.length === 0
  ) {
    return <Empty title="Not Found" description="No Leave Type Found" />;
  }

  return (
    <>
      <SubNav
        title="Leave Type List"
        urlPath={ADD_URL}
        addBtnTitle="Add Leave Type"
      />
      <LeaveTypeDatatable
        columns={columns}
        payload={leaveTypeListResponse.payload}
      />
    </>
  );
};

export default LeaveTypeList;
