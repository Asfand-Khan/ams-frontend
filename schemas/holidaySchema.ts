import { z } from "zod";

export const holidaySchema = z.object({
  holiday_date: z
    .string({
      required_error: "Holiday date is required.",
      invalid_type_error:
        "Holiday date must be a valid date string (YYYY-MM-DD).",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Holiday date must be a valid date (e.g., 2025-12-25).",
    }),

  title: z
    .string({
      required_error: "Title is required.",
      invalid_type_error: "Title must be a string.",
    })
    .min(1, "Title cannot be empty.")
    .max(100, "Title must be at most 100 characters long."),

  description: z
    .string({
      invalid_type_error: "Description must be a string.",
    })
    .optional(),
});

export type HolidayType = z.infer<typeof holidaySchema>;