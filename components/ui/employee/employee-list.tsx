"use client";

import { getRights } from "@/utils/getRights";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import React, { useMemo } from "react";
import Empty from "../foundations/empty";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import SubNav from "../foundations/sub-nav";
import { UserPayload, UsersResponse } from "@/types/userTypes";
import { fetchUserList } from "@/helperFunctions/userFunction";
import { ColumnDef } from "@tanstack/react-table";
import DatatableColumnHeader from "../datatable/datatable-column-header";
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
import EmployeeDatatable from "./employee-datatable";
import { Badge } from "../foundations/badge";
import { ColumnMeta } from "@/types/dataTableTypes";
import { format } from "date-fns";
import { toast } from "sonner";

const EmployeeList = () => {
  const ADD_URL = "/hr/employees/add-employee";
  const router = useRouter();
  const pathname = usePathname();

  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  const {
    data: userListResponse,
    isLoading: userListLoading,
    isError: userListIsError,
    error,
    refetch,
    isFetching
  } = useQuery<UsersResponse | null>({
    queryKey: ["user-list"],
    queryFn: fetchUserList,
  });

  const fullnameFilterOptions = useMemo(() => {
      const allFullName =
        userListResponse?.payload?.map((item) => item.employee.full_name) || [];
      const uniqueData = Array.from(new Set(allFullName));
      return uniqueData.map((item) => ({
        label: item,
        value: item,
      }));
    }, [userListResponse]);

  const columns: ColumnDef<UserPayload>[] = [
    {
      accessorKey: "employee.full_name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Fullname" />
      ),
      cell: ({ row }) => {
        const fullname = row.original.employee.full_name;
        return <div>{fullname}</div>;
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: fullnameFilterOptions,
        filterPlaceholder: "Filter name...",
      } as ColumnMeta,
    },
    {
      accessorKey: "employee.employee_code",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Employee Code" />
      ),
      cell: ({ row }) => {
        const code = row.original.employee.employee_code;
        return <div>{code}</div>;
      },
    },
    {
      accessorKey: "employee.email",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => {
        const email = row.original.employee.email;
        return <div>{email}</div>;
      },
    },
    {
      accessorKey: "employee.cnic",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Cnic" />
      ),
      cell: ({ row }) => {
        const cnic = row.original.employee.cnic ?? "---";
        return <div>{cnic}</div>;
      },
    },
    {
      accessorKey: "employee.department.name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Department" />
      ),
      cell: ({ row }) => {
        const data = row.original.employee.department.name ?? "---";
        return <div>{data}</div>;
      },
    },
    {
      accessorKey: "employee.designation.title",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Designation" />
      ),
      cell: ({ row }) => {
        const data = row.original.employee.designation.title ?? "---";
        return <div>{data}</div>;
      },
    },
    {
      accessorKey: "employee.dob",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="DOB" />
      ),
      cell: ({ row }) => {
        const data = row.original.employee.dob ?? "---";
        return <div>{format(data, "yyyy-MM-dd")}</div>;
      },
    },
    {
      accessorKey: "employee.join_date",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Join Date" />
      ),
      cell: ({ row }) => {
        const data = row.original.employee.join_date ?? "---";
        return <div>{format(data,"yyyy-MM-dd")}</div>;
      },
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Username" />
      ),
      cell: ({ row }) => {
        const data = row.original.username ?? "---";
        return <div>{data}</div>;
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
        description="You do not have permission to view employee listing."
      />
    );
  }

  const handleRefetch = async () => {
      const { isSuccess } = await refetch();
      if (isSuccess) {
        toast.success("Refetched successfully");
      }
    };

  // Loading state
  if (userListLoading) {
    return <LoadingState />;
  }

  // Error state
  if (userListIsError) {
    return <Error err={error?.message} />;
  }

  // Empty state
  if (!userListResponse?.payload || userListResponse.payload.length === 0) {
    return <Empty title="Not Found" description="No Employees Found" />;
  }

  return (
    <>
      <SubNav
        title="Employees List"
        urlPath={ADD_URL}
        addBtnTitle="Add Employee"
      />
      {!userListResponse?.payload || userListResponse.payload.length === 0 ? (
        <>
          <Empty title="Not Found" description="No Employees Found" />
        </>
      ) : (
        <>
          <EmployeeDatatable
            columns={columns}
            payload={userListResponse.payload}
            handleRefetch={handleRefetch}
            isRefetching={isFetching}
          />
        </>
      )}
      {/* <AttendanceCorrectionDatatable
        columns={columns}
        payload={attendanceCorrectionListResponse.payload}
        handleRefetch={handleRefetch}
        isRefetching={isFetching}
      /> */}
    </>
  );
};

export default EmployeeList;
