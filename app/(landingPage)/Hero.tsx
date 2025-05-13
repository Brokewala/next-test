import shoe_box from '@/public/shoe_box.png'
import { headerSection } from '@/src/data/content'
import ButtonPrimary from '@/src/shared/Button/ButtonPrimary'
import Image from 'next/image'

export default function Hero() {
    return (
        <div className="w-full h-fit flex flex-col justify-center items-center">
            <div className="container items-stretch gap-y-5 lg:flex lg:gap-5 lg:gap-y-0 p-6">
                <div className="basis-[100%] items-center space-y-10 rounded-2xl bg-gray-200 p-8 md:flex md:space-y-0 ">
                    <div className="basis-[63%]">
                        <h4 className="mb-5 text-md md:text-xl font-medium text-primary">
                            {headerSection.title}
                        </h4>
                        <h1
                            className="text-2xl md:text-3xl lg:text-[50px] font-medium tracking-tight"
                            style={{ lineHeight: '1.5em' }}
                        >
                            {headerSection.heading}
                        </h1>
                        <p className="my-10 w-[80%] text-neutral-500 leading-relaxed">
                            {headerSection.description}
                        </p>
                        <ButtonPrimary sizeClass="px-5 py-2 rounded-md" href='/nos-produits'>Voir les produits</ButtonPrimary>
                    </div>
                    <div className="basis-[37%]">
                        <Image src={shoe_box} width={200} height={200} alt="shoe box" className="w-full" />
                    </div>
                </div>

                {/* <div className="mt-5 basis-[30%] lg:mt-0">
                    <div className='relative h-full space-y-10 rounded-2xl bg-primary bg-[url("/bgPromo.png")] bg-cover bg-center bg-no-repeat p-5 text-white'>
                        <h1 className="text-[40px] font-medium" style={{ lineHeight: '1em' }}>
                            {promotionTag.heading}
                        </h1>
                        <p className="w-[90%]">{promotionTag.description}</p>
                    </div>
                </div> */}
            </div>
        </div>
    )
}
