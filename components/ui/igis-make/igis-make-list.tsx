"use client";

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
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Button } from '../shadcn/button';
import Link from 'next/link';
import SubNav from '../foundations/sub-nav';
import { IgisMakeResponseType, IgisMakePayloadType } from '@/types/igisTypes';

import { getRights } from '@/utils/getRights';
import IgisMakeDatatable from './igis-make-datatable';
import { fetchIgisMakeList } from '@/helperFunctions/igisFunction';
import useIgisMakeIdStore from '@/hooks/useIgisMakeIdStore';
import LoadingState from '../foundations/loading-state';

const IgisMakeList = () => {
  // Constants
  const EDIT_ROUTE = '/igis/edit-igis-makes'
  const ADD_ROUTE = '/igis/add-igis-makes'

  const router = useRouter();
  const pathname = usePathname();
  const { setIgisMakeId } = useIgisMakeIdStore();

  // Fetch IGIS make list data using react-query
  const { data: igisMakeListResponse, isLoading: igisMakeListLoading, isError: igisMakeListIsError, error: igisMakeListError } = useQuery<IgisMakeResponseType | null>({
    queryKey: ['igis-make-list'],
    queryFn: fetchIgisMakeList,
  });

  // Column filter options
  const makeNameFilterOptions = useMemo(() => {
    const allNames = igisMakeListResponse?.payload?.map((item) => item.make_name) || [];
    const uniqueNames = Array.from(new Set(allNames));
    return uniqueNames.map((name) => ({
      label: name,
      value: name,
    }));
  }, [igisMakeListResponse]);

  const igisMakeCodeFilterOptions = useMemo(() => {
    const allIgisMakeCodes = igisMakeListResponse?.payload?.map((item) => item.igis_make_code) || [];
    const uniqueIgisMakeCodes = Array.from(new Set(allIgisMakeCodes));
    return uniqueIgisMakeCodes.map((igis_make_code) => ({
      label: igis_make_code,
      value: igis_make_code,
    }));
  }, [igisMakeListResponse]);

  // Define columns for the data table
  const columns: ColumnDef<IgisMakePayloadType>[] = [
    {
      accessorKey: 'make_name',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Make Name" />,
      cell: ({ row }) => <div>{row.getValue("make_name")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: makeNameFilterOptions,
        filterPlaceholder: "Filter make name...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'igis_make_code',
      header: ({ column }) => <DatatableColumnHeader column={column} title="IGIS Make Code" />,
      cell: ({ row }) => <div>{row.getValue("igis_make_code")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: igisMakeCodeFilterOptions,
        filterPlaceholder: "Filter IGIS make code...",
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
      accessorKey: 'created_at',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) => <div>{new Date(row.getValue("created_at")).toLocaleDateString()}</div>,
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
                  <Link href={EDIT_ROUTE} onClick={() => setIgisMakeId(record.id)}>
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


  // Rights
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  if (rights?.can_view !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return <Empty title="Permission Denied" description="You do not have permission to view IGIS make listing." />;
  }

  // Loading state
  if (igisMakeListLoading) {
    return <LoadingState />;
  }

  // Error state
  if (igisMakeListIsError) {
    return <Error err={igisMakeListError?.message} />;
  }

  // Empty state
  if (!igisMakeListResponse?.payload || igisMakeListResponse.payload.length === 0) {
    return <Empty title="Not Found" description="No IGIS makes found" />;
  }

  return (
    <>
      <SubNav title="IGIS Make List" addBtnTitle="Add IGIS Make" urlPath={ADD_ROUTE} />
      <IgisMakeDatatable columns={columns} payload={igisMakeListResponse?.payload || []} />
    </>
  );
};

export default IgisMakeList;