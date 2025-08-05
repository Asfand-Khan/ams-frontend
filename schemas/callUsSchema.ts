import z from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const CallUsSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50)
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Name contains forbidden code patterns",
    }),
  contact: z
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
  email: z
    .string({
      invalid_type_error: "Email must be a string",
      required_error: "Email is required",
    })
    .email()
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
});

export type CallUsSchemaType = z.infer<typeof CallUsSchema>;
