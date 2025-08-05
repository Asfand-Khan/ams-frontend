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

export const AddUserSchema = z.object({
  username: z
    .string({ invalid_type_error: "Username must be a string" })
    .trim()
    .min(3, { message: "Username cannot be empty" })
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  fullname: z
    .string({ invalid_type_error: "Fullname must be a string" })
    .trim()
    .min(3, { message: "Fullname cannot be empty" })
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  phone: z
    .string()
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
    .string({ required_error: "User type is required" })
    .refine((val) => ["api_user", "dashboard_user"].includes(val), {
      message: "User type must be either 'Api User' or 'Dashboard User'",
    }),
  is_active: z.boolean({ required_error: "Status is required" }),
  created_by: z.number({ invalid_type_error: "Created by must be a number" }),
  menu_rights: menu_rights.array(),
});
export type AddUserSchemaType = z.infer<typeof AddUserSchema>;

export const EditUserSchema = z.object({
  username: z
    .string({ invalid_type_error: "Username must be a string" })
    .trim()
    .min(3, { message: "Username cannot be empty" })
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  fullname: z
    .string({ invalid_type_error: "Fullname must be a string" })
    .trim()
    .min(3, { message: "Fullname cannot be empty" })
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  phone: z
    .string({ invalid_type_error: "Phone must be a string" })
    .regex(/^03[0-4][0-9]{8}$/, {
      message: "Phone must be a valid Pakistani phone number",
    })
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
    })
    .optional()
    .or(z.literal("")),
  image: z.string().optional(),
  user_type:  z.string({ required_error: "User type is required" }),
  is_active: z.boolean({ required_error: "Status is required" }),
  menu_rights: menu_rights.array(),
  user_id: z.number().optional(),
});
export type EditUserSchemaType = z.infer<typeof EditUserSchema>;
