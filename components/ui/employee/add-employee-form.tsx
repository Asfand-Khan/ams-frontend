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
import { DepartmentPayload } from "@/types/departmentTypes";
import Select from "react-select";
import { selectStyles } from "@/utils/selectStyles";
import { DesignationPayload } from "@/types/designationTypes";
import { ShiftPayload } from "@/types/shiftTypes";
import { TeamPayload } from "@/types/teamTypes";
import { Employee, employeeSchema } from "@/schemas/employeeSchema";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { format } from "date-fns";
import { Calendar } from "../shadcn/calendar";
import { Textarea } from "../shadcn/textarea";

interface AddEmployeeFormProps {
  designations: DesignationPayload[] | undefined;
  departments: DepartmentPayload[] | undefined;
  shifts: ShiftPayload[] | undefined;
  teams: TeamPayload[] | undefined;
}
const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({
  departments,
  designations,
  shifts,
  teams,
}) => {
  // Constants
  const LISTING_ROUTE = "/hr/employees";

  const queryClient = useQueryClient();
  const router = useRouter();

  // Employee List options
  const departmentOptions = departments?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const designationOptions = designations?.map((item) => ({
    value: item.id,
    label: item.title,
  }));

  const shiftOptions = shifts?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const teamsOptions = teams?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const employeeTypeOptions = [
    { value: "employee", label: "Employee" },
    { value: "manager", label: "Manager" },
    { value: "admin", label: "Admin" },
    { value: "hr", label: "Hr" },
    { value: "lead", label: "Lead" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  // Form
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(employeeSchema),
  });

  const addEmployeeMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    Employee
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/employees",
        data: {
          ...record,
          leave_date: record.leave_date
            ? format(record.leave_date, "yyyy-MM-dd")
            : null,
          join_date: format(record.join_date, "yyyy-MM-dd"),
          dob: record.dob ? format(record.dob, "yyyy-MM-dd") : null,
        },
        isServer: true,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Add employees mutation error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      reset();
      queryClient.invalidateQueries({ queryKey: ["employees-list"] });
      router.push(LISTING_ROUTE);
    },
  });

  // Submit handler
  const onSubmit = (data: Employee) => {
    console.log(data);
    addEmployeeMutation.mutate(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-1/2">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="employee_code" className="gap-1 text-gray-600">
              Employee Code
              <span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="employee_code"
              placeholder="Enter employee code"
              {...register("employee_code")}
            />
            {errors.employee_code && (
              <p className="text-red-500 text-sm">
                {errors.employee_code.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="level" className="gap-1 text-gray-600">
              Username
              <span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="username"
              placeholder="Enter username"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name" className="gap-1 text-gray-600">
              Fullname<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="full_name"
              placeholder="Enter fullname"
              {...register("full_name")}
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm">{errors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fathername" className="gap-1 text-gray-600">
              Father Name
              <span className="text-red-500 text-md"></span>
            </Label>
            <Input
              type="text"
              id="fathername"
              placeholder="Enter father name"
              {...register("fathername")}
            />
            {errors.fathername && (
              <p className="text-red-500 text-sm">
                {errors.fathername.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="gap-1 text-gray-600">
              Email
              <span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="email"
              placeholder="Enter email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="emp_type" className="gap-1 text-gray-600">
              Employee Type<span className="text-red-500 text-md">*</span>
            </Label>
            <Controller
              control={control}
              name="emp_type"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  id="emp_type"
                  options={employeeTypeOptions}
                  value={
                    employeeTypeOptions?.find(
                      (option) => option.value === field.value
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption ? selectedOption.value : null)
                  }
                  placeholder="Select employee type"
                  className="w-full"
                  styles={selectStyles}
                />
              )}
            />
            {errors.emp_type && (
              <p className="text-red-500 text-sm">{errors.emp_type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="gap-1 text-gray-600">
              Phone
              <span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="phone"
              placeholder="Enter phone"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnic" className="gap-1 text-gray-600">
              Cnic
              <span className="text-red-500 text-md"></span>
            </Label>
            <Input
              type="text"
              id="cnic"
              placeholder="Enter cnic"
              {...register("cnic")}
            />
            {errors.cnic && (
              <p className="text-red-500 text-sm">{errors.cnic.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="gap-1 text-gray-600">
              Gender<span className="text-red-500 text-md">*</span>
            </Label>
            <Controller
              control={control}
              name="gender"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  id="gender"
                  options={genderOptions}
                  value={
                    genderOptions?.find(
                      (option) => option.value === field.value
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption ? selectedOption.value : null)
                  }
                  placeholder="Select gender"
                  className="w-full"
                  styles={selectStyles}
                />
              )}
            />
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Controller
              control={control}
              name="dob"
              render={({ field }) => (
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="dob" className="gap-1 text-gray-600">
                    Date of Birth
                    <span className="text-red-500 text-md"></span>
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
                            field.onChange(date ? date : null)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            />
            {errors.dob && (
              <p className="text-red-500 text-sm">{errors.dob.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Controller
              control={control}
              name="join_date"
              render={({ field }) => (
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="join_date" className="gap-1 text-gray-600">
                    Join Date
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
                            field.onChange(date ? date : null)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            />
            {errors.join_date && (
              <p className="text-red-500 text-sm">{errors.join_date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Controller
              control={control}
              name="leave_date"
              render={({ field }) => (
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="leave_date" className="gap-1 text-gray-600">
                    Leave Date
                    <span className="text-red-500 text-md"></span>
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
                            field.onChange(date ? date : null)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            />
            {errors.leave_date && (
              <p className="text-red-500 text-sm">
                {errors.leave_date.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department_id" className="gap-1 text-gray-600">
              Department<span className="text-red-500 text-md">*</span>
            </Label>
            <Controller
              control={control}
              name="department_id"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  id="department_id"
                  options={departmentOptions}
                  value={
                    departmentOptions?.find(
                      (option) => option.value === field.value
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption ? selectedOption.value : null)
                  }
                  placeholder="Select department"
                  className="w-full"
                  styles={selectStyles}
                />
              )}
            />
            {errors.department_id && (
              <p className="text-red-500 text-sm">
                {errors.department_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation_id" className="gap-1 text-gray-600">
              Designation<span className="text-red-500 text-md">*</span>
            </Label>
            <Controller
              control={control}
              name="designation_id"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  id="designation_id"
                  options={designationOptions}
                  value={
                    designationOptions?.find(
                      (option) => option.value === field.value
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption ? selectedOption.value : null)
                  }
                  placeholder="Select designation"
                  className="w-full"
                  styles={selectStyles}
                />
              )}
            />
            {errors.designation_id && (
              <p className="text-red-500 text-sm">
                {errors.designation_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shift_id" className="gap-1 text-gray-600">
              Shift<span className="text-red-500 text-md">*</span>
            </Label>
            <Controller
              control={control}
              name="shift_id"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  id="shift_id"
                  options={shiftOptions}
                  value={
                    shiftOptions?.find(
                      (option) => option.value === field.value
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption ? selectedOption.value : null)
                  }
                  placeholder="Select shift"
                  className="w-full"
                  styles={selectStyles}
                />
              )}
            />
            {errors.shift_id && (
              <p className="text-red-500 text-sm">{errors.shift_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="team_id" className="gap-1 text-gray-600">
              Team<span className="text-red-500 text-md">*</span>
            </Label>
            <Controller
              control={control}
              name="team_id"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  id="team_id"
                  options={teamsOptions}
                  value={
                    teamsOptions?.find(
                      (option) => option.value === field.value
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption ? selectedOption.value : null)
                  }
                  placeholder="Select team"
                  className="w-full"
                  styles={selectStyles}
                />
              )}
            />
            {errors.team_id && (
              <p className="text-red-500 text-sm">{errors.team_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="gap-1 text-gray-600">
              Address
              <span className="text-red-500 text-md">*</span>
            </Label>
            <Textarea
              id="address"
              placeholder="Enter address"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="gap-1 text-gray-600">
              Status<span className="text-red-500 text-md">*</span>
            </Label>
            <Controller
              control={control}
              name="status"
              defaultValue="active"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  id="status"
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                  value={
                    [
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" },
                    ]?.find((option) => option.value === field.value) || null
                  }
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption ? selectedOption.value : null)
                  }
                  placeholder="Select status"
                  className="w-full"
                  styles={selectStyles}
                />
              )}
            />
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={addEmployeeMutation.isPending}
            >
              {addEmployeeMutation.isPending ? "Submiting" : "Submit"}
              {addEmployeeMutation.isPending && (
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

export default AddEmployeeForm;
