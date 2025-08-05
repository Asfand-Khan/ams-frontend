"use client";

import { useMemo } from 'react';
import { fetchClientList } from '@/helperFunctions/clientFunction';
import useClientIdStore from '@/hooks/useClientIdStore';
import { ClientPayloadType, ClientResponseType } from '@/types/clientTypes';
import { getRights } from '@/utils/getRights';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
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
import ClientDatatable from './client-datatable';
import LoadingState from '../foundations/loading-state';

const ClientList = () => {
  // Constants
  const ADD_URL = '/branches-clients/add-clients'
  const EDIT_URL = '/branches-clients/edit-clients'

  const router = useRouter();
  const pathname = usePathname();

  // Zustand
  const { setClientId } = useClientIdStore();


  // Fetch client list data using react-query
  const { data: clientListResponse, isLoading: clientListLoading, isError: clientListIsError, error } = useQuery<ClientResponseType | null>({
    queryKey: ['clients-list'],
    queryFn: fetchClientList,
  });

  // Column filter options
  const nameFilterOptions = useMemo(() => {
    const allNames = clientListResponse?.payload?.map((item) => item.name) || [];
    const uniqueNames = Array.from(new Set(allNames.filter((name) => name !== null)));
    return uniqueNames.map((name) => ({
      label: name,
      value: name,
    }));
  }, [clientListResponse]);

  const igisClientCodeFilterOptions = useMemo(() => {
    const allIgisClientCodes = clientListResponse?.payload?.map((item) => item.igis_client_code) || [];
    const uniqueIgisClientCodes = Array.from(new Set(allIgisClientCodes));
    return uniqueIgisClientCodes.map((igis_client_code) => ({
      label: igis_client_code,
      value: igis_client_code,
    }));
  }, [clientListResponse]);

  const addressFilterOptions = useMemo(() => {
    const allAddresses = clientListResponse?.payload?.map((item) => item.address) || [];
    const uniqueAddresses = Array.from(new Set(allAddresses));
    return uniqueAddresses.map((address) => ({
      label: address,
      value: address,
    }));
  }, [clientListResponse]);

  const telephoneFilterOptions = useMemo(() => {
    const allTelephones = clientListResponse?.payload?.map((item) => item.telephone) || [];
    const uniqueTelephones = Array.from(new Set(allTelephones));
    return uniqueTelephones.map((telephone) => ({
      label: telephone,
      value: telephone,
    }));
  }, [clientListResponse]);

  const contactPersonFilterOptions = useMemo(() => {
    const allContactPersons = clientListResponse?.payload?.map((item) => item.contact_person) || [];
    const uniqueContactPersons = Array.from(new Set(allContactPersons));
    return uniqueContactPersons.map((contact_person) => ({
      label: contact_person,
      value: contact_person,
    }));
  }, [clientListResponse]);

  // Define columns for the data table
  const columns: ColumnDef<ClientPayloadType>[] = [
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
      accessorKey: 'igis_client_code',
      header: ({ column }) => <DatatableColumnHeader column={column} title="IGIS Client Code" />,
      cell: ({ row }) => <div>{row.getValue("igis_client_code")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: igisClientCodeFilterOptions,
        filterPlaceholder: "Filter IGIS client code...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'address',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Address" />,
      cell: ({ row }) => <div>{row.getValue("address")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: addressFilterOptions,
        filterPlaceholder: "Filter address...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'telephone',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Telephone" />,
      cell: ({ row }) => <div>{row.getValue("telephone")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: telephoneFilterOptions,
        filterPlaceholder: "Filter telephone...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'contact_person',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Contact Person" />,
      cell: ({ row }) => <div>{row.getValue("contact_person")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: contactPersonFilterOptions,
        filterPlaceholder: "Filter contact person...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'is_active',
      header: ({ column }) => <DatatableColumnHeader column={column} title='Status' />,
      accessorFn: (row) => (row.is_active ? "active" : "inactive"),
      cell: ({ row }) => {
        const status = row.getValue("is_active") as string;
        return (
          <Badge
            className={`justify-center py-1 min-w-[50px] w-[70px]`} variant={status === "active" ? "success" : "danger"}>
            {status}
          </Badge>
        )
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
                <DropdownMenuItem onClick={() => setClientId(record.id)} asChild>
                  <Link href={EDIT_URL}>
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
    return getRights(pathname)
  }, [pathname])

  if (rights?.can_view !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return <Empty title="Permission Denied" description="You do not have permission to view client listing." />;
  }

  // Loading state
  if (clientListLoading) {
    return <LoadingState />;
  }

  // Error state
  if (clientListIsError) {
    return <Error err={error?.message} />;
  }

  // Empty state
  if (!clientListResponse?.payload || clientListResponse.payload.length === 0) {
    return <Empty title="Not Found" description="No clients found" />;
  }

  return (
    <>
      <SubNav title="Client List" addBtnTitle="Add Client" urlPath={ADD_URL} />
      <ClientDatatable columns={columns} payload={clientListResponse?.payload || []} />
    </>
  );
};

export default ClientList;