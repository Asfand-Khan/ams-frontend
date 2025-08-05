"use client";

import React from "react";
import { Button } from "../shadcn/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "../shadcn/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { axiosFunction, axiosReturnType } from "@/utils/axiosFunction";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Input } from "../shadcn/input";
import { holidaySchema, HolidayType } from "@/schemas/holidaySchema";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { format } from "date-fns";
import { Calendar } from "../shadcn/calendar";

const AddHolidayForm = () => {
  // Constants
  const LISTING_ROUTE = "/hr/holidays";

  const queryClient = useQueryClient();
  const router = useRouter();

  // Form
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(holidaySchema),
  });

  const addHolidayMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    HolidayType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/holidays",
        data: record,
        isServer: true,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Add holiday mutation error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      reset();
      queryClient.invalidateQueries({ queryKey: ["holiday-list"] });
      router.push(LISTING_ROUTE);
    },
  });

  // Submit handler
  const onSubmit = (data: HolidayType) => {
    addHolidayMutation.mutate(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-1/2">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="gap-1 text-gray-600">
              Holiday Title<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="title"
              placeholder="Enter Holiday Title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Controller
              control={control}
              name="holiday_date"
              rules={{ required: true }}
              render={({ field }) => (
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="holiday_date" className="gap-1 text-gray-600">
                    Holiday Date
                    <span className="text-red-500 text-md">*</span>
                  </Label>
                  <div className={cn("grid gap-2")}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal w-full",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd") : ""
                            )
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            />
            {errors.holiday_date && (
              <p className="text-red-500 text-sm">
                {errors.holiday_date.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="gap-1 text-gray-600">
              Holiday Description<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="description"
              placeholder="Enter Holiday Description"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={addHolidayMutation.isPending}
            >
              {addHolidayMutation.isPending ? "Submiting" : "Submit"}
              {addHolidayMutation.isPending && (
                <span className="animate-spin">
                  <Loader2 />
                </span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddHolidayForm;
