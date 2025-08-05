import OtpForm from "@/components/ui/auth/otp-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'OTP | Orio Attendance',
  description: 'Enter the OTP sent to your registered email to verify your identity and access your account.',
}
const page = () => {
  return (
    <OtpForm />
  )
}

export default page