import z from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const IgisSubMakeSchema = z.object({
  make_id: z
    .number({
      required_error: "Make name is required",
      invalid_type_error: "Make name must be a number",
    })
    .min(0, "Make id cannot be negative"),
  sub_make_name: z
    .string()
    .min(1, "Sub make name is required")
    .max(50)
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Sub make name contains forbidden code patterns",
    }),
  igis_sub_make_code: z
    .string()
    .min(4, "IGIS sub make code is required")
    .max(4, "IGIS sub make code should be 4 characters")
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "IGIS sub make code contains forbidden code patterns",
    }),
  seating_capacity: z
    .number({
      required_error: "Seating Capacity is required",
      invalid_type_error: "Seating Capacity must be a number",
    })
    .min(0, "Seating capacity cannot be negative"),
  cubic_capacity: z
    .string()
    .min(1, { message: "Cubic capacity is required" })
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Cubic capacity contains forbidden code patterns",
    }),
  coi_type_code: z
    .string()
    .min(1, { message: "COI type code is required" })
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "COI type code contains forbidden code patterns",
    }),
});

export type IgisSubMakeSchemaType = z.infer<typeof IgisSubMakeSchema>;
