import z from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const DevelopmentOfficerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50)
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Name contains forbidden code patterns",
    }),
  branch_id: z.number({
    required_error: "Branch ID is required",
    invalid_type_error: "Branch ID must be a number",
  }),
  igis_do_code: z
    .string()
    .min(8, "IGIS DO code is required")
    .max(8, "IGIS DO code cannot exceed 8 characters")
    .trim()
    .refine((value) => !forbiddenCodeRegex.test(value), {
      message: "IGIS DO code contains forbidden code patterns",
    }),
  igis_code: z
    .string()
    .min(10, "IGIS code is required")
    .max(10, "IGIS code cannot exceed 10 characters")
    .trim()
    .refine((value) => !forbiddenCodeRegex.test(value), {
      message: "IGIS code contains forbidden code patterns",
    }),
  do_id: z.number().optional(),
});

export type DevelopmentOfficerSchemaType = z.infer<
  typeof DevelopmentOfficerSchema
>;
