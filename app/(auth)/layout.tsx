import { ReactNode } from 'react'
import Image from 'next/image'

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="grid min-h-svh lg:grid-cols-5">
        <div className="relative hidden lg:block lg:col-span-3">
          <Image
            src="/images/Orio-Connect-Login-Screen_1.jpg"
            className="object-cover"
            alt="Image"
            fill
            priority
          />
        </div>
        <div className="flex flex-col md:p-10 flex-1 items-center justify-center gap-4 p-6 lg:col-span-2">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={130}
            height={60}
            priority
          />
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>

    </>
  )
}

export default AuthLayout