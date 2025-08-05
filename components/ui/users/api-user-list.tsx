"use client";

import { getRights } from '@/utils/getRights';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo } from 'react'
import SubNav from '../foundations/sub-nav';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchApiUserList } from '@/helperFunctions/userFunction';
import Error from '../foundations/error';
import { ApiUsersPayloadType, ApiUsersResponseType } from '@/types/usersTypes';
import { ColumnDef } from '@tanstack/react-table';
import DatatableColumnHeader from '../datatable/datatable-column-header';
import { ColumnMeta } from '@/types/dataTableTypes';
import { Badge } from '../shadcn/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../shadcn/dropdown-menu';
import { Button } from '../shadcn/button';
import { MoreHorizontal, RefreshCcw } from 'lucide-react';
import Empty from '../foundations/empty';
import { AxiosError } from 'axios';
import { axiosFunction } from '@/utils/axiosFunction';
import { toast } from 'sonner';
import ApiUserDatatable from './api-user-datatable';
import LoadingState from '../foundations/loading-state';

const ApiUserList = () => {

  const router = useRouter();
  const queryClient = useQueryClient()
  const pathname = usePathname();

  // Fetch api user list data using react-query

  const { data: apiUserResponse, isLoading: apiUserLoading, isError: apiUserIsError, error } = useQuery<ApiUsersResponseType | null>({
    queryKey: ['api-user-list'],
    queryFn: fetchApiUserList
  })

  // update api user mutation

  const apiUserMutation = useMutation<
    ApiUsersResponseType,
    AxiosError<ApiUsersResponseType>,
    { id: number }
  >({
    mutationFn: (data) => {
      return axiosFunction({
        method: "GET",
        urlPath: `/api-users/${data.id}`
      })
    },
    onMutate: () => {
      toast.info('Please wait...')
    },
    onError: (err) => {
      const message = err.response?.data?.message
      toast.error(message)
      console.log("Update Api User Mutation Error:", err)
    },
    onSuccess: (data) => {
      const message = data.message
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['api-user-list'] })
    }
  })

  // update api user

  const updateApiUser = (id: number) => {
    apiUserMutation.mutate({ id })
  }

  // Column filter options

  const nameFilterOptions = useMemo(() => {
    const allName = apiUserResponse?.payload?.map((item) => item.name) || [];
    const uniqueName = Array.from(new Set(allName));
    return uniqueName.map((name) => ({
      label: name,
      value: name,
    }));
  }, [apiUserResponse]);

  const emailFilterOptions = useMemo(() => {
    const allEmail = apiUserResponse?.payload?.map((item) => item.email) || [];
    const uniqueEmail = Array.from(new Set(allEmail));
    return uniqueEmail.map((email) => ({
      label: email,
      value: email,
    }));
  }, [apiUserResponse]);

  const phoneFilterOptions = useMemo(() => {
    const allPhone = apiUserResponse?.payload?.map((item) => item.phone) || [];
    const uniquePhone = Array.from(new Set(allPhone));
    return uniquePhone.map((phone) => ({
      label: phone,
      value: phone,
    }));
  }, [apiUserResponse]);

  // Define columns for the data table

  const columns: ColumnDef<ApiUsersPayloadType>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <div>{row.getValue("name")}</div>
      ),
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: nameFilterOptions,
        filterPlaceholder: "Filter name...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <DatatableColumnHeader column={column} title='Email' />,
      cell: ({ row }) => (
        <div>{row.getValue("email")}</div>
      ),
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: emailFilterOptions,
        filterPlaceholder: "Filter email...",
      }
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => <DatatableColumnHeader column={column} title='Phone' />,
      cell: ({ row }) => (
        <div>{row.getValue("phone")}</div>
      ),
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: phoneFilterOptions,
        filterPlaceholder: "Filter phone...",
      }
    },
    {
      accessorKey: 'api_key',
      header: ({ column }) => <DatatableColumnHeader column={column} title='Api Key' />,
      cell: ({ row }) => (
        <div>{row.getValue("api_key")}</div>
      ),
    },
    {
      accessorKey: 'api_password',
      header: ({ column }) => <DatatableColumnHeader column={column} title='Api Password' />,
      cell: ({ row }) => (
        <div>{row.getValue("api_password")}</div>
      ),
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
      id: 'id',
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
              <DropdownMenuItem onClick={() => updateApiUser(record.id)}>
                <RefreshCcw className='mr-2 h-4 w-4' />
                Update
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  // Rights
  const rights = useMemo(() => {
    return getRights(pathname)
  }, [pathname])

  if (rights?.can_view !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return <Empty title="Permission Denied" description="You do not have permission to view api user listing." />;
  }


  // loading, error or empty state while fetching user list data

  if (apiUserLoading) {
    return <LoadingState />
  }

  if (apiUserIsError) {
    return <Error err={error?.message} />
  }

  if (!apiUserResponse?.payload || apiUserResponse.payload.length === 0) {
    return <Empty title="Not found" description='Not found' />
  }

  return (
    <>
      <SubNav
        title='Api User List'
      />
      <ApiUserDatatable
        columns={columns}
        payload={apiUserResponse?.payload || []}
      />
    </>
  )
}

export default ApiUserList