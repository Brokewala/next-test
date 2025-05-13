import ProductCard from "@/src/components/ProductCard";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useGetAllProducts } from "@/src/lib/requests/useProductRequest";
import ButtonPrimary from "@/src/shared/Button/ButtonPrimary";
import Heading from "@/src/shared/Heading/Heading";

export default function Hunder({ heading = true }: { heading?: boolean }) {
    const { products } = useGetAllProducts();

    return (
        <div className="container mx-auto -mt-12">
            {heading &&
                <Heading isCenter isMain desc="">
                    Nos produits
                </Heading>
            }

            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4 px-6">
                {products ? products.slice(0, 6).map((produit) => (
                    <ProductCard
                        key={produit.id}
                        product={produit}
                        className="border-neutral-300"
                    />
                ))
                    :
                    Array.from({ length: 6 }).map((_, index) => (
                        <div className="" key={index}>
                            <Skeleton className="h-[250px] rounded-2xl lg:h-[220px] 2xl:h-[300px]" />
                            <Skeleton className="w-12 h-2 mt-3" />
                        </div>
                    ))
                }
            </div>

            <div className="mt-14 flex items-center justify-center relative">
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[50%] h-[0.5px] bg-primary" />
                <ButtonPrimary href="/nos-produits" className="py-2 rounded-sm">Voir tous</ButtonPrimary>
            </div>
        </div>
    )
}
