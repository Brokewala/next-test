"use client"

import Link from 'next/link'
import React from 'react'


type CardProps = {
  img: string;
  titre: string;
  url: string;
  text: string;

}


export default function CardCollection({img,titre,url,text}: CardProps) {
  return (
    <div className={'  min-w-72 h-96  bg-cover bg-center'} style={{backgroundImage: `url(${img})`}}>
      <div className="w-full h-full  bg-[#00000062] flex flex-col">

        <div className="w-full h-full flex-[2]"></div>
        {/* footer */}
        <div className="flex-1 p-4">
            <h1 className='text-white text-2xl font-medium'>{titre}</h1>
            <Link className='text-xs underline text-white ' href={url} >{text}</Link>
        </div>
      </div>
    </div>
  )
}
