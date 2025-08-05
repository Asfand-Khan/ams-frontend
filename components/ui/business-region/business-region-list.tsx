"use client";

import { fetchBusinessRegionList } from '@/helperFunctions/businessRegionFunction';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import Error from '../foundations/error';
import Empty from '../foundations/empty';
import DatatableColumnHeader from '../datatable/datatable-column-header';
import { ColumnDef } from '@tanstack/react-table';
import { ColumnMeta } from '@/types/dataTableTypes';
import { Badge } from '../shadcn/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../shadcn/dropdown-menu';
import { MoreHorizontal, Edit, Trash } from 'lucide-react';
import { Button } from '../shadcn/button';
import Link from 'next/link';
import SubNav from '../foundations/sub-nav';
import { getRights } from '@/utils/getRights';
import { BusinessRegionPayloadType, BusinessRegionResponseType } from '@/types/businessRegionTypes';
import BusinessRegionDatatable from './business-region-datatable';
import LoadingState from '../foundations/loading-state';
import useBusinessRegionIdStore from '@/hooks/useBusinessRegionIdStore';

const BusinessRegionList = () => {
  // Constants
  const ADD_URL = '/branches-clients/add-business-regions'
  const EDIT_URL = '/branches-clients/edit-business-regions'

  const router = useRouter();
  const pathname = usePathname();
  const { setBusinessRegionId } = useBusinessRegionIdStore();

  // Rights
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);


  // Fetch business region list data using react-query
  const { data: businessRegionListResponse, isLoading: businessRegionListLoading, isError: businessRegionListIsError, error: businessRegionListError } = useQuery<BusinessRegionResponseType | null>({
    queryKey: ['business-region-list'],
    queryFn: fetchBusinessRegionList,
  });

  // Column filter options with sanitization
  const businessRegionNameFilterOptions = useMemo(() => {
    const allNames = businessRegionListResponse?.payload?.map((item) => item.business_region_name) || [];
    const uniqueNames = Array.from(new Set(allNames.filter((name) => name != null)));
    return uniqueNames.map((name) => ({
      label: name,
      value: name,
    }));
  }, [businessRegionListResponse]);

  const igisBusinessRegionCodeFilterOptions = useMemo(() => {
    const allCodes = businessRegionListResponse?.payload?.map((item) => item.igis_business_region_code) || [];
    const uniqueCodes = Array.from(new Set(allCodes.filter((code) => code != null)));
    return uniqueCodes.map((code) => ({
      label: code,
      value: code,
    }));
  }, [businessRegionListResponse]);

  // Define columns for the data table
  const columns: ColumnDef<BusinessRegionPayloadType>[] = [
    {
      accessorKey: 'business_region_name',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Business Region Name" />,
      cell: ({ row }) => <div>{row.getValue("business_region_name") || "N/A"}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: businessRegionNameFilterOptions,
        filterPlaceholder: "Filter business region name...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'igis_business_region_code',
      header: ({ column }) => <DatatableColumnHeader column={column} title="IGIS Business Region Code" />,
      cell: ({ row }) => <div>{row.getValue("igis_business_region_code") || "N/A"}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: igisBusinessRegionCodeFilterOptions,
        filterPlaceholder: "Filter IGIS business region code...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'is_active',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Status" />,
      accessorFn: (row) => (row.is_active ? "active" : "inactive"),
      cell: ({ row }) => {
        const status = row.getValue("is_active") as string;
        return (
          <Badge className="justify-center py-1 min-w-[50px] w-[70px]" variant={status === "active" ? "success" : "danger"}>
            {status}
          </Badge>
        );
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" }
        ],
        filterPlaceholder: "Filter status...",
      } as ColumnMeta,
    },
    {
      id: 'actions',
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
                <DropdownMenuItem asChild>
                  <Link href={EDIT_URL} onClick={() => setBusinessRegionId(record.id)}>
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
    return <Empty title="Permission Denied" description="You do not have permission to view business region listing." />;
  }

  // Loading state
  if (businessRegionListLoading) {
    return <LoadingState />;
  }

  // Error state
  if (businessRegionListIsError) {
    return <Error err={businessRegionListError?.message} />;
  }

  // Empty state
  if (!businessRegionListResponse?.payload || businessRegionListResponse.payload.length === 0) {
    return <Empty title="Not Found" description="No business regions found" />;
  }

  return (
    <>
      <SubNav title="Business Region List" addBtnTitle="Add Business Region" urlPath={ADD_URL} />
      <BusinessRegionDatatable columns={columns} payload={businessRegionListResponse.payload} />
    </>
  );
};

export default BusinessRegionList;