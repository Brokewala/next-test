import Link from 'next/link';
import React from 'react';
import { MdClose } from 'react-icons/md';

import { topNavLinks } from '@/src/data/content';
import Logo from '@/src/shared/Logo/Logo';

export interface NavMobileProps {
  onClickClose?: () => void;
}

const NavMobile: React.FC<NavMobileProps> = ({ onClickClose }) => {
  return (
    <div className="h-screen w-full divide-y divide-neutral-300 overflow-y-auto bg-white py-2 shadow-lg ring-1 transition">
      <div className="px-5 py-2">
        <Logo className="block" />
        <span className="absolute right-2 top-2 p-1" onClick={onClickClose}>
          <MdClose />
        </span>
      </div>
      <ul className="flex flex-col space-y-5 px-5 py-6">
        {topNavLinks.map((item) => (
          <Link href={item.href} onClick={onClickClose} key={item.id} className="capitalize">
            {item.name}
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default NavMobile;
