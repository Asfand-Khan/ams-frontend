import z from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const menu_rights = z.object({
  menu_id: z.number({ invalid_type_error: "Menu ID must be a number" }),
  can_view: z.boolean(),
  can_create: z.boolean(),
  can_edit: z.boolean(),
  can_delete: z.boolean(),
});

export const UserSchema = z.object({
  username: z
    .string({
      invalid_type_error: "Username must be a string",
      required_error: "Username is required",
    })
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username cannot exceed 20 characters" })
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  fullname: z
    .string({
      invalid_type_error: "Fullname must be a string",
      required_error: "Fullname is required",
    })
    .min(3, { message: "Email must be at least 3 characters" })
    .max(20, { message: "Email cannot exceed 20 characters" })
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
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
  phone: z
    .string({
      invalid_type_error: "Phone must be a string",
      required_error: "Phone is required",
    })
    .min(11, "Phone number must be at least 11 digits")
    .max(15, "Phone number cannot exceed 15 characters")
    .regex(
      /^\+?\d+$/,
      "Phone number must contain only digits and an optional leading +"
    )
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[!@#$%^&*]/, {
      message: "Password must contain at least one special character",
    })
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  image: z.string().optional(),
  user_type: z
    .string({
      invalid_type_error: "User type must be a string",
      required_error: "User type is required",
    })
    .min(1, { message: "User type is required" }),
  is_active: z.boolean({ message: "Status is required" }),
  menu_rights: menu_rights.array(),
});

export type UserSchemaType = z.infer<typeof UserSchema>;
