"use client"

import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import ButtonNavigate from '../lib/buttonNavigate'
import { useGetMyPanier } from '../lib/requests/userPanierRequest'
import { deleteSession } from '../lib/session'
import useShopStore from '../lib/store/shopStore'
import { Badge } from './ui/badge'
import Text from './ui/text'

export function MenuClient() {
  const isLoggedIn = useShopStore((state) => state.isAuthenticated);
  const logout = useShopStore((state) => state.logout);
  const user_connecte = useShopStore((state) => state.currentUser);
  const cart = useShopStore((state) => state.cart);
  const setCart = useShopStore((state) => state.setCart);

  // const [user_connecte, setuser_connecte] = React.useState<UserType | null>(null);
  const { panier } = useGetMyPanier(user_connecte?.id.toString() as string);

  // Load user data on component mount
  React.useEffect(() => {
    useShopStore.getState().loadUserData();
  }, []);

  // Set cart when panier data is available
  React.useEffect(() => {
    if (panier) {
      setCart([panier]);
    }
  }, [panier, setCart]);

  const path = usePathname();

  const deconnexion = () => {
    deleteSession();
    logout();
  }

  return (
    <div className={`w-full shadow-sm sticky top-0 z-50 bg-white`}>
      <div className='container m-auto flex flex-row items-center h-16 z-50 px-12'>
        <div className='text-black w-[50%]'>
          <Link href="/">
            <Text format='p' weight="800">E-COMMERCE</Text>
          </Link>
        </div>

        <div className={`w-[50%] flex flex-row justify-end items-center gap-6 ${path !== "/" ? "text-white" : "text-white"}`}>
          {isLoggedIn ? (
            <div className="flex flex-row gap-6 items-center">
              <ButtonNavigate path='/panier' className='relative p-2'>
                <Badge className='absolute -top-1 -right-2 rounded-full bg-red-600 hover:bg-red-600 hover:animate-pulse'>
                  {cart[0]?.items ? cart[0]?.items.length : "0"}
                </Badge>
                <ShoppingCartIcon strokeWidth={2} size={22} color="#252525" />
              </ButtonNavigate>
              <div onClick={() => deconnexion()} className="py-2 flex flex-row gap-2 cursor-pointer">
                <Text format="p" classNameStyle="text-red-600">Me déconnecter</Text>
                {/* <LockKeyhole size={20} className="text-red-600" /> */}
              </div>
            </div>
          )
            :
            <div className="flex flex-row gap-2">
              <ButtonNavigate path='/sign-in'>
                <div className='py-2 px-4 text-black rounded-md'>
                  S&apos;inscrir
                </div>
              </ButtonNavigate>
              <ButtonNavigate path='/login'>
                <div className='py-2 px-4 text-teal-600 rounded-md'>
                  Se connecter
                </div>
              </ButtonNavigate>
            </div>
          }

          {/* {!isLoading && isLoggedIn && ( */}
          {/* <Sheet>
            <SheetTrigger>
              <MenuIcon size={22} color="#252525" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <div className="pb-6 border-b border-zinc-200">
                    <Text format="p" weight="800" className="text-xl">E-COMMERCE</Text>
                  </div>
                </SheetTitle>
                <div className='flex flex-col gap-4 pt-6'>
                  <div className={`flex sm:hidden flex-col items-center gap-8 h-full`}>
                    <ButtonNavigate path='/' className='w-full text-start'>Acceuil</ButtonNavigate>
                    <ButtonNavigate path='/nos-produits' className='w-full text-start'>Nos produits</ButtonNavigate>
                  </div>

                  {isLoggedIn ? (
                    <>
                      <Link href="/commande" className='flex flex-row items-center gap-5 py-2 px-2 hover:bg-zinc-100 rounded-md'>
                        <Command size={20} strokeWidth={1.5} />
                        <span>Commandes</span>
                      </Link>
                    </>
                  )
                    :
                    <div className="flex flex-col gap-4 mt-6">
                      <ButtonNavigate path='/sign-in'>
                        <div className='py-2 px-4 border border-teal-600 text-teal-600 rounded-md'>
                          S&apos;inscrir
                        </div>
                      </ButtonNavigate>
                      <ButtonNavigate path='/login'>
                        <div className='py-2 px-4 border border-teal-600 bg-teal-600 text-white rounded-md'>
                          Se connecter
                        </div>
                      </ButtonNavigate>
                    </div>
                  }

                  {isLoggedIn && (
                    <div className="absolute bottom-6 left-0 w-full px-4">
                      <Button onClick={() => deconnexion()} className='w-full py-2 px-4 rounded-md bg-transparent hover:bg-red-600 border border-red-600 text-red-600 hover:text-white'>
                        Se déconnecter
                      </Button>
                    </div>
                  )}
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet> */}
          {/* )} */}
        </div>
      </div>

      {/* navigate */}
      {/* <NavBarClient /> */}
      <div className='w-full flex justify-center items-center bg-cyan-700 py-2'>
        <div className={`w-full overflow-x-auto sm:overflow-x-hidden flex flex-row justify-center items-center gap-8 ${path !== "/" ? "text-white" : "text-black"} backdrop-blur-sm h-full px-12 rounded-b-2xl`}>
          <div className={`flex flex-row sm:gap-8`}>
            <ButtonNavigate path='/' className={`${path === "/" ? "font-bold border-b border-white text-white" : "text-white"} py-2 px-4`}>Acceuil</ButtonNavigate>
            <ButtonNavigate path='/nos-produits' className={`${path === "/nos-produits" ? "font-bold border-b border-white text-white" : "text-white"} py-2 px-4`}>Nos produits</ButtonNavigate>
            {isLoggedIn && <ButtonNavigate path='/commande' className={`${path === "/commande" ? "font-bold border-b border-white text-white" : "text-white"} py-2 px-4`}>Mes commandes</ButtonNavigate>}
          </div>
        </div>
      </div>
    </div>
  )
}