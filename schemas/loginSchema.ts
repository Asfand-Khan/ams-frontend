import z from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const loginSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .trim()
    .min(3, { message: "Username should be at least 3 characters" })
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(8, { message: "Password should be at least 8 characters" })
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
