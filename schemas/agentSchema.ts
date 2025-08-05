import { z } from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

const AgentSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(50)
      .trim()
      .refine((val) => !forbiddenCodeRegex.test(val), {
        message: "Name contains forbidden code patterns",
      }),
    igis_code: z
      .string()
      .min(1, "IGIS code is required")
      .max(10)
      .trim()
      .refine((val) => !forbiddenCodeRegex.test(val), {
        message: "IGIS code contains forbidden code patterns",
      }),
    igis_agent_code: z
      .string()
      .min(1, "IGIS agent code is required")
      .max(10)
      .trim()
      .refine((val) => !forbiddenCodeRegex.test(val), {
        message: "IGIS agent code contains forbidden code patterns",
      }),
    branch_id: z.number({
      required_error: "Branch ID is required",
      invalid_type_error: "Branch ID must be a number",
    }),
    development_officer_id: z.number({
      required_error: "Development Officer ID is required",
      invalid_type_error: "Development Officer ID must be a number",
    }),
    idev_affiliate: z.boolean(),
    idev_id: z
      .number()
      .nullable()
      .optional()
      .transform((val) => (Number.isNaN(val) ? null : val)),
    agent_id: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.idev_affiliate &&
      (data.idev_id === null || data.idev_id === undefined)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["idev_id"],
        message: "IDEV ID is required when affiliate is checked",
      });
    }
  });

export default AgentSchema;
export type AgentSchemaType = z.infer<typeof AgentSchema>;
