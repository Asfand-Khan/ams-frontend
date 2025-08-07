import z from "zod";

export const assetComplaintRequestSchema = z.object({
  complaint_id: z
    .number({ required_error: "Complaint ID is required" })
    .int("Complaint ID must be an integer")
    .positive("Complaint ID must be a positive number"),

  status: z.enum(["pending", "in_progress", "rejected", "resolved"]),
  remarks: z
    .string({
      required_error: "Remarks is required",
      invalid_type_error: "Remarks must be a string",
    })
    .min(1, { message: "Remarks cannot be empty" }),
});

export type AssetComplaintRequest = z.infer<typeof assetComplaintRequestSchema>;
