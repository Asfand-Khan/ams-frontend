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
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../shadcn/dialog";
import { Button } from "../shadcn/button";

// Helper function to capitalize the first letter
const capitalizeFirstLetter = (str: string | undefined | null): string => {
  if (!str) return "---";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

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
    refetch,
    isFetching,
  } = useQuery<NotificationResponse | null>({
    queryKey: ["notification-list"],
    queryFn: fetchNotificationList,
  });

  const nameFilterOptions = useMemo(() => {
    const allUsernames =
      notificationListResponse?.payload?.map((item) => item.user?.username) ||
      [];
    const uniqueUsernames = Array.from(new Set(allUsernames));
    return uniqueUsernames.map((username) => ({
      label: capitalizeFirstLetter(username), // for display
      value: username, // for filtering
    }));
  }, [notificationListResponse]);
  const createdAtFilterOptions = useMemo(() => {
    const allDates =
      notificationListResponse?.payload?.map(
        (item) => item.created_at?.split("T")[0] // extract only date
      ) || [];
    const uniqueDates = Array.from(new Set(allDates));
    return uniqueDates.map((date) => ({
      label: date,
      value: date, // same as what you display
    }));
  }, [notificationListResponse]);

  const columns: ColumnDef<NotificationPayload>[] = [
    {
      accessorKey: "user.username",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const name = row.original.user?.username;
        return <div>{capitalizeFirstLetter(name)}</div>;
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: nameFilterOptions,
        filterPlaceholder: "Filter name...",
      } as ColumnMeta,
    },
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
      cell: ({ row }) => (
        <div>{capitalizeFirstLetter(String(row.getValue("priority")))}</div>
      ),
    },
    {
      accessorKey: "message",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Message" />
      ),
      cell: ({ row }) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="link">
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[400px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Message</DialogTitle>
              <DialogDescription>Below is the message.</DialogDescription>
              <hr />
            </DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex-1 gap-2 whitespace-pre-wrap">
                {row.getValue("message") ?? "---"}
              </div>
            </div>
            <DialogFooter className="sm:justify-start mt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => (
        <div>{capitalizeFirstLetter(row.getValue("type"))}</div>
      ),
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
      accessorFn: (row) => row.created_at?.split("T")[0] ?? "", // returns only date
      id: "created_at",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Create Date" />
      ),
      cell: ({ row }) => {
        const createDate = row.original.created_at?.split("T")[0] ?? "---";
        return <div>{createDate}</div>;
      },
      filterFn: (row, columnId, filterValues) => {
        const cellValue = row.getValue(columnId); // this is only the date part
        return filterValues.includes(cellValue);
      },
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

  const handleRefetch = async () => {
    const { isSuccess } = await refetch();
    if (isSuccess) {
      toast.success("Refetched successfully");
    }
  };

  return (
    <>
      <SubNav
        title="Notification List"
        urlPath={ADD_URL}
        addBtnTitle="Add Notification"
      />
      {!notificationListResponse?.payload ||
      notificationListResponse.payload.length === 0 ? (
        <Empty title="Not Found" description="No Notification Found" />
      ) : (
        <NotificationDatatable
          columns={columns}
          payload={notificationListResponse.payload}
          handleRefetch={handleRefetch}
          isRefetching={isFetching}
        />
      )}
    </>
  );
};

export default NotificationList;
