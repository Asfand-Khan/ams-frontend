"use client";

import React, { useMemo } from "react";
import SubNav from "../foundations/sub-nav";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Button } from "../shadcn/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getRights } from "@/utils/getRights";
import Empty from "../foundations/empty";
import { DepartmentResponse } from "@/types/departmentTypes";
import { useQuery } from "@tanstack/react-query";
import { fetchDepartmentList } from "@/helperFunctions/departmentFunction";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import AddDesignationForm from "./add-designation-form";

const AddDesignation = () => {
  const LISTING_ROUTE = "/organization/designations";
  const router = useRouter();

  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  const {
    data: departmentListResponse,
    isLoading: departmentListLoading,
    isError: departmentListIsError,
    error,
  } = useQuery<DepartmentResponse | null>({
    queryKey: ["designation-department-list"],
    queryFn: fetchDepartmentList,
  });

  if (rights?.can_create !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission to add new designation."
      />
    );
  }

  // Loading state
  if (departmentListLoading) {
    return <LoadingState />;
  }

  // Error state
  if (departmentListIsError) {
    return <Error err={error?.message} />;
  }

  return (
    <>
      <SubNav title="Add Designation" />
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
              Add a new designation to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <AddDesignationForm departments={departmentListResponse?.payload} />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AddDesignation;
