import { z } from "zod";

export const LeaveTypeSchema = z.object({
  name: z.string({
    required_error: "Leave type name is required",
    invalid_type_error: "Leave type name must be a string",
  }),
  total_quota: z
    .number({
      required_error: "Total quota is required",
      invalid_type_error: "Total quota must be a number",
    })
    .int({ message: "Total quota must be an integer" })
    .positive({ message: "Total quota must be a positive number" }),
});

export const EditLeaveTypeSchema = LeaveTypeSchema.extend({
  leave_type_id: z
    .number({ required_error: "Leave type ID is required" })
    .int({ message: "Leave type ID must be an integer" })
    .positive({ message: "Leave type ID must be a positive number" }),
});

export type LeaveTypeType = z.infer<typeof LeaveTypeSchema>;
export type EditLeaveTypeType = z.infer<typeof EditLeaveTypeSchema>;
