import { Metadata } from 'next'
import LoginForm from '@/components/ui/auth/login-form'

export const metadata: Metadata = {
  title: 'Login | Orio Attendance',
  description: 'Login to your Jubilee Retail account to access exclusive features and manage your profile.',
}

const page = () => {
  return (
    <LoginForm />
  )
}

export default page