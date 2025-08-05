"use client";

import { fetchIgisMakeList, fetchIgisSubMakeList } from '@/helperFunctions/igisFunction';
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
import { IgisSubMakeResponseType, IgisSubMakePayloadType, IgisMakeResponseType } from '@/types/igisTypes';
import { getRights } from '@/utils/getRights';
import IgisSubMakeDatatable from './igis-sub-make-datatable';
import LoadingState from '../foundations/loading-state';
import useIgisSubMakeIdStore from '@/hooks/useIgisSubMakeIdStore';

const IgisSubMakeList = () => {
  // Constants
  const ADD_URL = '/igis/add-igis-sub-makes'
  const EDIT_URL = '/igis/edit-igis-sub-makes'

  const router = useRouter();
  const pathname = usePathname();
  const { setIgisMakeId } = useIgisSubMakeIdStore();

  // Fetch IGIS make list data for make_id to make_name mapping
  const { data: igisMakeListResponse, isLoading: igisMakeListLoading, isError: igisMakeListIsError, error: igisMakeListError } = useQuery<IgisMakeResponseType | null>({
    queryKey: ['get-igis-make-list'],
    queryFn: fetchIgisMakeList,
  });

  // Create a make ID to make name mapping
  const makeNameMap = useMemo(() => {
    const map = new Map<number, string>();
    igisMakeListResponse?.payload.forEach((item) => {
      map.set(item.id, item.make_name);
    });
    return map;
  }, [igisMakeListResponse]);

  // Fetch IGIS sub-make list data using react-query
  const { data: igisSubMakeListResponse, isLoading: igisSubMakeListLoading, isError: igisSubMakeListIsError, error: igisSubMakeListError } = useQuery<IgisSubMakeResponseType | null>({
    queryKey: ['igis-sub-make-list'],
    queryFn: fetchIgisSubMakeList,
  });

  // Column filter options
  const subMakeNameFilterOptions = useMemo(() => {
    const allNames = igisSubMakeListResponse?.payload?.map((item) => item.sub_make_name) || [];
    const uniqueNames = Array.from(new Set(allNames));
    return uniqueNames.map((name) => ({
      label: name,
      value: name,
    }));
  }, [igisSubMakeListResponse]);

  const igisSubMakeCodeFilterOptions = useMemo(() => {
    const allIgisSubMakeCodes = igisSubMakeListResponse?.payload?.map((item) => item.igis_sub_make_code) || [];
    const uniqueIgisSubMakeCodes = Array.from(new Set(allIgisSubMakeCodes));
    return uniqueIgisSubMakeCodes.map((igis_sub_make_code) => ({
      label: igis_sub_make_code,
      value: igis_sub_make_code,
    }));
  }, [igisSubMakeListResponse]);

  const coiTypeCodeFilterOptions = useMemo(() => {
    const allCoiTypeCodes = igisSubMakeListResponse?.payload?.map((item) => item.coi_type_code) || [];
    const uniqueCoiTypeCodes = Array.from(new Set(allCoiTypeCodes));
    return uniqueCoiTypeCodes.map((coi_type_code) => ({
      label: coi_type_code,
      value: coi_type_code,
    }));
  }, [igisSubMakeListResponse]);

  const makeIdFilterOptions = useMemo(() => {
    const allMakeIds = igisSubMakeListResponse?.payload?.map((item) => item.make_id.toString()) || [];
    const uniqueMakeIds = Array.from(new Set(allMakeIds));
    return uniqueMakeIds.map((make_id) => ({
      label: makeNameMap.get(+make_id) || make_id,
      value: makeNameMap.get(+make_id) || make_id,
    }));
  }, [igisSubMakeListResponse, makeNameMap]);

  // Define columns for the data table
  const columns: ColumnDef<IgisSubMakePayloadType>[] = [
    {
      accessorKey: 'sub_make_name',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Sub Make Name" />,
      cell: ({ row }) => <div>{row.getValue("sub_make_name")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: subMakeNameFilterOptions,
        filterPlaceholder: "Filter sub make name...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'igis_sub_make_code',
      header: ({ column }) => <DatatableColumnHeader column={column} title="IGIS Sub Make Code" />,
      cell: ({ row }) => <div>{row.getValue("igis_sub_make_code")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: igisSubMakeCodeFilterOptions,
        filterPlaceholder: "Filter IGIS sub make code...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'seating_capacity',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Seating Capacity" />,
      cell: ({ row }) => <div>{row.getValue("seating_capacity")}</div>,
    },
    {
      accessorKey: 'coi_type_code',
      header: ({ column }) => <DatatableColumnHeader column={column} title="COI Type Code" />,
      cell: ({ row }) => <div>{row.getValue("coi_type_code")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: coiTypeCodeFilterOptions,
        filterPlaceholder: "Filter COI type code...",
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
      accessorKey: 'make_id',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Make" />,
      accessorFn: (row) => makeNameMap.get(row.make_id) || row.make_id,
      cell: ({ row }) => <div>{row.getValue("make_id")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: makeIdFilterOptions,
        filterPlaceholder: "Filter make...",
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
                  <Link href={EDIT_URL} onClick={() => setIgisMakeId(record.id)}>
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

  // Rights
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  if (rights?.can_view !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return <Empty title="Permission Denied" description="You do not have permission to view IGIS sub make listing." />;
  }

  // Loading state
  if (igisSubMakeListLoading || igisMakeListLoading) {
    return <LoadingState />;
  }

  // Error state
  if (igisSubMakeListIsError || igisMakeListIsError) {
    return <Error err={igisSubMakeListError?.message || igisMakeListError?.message} />;
  }

  // Empty state
  if (!igisSubMakeListResponse?.payload || igisSubMakeListResponse.payload.length === 0) {
    return <Empty title="Not Found" description="No IGIS sub-makes found" />;
  }

  return (
    <>
      <SubNav title="IGIS Sub Make List" addBtnTitle="Add IGIS Sub-Make" urlPath={ADD_URL} />
      <IgisSubMakeDatatable columns={columns} payload={igisSubMakeListResponse?.payload || []} />
    </>
  );
};

export default IgisSubMakeList;