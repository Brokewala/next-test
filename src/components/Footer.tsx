"use client";

import Link from 'next/link';
import React from 'react';

import { footerBannerData, footerData } from '@/src/data/content';

import Logo from '@/src/shared/Logo/Logo';
import ButtonPrimary from '../shared/Button/ButtonPrimary';
import Heading from '../shared/Heading/Heading';

const Footer: React.FC = () => {
    return (
        <div className='w-full'>
            <div className="container mx-auto mb-6 px-6">
                <div className="bg-[url('/bgProducts.jpg')] bg-cover bg-center bg-no-repeat py-16 text-white">
                    <Heading className="mb-0" isMain isCenter>
                        {footerBannerData.heading}
                    </Heading>
                    <p className="mx-auto w-[80%] text-center md:w-[50%]">
                        {footerBannerData.description}
                    </p>
                    <div className="mt-10 flex items-center justify-center">
                        <ButtonPrimary sizeClass="px-6 py-2" className='rounded-none' href='/nos-produits'>Voir nos produits</ButtonPrimary>
                    </div>
                </div>
            </div>

            <div className="bg-[#295DAC] text-white container mx-auto px-8">
                <div className="container mx-auto grid gap-10 py-16 lg:grid-cols-2 lg:gap-0">
                    <div className="space-y-10 md:pr-20">
                        <Logo className="block" />
                        <p className="leading-relaxed text-justify">{footerData.description}</p>
                        {/* <div className="items-stretch justify-between space-y-5 rounded-2xl bg-white/10 p-5 md:flex md:space-y-0">
                            <div className="basis-[52%] space-y-5">
                                <h3 className="text-2xl font-medium">{newsletter.heading}</h3>
                                <Input
                                    type="text"
                                    sizeClass="h-12 px-0 py-3"
                                    rounded="rounded-none"
                                    className="border-b-2 border-transparent border-b-neutral-400 bg-transparent placeholder:text-sm placeholder:text-neutral-200 focus:border-transparent"
                                    placeholder="Your email@email.com"
                                />
                            </div>
                            <div className="basis-[43%] space-y-7">
                                <p className="text-neutral-400">{newsletter.description}</p>
                                <ButtonPrimary>Subscribe</ButtonPrimary>
                            </div>
                        </div> */}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:grid-cols-3">
                        <div className="space-y-5">
                            <h4 className="text-2xl font-medium">
                                {footerData.footerLinks[0]?.title}
                            </h4>
                            {footerData.footerLinks[0]?.links.map((link) => (
                                <div key={link.name}>
                                    <Link href={link.href}>{link.name}</Link>
                                </div>
                            ))}
                        </div>
                        <div className='hidden lg:block w-full md:w-auto'>
                            <div className="grid gap-5">
                                {footerData.footerLinks.slice(1, 3).map((item) => (
                                    <div key={item.title} className="space-y-5">
                                        <h4 className="text-2xl font-medium">{item.title}</h4>
                                        {item.links.map((link) => (
                                            <div key={link.name}>
                                                <Link href={link.href}>{link.name}</Link>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-5 hidden lg:block">
                            <h4 className="text-2xl font-medium">
                                {footerData.footerLinks[3]?.title}
                            </h4>
                            {footerData.footerLinks[3]?.links.map((link) => (
                                <div key={link.name}>
                                    <Link href={link.href}>{link.name}</Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;


{/* <Link href={"/"}>Acceuil</Link>
                        <Link href={"/"}>Nos produits</Link>
                        {isLoggedIn && <Link href="/commande">Mes commandes</Link> } */}