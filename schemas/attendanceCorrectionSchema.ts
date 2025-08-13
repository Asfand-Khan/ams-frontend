import z from "zod";

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

export type AttendanceCorrectionApproveReject = z.infer<
  typeof attendanceCorrectionApproveRejectSchema
>;
