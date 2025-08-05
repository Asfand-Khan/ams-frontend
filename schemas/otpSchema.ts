import z from "zod";

export const otpSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .trim()
    .toLowerCase(),
  otp: z
    .string({
      required_error: "OTP is required",
    })
    .trim()
    .min(6, { message: "OTP should be 6 digits" })
    .max(6, { message: "OTP should be 6 digits" }),
});

export type OtpSchemaType = z.infer<typeof otpSchema>;
