import React from 'react'
import Header from '../components/Header/Header'
import { ScrollArea } from '../components/ui/scroll-area'
import Footer from '../components/Footer'

export function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen h-screen flex flex-col bg-emerald-50/5">
      <Header />
      <ScrollArea>
        <div className='w-full flex flex-col gap-12'>
          {children}
        </div>
        <div className="mt-24">
          <Footer />
        </div>
      </ScrollArea>
    </div>
  )
}