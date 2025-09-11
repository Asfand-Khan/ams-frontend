"use client";

import React, { useMemo } from "react";
import SubNav from "../foundations/sub-nav";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Button } from "../shadcn/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getRights } from "@/utils/getRights";
import Empty from "../foundations/empty";
import { EmployeesResponseType } from "@/types/employeeTypes";
import { useQuery } from "@tanstack/react-query";
import { fetchEmployeeList } from "@/helperFunctions/employeeFunction";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import AddAttendanceCorrectionForm from "./add-attendance-correction-form";

const AddAttendanceCorrection = () => {
  // Constants
  const LISTING_ROUTE = "/hr/attendance-corrections";
  const router = useRouter();

  // Rights
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // Fetch branch list data using react-query
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
  if (rights?.can_create !== "1") {
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
  if (employeeListLoading) {
    return <LoadingState />;
  }

  // error state
  if (employeeListIsError) {
    return <Error err={employeeListError?.message} />;
  }

  // empty state
  if (
    employeeListResponse?.payload?.length === 0 ||
    !employeeListResponse?.payload
  ) {
    return (
      <Empty
        title="Not Found"
        description="No Users found to populate the form."
      />
    );
  }

  return (
    <>
      <SubNav title="Add Attendance Correction" />
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
              Add a new attendance to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <AddAttendanceCorrectionForm employeeList={employeeListResponse?.payload} />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AddAttendanceCorrection;
