import z from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const BusinessRegionSchema = z.object({
  business_region_name: z
    .string()
    .min(1, "Business region name is required")
    .max(50)
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Business region name contains forbidden code patterns",
    }),
  igis_business_region_code: z
    .string()
    .min(4, "Igis business region code is required")
    .max(4, "Igis business region code must be 4 characters")
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Igis business region code contains forbidden code patterns",
    }),
});

export type BusinessRegionSchemaType = z.infer<typeof BusinessRegionSchema>;
