import z from "zod";

export const genderEnum = z.enum(["male", "female"], {
  required_error: "Gender is required",
  invalid_type_error: "Gender must be either 'male' or 'female'",
});

export const statusEnum = z.enum(["active", "inactive", "terminated"], {
  required_error: "Status is required",
  invalid_type_error: "Status must be 'active', 'inactive', or 'terminated'",
});

export const empTypeEnum = z.enum(
  ["employee", "manager", "admin", "hr", "lead"],
  {
    required_error: "Employee type is required",
    invalid_type_error:
      "Employee type must be 'employee', 'manager', admin, hr or 'lead'",
  }
);

export const employeeSchema = z.object({
  employee_code: z
    .string({ required_error: "Employee code is required" })
    .length(4, "Employee code must be at exactly 4 characters length"),

  username: z
    .string({ required_error: "Username is required" })
    .min(3, "Username must be at least 3 characters")
    .max(100, "Username must be at most 100 characters")
    .toLowerCase(),

  full_name: z
    .string({ required_error: "Full name is required" })
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name must be at most 100 characters"),

  fathername: z
    .string({ required_error: "Father name is required" })
    .min(3, "Father name must be at least 3 characters")
    .max(100, "Father name must be at most 100 characters")
    .optional()
    .nullable(),

  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .max(100, "Email must be at most 100 characters")
    .toLowerCase(),

  emp_type: empTypeEnum.default("employee"),

  phone: z
    .string()
    .startsWith("03", "Phone number must start with '03'")
    .length(
      11,
      "Phone number must be at exactly 11 characters i.e: 03XXXXXXXXXX"
    )
    .or(z.literal("").transform(() => undefined)),

  cnic: z
    .string()
    .regex(/^\d{5}-\d{7}-\d$/, "CNIC must be in the format 12345-1234567-1")
    .length(15, "CNIC must be at exactly 15 characters")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  gender: genderEnum,

  dob: z
    .date({ invalid_type_error: "Date of birth must be a valid date" })
    .optional(),

  join_date: z.date({
    required_error: "Join date is required",
    invalid_type_error: "Join date must be a valid date",
  }),

  leave_date: z
    .date({ invalid_type_error: "Join date must be a valid date" })
    .optional(),

  department_id: z
    .number({ required_error: "Department ID is required" })
    .int("Department ID must be an integer"),

  designation_id: z
    .number({ required_error: "Designation ID is required" })
    .int("Designation ID must be an integer"),

  shift_id: z
    .number({ required_error: "Shift ID is required" })
    .int("Shift ID must be an integer"),

  team_id: z
    .number({ required_error: "Team ID is required" })
    .int("Team ID must be an integer"),

  profile_picture: z
    .string()
    .max(255, "Profile picture URL is too long")
    .optional(),

  address: z.string().max(1000, "Address must be at most 1000 characters"),

  status: statusEnum.default("active"),

  menu_rights: z
    .array(
      z.object({
        menu_id: z.number({
          required_error: "Menu ID is required",
        }),
        can_view: z
          .boolean({
            required_error: "Can view is required",
          })
          .default(true),
        can_create: z
          .boolean({
            required_error: "Can create is required",
          })
          .default(false),
        can_edit: z
          .boolean({
            required_error: "Can edit is required",
          })
          .default(false),
        can_delete: z
          .boolean({
            required_error: "Can delete is required",
          })
          .default(false),
      }),
      { required_error: "Menu rights are required" }
    )
    .nullable()
    .optional(),
});

export type Employee = z.infer<typeof employeeSchema>;
