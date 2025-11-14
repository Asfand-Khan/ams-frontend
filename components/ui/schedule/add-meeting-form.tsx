import { meetingSchema, MeetingSchemaType } from "@/schemas/meetingSchema";
import { EmployeePayloadType } from "@/types/employeeTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Label } from "../shadcn/label";
import { Button } from "../shadcn/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Input } from "../shadcn/input";
import Select from "react-select";
import { singleSelectStyle} from "@/utils/selectStyles";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { format } from "date-fns";
import { Calendar } from "../shadcn/calendar";
import { TimePicker12Demo } from "../foundations/time-picker";
import { Textarea } from "../shadcn/textarea";
import { axiosFunction, axiosReturnType } from "@/utils/axiosFunction";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface AddMeetingFormProps {
  employees: EmployeePayloadType[] | undefined;
}

const AddMeetingForm: React.FC<AddMeetingFormProps> = ({ employees }) => {
  // Constants
  const LISTING_ROUTE = "/hr/schedule";

  const queryClient = useQueryClient();
  const router = useRouter();

  const attendeesOptions = employees?.map((item) => ({
    value: item.id,
    label: item.full_name,
  }));

  const [recurrenceRuleOptions] = React.useState([
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
  ]);

  const [recurrenceTypeOptions] = React.useState([
    { value: "daily", label: "Daily" },
    { value: "one_time", label: "One Time" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ]);

  const [locationTypeOptions] = React.useState([
    { value: "online", label: "Online" },
    { value: "physical", label: "Physical" },
  ]);

  // Form
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    register,
  } = useForm({
    resolver: zodResolver(meetingSchema),
  });

  const addMeetingMutation = useMutation<
    axiosReturnType,
    AxiosError<any>,
    MeetingSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/meetings",
        data: {
          ...record,
          start_time: format(record.start_time, "HH:mm:ss"),
          end_time: format(record.end_time, "HH:mm:ss"),
          recurrence_start_date: format(
            record.recurrence_start_date,
            "yyyy-MM-dd"
          ),
          recurrence_end_date: format(record.recurrence_end_date, "yyyy-MM-dd"),
        },
        isServer: true,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      console.log("Add Meeting mutation error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      reset();
      queryClient.invalidateQueries({ queryKey: ["meeting-list"] });
      router.push(LISTING_ROUTE);
    },
  });

  const onSubmit = (data: MeetingSchemaType) => {
    addMeetingMutation.mutate(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-1/2">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="gap-1 text-gray-600">
              Title<span className="text-red-500 text-md">*</span>
            </Label>
            <Input
              type="text"
              id="title"
              placeholder="Enter title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="recurrence_rule" className="gap-1 text-gray-600">
              Recurrence Rule<span className="text-red-500 text-md">*</span>
            </Label>
            <Controller
              control={control}
              name="recurrence_rule"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  id="recurrence_rule"
                  options={recurrenceRuleOptions}
                  value={
                    recurrenceRuleOptions?.find(
                      (option) => option.value === field.value
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption ? selectedOption.value : null)
                  }
                  placeholder="Select recurrence rule"
                  className="w-full"
                  styles={singleSelectStyle}
                />
              )}
            />
            {errors.recurrence_rule && (
              <p className="text-red-500 text-sm">
                {errors.recurrence_rule.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="recurrence_type" className="gap-1 text-gray-600">
              Recurrence Type<span className="text-red-500 text-md">*</span>
            </Label>
            <Controller
              control={control}
              name="recurrence_type"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  id="recurrence_type"
                  options={recurrenceTypeOptions}
                  value={
                    recurrenceTypeOptions?.find(
                      (option) => option.value === field.value
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption ? selectedOption.value : null)
                  }
                  placeholder="Select recurrence type"
                  className="w-full"
                  styles={singleSelectStyle}
                />
              )}
            />
            {errors.recurrence_type && (
              <p className="text-red-500 text-sm">
                {errors.recurrence_type.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Controller
              control={control}
              name="recurrence_start_date"
              rules={{ required: true }}
              render={({ field }) => (
                <div className="space-y-2 lg:col-span-2">
                  <Label
                    htmlFor="recurrence_start_date"
                    className="gap-1 text-gray-600"
                  >
                    Start Date
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
            {errors.recurrence_start_date && (
              <p className="text-red-500 text-sm">
                {errors.recurrence_start_date.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Controller
              control={control}
              name="recurrence_end_date"
              rules={{ required: true }}
              render={({ field }) => (
                <div className="space-y-2 lg:col-span-2">
                  <Label
                    htmlFor="recurrence_end_date"
                    className="gap-1 text-gray-600"
                  >
                    End Date
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
            {errors.recurrence_end_date && (
              <p className="text-red-500 text-sm">
                {errors.recurrence_end_date.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Controller
              control={control}
              name="start_time"
              render={({ field }) => (
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="start_time" className="gap-1 text-gray-600">
                    Start Time
                  </Label>
                  <div className="flex gap-2 w-full">
                    <TimePicker12Demo
                      setDate={field.onChange}
                      date={field.value ? new Date(field.value) : undefined}
                    />
                  </div>
                </div>
              )}
            />
            {errors.start_time && (
              <p className="text-red-500 text-sm">
                {errors.start_time.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Controller
              control={control}
              name="end_time"
              render={({ field }) => (
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="end_time" className="gap-1 text-gray-600">
                    End Time
                  </Label>
                  <div className="flex gap-2 w-full">
                    <TimePicker12Demo
                      setDate={field.onChange}
                      date={field.value ? new Date(field.value) : undefined}
                    />
                  </div>
                </div>
              )}
            />
            {errors.end_time && (
              <p className="text-red-500 text-sm">{errors.end_time.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location_type" className="gap-1 text-gray-600">
              Location Type<span className="text-red-500 text-md">*</span>
            </Label>
            <Controller
              control={control}
              name="location_type"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  id="location_type"
                  options={locationTypeOptions}
                  value={
                    locationTypeOptions?.find(
                      (option) => option.value === field.value
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption ? selectedOption.value : null)
                  }
                  placeholder="Select location type"
                  className="w-full"
                  styles={singleSelectStyle}
                />
              )}
            />
            {errors.location_type && (
              <p className="text-red-500 text-sm">
                {errors.location_type.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location_details" className="gap-1 text-gray-600">
              Location Details<span className="text-red-500 text-md">*</span>
            </Label>
            <Textarea
              id="location_details"
              placeholder="Enter location details"
              {...register("location_details")}
            />
            {errors.location_details && (
              <p className="text-red-500 text-sm">
                {errors.location_details.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="agenda" className="gap-1 text-gray-600">
              Agenda <span className="text-red-500 text-md">*</span>
            </Label>
            <Textarea
              id="agenda"
              placeholder="Enter agenda"
              {...register("agenda")}
            />
            {errors.agenda && (
              <p className="text-red-500 text-sm">{errors.agenda.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="host_id" className="gap-1 text-gray-600">
              Host <span className="text-red-500 text-md">*</span>
            </Label>
            <Controller
              control={control}
              name="host_id"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  id="host_id"
                  options={attendeesOptions}
                  value={
                    attendeesOptions?.find(
                      (option) => option.value === field.value
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption ? selectedOption.value : null)
                  }
                  placeholder="Select host"
                  className="w-full"
                  styles={singleSelectStyle}
                />
              )}
            />
            {errors.host_id && (
              <p className="text-red-500 text-sm">{errors.host_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendees" className="gap-1 text-gray-600">
              Attendees <span className="text-red-500 text-md">*</span>
            </Label>
            <Controller
              control={control}
              name="attendees"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  id="attendees"
                  isMulti
                  options={attendeesOptions}
                  value={
                    attendeesOptions?.filter((option) =>
                      field.value?.includes(option.value)
                    ) || []
                  }
                  onChange={(selectedOptions) =>
                    field.onChange(
                      selectedOptions
                        ? selectedOptions.map((opt) => opt.value)
                        : []
                    )
                  }
                  placeholder="Select attendees"
                  className="w-full"
                />
              )}
            />
            {errors.attendees && (
              <p className="text-red-500 text-sm">{errors.attendees.message}</p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={addMeetingMutation.isPending}
            >
              {addMeetingMutation.isPending ? "Submiting" : "Submit"}
              {addMeetingMutation.isPending && (
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

export default AddMeetingForm;
