'use client';

import ButtonCircle3 from '@/src/shared/Button/ButtonCircle3';
import ButtonSecondary from '@/src/shared/Button/ButtonSecondary';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaBagShopping } from 'react-icons/fa6';
import { MdClose } from 'react-icons/md';
import ButtonNavigate from '../lib/buttonNavigate';
import { ProduitType } from '../lib/queryClient';
import useShopStore from '../lib/store/shopStore';
import InputNumber from '../shared/InputNumber/InputNumber';

// export interface CartSideBarProps {}
const CartSideBar = () => {
  const isLoggedIn = useShopStore((state) => state.isAuthenticated);
  const cart = useShopStore((state) => state.cart);

  const somme: Array<number> = [];

  const [isVisable, setIsVisable] = useState(false);

  const handleOpenMenu = () => setIsVisable(true);
  const handleCloseMenu = () => setIsVisable(false);

  const removeFromCart = useShopStore((state) => state.removeFromCart);

  const renderProduct = (item: ProduitType, quantite: number) => {
    const { nom, prix, id, image } = item;


    somme.push(prix * quantite);

    return (
      <div key={nom} className="flex py-5 last:pb-0">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl" style={{ background: `url(${image})` }}>
          <Image
            fill
            src={image[0]}
            alt={nom}
            className="h-full w-full object-contain object-center"
          />
          <Link
            onClick={handleCloseMenu}
            className="absolute inset-0"
            href={`/nos-produits/${id}`}
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col justify-between">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="font-medium ">
                  <Link onClick={handleCloseMenu} href={`/nos-produits/${id}`}>
                    {nom}
                  </Link>
                </h3>
                {/* <span className="my-1 text-sm text-neutral-500">
                  {shoeCategory}
                </span> */}
                {/* <div className="flex items-center gap-1">
                  <MdStar className="text-yellow-400" />
                  <span className="text-sm">{rating}</span>
                </div> */}
              </div>
              <span className=" font-medium">${prix}</span>
            </div>
          </div>
          <div className="flex w-full items-end justify-between text-sm">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => removeFromCart(id)}>
              {/* <LikeButton /> */}
              <AiOutlineDelete className="text-2xl" color="red" />
            </div>
            <div>
              <InputNumber defaultValue={quantite} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <Transition appear show={isVisable} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={handleCloseMenu}
        >
          {/* Backdrop overlay */}
          <Transition.Child
            as={Fragment}
            enter="duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-neutral-900/60" aria-hidden="true" />
          </Transition.Child>

          <div className="z-max fixed inset-y-0 right-0 w-full max-w-md outline-none focus:outline-none md:max-w-md">
            <Transition.Child
              as={Fragment}
              enter="transition duration-100 transform"
              enterFrom="opacity-0 translate-x-full"
              enterTo="opacity-100 translate-x-0"
              leave="transition duration-150 transform"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="opacity-0 translate-x-full"
            >
              <div className="relative z-20">
                <div className="overflow-hidden shadow-lg ring-1 ring-black/5">
                  <div className="relative h-screen bg-white">
                    <div className="hiddenScrollbar h-screen overflow-y-auto p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">Shopping cart</h3>
                        <ButtonCircle3 onClick={handleCloseMenu}>
                          <MdClose className="text-2xl" />
                        </ButtonCircle3>
                      </div>

                      {isLoggedIn ? (
                        <div className="min-h-[50vh] overflow-y-auto divide-y divide-neutral-300 mt-6">
                          {cart.map((item) => item.items.map((produit => renderProduct(produit.produit, produit.quantite))))}
                        </div>
                      )
                        :
                        (
                          <div className="w-full h-48 flex items-center justify-center">
                            <div className="w-full flex flex-row gap-2">
                              <ButtonNavigate path='/sign-in' className='w-1/2'>
                                <div className='py-2 px-4 text-white rounded-md border border-cyan-600 bg-cyan-600 text-center'>
                                  S&apos;inscrire
                                </div>
                              </ButtonNavigate>
                              <ButtonNavigate path='/login' className='w-1/2'>
                                <div className='py-2 px-4 text-cyan-600 rounded-md border border-cyan-600 text-center'>
                                  Se connecter
                                </div>
                              </ButtonNavigate>
                            </div>
                          </div>
                        )
                      }
                    </div>
                    {isLoggedIn && (
                      <div className="absolute bottom-0 left-0 w-full bg-neutral-50 p-5">
                        <p className="flex justify-between">
                          <span>
                            <span className="font-medium">Total</span>
                            {/* <span className="block text-sm text-neutral-500">
                              Shipping and taxes calculated at checkout.
                            </span> */}
                          </span>
                          <span className="text-xl font-medium">{somme.reduce((a, b) => a + b, 0)} KMF</span>
                        </p>
                        <div className="mt-5 flex items-center gap-5">
                          {/* <ButtonPrimary
                            href="/checkout"
                            onClick={handleCloseMenu}
                            className="w-full flex-1"
                          >
                            Checkout
                          </ButtonPrimary> */}
                          <ButtonSecondary
                            onClick={handleCloseMenu}
                            href="/panier"
                            className="w-full flex-1 border-2 py-3 border-primary text-primary hover:bg-primary hover:text-secondary"
                          >
                            Voir panier
                          </ButtonSecondary>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  };

  return (
    <div className="flex flex-row gap-4 items-center">
      {/* {isLoggedIn &&
        <Link href="/commande" className="hidden md:block">Mes commandes</Link>
      } */}
      <button
        type="button"
        onClick={handleOpenMenu}
        className="mx-5 flex items-center gap-1 rounded-full bg-neutral-100 p-2 text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        <FaBagShopping className="text-2xl" />
        {isLoggedIn &&
          <span className="hidden text-sm lg:block px-2">{cart[0]?.items ? cart[0]?.items.length : "0"}</span>
        }
      </button>

      {renderContent()}
    </div>
  );
};

export default CartSideBar;
