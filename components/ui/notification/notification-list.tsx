"use client";

import { getRights } from "@/utils/getRights";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";
import React, { useMemo } from "react";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnMeta } from "@/types/dataTableTypes";
import Empty from "../foundations/empty";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import SubNav from "../foundations/sub-nav";
import {
  NotificationPayload,
  NotificationResponse,
} from "@/types/notificationTypes";
import { fetchNotificationList } from "@/helperFunctions/notificationFunction";
import { Badge } from "../foundations/badge";
import NotificationDatatable from "./notification-datatable";

const NotificationList = () => {
  // Constants
  const ADD_URL = "/hr/notifications/add-notification";

  const router = useRouter();
  const pathname = usePathname();

  // Rights
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  const {
    data: notificationListResponse,
    isLoading: notificationListLoading,
    isError: notificationListIsError,
    error,
  } = useQuery<NotificationResponse | null>({
    queryKey: ["notification-list"],
    queryFn: fetchNotificationList,
  });

  const nameFilterOptions = useMemo(() => {
    const allEmployeeCode =
      notificationListResponse?.payload?.map((item) => item.user?.username) ||
      [];
    const uniqueEmployeeCode = Array.from(new Set(allEmployeeCode));
    return uniqueEmployeeCode.map((code) => ({
      label: code,
      value: code,
    }));
  }, [notificationListResponse]);

  const createdAtFilterOptions = useMemo(() => {
    const allEmployeeCode =
      notificationListResponse?.payload?.map((item) => item.created_at) || [];
    const uniqueEmployeeCode = Array.from(new Set(allEmployeeCode));
    return uniqueEmployeeCode.map((code) => ({
      label: code,
      value: code,
    }));
  }, [notificationListResponse]);

  const columns: ColumnDef<NotificationPayload>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => <div>{row.getValue("title")}</div>,
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Priority" />
      ),
      cell: ({ row }) => <div>{String(row.getValue("priority"))}</div>,
    },
    {
      accessorKey: "message",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Message" />
      ),
      cell: ({ row }) => <div>{row.getValue("message") ?? "---"}</div>,
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => <div>{row.getValue("type") ?? "---"}</div>,
    },
    {
      accessorKey: "user.username",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const name = row.original.user?.username ?? "---";
        return <div>{name}</div>;
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: nameFilterOptions,
        filterPlaceholder: "Filter name...",
      } as ColumnMeta,
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
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: createdAtFilterOptions,
        filterPlaceholder: "Filter date...",
      } as ColumnMeta,
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
        description="You do not have permission to view notification listing."
      />
    );
  }

  // Loading state
  if (notificationListLoading) {
    return <LoadingState />;
  }

  // Error state
  if (notificationListIsError) {
    return <Error err={error?.message} />;
  }

  // Empty state
  if (
    !notificationListResponse?.payload ||
    notificationListResponse.payload.length === 0
  ) {
    return <Empty title="Not Found" description="No Notification Found" />;
  }

  return (
    <>
      <SubNav
        title="Notification List"
        urlPath={ADD_URL}
        addBtnTitle="Add Notification"
      />
      <NotificationDatatable
        columns={columns}
        payload={notificationListResponse.payload}
      />
    </>
  );
};

export default NotificationList;