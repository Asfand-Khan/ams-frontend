"use client";

import React, { useMemo } from "react";
import SubNav from "../foundations/sub-nav";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Button } from "../shadcn/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getRights } from "@/utils/getRights";
import Empty from "../foundations/empty";
import { useQuery } from "@tanstack/react-query";
import { LeaveTypeResponse } from "@/types/leaveTypeTypes";
import { singleLeaveType } from "@/helperFunctions/leaveTypeFunction";
import useLeaveTypeIdStore from "@/hooks/useLeaveTypeIdStore";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import EditLeaveTypeForm from "./edit-leave-type-form";

const EditLeaveType = () => {
  const LISTING_ROUTE = "/hr/leave-types";
  const router = useRouter();

  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // zustand
  const leaveTypeId = useLeaveTypeIdStore((state) => state.leaveTypeId);
  
  const {
    data: singleLeaveTypeResponse,
    isLoading: singleLeaveTypeLoading,
    isError: singleLeaveTypeIsError,
    error,
  } = useQuery<LeaveTypeResponse | null>({
    queryKey: ["add-leave-type-list"],
    queryFn: () => singleLeaveType({ id: leaveTypeId! }),
    enabled: !!leaveTypeId,
  });


  if (rights?.can_edit !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission to edit leave type."
      />
    );
  }

  if (leaveTypeId === null) {
    setTimeout(() => {
      router.back();
    }, 1500);
    return (
      <Empty
        title="No Leave Type"
        description="No leave type selected. Please select a leave type to edit."
      />
    );
  }


  // Loading state
  if (singleLeaveTypeLoading) {
    return <LoadingState />;
  }

  // Error state
  if (singleLeaveTypeIsError) {
    return <Error err={error?.message} />;
  }

  // Empty state
  if (
    !singleLeaveTypeResponse?.payload ||
    singleLeaveTypeResponse.payload.length === 0
  ) {
    return <Empty title="Not Found" description="No Leave Type Found" />;
  }

  return (
    <>
      <SubNav title="Edit Leave Type" />
      <Card className="w-full shadow-none border-none">
        <CardHeader className="border-b gap-0">
          <CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-gray-200 cursor-pointer"
                onClick={() => router.push(LISTING_ROUTE)}
              >
                <ArrowLeft className="size-6" />
              </Button>
              Edit a leave type to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <EditLeaveTypeForm singleLeaveType={singleLeaveTypeResponse.payload[0]}/>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default EditLeaveType;
