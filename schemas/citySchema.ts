import { z } from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const CitySchema = z.object({
  country_id: z.number().min(1, "Country is required"),
  igis_city_code: z
    .string()
    .min(1, "IGIS city code is required")
    .max(50, "IGIS city code should be 50 characters")
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "IGIS city code contains forbidden code patterns",
    }),
  city_name: z
    .string()
    .min(1, "City name is required")
    .max(50)
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "City name contains forbidden code patterns",
    }),
  city_code: z
    .string()
    .min(1, "City code is required")
    .max(50)
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "City code contains forbidden code patterns",
    }),
  priority: z.number().optional(),
  is_tcs: z.boolean().optional(),
  is_blueEx: z.boolean().optional(),
  is_leopard: z.boolean().optional(),
});

export type CitySchemaType = z.infer<typeof CitySchema>;
