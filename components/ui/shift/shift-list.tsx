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
import { ShiftPayload, ShiftsResponse } from "@/types/shiftTypes";
import { fetchShiftList } from "@/helperFunctions/shiftFunction";
import ShiftDatatable from "./shift-datatable";

const ShiftList = () => {
  const ADD_URL = "/organization/shifts/add-shift";
  const router = useRouter();
  const pathname = usePathname();

  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  const {
    data: shiftListResponse,
    isLoading: shiftListLoading,
    isError: shiftListIsError,
    error,
  } = useQuery<ShiftsResponse | null>({
    queryKey: ["shift-list"],
    queryFn: fetchShiftList,
  });

  const shiftNameFilterOptions = useMemo(() => {
    const allFullName =
      shiftListResponse?.payload?.map((item) => item.name) || [];
    const uniqueData = Array.from(new Set(allFullName));
    return uniqueData.map((item) => ({
      label: item,
      value: item,
    }));
  }, [shiftListResponse]);

  const columns: ColumnDef<ShiftPayload>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const shiftName = row.original.name;
        return <div>{shiftName}</div>;
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: shiftNameFilterOptions,
        filterPlaceholder: "Filter name...",
      } as ColumnMeta,
    },
    {
      accessorKey: "start_time",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Start Time" />
      ),
      cell: ({ row }) => <div>{row.getValue("start_time") ?? "---"}</div>,
    },
    {
      accessorKey: "end_time",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="End Time" />
      ),
      cell: ({ row }) => <div>{row.getValue("end_time") ?? "---"}</div>,
    },
    {
      accessorKey: "grace_minutes",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Grace Minutes" />
      ),
      cell: ({ row }) => <div>{row.getValue("grace_minutes") ?? "---"}</div>,
    },
    {
      accessorKey: "break_duration_minutes",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Break Duration Minutes" />
      ),
      cell: ({ row }) => (
        <div>{row.getValue("break_duration_minutes") ?? "---"}</div>
      ),
    },
    {
      accessorKey: "early_leave_threshold_minutes",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Ealry Leave Threshold" />
      ),
      cell: ({ row }) => (
        <div>{row.getValue("early_leave_threshold_minutes") ?? "---"}</div>
      ),
    },
    {
      accessorKey: "half_day_hours",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Half Day Hours" />
      ),
      cell: ({ row }) => <div>{row.getValue("half_day_hours") ?? "---"}</div>,
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

  // Rights Redirection
  if (rights?.can_view !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission to view shift listing."
      />
    );
  }

  // Loading state
  if (shiftListLoading) {
    return <LoadingState />;
  }

  // Error state
  if (shiftListIsError) {
    return <Error err={error?.message} />;
  }

  // Empty state
  if (!shiftListResponse?.payload || shiftListResponse.payload.length === 0) {
    return <Empty title="Not Found" description="No Shift Found" />;
  }

  return (
    <>
      <SubNav title="Shift List" addBtnTitle="Add Shift" urlPath={ADD_URL} />
      <ShiftDatatable columns={columns} payload={shiftListResponse.payload} />
    </>
  );
};

export default ShiftList;
