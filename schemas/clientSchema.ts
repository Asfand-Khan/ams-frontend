import z from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const ClientSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50)
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Name contains forbidden code patterns",
    }),
  igis_client_code: z
    .string()
    .min(10, "IGIS client code is required")
    .max(10, "IGIS client code cannot exceed 10 characters")
    .trim()
    .refine((value) => !forbiddenCodeRegex.test(value), {
      message: "IGIS client code contains forbidden code patterns",
    }),
  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address cannot exceed 200 characters")
    .trim()
    .refine((value) => !forbiddenCodeRegex.test(value), {
      message: "Address contains forbidden code patterns",
    }),
  telephone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .max(15, "Phone number cannot exceed 15 characters")
    .regex(
      /^\+?\d+$/,
      "Phone number must contain only digits and an optional leading +"
    )
    .trim()
    .refine((value) => !forbiddenCodeRegex.test(value), {
      message: "Phone number contains forbidden code patterns",
    }),
  contact_person: z
    .string()
    .min(1, "Contact person is required")
    .max(50)
    .trim()
    .refine((v) => !forbiddenCodeRegex.test(v), {
      message: "Contact person contains forbidden code patterns",
    }),
  branch_id: z.number({
    required_error: "Branch ID is required",
    invalid_type_error: "Branch ID must be a number",
  }),
  client_id: z.number().optional(),
});

export type ClientSchemaType = z.infer<typeof ClientSchema>;
