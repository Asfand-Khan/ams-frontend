import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import { Loader } from 'lucide-react'

const LoadingState = () => {
  return (
    <Card className='w-full shadow-none border-none h-full'>
      <CardHeader className='border-b gap-0'>
        <CardTitle>Please wait while we fetch the data...</CardTitle>
      </CardHeader>
      <CardContent className='h-full'>
        <div className="flex justify-center items-center h-full">
          <Loader className='animate-spin size-14 stroke-primary' />
        </div>
      </CardContent>
    </Card>
  )
}

export default LoadingState