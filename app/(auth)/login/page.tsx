import { Metadata } from 'next'
import LoginForm from '@/components/ui/auth/login-form'

export const metadata: Metadata = {
  title: 'Login | Orio Attendance',
  description: 'A comprehensive workforce management platform designed to manage employees, attendance, leave, shifts, teams, assets, and meetings with efficiency and control..',
}

const page = () => {
  return (
    <LoginForm />
  )
}

export default page