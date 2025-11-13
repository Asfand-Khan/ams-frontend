import z from "zod";
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

const isValidPastOrTodayDate = (dateStr: string): boolean => {
  const inputDate = new Date(dateStr);
  const today = new Date();

  // Set both dates to start of day (ignore time for pure date comparison)
  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return inputDate <= today;
};

// ---- helpers ------------------------------------------------------------
const parseTime = (t: string) => {
  // "HH:mm:ss"  →  minutes since midnight
  const [h, m, s] = t.split(":").map(Number);
  return h * 60 + m + s / 60;
};

const isCheckInBeforeCheckOut = (cin?: string, cout?: string): boolean => {
  if (!cin || !cout) return true; // let Zod handle required fields
  return parseTime(cin) < parseTime(cout);
};

export const attendanceCorrectionApproveRejectSchema = z.object({
  attendance_correction_id: z
    .number({ required_error: "Attendance correction ID is required" })
    .int("Attendance correction ID must be an integer")
    .positive("Attendance correction ID must be a positive number"),

  employee_id: z
    .number({ required_error: "Employee ID is required" })
    .int("Employee ID must be an integer")
    .positive("Employee ID must be a positive number"),

  status: z.enum(["pending", "rejected", "approved"]),

  remarks: z
    .string({
      required_error: "Remarks is required",
      invalid_type_error: "Remarks must be a string",
    })
    .min(1, { message: "Remarks cannot be empty" }),
});
// Schema for creating attendance corrections
/* ---------- CREATE SCHEMA ---------- */
export const attendanceCorrectionCreateSchema = z
  .object({
    employee_id: z
      .number({ required_error: "Employee ID is required" })
      .int("Employee ID must be an integer")
      .positive("Employee ID must be a positive number"),

    attendance_date: z
      .string({ required_error: "Attendance date is required" })
      .regex(dateRegex, "Attendance date must be in YYYY-MM-DD format")
      .refine(isValidPastOrTodayDate, "Attendance date cannot be in the future"),

    request_type: z.enum(
      ["missed_check_in", "missed_check_out", "wrong_time", "both", "work_from_home"],
      { required_error: "Request type is required" }
    ),

    reason: z
      .string({ required_error: "Reason is required" })
      .min(1, "Reason cannot be empty")
      .max(500, "Reason cannot exceed 500 characters"),

    /* ---------- TIME FIELDS – FIXED ---------- */
    requested_check_in_time: z
      .string()
      .optional()
      .refine(
        (v) => !v || timeRegex.test(v),
        "Requested check-in time must be in HH:mm:ss format"
      ),

    requested_check_out_time: z
      .string()
      .optional()
      .refine(
        (v) => !v || timeRegex.test(v),
        "Requested check-out time must be in HH:mm:ss format"
      ),
  })
  .superRefine((data, ctx) => {
    /* ---- Conditional required fields ---- */
    if (data.request_type === "missed_check_in" && !data.requested_check_in_time) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["requested_check_in_time"],
        message: "Check-in time is required for 'missed_check_in'",
      });
    }

    if (data.request_type === "missed_check_out" && !data.requested_check_out_time) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["requested_check_out_time"],
        message: "Check-out time is required for 'missed_check_out'",
      });
    }

    if (["wrong_time", "both", "work_from_home"].includes(data.request_type)) {
      if (!data.requested_check_in_time) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["requested_check_in_time"],
          message: "Check-in time is required",
        });
      }
      if (!data.requested_check_out_time) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["requested_check_out_time"],
          message: "Check-out time is required",
        });
      }
    }

    /* ---- Check-in < Check-out ---- */
    if (
      data.requested_check_in_time &&
      data.requested_check_out_time &&
      !isCheckInBeforeCheckOut(data.requested_check_in_time, data.requested_check_out_time)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["requested_check_in_time"], // error shown under Check-In
        message: "Check-in time must be earlier than check-out time",
      });
    }
  });
export type AttendanceCorrectionApproveReject = z.infer<
  typeof attendanceCorrectionApproveRejectSchema
>;
export type AttendanceCorrectionCreateSchemaType = z.infer<
  typeof attendanceCorrectionCreateSchema
>;
