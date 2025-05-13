import React from 'react';

import { topNavLinks } from '@/src/data/content';
import NavigationItem from '../NavItem';
import useShopStore from '@/src/lib/store/shopStore';

const TopNav = () => {
  const isLoggedIn = useShopStore((state) => state.isAuthenticated);

  const filteredLinks = topNavLinks.filter(
    (item) => isLoggedIn || (item.name !== 'Commandes' && item.name !== 'Panier')
  );

  return (
    <div className="hidden bg-[#295DAC] py-3 lg:block">
      <div className="container mx-auto flex items-center justify-between text-sm text-white">
        <div className="flex items-center divide-x divide-neutral-100">
          {filteredLinks.map((item) => (
            <NavigationItem menuItem={item} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
