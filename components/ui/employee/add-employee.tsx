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
import { DepartmentResponse } from "@/types/departmentTypes";
import { fetchDepartmentList } from "@/helperFunctions/departmentFunction";
import { DesignationResponse } from "@/types/designationTypes";
import { fetchDesignationList } from "@/helperFunctions/designationFunction";
import { ShiftsResponse } from "@/types/shiftTypes";
import { fetchShiftList } from "@/helperFunctions/shiftFunction";
import { TeamsResponse } from "@/types/teamTypes";
import { fetchTeamsList } from "@/helperFunctions/teamFunctions";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import AddEmployeeForm from "./add-employee-form";

const AddEmployee = () => {
  const LISTING_ROUTE = "/hr/employees";
  const router = useRouter();

  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  const {
    data: departmentListResponse,
    isLoading: departmentListLoading,
    isError: departmentListIsError,
    error: departmentListError,
  } = useQuery<DepartmentResponse | null>({
    queryKey: ["department-list"],
    queryFn: fetchDepartmentList,
  });

  const {
    data: designationListResponse,
    isLoading: designationListLoading,
    isError: designationListIsError,
    error: designationListError,
  } = useQuery<DesignationResponse | null>({
    queryKey: ["designation-list"],
    queryFn: fetchDesignationList,
  });

  const {
    data: shiftListResponse,
    isLoading: shiftListLoading,
    isError: shiftListIsError,
    error: shiftListError,
  } = useQuery<ShiftsResponse | null>({
    queryKey: ["shift-list"],
    queryFn: fetchShiftList,
  });

  const {
    data: teamsListResponse,
    isLoading: teamsListLoading,
    isError: teamsListIsError,
    error: teamsListError,
  } = useQuery<TeamsResponse | null>({
    queryKey: ["teams-list"],
    queryFn: fetchTeamsList,
  });

  if (rights?.can_create !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission to add new employee."
      />
    );
  }

  // Loading state
  if (
    designationListLoading ||
    departmentListLoading ||
    shiftListLoading ||
    teamsListLoading
  ) {
    return <LoadingState />;
  }

  // Error state
  if (
    designationListIsError ||
    departmentListIsError ||
    shiftListIsError ||
    teamsListIsError
  ) {
    const error =
      designationListError ||
      departmentListError ||
      shiftListError ||
      teamsListError;
    return <Error err={error?.message} />;
  }

  return (
    <>
      <SubNav title="Add Employee" />
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
              Add a new employee to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <AddEmployeeForm
              departments={departmentListResponse?.payload}
              designations={designationListResponse?.payload}
              shifts={shiftListResponse?.payload}
              teams={teamsListResponse?.payload}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AddEmployee;
