import z from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const IgisMakeSchema = z.object({
  make_name: z
    .string()
    .min(1, "Make name is required")
    .max(50)
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Make name contains forbidden code patterns",
    }),
  igis_make_code: z
    .string()
    .min(4, "IGIS make code is required")
    .max(4)
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "IGIS make code contains forbidden code patterns",
    }),
});

export type IgisMakeSchemaType = z.infer<typeof IgisMakeSchema>;
