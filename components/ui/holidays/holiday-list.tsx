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
import { HolidayPayload, HolidayResponse } from "@/types/holidayTypes";
import { fetchHolidayList } from "@/helperFunctions/holidayFunction";
import HolidayDatatable from "./holiday-datatable";
import { toast } from "sonner";

const HolidayList = () => {
  const ADD_URL = "/hr/holidays/add-holiday";

  const router = useRouter();
  const pathname = usePathname();

  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  const {
    data: holidayListResponse,
    isLoading: holidayListLoading,
    isError: holidayListIsError,
    error,
    refetch,
    isFetching
  } = useQuery<HolidayResponse | null>({
    queryKey: ["holiday-list"],
    queryFn: fetchHolidayList,
  });

  const nameFilterOptions = useMemo(() => {
    const allFullName =
      holidayListResponse?.payload?.map((item) => item.title) || [];
    const uniqueData = Array.from(new Set(allFullName));
    return uniqueData.map((item) => ({
      label: item,
      value: item,
    }));
  }, [holidayListResponse]);

  const dateFilterOptions = useMemo(() => {
    const allFullName =
      holidayListResponse?.payload?.map((item) => item.holiday_date) || [];
    const uniqueData = Array.from(new Set(allFullName));
    return uniqueData.map((item) => ({
      label: item,
      value: item,
    }));
  }, [holidayListResponse]);

  const columns: ColumnDef<HolidayPayload>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        const name = row.original.title;
        return <div>{name}</div>;
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: nameFilterOptions,
        filterPlaceholder: "Filter name...",
      } as ColumnMeta,
    },
    {
      accessorKey: "holiday_date",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Holiday Date" />
      ),
      cell: ({ row }) => <div>{row.getValue("holiday_date") ?? "---"}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: dateFilterOptions,
        filterPlaceholder: "Filter date...",
      } as ColumnMeta,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Desc" />
      ),
      cell: ({ row }) => <div>{row.getValue("description") ?? "---"}</div>,
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


  if (rights?.can_view !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission to view holiday listing."
      />
    );
  }

  // Loading state
  if (holidayListLoading) {
    return <LoadingState />;
  }

  // Error state
  if (holidayListIsError) {
    return <Error err={error?.message} />;
  }

  // Empty state
  if (
    !holidayListResponse?.payload ||
    holidayListResponse.payload.length === 0
  ) {
    return <Empty title="Not Found" description="No Holiday Found" />;
  }

  const handleRefetch = async () => {
      const { isSuccess } = await refetch();
      if (isSuccess) {
        toast.success("Refetched successfully");
      }
    };

  return (
    <>
      <SubNav
        title="Holiday List"
        urlPath={ADD_URL}
        addBtnTitle="Add Holiday"
      />
      <HolidayDatatable
        columns={columns}
        payload={holidayListResponse.payload}
        handleRefetch={handleRefetch}
        isRefetching={isFetching}
      />
    </>
  );
};

export default HolidayList;