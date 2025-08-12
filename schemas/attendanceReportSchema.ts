import z from "zod";

export const OverallAttendanceSummaryReportSchema = z.object({
  start_date: z.date({ required_error: "Start date is required" }),
  end_date: z.date({ required_error: "End date is required" }),
});

export type OverallAttendanceSummaryReport = z.infer<typeof OverallAttendanceSummaryReportSchema>;