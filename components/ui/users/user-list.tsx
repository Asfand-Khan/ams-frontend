"use client";

import React, { useMemo } from 'react'
import SubNav from '../foundations/sub-nav'
import { useQuery } from '@tanstack/react-query'
import { fetchUserList } from '@/helperFunctions/userFunction'
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import { UsersListPayloadType, UsersListResponseType } from '@/types/usersTypes';
import { ColumnDef } from '@tanstack/react-table';
import DatatableColumnHeader from '../datatable/datatable-column-header';
import { ColumnMeta } from '@/types/dataTableTypes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../shadcn/dropdown-menu';
import { Button } from '../shadcn/button';
import { Badge } from '../shadcn/badge';
import Error from '../foundations/error';
import { getRights } from '@/utils/getRights';
import { usePathname, useRouter } from 'next/navigation';
import Empty from '../foundations/empty';
import Link from 'next/link';
import useUserIdStore from '@/hooks/useAddUserIdStore';
import UserDatatable from './user-datatable';
import LoadingState from '../foundations/loading-state';

const UserList = () => {

  const router = useRouter();
  const pathname = usePathname();
  // Constants
  const ADD_ROUTE = '/users/add-user'

  // zustand
  const { setUserId } = useUserIdStore()

  // Fetch user list data using react-query
  const { data: userListResponse, isLoading: userListLoading, isError: userListIsError, error } = useQuery<UsersListResponseType | null>({
    queryKey: ['users-list'],
    queryFn: fetchUserList
  })

  // Column filter options
  const fullnameFilterOptions = useMemo(() => {
    const allFullname = userListResponse?.payload?.map((item) => item.fullname) || [];
    const uniqueFullname = Array.from(new Set(allFullname));
    return uniqueFullname.map((fullname) => ({
      label: fullname,
      value: fullname,
    }));
  }, [userListResponse]);

  const usernameFilterOptions = useMemo(() => {
    const allUsername = userListResponse?.payload?.map((item) => item.username) || [];
    const uniqueUsername = Array.from(new Set(allUsername));
    return uniqueUsername.map((username) => ({
      label: username,
      value: username,
    }));
  }, [userListResponse]);

  const emailFilterOptions = useMemo(() => {
    const allEmail = userListResponse?.payload?.map((item) => item.email) || [];
    const uniqueEmail = Array.from(new Set(allEmail));
    return uniqueEmail.map((email) => ({
      label: email,
      value: email,
    }));
  }, [userListResponse]);

  const phoneFilterOptions = useMemo(() => {
    const allPhone = userListResponse?.payload?.map((item) => item.phone) || [];
    const uniquePhone = Array.from(new Set(allPhone));
    return uniquePhone.map((phone) => ({
      label: phone,
      value: phone,
    }));
  }, [userListResponse]);

  // Define columns for the data table
  const columns: ColumnDef<UsersListPayloadType>[] = [
    {
      accessorKey: 'fullname',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Fullname" />,
      cell: ({ row }) => (
        <div>{row.getValue("fullname")}</div>
      ),
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: fullnameFilterOptions,
        filterPlaceholder: "Filter fullname...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'username',
      header: ({ column }) => <DatatableColumnHeader column={column} title='Username' />,
      cell: ({ row }) => (
        <div>{row.getValue("username")}</div>
      ),
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: usernameFilterOptions,
        filterPlaceholder: "Filter username...",
      }
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
      accessorKey: 'user_type',
      header: ({ column }) => <DatatableColumnHeader column={column} title='User Type' />,
      cell: ({ row }) => (
        <div>{row.getValue("user_type")}</div>
      ),
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: [
          { label: "Dashboard User", value: "dashboard_user" },
          { label: "API User", value: "api_user" },
        ],
        filterPlaceholder: "Filter user type...",
      }
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
              {rights?.can_edit === "1" &&
                <DropdownMenuItem onClick={() => setUserId(record.id)} asChild>
                  <Link href={`/users/edit-user`}>
                    <Edit className='mr-2 h-4 w-4' />
                    Edit
                  </Link>
                </DropdownMenuItem>
              }
              {
                rights?.can_edit === "1" &&
                <DropdownMenuItem>
                  <Trash className='mr-2 h-4 w-4' />
                  Delete
                </DropdownMenuItem>
              }
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
    return <Empty title="Permission Denied" description="You do not have permission to view user listing." />;
  }

  // loading state while fetching user list data
  if (userListLoading) {
    return <LoadingState />
  }

  if (userListIsError) {
    return <Error err={error?.message} />
  }

  // Empty state
  if (!userListResponse?.payload || userListResponse.payload.length === 0) {
    return <Empty title='Not Found' description='Not Found' />;
  }

  return (
    <>
      <SubNav
        title="User Management"
        addBtnTitle="Add User"
        urlPath={ADD_ROUTE}
      />

      <UserDatatable
        columns={columns}
        payload={userListResponse?.payload || []}
      />
    </>
  )
}

export default UserList