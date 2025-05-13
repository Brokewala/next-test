'use client';

import ProductCard from "@/src/components/ProductCard";
import { Input } from "@/src/components/ui/input";
import Text from "@/src/components/ui/text";
import { LayoutClient } from "@/src/layouts/LayoutClient";
import { useGetAllProducts } from "@/src/lib/requests/useProductRequest";
import useShopStore from "@/src/lib/store/shopStore";
import { ChevronLeftIcon, ChevronRightIcon, ListFilterIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import ProductSkeleton from "./productSkeleton";
import { useGetUserConnect } from "@/src/lib/requests/userUserRequest";

// export const ProductSkeleton = () => (
//   <div className="w-full">
//     <Skeleton className="w-full h-52 rounded-xl bg-zinc-100" />
//     <Skeleton className="w-1/2 h-4 mt-3 bg-zinc-200" />
//   </div>
// );

const Page = () => {
  const route = useRouter();
  const { products } = useGetAllProducts();
  const addProducts = useShopStore((state) => state.addProduct);
  const ourProducts = useShopStore((state) => state.products);
  const [nomRecherche, setNomRecherche] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 50; // Number of products per page

  const { user_connecte } = useGetUserConnect();

  if (user_connecte) {
    if (user_connecte?.role === "ADMIN") {
      route.push("/admin/dashboard");
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  React.useEffect(() => {
    useShopStore.getState().loadUserData();
  }, []);

  React.useEffect(() => {
    if (ourProducts.length === 0 && products) {
      addProducts(products);
    }
  }, [products, ourProducts, addProducts]);

  const filteredProducts = products?.filter((p) =>
    p.nom.toLowerCase().includes(nomRecherche.toLowerCase())
  );

  const totalPages = Math.ceil((filteredProducts?.length || 0) / itemsPerPage);

  const paginatedProducts = filteredProducts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <LayoutClient>
      <div className="container mx-auto flex flex-col gap-12 p-8">
        <div className="w-full h-[40dvh] bg-cover bg-no-repeat bg-center flex justify-between relative before:absolute before:inset-0 before:bg-black/20 product-bg z-0">
          <div className="h-full flex flex-1 items-center justify-center flex-col gap-6 px-12 z-50">
            <Text format="h1" weight="800" classNameStyle="text-2xl md:text-3xl text-white uppercase">Découvrez nos produits</Text>
          </div>
        </div>

        <div className="w-full flex flex-col gap-12">
          <div className="w-full flex flex-col md:flex-row gap-8 justify-start md:justify-between items-center">
            <div className="w-full flex flex-row gap-4 items-center">
              <ChevronLeftIcon size={25} onClick={() => route.back()} />
              <Text format="p" weight="800" classNameStyle="text-2xl">Nos produits</Text>
            </div>
            <div className='flex flex-row gap-6'>
              <div className='flex flex-row gap-2 items-center'>
                <Input
                  type='search'
                  placeholder='Rechercher un produit'
                  className='w-64'
                  onChange={(e) => {
                    setNomRecherche(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                />
                <ListFilterIcon size={18} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <Suspense fallback={
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-20 md:gap-12 pb-12">
              {Array.from({ length: itemsPerPage }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          }>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 pb-12">
              {paginatedProducts ? paginatedProducts.length > 0 ? (
                paginatedProducts.map((item) => (
                  <ProductCard key={item.id} product={item} className="border-neutral-300" />
                ))
              ) : (
                <div className="col-span-3 text-center text-white">
                  <Text format="p" weight="800" classNameStyle="text-xl">Aucun produit trouvé</Text>
                </div>
              ) : (
                <div className="w-[90dvw] grid grid-cols-3 gap-12 pb-12">
                  {Array.from({ length: itemsPerPage }).map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))}
                </div>
              )}
            </div>
          </Suspense>

          <div className="w-full flex justify-center items-center">
            <div className="flex flex-row gap-6 items-center">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronLeftIcon />
              </button>
              <Text format="p" weight="800" classNameStyle="text-md">
                Page {currentPage} sur {totalPages}
              </Text>
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent default behavior
                  handleNextPage();
                }}
                disabled={currentPage === totalPages}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutClient>
  );
};

export default Page;
