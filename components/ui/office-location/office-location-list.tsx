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
import OfficeLocationDatatable from "./office-location-datatable";
import {
  OfficeLocationPayload,
  OfficeLocationsResponse,
} from "@/types/officeLocationTypes";
import { fetchOfficeLocationList } from "@/helperFunctions/officeLocationFunction";

const OfficeLocationList = () => {
  const ADD_URL = "/organization/office-locations/add-office-location";
  const router = useRouter();
  const pathname = usePathname();

  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  const {
    data: officeLocationListResponse,
    isLoading: officeLocationListLoading,
    isError: officeLocationListIsError,
    error,
  } = useQuery<OfficeLocationsResponse | null>({
    queryKey: ["office-location-list"],
    queryFn: fetchOfficeLocationList,
  });

  const officeLocationNameFilterOptions = useMemo(() => {
    const allFullName =
      officeLocationListResponse?.payload?.map((item) => item.name) || [];
    const uniqueData = Array.from(new Set(allFullName));
    return uniqueData.map((item) => ({
      label: item,
      value: item,
    }));
  }, [officeLocationListResponse]);

  const columns: ColumnDef<OfficeLocationPayload>[] = [
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
        filterOptions: officeLocationNameFilterOptions,
        filterPlaceholder: "Filter name...",
      } as ColumnMeta,
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Address" />
      ),
      cell: ({ row }) => <div>{row.getValue("address") ?? "---"}</div>,
    },
    {
      accessorKey: "latitude",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Latitude" />
      ),
      cell: ({ row }) => <div>{row.getValue("latitude") ?? "---"}</div>,
    },
    {
      accessorKey: "longitude",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Longitude" />
      ),
      cell: ({ row }) => <div>{row.getValue("longitude") ?? "---"}</div>,
    },
    {
      accessorKey: "radius_meters",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Radius" />
      ),
      cell: ({ row }) => <div>{row.getValue("radius_meters") ?? "---"}</div>,
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
        description="You do not have permission to view office location listing."
      />
    );
  }

  // Loading state
  if (officeLocationListLoading) {
    return <LoadingState />;
  }

  // Error state
  if (officeLocationListIsError) {
    return <Error err={error?.message} />;
  }

  // Empty state
  if (
    !officeLocationListResponse?.payload ||
    officeLocationListResponse.payload.length === 0
  ) {
    return <Empty title="Not Found" description="No Office Location Found" />;
  }

  return (
    <>
      <SubNav
        title="Office Location List"
        addBtnTitle="Add Office Location"
        urlPath={ADD_URL}
      />
      <OfficeLocationDatatable
        columns={columns}
        payload={officeLocationListResponse.payload}
      />
    </>
  );
};

export default OfficeLocationList;
