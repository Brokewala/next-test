"use client"

import Hunder from '@/app/(landingPage)/Hunder';
import { Button } from '@/src/components/ui/button';
import { Skeleton } from '@/src/components/ui/skeleton';
import Text from '@/src/components/ui/text';
import { LayoutClient } from '@/src/layouts/LayoutClient';
import { addPanierUser } from '@/src/lib/definitions/server-panier-actions';
import { QueryKeyFactory, useServerActionMutation } from '@/src/lib/hooks/server-actions-hooks';
import { ProduitType } from '@/src/lib/queryClient';
import useShopStore from '@/src/lib/store/shopStore';
import { toForm } from '@/src/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronLeftIcon, Loader2Icon, MinusIcon, PlusIcon, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

export function Produit({ product }: { product: ProduitType | null }) {
  const router = useRouter();

  const [qtite, setqtite] = React.useState<number>(1);

  React.useEffect(() => {
    useShopStore.getState().loadUserData();
  }, []);

  const isLoggedIn = useShopStore((state) => state.isAuthenticated);
  const user_connecte = useShopStore((state) => state.currentUser);
  const addToCart = useShopStore((state) => state.addToCart);

  if (user_connecte) {
    if (user_connecte?.role === "ADMIN") {
      router.push("/admin/dashboard");
    }
  }

  const [idImage, setidImage] = React.useState<number>(0);

  // QUERY CLIENT
  const queryClient = useQueryClient();

  const { isPending, mutate } = useServerActionMutation(addPanierUser, {
    onSuccess: (data) => {
      if (data?.message === "Produit ajouté au panier") {
        toast(data?.message, { position: "top-center" });

        addToCart(product as ProduitType);

        queryClient.refetchQueries({
          queryKey: QueryKeyFactory.getPanier(user_connecte ? user_connecte?.id.toString() as string : ""),
        });
        router.refresh();
        router.push(`/nos-produits/${product?.id}`);
      } else {
        toast("Pas assez de produits. Stock insuffisant", { position: "top-center" });
      }
    },
    onError: (error) => {
      throw error;
    }
  })

  // React.useEffect(() => {
  //   if (error) {
  //     console.log("ADD ERROR ==> ", error)
  //   }
  // }, [error])

  const handleAddPanier = async () => {
    if (isLoggedIn && user_connecte) {
      try {
        const data = {
          clientId: user_connecte.client.id.toString(),
          produitId: product ? product.id.toString() : "",
          quantite: qtite
        };

        mutate(toForm(data));
      } catch (error) {
        throw error;
      }
    } else {
      toast("Pas d'utilisateur connécter", {
        position: "top-center",
        action: {
          label: "Se connecter",
          onClick: () => {
            router.push("/login");
          }
        }
      });
    }
  }

  return (
    <LayoutClient>
      {/* <div className="h-[5dvh]" /> */}
      <div className='w-full flex flex-col gap-12 p-6'>
        <div className='w-full flex flex-row gap-4 items-center'>
          <ChevronLeftIcon size={25} onClick={() => router.back()} />
          <Text format='p' weight='800' classNameStyle='text-md'>
            Retour
          </Text>
        </div>
        <div className='w-full flex flex-col lg:flex-row gap-6'>
          <div className="w-full h-[350px] flex lg:hidden overflow-hidden rounded" style={{ backgroundImage: `url(${product?.image[idImage]})` }}>
            <div className="w-full h-full bg-white/5 backdrop-blur-md rounded-lg">
              {product?.image &&
                <Image src={product?.image[idImage] as string} alt={"image-" + product?.nom} fill className="w-auto h-auto object-contain" />
              }
            </div>
          </div>
          <div className={`hidden h-[50dvh] relative lg:flex flex-1 rounded-lg bg-cover overflow-hidden`} style={{ backgroundImage: `url(${product?.image[idImage]})` }}>
            <div className="w-full h-full bg-white/5 backdrop-blur-md rounded-lg">
              {product?.image &&
                <Image src={product?.image[idImage] as string} alt={"image-" + product?.nom} fill className="w-auto h-auto object-contain" />
              }
            </div>
          </div>
          <div className='flex flex-1 flex-col gap-12'>
            <div className='flex flex-row justify-between items-center gap-2'>
              {product?.nom
                ?
                <Text format='h1' weight='800' classNameStyle='text-2xl'>
                  {product?.nom}
                </Text>
                :
                <Skeleton className='w-36 h-8' />
              }

              {product?.stock ?
                <Text format='p' classNameStyle={`${product?.stock >= 1 ? "text-green-600" : "text-red-600"} text-lg`} weight='800'>{(product.stock + 1) !== 1 ? "Stock disponible" : "Stock indisponible"}</Text>
                :
                <Text format='p' classNameStyle="text-red-600 text-lg" weight='800'>Stock indisponible</Text>
              }
            </div>
            {product?.description ?
              <Text format='p' classNameStyle='leading-relaxed'>
                {product?.description}
              </Text>
              :
              <div className='flex flex-col gap-4'>
                <Skeleton className='w-72 h-2' />
                <Skeleton className='w-32 h-2' />
              </div>
            }

            {product?.prix ?
              <Text format='p' weight='800' classNameStyle='text-3xl'>
                {product?.prix} KMF
              </Text>
              :
              <div className='flex flex-row gap-4'>
                <Skeleton className='w-8 h-8' />
                <Skeleton className='w-8 h-8' />
              </div>
            }

            <div className='flex flex-col gap-8'>
              <div className='flex flex-col gap-2'>
                <div className='w-fit flex flex-row items-center border px-4 py-2 rounded-xl'>
                  {product &&
                    <MinusIcon size={18} onClick={() => qtite > 1 && setqtite(qtite - 1)} className='cursor-pointer' />
                  }
                  <Text format='p' weight='800' classNameStyle='text-3xl w-32 text-center'>{qtite}</Text>
                  {product &&
                    <PlusIcon size={18} onClick={() =>
                      qtite < product?.stock ? setqtite(qtite + 1) :
                        toast("Stock insuffisant", { position: "top-center" })
                    }
                      className='cursor-pointer'
                    />
                  }
                </div>
              </div>

              <div className="flex flex-row gap-4 items-center">
                {product?.image && product?.image.length > 1 &&
                  product?.image.map((img, index) => (
                    <Image src={img} alt={"image-" + product?.nom} width={40} height={40} key={index} className="w-14 h-14 rounded object-cover cursor-pointer" onClick={() => setidImage(index)} />
                  ))}
              </div>

              <Button onClick={() => handleAddPanier()} className="bg-sky-600 hover:bg-sky-500" disabled={isPending || product?.stock === 0 || qtite === 0} style={product?.stock === 0 || qtite === 0 ? { cursor: "not-allowed" } : {}}>
                {isPending ?
                  <div className="flex flex-row gap-4 items-center justify-center">
                    <span className="text-md">Chargement</span>
                    <Loader2Icon className='animate-spin' size={18} />
                  </div>
                  :
                  <div className='flex flex-row gap-2 justify-center items-center p-2'>
                    <Text format='p'>Ajouter au panier</Text>
                    <ShoppingCart size={18} strokeWidth={1.5} />
                  </div>
                }
              </Button>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-6'>
          <div className='flex flex-row gap-6 items-center'>
            <div className='w-20 h-1 rounded-lg bg-primary'></div>
            <Text format='p' weight='800' classNameStyle='text-2xl'>Autres produits</Text>
          </div>
          {/* <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            {products?.slice(0, 8)?.filter((item) => item.id !== product?.id)?.map((product) => (
              <CardProduct
                id={product.id}
                image={product.image}
                nom={product.nom}
                description={product.description}
                prix={product.prix.toString()}
                key={product.id}
                createdAt={product.createdAt}
                stock={product.stock}
                updatedAt={product.updatedAt}
                role={user_connecte?.role as "CLIENT" | "ADMIN"}
              />
            ))}
          </div> */}

          <div className="mt-12">
            <Hunder heading={false} />
          </div>
        </div>
      </div>
    </LayoutClient>
  )
}
