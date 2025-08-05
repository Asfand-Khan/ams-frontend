import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'

const Error = ({ err }: { err: string | undefined }) => {
  return (
    <Card className='w-full shadow-none border-none h-full'>
      <CardHeader className='border-b gap-0'>
        <CardTitle>Failed</CardTitle>
      </CardHeader>
      <CardContent className='flex justify-center items-center h-full'>
       <h6>{err || "An unexpected error occurred"}</h6>
      </CardContent>
    </Card>
  )
}

export default Error