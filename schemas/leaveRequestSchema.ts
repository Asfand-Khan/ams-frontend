import z from "zod";

export const leaveRequestApproveRejectSchema = z.object({
  leave_id: z
    .number({ required_error: "Leave ID is required" })
    .int("Leave ID must be an integer")
    .positive("Leave ID must be a positive number"),

  employee_id: z
    .number({ required_error: "Employee ID is required" })
    .int("Employee ID must be an integer")
    .positive("Employee ID must be a positive number"),

  leave_type_id: z
    .number({ required_error: "Leave Type ID is required" })
    .int("Leave Type ID must be an integer")
    .positive("Leave Type ID must be a positive number"),

  status: z.enum(["pending", "rejected", "approved"]),

  remarks: z
    .string({
      required_error: "Remarks is required",
      invalid_type_error: "Remarks must be a string",
    })
    .min(1, { message: "Remarks cannot be empty" }),
});

export type LeaveRequestApproveReject = z.infer<typeof leaveRequestApproveRejectSchema>;
