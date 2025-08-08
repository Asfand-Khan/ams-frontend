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
import { UsersResponse } from "@/types/userTypes";
import { fetchUserList } from "@/helperFunctions/userFunction";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import AddNotificationForm from "./add-notification-form";

const AddNotification = () => {
  const LISTING_ROUTE = "/hr/notifications";
  const router = useRouter();

  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  const {
    data: userListResponse,
    isLoading: userListLoading,
    isError: userListIsError,
    error,
  } = useQuery<UsersResponse | null>({
    queryKey: ["user-list"],
    queryFn: fetchUserList,
  });

  if (rights?.can_create !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission to add new notification."
      />
    );
  }

  // Loading state
  if (userListLoading) {
    return <LoadingState />;
  }

  // Error state
  if (userListIsError) {
    return <Error err={error?.message} />;
  }

  return (
    <>
      <SubNav title="Add Notification" />
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
              Add a new notification to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <AddNotificationForm users={userListResponse?.payload} />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AddNotification;
