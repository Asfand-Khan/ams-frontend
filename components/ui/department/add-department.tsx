"use client";

import React, { useMemo } from "react";
import SubNav from "../foundations/sub-nav";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Button } from "../shadcn/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getRights } from "@/utils/getRights";
import Empty from "../foundations/empty";
import AddDepartmentForm from "./add-department-form";

const AddDepartment = () => {
  const LISTING_ROUTE = "/organization/departments";
  const router = useRouter();

  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  if (rights?.can_create !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission to add new department."
      />
    );
  }

  return (
    <>
      <SubNav title="Add Department" />
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
              Add a new department to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <AddDepartmentForm />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AddDepartment;
