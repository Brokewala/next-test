import ProductCard from "@/src/components/ProductCard";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useGetCategories } from "@/src/lib/requests/useCategoryRequest";
import ButtonPrimary from "@/src/shared/Button/ButtonPrimary";
import Image from "next/image";
import Link from "next/link";
import { RiMicrosoftLoopFill } from "react-icons/ri";
import ProductSkeleton from "../(client)/nos-produits/productSkeleton";

export default function Category() {
  const { categories } = useGetCategories();

  return (
    <div className="w-full h-full container mx-auto px-8">
      {categories &&
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {categories
            ?.filter((category) => category.produits && category.produits.length > 0)
            .slice(-4).map((category) => (
              <div
                key={category.id}
                className="border rounded-lg p-4 flex flex-col items-center text-center shadow-md"
              >
                <Image
                  src={category.image}
                  alt={category.nom}
                  width={80}
                  height={80}
                  className="rounded-full mb-4"
                />
                <h2 className="text-lg font-semibold">{category.nom}</h2>
                {/* <p className="text-gray-600 mt-2">{category.description}</p> */}
                <ButtonPrimary
                  href={`/categorie/${category.id}`}
                  className="mt-4 py-2 rounded-none"
                >
                  Voir les produits ➡
                </ButtonPrimary>
              </div>
            ))}
        </div>
      }

      {/* <Heading isCenter isMain desc="" className="mt-20">Catégories</Heading> */}
      <div className="py-2 px-6 bg-zinc-200 mt-12 w-[80%] sm:w-1/2 text-lg md:text-xl lg:text-2xl">
        <p>Catégories</p>
      </div>

      {categories ? (
        <div className="grid grid-cols-1 gap-12 mt-12">
          {categories
            ?.filter((category) => category.produits && category.produits.length > 0)
            .slice(-4)
            .map((category) => (
              <div key={category.nom} className="flex flex-col gap-6">
                <div className="w-full flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {category.image ?
                      <Image
                        src={category.image}
                        alt={category.nom}
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                      :
                      <RiMicrosoftLoopFill className="text-lg text-primary" />
                    }
                    <h2 className="text-lg md:text-xl font-semibold uppercase">{category.nom}</h2>
                  </div>
                  <Link href={`/categorie/${category.id}`}>Savoir plus ➡</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.produits?.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {/* <div className="w-full flex justify-center mt-6">
                  <ButtonPrimary href={`/categorie/${category.id}`} className="py-2 rounded-none">Savoir plus ➡</ButtonPrimary>
                </div> */}
              </div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-6 animate-pulse">
              <div className="w-full flex justify-between items-center">
                <Skeleton className="h-2 w-16 rounded-full" />
                <Skeleton className="h-2 w-10 rounded-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="w-full flex justify-center mt-12 relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[50%] h-[0.5px] bg-[#FDE42D]" />
        <ButtonPrimary href={`/categorie`} className="py-2 rounded-none">Voir tous les catégories</ButtonPrimary>
      </div>
    </div>
  );
}
