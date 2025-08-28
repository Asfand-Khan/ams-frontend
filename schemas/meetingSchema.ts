import z from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const meetingSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long." })
    .max(100, { message: "Title cannot exceed 100 characters." })
    .describe("Title of the meeting"),

  recurrence_rule: z.enum(
    [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
    {
      errorMap: () => ({
        message:
          "Recurrence rule must be one of: monday, tuesday, wednesday, thursday, friday, saturday, sunday.",
      }),
    }
  ),

  recurrence_type: z.enum(["one_time", "weekly", "monthly", "daily"], {
    errorMap: () => ({
      message:
        "Recurrence type must be one of: one_time, weekly, monthly, daily.",
    }),
  }),

  start_time: z
    .date({ required_error: "Start time is required" })
    .refine((value) => value.getTime().toString()),

  end_time: z
    .date({ required_error: "End time is required" })
    .refine((value) => value.getTime().toString()),

  recurrence_start_date: z.date({
    required_error: "Recurrence start date is required",
  }),

  recurrence_end_date: z.date({
    required_error: "Recurrence end date is required",
  }),

  host_id: z
    .number()
    .int({ message: "Host ID must be an integer." })
    .positive({ message: "Host ID must be a positive number." }),

  location_type: z.enum(["physical", "online"], {
    errorMap: () => ({
      message: "Location type must be either 'physical' or 'online'.",
    }),
  }),

  location_details: z
    .string()
    .min(5, { message: "Location details must be at least 5 characters." })
    .describe("Physical room name/address or online meeting URL"),

  agenda: z
    .string()
    .max(5000, { message: "Agenda cannot exceed 5000 characters." })
    .optional(),

  attendees: z.array(
    z
      .number()
      .int({ message: "Attendees must be integers." })
      .positive({ message: "Attendees must be positive integers." }),
    {
      errorMap: () => ({
        message: "Attendees must be an array of integers.",
      }),
    }
  ),

  status: z
    .enum(["scheduled", "in_progress", "completed", "cancelled"], {
      errorMap: () => ({
        message:
          "Status must be one of: scheduled, in_progress, completed, cancelled.",
      }),
    })
    .default("scheduled"),
});

export type MeetingSchemaType = z.infer<typeof meetingSchema>;
