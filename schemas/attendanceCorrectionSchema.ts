import z from "zod";
// Regular expressions for validation
export const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
export const timeRegex = /^\d{2}:\d{2}:\d{2}$/;

// Utility to validate past or today dates
export const isValidPastOrTodayDate = (date: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(date);
  return inputDate <= today;
};
export const attendanceCorrectionApproveRejectSchema = z.object({
  attendance_correction_id: z
    .number({ required_error: "Attendance correction ID is required" })
    .int("Attendance correction ID must be an integer")
    .positive("Attendance correction ID must be a positive number"),

  employee_id: z
    .number({ required_error: "Employee ID is required" })
    .int("Employee ID must be an integer")
    .positive("Employee ID must be a positive number"),

  status: z.enum(["pending", "rejected", "approved"]),

  remarks: z
    .string({
      required_error: "Remarks is required",
      invalid_type_error: "Remarks must be a string",
    })
    .min(1, { message: "Remarks cannot be empty" }),
});
// Schema for creating attendance corrections
export const attendanceCorrectionCreateSchema = z.object({
  employee_id: z
    .number({ required_error: "Employee ID is required" })
    .int("Employee ID must be an integer")
    .positive("Employee ID must be a positive number"),

  attendance_date: z
    .string({ required_error: "Attendance date is required" })
    .regex(dateRegex, "Attendance date must be in YYYY-MM-DD format")
    .refine(isValidPastOrTodayDate, "Attendance date cannot be in the future"),

  request_type: z.enum(
    ["missed_check_in", "missed_check_out", "wrong_time", "both", "work_from_home"],
    {
      required_error: "Request type is required",
    }
  ),

  reason: z
    .string({
      required_error: "Reason is required",
      invalid_type_error: "Reason must be a string",
    })
    .min(1, "Reason cannot be empty")
    .max(500, "Reason cannot exceed 500 characters"),

  requested_check_in_time: z
    .string()
    .regex(timeRegex, "Requested check-in time must be in HH:mm:ss format")
    .nullable()
    .optional(),

  requested_check_out_time: z
    .string()
    .regex(timeRegex, "Requested check-out time must be in HH:mm:ss format")
    .nullable()
    .optional(),
}).superRefine((data, ctx) => {
  // Conditional validation based on request_type
  if (data.request_type === "missed_check_in" && !data.requested_check_in_time) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["requested_check_in_time"],
      message: "Requested check-in time is required for 'missed_check_in' request type",
    });
  }
  if (data.request_type === "missed_check_out" && !data.requested_check_out_time) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["requested_check_out_time"],
      message: "Requested check-out time is required for 'missed_check_out' request type",
    });
  }
  if (["wrong_time", "both"].includes(data.request_type)) {
    if (!data.requested_check_in_time) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["requested_check_in_time"],
        message: "Requested check-in time is required for 'wrong_time' or 'both' request types",
      });
    }
    if (!data.requested_check_out_time) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["requested_check_out_time"],
        message: "Requested check-out time is required for 'wrong_time' or 'both' request types",
      });
    }
  }
});
export type AttendanceCorrectionApproveReject = z.infer<
  typeof attendanceCorrectionApproveRejectSchema
>;
export type AttendanceCorrectionCreateSchemaType = z.infer<
  typeof attendanceCorrectionCreateSchema
>;