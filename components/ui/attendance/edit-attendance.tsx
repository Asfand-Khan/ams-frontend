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
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import useAttendanceIdStore from "@/hooks/useAttendanceIdStore";
import { SingleAttendanceResponse } from "@/types/attendanceTypes";
import { fetchAttendanceById } from "@/helperFunctions/attendanceFunction";
import { EmployeesResponseType } from "@/types/employeeTypes";
import { fetchEmployeeList } from "@/helperFunctions/employeeFunction";
import EditAttendanceForm from "./edit-attendance-form";

const EditAttendance = () => {
  // Constants
  const LISTING_ROUTE = "/hr/attendance";
  const router = useRouter();

  // zustand
  const { attendanceId } = useAttendanceIdStore();

  // Rights
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // Fetch single attendance data using react-query
  const {
    data: singleAttendanceResponse,
    isLoading: singleAttendanceLoading,
    isError: singleAttendanceIsError,
    error: singleAttendanceError,
  } = useQuery<SingleAttendanceResponse | null>({
    queryKey: ["single-attendance", attendanceId],
    queryFn: () => fetchAttendanceById({ attendance_id: attendanceId! }),
    enabled: !!attendanceId, // Only fetch if agentId is available
  });

  // Fetch single employee data using react-query
  const {
      data: employeeListResponse,
      isLoading: employeeListLoading,
      isError: employeeListIsError,
      error: employeeListError,
    } = useQuery<EmployeesResponseType | null>({
      queryKey: ["get-employee-list"],
      queryFn: fetchEmployeeList,
    });

  // Rights Redirection
  if (rights?.can_edit !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission to add new branch."
      />
    );
  }


  // loading state
  if (singleAttendanceLoading || employeeListLoading) {
    return <LoadingState />;
  }

  // error state
  if (singleAttendanceIsError) {
    return <Error err={singleAttendanceError?.message} />;
  }

  // error state
  if (employeeListIsError) {
    return <Error err={employeeListError?.message} />;
  }

  // empty state
  if (!attendanceId) {
    return <Empty title="Not Found" description="No attendance found." />;
  }

  console.log(attendanceId);

  return (
    <>
      <SubNav title="Edit Attendance" />
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
              Edit attendance to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <EditAttendanceForm employeeList={employeeListResponse?.payload} singleAttendance={singleAttendanceResponse?.payload} />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default EditAttendance;
