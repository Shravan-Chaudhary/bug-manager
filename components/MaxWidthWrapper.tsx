import { cn } from '@/lib/utils'
import React from 'react'

interface Props {
  className?: string
  children: React.ReactNode
}

const MaxWidthWrapper = ({ className, children }: Props) => {
  return <div className={cn('mx-auto w-full max-w-screen-2xl px-2.5 md:px-20', className)}>{children}</div>
}

export default MaxWidthWrapper
