import z from "zod";

export const shiftSchema = z.object({
  name: z
    .string({
      required_error: "Shift name is required.",
      invalid_type_error: "Shift name must be a string.",
    })
    .min(1, "Shift name cannot be empty.")
    .max(50, "Shift name must not exceed 50 characters.")
    .toLowerCase(),

  start_time: z
    .date({
      required_error: "Start time is required.",
      invalid_type_error: "Start time must be a date string.",
    }),

  end_time: z
    .date({
      required_error: "End time is required.",
      invalid_type_error: "End time must be a date string.",
    }),

  grace_minutes: z
    .number({
      invalid_type_error: "Grace minutes must be a number.",
    })
    .int("Grace minutes must be an integer.")
    .min(0, "Grace minutes cannot be negative.")
    .default(10),

  half_day_hours: z
    .string({
      required_error: "Half day hours is required.",
      invalid_type_error: "Half day hours must be a string.",
    }),

  early_leave_threshold_minutes: z
    .number({
      invalid_type_error: "Early leave threshold must be a number.",
    })
    .int("Early leave threshold must be an integer.")
    .min(0, "Early leave threshold cannot be negative.")
    .default(30),

  break_duration_minutes: z
    .number({
      invalid_type_error: "Break duration must be a number.",
    })
    .int("Break duration must be an integer.")
    .min(0, "Break duration cannot be negative.")
    .default(0),
});

export type ShiftType = z.infer<typeof shiftSchema>;