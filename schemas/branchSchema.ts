import { z } from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

const BranchSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name cannot exceed 50 characters")
    .trim()
    .refine((value) => !forbiddenCodeRegex.test(value), {
      message: "Name contains forbidden code patterns",
    }),
  igis_branch_code: z
    .string()
    .min(1, "IGIS branch code is required")
    .max(8, "IGIS branch code cannot exceed 8 characters")
    .trim()
    .refine((value) => !forbiddenCodeRegex.test(value), {
      message: "IGIS branch code contains forbidden code patterns",
    }),
  igis_takaful_code: z
    .string()
    .min(1, "IGIS takaful code is required")
    .max(8, "IGIS Takaful Code must be at most 8 characters")
    .trim()
    .refine((value) => !forbiddenCodeRegex.test(value), {
      message: "IGIS takaful code contains forbidden code patterns",
    }),
  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address cannot exceed 200 characters")
    .trim()
    .refine((value) => !forbiddenCodeRegex.test(value), {
      message: "Address contains forbidden code patterns",
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
    .refine((value) => !forbiddenCodeRegex.test(value), {
      message: "Phone number contains forbidden code patterns",
    }),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(100, "Email cannot exceed 100 characters")
    .trim()
    .refine((value) => !forbiddenCodeRegex.test(value), {
      message: "Email contains forbidden code patterns",
    }),
  website: z
    .string()
    .url("Invalid URL format")
    .max(200, "Website URL cannot exceed 200 characters")
    .trim()
    .refine((value) => !forbiddenCodeRegex.test(value), {
      message: "Website URL contains forbidden code patterns",
    }),
  his_code: z
    .string()
    .min(1, "HIS code is required")
    .max(10, "HIS code cannot exceed 10 characters")
    .trim()
    .refine((value) => !forbiddenCodeRegex.test(value), {
      message: "HIS code contains forbidden code patterns",
    }),
  his_code_takaful: z
    .string()
    .min(1, "HIS takaful code is required")
    .max(10, "HIS takaful code cannot exceed 10 characters")
    .trim()
    .refine((value) => !forbiddenCodeRegex.test(value), {
      message: "HIS takaful code contains forbidden code patterns",
    }),
  sales_tax_perc: z
    .string()
    .min(0, "Sales tax percentage cannot be negative")
    .max(100, "Sales tax percentage cannot exceed 100"),
  fed_insurance_fee: z
    .string()
    .min(0, "Federal insurance fee cannot be negative")
    .max(100, "Federal insurance fee cannot exceed 100"),
  stamp_duty: z.number().min(0, "Stamp duty cannot be negative"),
  admin_rate: z
    .string()
    .min(0, "Admin rate cannot be negative")
    .max(100, "Admin rate cannot exceed 100"),
});

export default BranchSchema;

export type BranchSchemaType = z.infer<typeof BranchSchema>;
