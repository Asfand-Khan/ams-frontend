"use client";

import { getRights } from "@/utils/getRights";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";
import React, { useMemo } from "react";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { Button } from "../shadcn/button";
import Empty from "../foundations/empty";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import SubNav from "../foundations/sub-nav";
import { Badge } from "../foundations/badge";
import { fetchMeetingList } from "@/helperFunctions/scheduleFunciton";
import {
  MeetingInstancePayload,
  MeetingPayload,
  MeetingResponse,
} from "@/types/scheduleTypes";
import ScheduleDatatable from "./schedule-datatable";
import { Dialog, DialogContent } from "../shadcn/dialog";
import { axiosFunction, axiosReturnType } from "@/utils/axiosFunction";
import { AxiosError } from "axios";
import { toast } from "sonner";
import ScheduleInstanceDatatable from "./schedule-instance-datatable";

const MeetingList = () => {
  const ADD_URL = "/hr/schedule/add-schedule";
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = React.useState(false);
  const [meetingInstance, setMeetingInstance] = React.useState<
    MeetingInstancePayload[]
  >([]);

  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  const {
    data: meetingListResponse,
    isLoading: meetingListLoading,
    isError: meetingListIsError,
    error,
  } = useQuery<MeetingResponse | null>({
    queryKey: ["meeting-list"],
    queryFn: fetchMeetingList,
  });

  // Mutations
  const fetchMeetingInstancesMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    { meeting_id: number }
  >({
    onMutate: () => {
      toast.info("Please wait...");
    },
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/meetings/instances",
        data: record,
        isServer: true,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Meeting Instance mutation error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      setMeetingInstance(data?.payload);
      setOpen(true);
    },
  });

  const toggleInstanceStatusMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    { meeting_instance_id: number }
  >({
    onMutate: () => {
      setOpen(false);
    },
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/meetings/instances/status",
        data: record,
        isServer: true,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Toggle Instance mutation error", err);
      toast.error(message);
    },
  });

  const instanceColumns: ColumnDef<MeetingInstancePayload>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        const title = row.original.title;
        return <div>{title}</div>;
      },
    },
    {
      accessorKey: "instance_date",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Instance Date" />
      ),
      cell: ({ row }) => {
        const date = row.original.instance_date;
        return <div>{date}</div>;
      },
    },
    {
      accessorKey: "recurrence_rule",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Day" />
      ),
      cell: ({ row }) => {
        const title = row.original.recurrence_rule;
        return <div>{title}</div>;
      },
    },
    {
      accessorKey: "location_type",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Location Type" />
      ),
      cell: ({ row }) => {
        const title = row.original.location_type;
        return <div>{title}</div>;
      },
    },
    {
      accessorKey: "location_details",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Location Details" />
      ),
      cell: ({ row }) => {
        const title = row.original.location_details;
        return <div>{title}</div>;
      },
    },
    {
      accessorKey: "start_time",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Start Time" />
      ),
      cell: ({ row }) => {
        const title = row.original.start_time;
        return <div>{title}</div>;
      },
    },
    {
      accessorKey: "end_time",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="End Time" />
      ),
      cell: ({ row }) => {
        const title = row.original.end_time;
        return <div>{title}</div>;
      },
    },
    {
      accessorKey: "agenda",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Agenda" />
      ),
      cell: ({ row }) => {
        const title = row.original.agenda;
        return <div>{title}</div>;
      },
    },
    {
      accessorKey: "attendees",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Attendees" />
      ),
      cell: ({ row }) => {
        const title = row.original.attendees;
        return <div>{title}</div>;
      },
    },
    {
      accessorKey: "is_active",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Active/Inactive" />
      ),
      cell: ({ row }) => {
        const is_active = row.getValue("is_active");
        const status = is_active === 1 ? "Active" : "Inactive";
        return (
          <Badge
            variant={`${status === "Active" ? "success" : "danger"}`}
            className="px-3 py-1 capitalize cursor-pointer"
            onClick={() => {
              toggleInstanceStatusMutation.mutate(
                { meeting_instance_id: row.original.meeting_instance_id },
                {
                  onSuccess: () => {
                    fetchMeetingInstancesMutation.mutate({
                      meeting_id: row.original.meeting_id,
                    });
                  },
                }
              );
            }}
          >
            {status ?? "---"}
          </Badge>
        );
      },
    },
  ];

  const columns: ColumnDef<MeetingPayload>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        const title = row.original.title;
        return <div>{title}</div>;
      },
    },
    {
      accessorKey: "recurrence_rule",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Recurrence Rule" />
      ),
      cell: ({ row }) => <div>{row.getValue("recurrence_rule") ?? "---"}</div>,
    },
    {
      accessorKey: "recurrence_type",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Recurrence Type" />
      ),
      cell: ({ row }) => <div>{row.getValue("recurrence_type") ?? "---"}</div>,
    },
    {
      accessorKey: "start_time",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Start Time" />
      ),
      cell: ({ row }) => <div>{row.getValue("start_time") ?? "---"}</div>,
    },
    {
      accessorKey: "end_time",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="End Time" />
      ),
      cell: ({ row }) => <div>{row.getValue("end_time") ?? "---"}</div>,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Instances" />
      ),
      cell: ({ row }) => {
        const meeting_id = row.original.id;
        return (
          <>
            <Button
              size="sm"
              variant="link"
              onClick={() => {
                fetchMeetingInstancesMutation.mutate({ meeting_id });
              }}
            >
              View
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="sm:max-w-10/12">
                <div className="flex items-center gap-2 overflow-x-auto">
                  <ScheduleInstanceDatatable
                    columns={instanceColumns}
                    payload={meetingInstance}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </>
        );
      },
    },
    {
      accessorKey: "meeting_host.full_name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Host" />
      ),
      cell: ({ row }) => {
        const host = row.original.meeting_host.full_name ?? "---";
        return <div>{host}</div>;
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
  ];

  // Rights Redirection
  if (rights?.can_view !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission to view meeting listing."
      />
    );
  }

  // Loading state
  if (meetingListLoading) {
    return <LoadingState />;
  }

  // Error state
  if (meetingListIsError) {
    return <Error err={error?.message} />;
  }

  // Empty state
  if (
    !meetingListResponse?.payload ||
    meetingListResponse.payload.length === 0
  ) {
    return <Empty title="Not Found" description="No Meeting Found" />;
  }

  return (
    <>
      <SubNav
        title="Meeting List"
        addBtnTitle="Add Meeting"
        urlPath={ADD_URL}
      />
      <ScheduleDatatable
        columns={columns}
        payload={meetingListResponse.payload}
      />
    </>
  );
};

export default MeetingList;
