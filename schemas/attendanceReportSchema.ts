import { z } from "zod";

export const OverallAttendanceSummaryReportSchema = z.object({
  dateRange: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .refine((data) => data.from && data.to, {
      message: "Both start and end dates are required",
    }),
});

export type OverallAttendanceSummaryReport = z.infer<typeof OverallAttendanceSummaryReportSchema>;