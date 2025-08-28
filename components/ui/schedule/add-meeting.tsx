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
import { EmployeesResponseType } from "@/types/employeeTypes";
import { fetchEmployeeList } from "@/helperFunctions/employeeFunction";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import AddMeetingForm from "./add-meeting-form";

const AddMeeting = () => {
  const LISTING_ROUTE = "/hr/schedule";
  const router = useRouter();

  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  const {
    data: employeeListResponse,
    isLoading: employeeListLoading,
    isError: employeeListIsError,
    error: employeeListError,
  } = useQuery<EmployeesResponseType | null>({
    queryKey: ["meeting-employee-list"],
    queryFn: fetchEmployeeList,
  });

  if (rights?.can_create !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission to add new meeting."
      />
    );
  }

  if (employeeListLoading) {
    return <LoadingState />;
  }

  if (employeeListIsError) {
    return <Error err={employeeListError?.message} />;
  }

  return (
    <>
      <SubNav title="Add Meeting" />
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
              Add a new meeting to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <AddMeetingForm employees={employeeListResponse?.payload}/>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AddMeeting;
