"use client";

import ProductCardAdmin from '@/src/components/ProductCardAdmin';
import { Button } from "@/src/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import Text from "@/src/components/ui/text";
import Layout from "@/src/layouts/LayoutDash";
import ButtonNavigate from "@/src/lib/buttonNavigate";
import { hashId } from "@/src/lib/hasheId";
import { useGetCategories } from "@/src/lib/requests/useCategoryRequest";
import {
  useGetAllCommande
} from "@/src/lib/requests/useCommandeRequest";
import { useGetAllProducts } from "@/src/lib/requests/useProductRequest";
import { ArrowUpRight, KeyRoundIcon } from "lucide-react";


const Page = () => {
  const { categories } = useGetCategories();
  const { commandes } = useGetAllCommande();
  const { products } = useGetAllProducts();

  return (
    <Layout>
      <div>
        <Text format="h1" weight="800" classNameStyle="text-3xl">
          Tableau de bord
        </Text>
      </div>
      {/* <div className="w-full p-6 flex flex-col gap-6 rounded-lg bg-white border border-zinc-100 shadow-sm">
        <Text format="h1" weight="800">
          Statistiques
        </Text>
        <div className="w-full grid grid-cols-3 gap-6">
          {datas.map((item, index) => (
            <CardStat
              icon={item.icon}
              title={item.title}
              number={item.count.toString()}
              key={index}
            />
          ))}
        </div>
      </div>
      */}

      {/* /// COMMANDE PANIER CLIENT */}
      <div className="w-full flex flex-col gap-6">
        <div className="w-full grid grid-cols-2 gap-6">
          <div className="p-4 space-y-6 bg-white rounded-lg shadow-md border border-zinc-100">
            <div className="w-full flex justify-between items-center">
              <Text format="h2" weight="800">
                Commandes (paniers)
              </Text>
              <ButtonNavigate path="commandes">
                <Text
                  format="p"
                  classNameStyle="text-violet-700 text-sm cursor-pointer"
                  weight="800"
                >
                  Voir tous
                </Text>
              </ButtonNavigate>
            </div>
            <ScrollArea className="w-full min-h-40 max-h-80">
              <div className="grid grid-flow-row grid-cols-2 gap-4">
                {commandes.map((item) => (
                  <ButtonNavigate path={`commandes/${item.id}`} key={item.id}>
                    <div className="w-full p-4 border border-zinc-100 hover:border-violet-400 shadow-lg hover:bg-violet-200 rounded-lg space-y-6 ease-in-out duration-200 cursor-pointer">
                      <div className="w-full flex flex-row items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                          <KeyRoundIcon
                            size={16}
                            strokeWidth={1.5}
                            color="violet"
                          />
                        </div>
                        <Text format="p" weight="800">
                          {hashId(item.id)}
                        </Text>
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <Text
                          format="p"
                          classNameStyle="text-black text-center"
                          weight="800"
                        >
                          Client :
                        </Text>
                        <Text
                          format="p"
                          classNameStyle="text-black text-center"
                        >
                          {item.client.utilisateur.nom}
                        </Text>
                      </div>
                    </div>
                  </ButtonNavigate>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-md space-y-6">
            <div className="w-full flex justify-between items-center">
              <Text format="h2" weight="800">
                Nos produits
              </Text>
              <ButtonNavigate path="produits">
                <Text
                  format="p"
                  classNameStyle="text-violet-700 text-sm"
                  weight="800"
                >
                  Voir les produits
                </Text>
              </ButtonNavigate>
            </div>

            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent>
                {products?.slice(0, 5).map((item) => (
                  <CarouselItem
                    key={item.id}
                    className="md:basis-1/2 lg:basis-1/2"
                  >
                    <ProductCardAdmin
                      product={item}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="w-full flex justify-center items-center pt-4 border-t border-zinc-200">
              <ButtonNavigate path="/admin/produits/add">
                <Text format='p' weight="800" classNameStyle="text-sky-600">Ajouter un produit</Text>
              </ButtonNavigate>
            </div>
          </div>
        </div>
      </div>

      {/* /// ======> CATEGORIES */}
      <div className="w-full flex flex-col gap-6 p-2">
        <div className="w-full flex justify-between items-center">
          <Text format="h2" weight="800">
            Catégories
          </Text>
          <ButtonNavigate path='categories'>
            <Text
              format="p"
              classNameStyle="text-violet-700 text-sm cursor-pointer"
              weight="800"
            >
              Voir tous
            </Text>
          </ButtonNavigate>
        </div>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {categories && categories.map((item) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="relative p-1 h-40 border flex justify-center items-center rounded-lg shadow-lg bg-white border-zinc-100">
                  <Text format="p" classNameStyle="text-black text-lg">
                    {item.nom}
                  </Text>
                  <ButtonNavigate path={`categories/${item.id}`}>
                    <Button className="absolute bottom-4 right-4 w-8 h-8 rounded-lg">
                      <ArrowUpRight size={14} color="#FFF" />
                    </Button>
                  </ButtonNavigate>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </Layout>
  );
};

export default Page;
