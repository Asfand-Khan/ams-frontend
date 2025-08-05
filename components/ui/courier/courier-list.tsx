"use client";

import { fetchCourierList } from '@/helperFunctions/courierFunction';
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
import { CourierResponseType, CourierPayloadType } from '@/types/courierTypes';
import CourierDatatable from './courier-datatable';
import { getRights } from '@/utils/getRights';
import LoadingState from '../foundations/loading-state';
import useCourierIdStore from '@/hooks/useCourierIdStore';


const CourierList = () => {
  // Constants
  const ADD_URL = '/cites-couiers/add-couriers'
  const EDIT_URL = '/cites-couiers/edit-couriers'

  const router = useRouter();
  const pathname = usePathname();
  const { setCourierId } = useCourierIdStore();

  // Fetch courier list data using react-query
  const { data: courierListResponse, isLoading: courierListLoading, isError: courierListIsError, error: courierListError } = useQuery<CourierResponseType | null>({
    queryKey: ['courier-list'],
    queryFn: fetchCourierList,
  });

  // Column filter options
  const nameFilterOptions = useMemo(() => {
    const allNames = courierListResponse?.payload?.map((item) => item.name) || [];
    const uniqueNames = Array.from(new Set(allNames));
    return uniqueNames.map((name) => ({
      label: name || "N/A",
      value: name || "N/A",
    }));
  }, [courierListResponse]);

  const accountNumberFilterOptions = useMemo(() => {
    const allAccountNumbers = courierListResponse?.payload?.map((item) => item.account_number) || [];
    const uniqueAccountNumbers = Array.from(new Set(allAccountNumbers));
    return uniqueAccountNumbers.map((account_number) => ({
      label: account_number || "N/A",
      value: account_number || "N/A",
    }));
  }, [courierListResponse]);

  const bookUrlFilterOptions = useMemo(() => {
    const allBookUrls = courierListResponse?.payload?.map((item) => item.book_url) || [];
    const uniqueBookUrls = Array.from(new Set(allBookUrls));
    return uniqueBookUrls.map((book_url) => ({
      label: book_url || "N/A",
      value: book_url || "N/A",
    }));
  }, [courierListResponse]);


  // Define columns for the data table
  const columns: ColumnDef<CourierPayloadType>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: nameFilterOptions,
        filterPlaceholder: "Filter name...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'account_number',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Account Number" />,
      cell: ({ row }) => <div>{row.getValue("account_number")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: accountNumberFilterOptions,
        filterPlaceholder: "Filter account number...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'book_url',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Book URL" />,
      cell: ({ row }) => <div>{row.getValue("book_url")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: bookUrlFilterOptions,
        filterPlaceholder: "Filter book URL...",
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
        const record = row.original
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
                  <Link href={EDIT_URL} onClick={() => setCourierId(record.id)}>
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
    return <Empty title="Permission Denied" description="You do not have permission to view courier listing." />;
  }

  // Loading state
  if (courierListLoading) {
    return <LoadingState />;
  }

  // Error state
  if (courierListIsError) {
    return <Error err={courierListError?.message} />;
  }

  // Empty state
  if (!courierListResponse?.payload || courierListResponse.payload.length === 0) {
    return <Empty title="Not Found" description="No couriers found" />;
  }

  return (
    <>
      <SubNav title="Courier List" addBtnTitle="Add Courier" urlPath={ADD_URL} />
      <CourierDatatable columns={columns} payload={courierListResponse?.payload || []} />
    </>
  );
};

export default CourierList;