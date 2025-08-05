"use client";

import { fetchCallUsList } from '@/helperFunctions/callUsFunction';
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
import { CallUsResponseType, CallUsPayloadType } from '@/types/callUsTypes';
import { getRights } from '@/utils/getRights';
import CallUsDatatable from './call-us-datatable';
import useCallUsIdStore from '@/hooks/useCallUsIdStore';
import LoadingState from '../foundations/loading-state';

const CallUsList = () => {
  // Constants
  const ADD_URL = '/customer-service/add-call-us'
  const EDIT_URL = '/customer-service/edit-call-us'

  const router = useRouter();
  const pathname = usePathname();
  const { setCallUsId } = useCallUsIdStore();

  // Rights
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  // Fetch call us list data using react-query
  const { data: callUsListResponse, isLoading: callUsListLoading, isError: callUsListIsError, error: callUsListError } = useQuery<CallUsResponseType | null>({
    queryKey: ['call-us-list'],
    queryFn: fetchCallUsList,
  });

  // Column filter options with sanitization
  const nameFilterOptions = useMemo(() => {
    const allNames = callUsListResponse?.payload?.map((item) => item.name) || [];
    const uniqueNames = Array.from(new Set(allNames.filter((name) => name != null)));
    return uniqueNames.map((name) => ({
      label: name || "N/A",
      value: name || "N/A",
    }));
  }, [callUsListResponse]);

  const contactFilterOptions = useMemo(() => {
    const allContacts = callUsListResponse?.payload?.map((item) => item.contact) || [];
    const uniqueContacts = Array.from(new Set(allContacts.filter((contact) => contact != null)));
    return uniqueContacts.map((contact) => ({
      label: contact || "N/A",
      value: contact || "N/A",
    }));
  }, [callUsListResponse]);

  const emailFilterOptions = useMemo(() => {
    const allEmails = callUsListResponse?.payload?.map((item) => item.email) || [];
    const uniqueEmails = Array.from(new Set(allEmails.filter((email) => email != null)));
    return uniqueEmails.map((email) => ({
      label: email || "N/A",
      value: email || "N/A",
    }));
  }, [callUsListResponse]);

  // Define columns for the data table
  const columns: ColumnDef<CallUsPayloadType>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => <div>{row.getValue("name") || "N/A"}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: nameFilterOptions,
        filterPlaceholder: "Filter name...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'contact',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Contact" />,
      cell: ({ row }) => <div>{row.getValue("contact") || "N/A"}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: contactFilterOptions,
        filterPlaceholder: "Filter contact...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Email" />,
      cell: ({ row }) => <div>{row.getValue("email") || "N/A"}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: emailFilterOptions,
        filterPlaceholder: "Filter email...",
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
                  <Link href={EDIT_URL} onClick={() => setCallUsId(record.id)}>
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
    return <Empty title="Permission Denied" description="You do not have permission to view call us listing." />;
  }

  // Loading state
  if (callUsListLoading) {
    return <LoadingState />;
  }

  // Error state
  if (callUsListIsError) {
    return <Error err={callUsListError?.message} />;
  }

  // Empty state
  if (!callUsListResponse?.payload || callUsListResponse.payload.length === 0) {
    return <Empty title="Not Found" description="No call us records found" />;
  }

  return (
    <>
      <SubNav title="Call Us List" addBtnTitle="Add Call Us" urlPath={ADD_URL} />
      <CallUsDatatable columns={columns} payload={callUsListResponse?.payload || []} />
    </>
  );
};

export default CallUsList;