import React from 'react';

import { footerBannerData } from '@/src/data/content';
import Heading from '@/src/shared/Heading/Heading';

import ButtonPrimary from '../Button/ButtonPrimary';

const FooterBanner = () => {
  return (
    <div className="rounded-2xl bg-[url('/bgProducts.jpg')] bg-cover bg-center bg-no-repeat py-16 text-white">
      <Heading className="mb-0 uppercase" isMain isCenter>
        {footerBannerData.heading}
      </Heading>
      <p className="mx-auto w-[80%] text-center md:w-[50%]">
        {footerBannerData.description}
      </p>
      <div className="mt-10 flex items-center justify-center">
        <ButtonPrimary sizeClass="px-6 py-2" href='/nos-produits'>Voir nos produits</ButtonPrimary>
      </div>
    </div>
  );
};

export default FooterBanner;
