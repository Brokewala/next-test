import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { RiSearch2Line } from 'react-icons/ri';
import { LockIcon } from 'lucide-react';
import Image from 'next/image';

import ButtonCircle3 from '@/src/shared/Button/ButtonCircle3';
import Logo from '@/src/shared/Logo/Logo';
import ButtonNavigate from '@/src/lib/buttonNavigate';
import useShopStore from '@/src/lib/store/shopStore';
import { useGetMyPanier } from '@/src/lib/requests/userPanierRequest';
import Input from '@/src/shared/Input/Input';
import Button from '@/src/shared/Button/Button';

import CartSideBar from '../CartSideBar';
import MenuBar from './MenuBar';
import { CategoryType, ProduitType } from '@/src/lib/queryClient';
import { useGetAllProducts } from '@/src/lib/requests/useProductRequest';
import { useGetCategories } from '@/src/lib/requests/useCategoryRequest';
import { deleteSession } from '@/src/lib/session';
import LoadLogOut from '../LoadLogOut';

const MainNav = () => {
  const router = useRouter();
  const isLoggedIn = useShopStore((state) => state.isAuthenticated);
  const user_connecte = useShopStore((state) => state.currentUser);
  const setCart = useShopStore((state) => state.setCart);
  const logout = useShopStore((state) => state.logout);
  // const produits = useShopStore((state) => state.products);
  const { products } = useGetAllProducts();
  const { categories } = useGetCategories();
  const { panier } = useGetMyPanier(user_connecte?.id.toString() as string);

  const [loadLogOut, setloadLogOut] = React.useState(false);

  const deconnexion = () => {
    localStorage.removeItem('shop-store');
    localStorage.removeItem('admin-store');
    logout();
    setloadLogOut(true);
    deleteSession();
    setTimeout(() => {
      setloadLogOut(false);
    }, 3000);
  }

  // États pour la recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<ProduitType[]>([]);
  const searchRef = useRef(null);
  const searchMobileRef = useRef(null);

  // Filtrer les produits quand searchTerm change
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products?.slice(0, 6) || []);
      return;
    }

    const filtered = products?.filter((product) =>
      product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.keyWord && product.keyWord.toLowerCase().includes(searchTerm.toLowerCase()))
    ).slice(0, 6);

    setFilteredProducts(filtered || []);
  }, [searchTerm, products]);

  // Fermer les résultats si on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        searchRef.current &&
        !((searchRef.current as HTMLElement).contains(event.target as Node)) &&
        searchMobileRef.current &&
        !((searchMobileRef.current as HTMLElement).contains(event.target as Node))
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef, searchMobileRef]);

  // Gérer la soumission de recherche
  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(searchTerm)}`);
      setShowResults(false);
    }
  };

  // Set cart when panier data is available
  React.useEffect(() => {
    if (panier) {
      setCart([panier]);
    }
  }, [panier, setCart]);

  // Load user data on component mount
  React.useEffect(() => {
    useShopStore.getState().loadUserData();
  }, []);

  return (
    <div className='w-full flex flex-col'>
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex-1 lg:hidden">
          <MenuBar />
        </div>
        <div className="flex items-center gap-5 lg:basis-[60%]">
          <Logo />
          <div
            ref={searchRef}
            className="hidden w-full max-w-2xl items-center gap-5 rounded-full border border-neutral-300 py-1 pr-3 lg:flex relative"
          >
            <form onSubmit={handleSearch} className="flex w-full items-center">
              <Input
                type="text"
                className="border-transparent bg-white placeholder:text-neutral-500 focus:border-transparent outline-none w-full"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.trim()) {
                    setShowResults(true);
                  }
                }}
                onFocus={() => {
                  if (searchTerm.trim()) {
                    setShowResults(true);
                  }
                }}
              />
              <button type="submit" className="bg-transparent border-none p-0">
                <RiSearch2Line className="text-2xl text-neutral-500" />
              </button>
            </form>

            {showResults && (
              <div className='absolute left-0 top-16 bg-white p-4 w-full h-auto border border-black/20 z-[999] flex flex-col gap-6 shadow-lg rounded-lg'>
                <p className={`font-semibold ${filteredProducts.length > 0 || categories && categories?.length > 0 ? 'text-start' : 'text-center'}`}>
                  {filteredProducts.length > 0 || categories && categories?.length > 0
                    ? 'Résultats'
                    : 'Aucun résultat trouvé'}
                </p>
                {filteredProducts.length > 0 && (
                  <div className='flex flex-col gap-6'>
                    <p className="font-semibold text-md">Produits</p>
                    <div className="w-full grid grid-cols-3 gap-6">
                      {filteredProducts.map((product) => (
                        <Link
                          href={`/nos-produits/${product.id}`}
                          key={product.id}
                          onClick={() => setShowResults(false)}
                        >
                          <div className='flex items-center gap-2'>
                            <Image
                              src={product.image ? product.image[0] : "/user.png"}
                              alt={`${product.nom} cover photo`}
                              width={200}
                              height={200}
                              className="h-12 w-12 object-cover object-bottom rounded-md border border-black/20"
                            />
                            <p className='text-sm'>{product.nom}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {categories && categories?.length > 0 && (
                  <div className='flex flex-col gap-6'>
                    <p className="font-semibold text-md">Catégories</p>
                    <div className="w-full grid grid-cols-3 gap-6">
                      {categories
                        .filter((category: CategoryType) =>
                          category.nom.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((category: CategoryType) => (
                          <Link
                            href={`/categories/${category.id}`}
                            key={category.id}
                            onClick={() => setShowResults(false)}
                          >
                            <div className='flex flex-row items-center gap-4'>
                              <Image
                                src={category.image ? category.image : "/user.png"}
                                alt={`${category.nom} cover photo`}
                                width={25}
                                height={25}
                              />
                              <p className='text-sm'>{category.nom}</p>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
                <div className='w-full flex justify-center'>
                  <Button
                    onClick={() => {
                      router.push(`/recherche?q=${encodeURIComponent(searchTerm)}`);
                      setShowResults(false);
                    }}
                    className='border border-black/50 hover:bg-black/80 hover:text-white w-fit py-1 px-4 text-sm'
                  >
                    Voir tout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-5">
          <div className="flex items-center divide-x divide-neutral-300">
            <CartSideBar />

            {!isLoggedIn ?
              <div className="relative hidden lg:flex flex-row gap-2">
                <ButtonNavigate path='/sign-in'>
                  <div className='py-2 px-4 text-black rounded-md text-center'>
                    S&apos;inscrire
                  </div>
                </ButtonNavigate>
                <ButtonNavigate path='/login'>
                  <div className='py-2 px-4 text-cyan-600 rounded-md  text-center'>
                    Se connecter
                  </div>
                </ButtonNavigate>
              </div>
              :
              <div className="flex items-center gap-2 pl-5">
                <ButtonCircle3 className="overflow-hidden bg-gray" size="w-10 h-10 overflow-hidden">
                  <Image
                    src="/user.png"
                    alt="avatar"
                    width={150}
                    height={150}
                    className="h-full w-full object-cover object-center"
                  />
                </ButtonCircle3>
                <p className="hidden text-sm lg:block">
                  {user_connecte?.nom && user_connecte?.nom.length > 15 ? user_connecte?.nom.slice(0, 15) + '...' : user_connecte?.nom}
                </p>

                <LockIcon onClick={() => deconnexion()} color="red" className="ml-4 cursor-pointer" />
              </div>
            }
          </div>
        </div>
      </div>
      <div className="w-full px-6 flex justify-center relative pb-6">
        <div
          ref={searchMobileRef}
          className="flex w-full max-w-2xl items-center gap-5 rounded-full border border-neutral-300 py-1 pr-3 lg:hidden relative"
        >
          <form onSubmit={handleSearch} className="flex w-full items-center">
            <Input
              type="text"
              className="border-transparent bg-white placeholder:text-neutral-500 focus:border-transparent outline-none w-full"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value.trim()) {
                  setShowResults(true);
                }
              }}
              onFocus={() => {
                if (searchTerm.trim()) {
                  setShowResults(true);
                }
              }}
            />
            <button type="submit" className="bg-transparent border-none p-0">
              <RiSearch2Line className="text-2xl text-neutral-500" />
            </button>
          </form>

          {showResults && (
            <div className='absolute left-0 top-14 bg-white p-4 w-full h-auto border border-black/20 z-[999] flex flex-col gap-6 shadow-lg rounded-lg'>
              <p className='font-semibold'>
                {filteredProducts.length > 0
                  ? 'Produits'
                  : 'Aucun produit trouvé'}
              </p>
              {filteredProducts.length > 0 && (
                <div className="w-full grid grid-cols-2 gap-2">
                  {filteredProducts.map((product) => (
                    <Link
                      href={`/nos-produits/${product.id}`}
                      key={product.id}
                      onClick={() => setShowResults(false)}
                    >
                      <div className='flex items-center gap-2'>
                        <Image
                          src={product.image ? product.image[0] : "/user.png"}
                          alt={`${product.nom} cover photo`}
                          width={200}
                          height={200}
                          className="h-10 w-10 object-cover object-bottom rounded-md border border-black/20"
                        />
                        <p className='text-xs'>{product.nom}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <div className='w-full flex justify-center'>
                <Button
                  onClick={() => {
                    router.push(`/recherche?q=${encodeURIComponent(searchTerm)}`);
                    setShowResults(false);
                  }}
                  className='border border-black/50 hover:bg-black/80 hover:text-white w-fit py-1 px-4 text-sm'
                >
                  Voir tout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {loadLogOut && 
        <LoadLogOut />
      }
    </div>
  );
};

export default MainNav;