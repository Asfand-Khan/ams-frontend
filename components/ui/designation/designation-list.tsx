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
import {
  DesignationPayload,
  DesignationResponse,
} from "@/types/designationTypes";
import { fetchDesignationList } from "@/helperFunctions/designationFunction";
import DesignationDatatable from "./designation-datatable";

const DesignationList = () => {
  const ADD_URL = "/organization/designations/add-designation";
  const router = useRouter();
  const pathname = usePathname();

  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  const {
    data: designationListResponse,
    isLoading: designationListLoading,
    isError: designationListIsError,
    error,
  } = useQuery<DesignationResponse | null>({
    queryKey: ["designation-list"],
    queryFn: fetchDesignationList,
  });

  const designationNameFilterOptions = useMemo(() => {
    const allFullName =
      designationListResponse?.payload?.map((item) => item.title) || [];
    const uniqueData = Array.from(new Set(allFullName));
    return uniqueData.map((item) => ({
      label: item,
      value: item,
    }));
  }, [designationListResponse]);

  const columns: ColumnDef<DesignationPayload>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        const departmentName = row.original.title;
        return <div>{departmentName}</div>;
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: designationNameFilterOptions,
        filterPlaceholder: "Filter name...",
      } as ColumnMeta,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => <div>{row.getValue("description") ?? "---"}</div>,
    },
    {
      accessorKey: "level",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Level" />
      ),
      cell: ({ row }) => <div>{row.getValue("level") ?? "---"}</div>,
    },
    {
      accessorKey: "department.name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Department" />
      ),
      cell: ({ row }) => {
        const department = row.original.department?.name ?? "---";
        return <div>{department}</div>;
      },
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
        description="You do not have permission to view designation listing."
      />
    );
  }

  // Loading state
  if (designationListLoading) {
    return <LoadingState />;
  }

  // Error state
  if (designationListIsError) {
    return <Error err={error?.message} />;
  }

  // Empty state
  if (
    !designationListResponse?.payload ||
    designationListResponse.payload.length === 0
  ) {
    return <Empty title="Not Found" description="No Designation Found" />;
  }

  return (
    <>
      <SubNav
        title="Designation List"
        addBtnTitle="Add Designation"
        urlPath={ADD_URL}
      />
      <DesignationDatatable
        columns={columns}
        payload={designationListResponse.payload}
      />
    </>
  );
};

export default DesignationList;
