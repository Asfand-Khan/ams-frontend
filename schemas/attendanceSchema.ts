import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const AttendanceSchema = z.object({
  employee_id: z
    .number({ message: "Employee ID is required" })
    .int({ message: "Employee ID must be an integer" })
    .positive({ message: "Employee ID must be a positive number" }),

  attendance_date: z.date({ required_error: "Attendance date is required" }),

  check_in_time: z
    .date({ required_error: "Check-in time is required" })
    .refine((value) => value.getTime().toString())
    .nullable()
    .optional(),

  check_out_time: z
    .date({ required_error: "Check-out time is required" })
    .refine((value) => value.getTime().toString())
    .nullable()
    .optional(),
});

export const AttendanceHistorySchema = z.object({
  employee_id: z
    .number({ message: "Employee ID is required" })
    .int({ message: "Employee ID must be an integer" })
    .positive({ message: "Employee ID must be a positive number" }),
  dateRange: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .refine((data) => data.from && data.to, {
      message: "Both start and end dates are required",
    }),
});

export type AttendanceSchemaType = z.infer<typeof AttendanceSchema>;
export type AttendanceHistoryType = z.infer<typeof AttendanceHistorySchema>;
