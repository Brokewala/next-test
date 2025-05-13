import { Skeleton } from '@/src/components/ui/skeleton'
import React from 'react'

export default function ProductSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="w-full h-52 rounded-xl bg-zinc-100" />
      <Skeleton className="w-1/2 h-4 mt-3 bg-zinc-200" />
    </div>
  )
}
