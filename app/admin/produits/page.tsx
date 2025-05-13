"use client";

import ProductCardAdmin from "@/src/components/ProductCardAdmin";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import Text from "@/src/components/ui/text";
import Layout from "@/src/layouts/LayoutDash";
import { useProductsManager } from "@/src/lib/requests/useProductRequest";
import { ChevronLeftIcon, ChevronRightIcon, ListFilterIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const route = useRouter();

  const { loading, loadAllProducts, produits } = useProductsManager();

  useEffect(() => {
    loadAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [nomRecherche, setnomRecherche] = React.useState("");

  const myProducts = produits?.filter((products) =>
    products.nom.includes(nomRecherche)
  );

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 50; // Number of products per page

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const totalPages = Math.ceil((myProducts?.length || 0) / itemsPerPage);

  const paginatedProducts = myProducts?.slice(
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
    <Layout>
      <div className="flex flex-col gap-12">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-row gap-4 items-center">
            <ChevronLeftIcon size={25} onClick={() => route.back()} />
            <Text format="p" weight="800" classNameStyle="text-2xl">
              Nos produits
            </Text>
          </div>
          <div className="flex flex-row gap-6">
            <div className="flex flex-row gap-2 items-center">
              <Input
                type="search"
                placeholder="Rechercher un produit"
                className="w-64"
                onChange={(e) => setnomRecherche(e.target.value)}
              />
              <ListFilterIcon size={18} strokeWidth={1.5} />
            </div>
            <Link href={"/produits/add"}>
              <Button>Ajouter un produit</Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="w-full h-[350px] flex justify-center items-center">
            <Loader2Icon size={35} className="animate-spin" />
            <p>Chargement</p>
          </div>
        ) : paginatedProducts?.length > 0 ? (
          <div className="w-full grid grid-cols-4 gap-6">
            {paginatedProducts.map((item) => (
              <ProductCardAdmin key={item.id} product={item} />
            ))}
          </div>
        ) : (
          <div className="w-full h-[350px] flex flex-col justify-center items-center text-center">
            <p>Aucun produit</p>
          </div>
        )}

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
    </Layout>
  );
};

export default Page;
