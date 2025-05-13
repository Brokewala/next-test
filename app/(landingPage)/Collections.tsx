import React from 'react'
import CardCollection from '@/src/components/CardCollection'
import Text from '@/src/components/ui/text'

export default function Collections() {
  return (
    <div className='w-full mt-16 min-h-screen'>
      <section className='m-auto w-[90vw] md:w-[80vw]'>
        <div className="w-full pb-8">
          <Text format='h2' weight="800" className='text-9xl'>Shop collection</Text>
        </div>
        <div className="w-full  grid grid-cols-1 sm:grid-cols-2 gap-5">

          <CardCollection text='Novembre Outfis' url='/' titre='Call your friends' img='/landingpage/pexels-lucas-toyes-706110023-18398399.jpg' />
          <CardCollection text='Novembre Outfis' url='/' titre='Buy Now' img='/landingpage/pexels-shkrabaanthony-6207729.jpg' />
          <CardCollection text='Novembre Outfis' url='/' titre='Chose your collection' img='/landingpage/pexels-cottonbro-6068969.jpg' />
          <CardCollection text='Novembre Outfis' url='/' titre='Buy it now' img='/landingpage/pexels-thirdman-8484204.jpg' />
        </div>
      </section>
    </div>
  )
}
