import { ScrollArea } from '@/src/components/ui/scroll-area'
import { icons } from '@/src/data/content'
import { CheckIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default function IconChoise({ imageCategory, setimageCategory } : { imageCategory: string, setimageCategory: React.Dispatch<React.SetStateAction<string>> }) {
  return (
    <ScrollArea className='w-full h-[350px] pr-2 mt-6'>
      <div className='w-full flex flex-col gap-4'>
        {icons.map(item => (
          <div key={item.name} className='w-full flex justify-between items-center cursor-pointer' onClick={() => setimageCategory(item.icon)}>
            <div className='flex flex-row gap-4 items-center'>
              <Image 
                src={item.icon}
                alt={`icon-${item.name}`}
                width={25}
                height={25}
              />

              <span className={`${imageCategory === item.icon && 'font-bold text-green-500'}`}>{item.name}</span>
            </div>

            {imageCategory === item.icon &&
              <CheckIcon color="green" className='mr-4' size={16} />
            }
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
