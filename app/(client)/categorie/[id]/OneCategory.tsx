"use client";

import ProductCard from '@/src/components/ProductCard';
import { Input } from '@/src/components/ui/input';
import { Skeleton } from '@/src/components/ui/skeleton';
import Text from '@/src/components/ui/text';
import { LayoutClient } from '@/src/layouts/LayoutClient';
import { CategoryType } from '@/src/lib/queryClient';
import { useGetUserConnect } from '@/src/lib/requests/userUserRequest';
import { ChevronLeftIcon, ListFilterIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export function OneCategory({ onecategories, isLoading }: { onecategories: CategoryType, isLoading: boolean }) {
  const route = useRouter();

  const { user_connecte } = useGetUserConnect();

  if (user_connecte) {
    if (user_connecte?.role === "ADMIN") {
      route.push("/admin/dashboard");
    }
  }

  const [nomRecherche, setnomRecherche] = React.useState("");

  const products = onecategories?.produits?.filter(produit =>
    produit.nom.toLowerCase().includes(nomRecherche.toLowerCase())
  );

  return (
    <LayoutClient>
      <div className='w-full container mx-auto flex flex-col gap-12 p-8'>
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-row gap-4 items-center">
            <ChevronLeftIcon size={25} onClick={() => route.back()} />
            {!isLoading ?
              <Text format="p" weight="800" classNameStyle="text-2xl">
                {onecategories?.nom}
              </Text>
              :
              <Skeleton className="h-8 w-48" />
            }
          </div>
          <div className='flex flex-row gap-2 items-center'>
            <Input type='search' placeholder='Rechercher un produit' className='w-64' onChange={(e) => setnomRecherche(e.target.value)} />
            <ListFilterIcon size={18} strokeWidth={1.5} />
          </div>
        </div>

        <div className='w-full grid grid-cols-4 gap-6'>
          {products ? products.length > 0 ? products?.map(item => (
            <ProductCard key={item.id} product={item} />
          ))
            :
            <div className='w-[75dvw] h-80 flex items-center justify-center'>
              <Text format="p" weight="800" classNameStyle="text-2xl">
                Aucun produit trouvé
              </Text>
            </div>
            :
            Array.from({ length: 4 }).map((_, index) => (
              <div className="flex flex-col gap-6 w-full" key={index}>
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-2 w-32" />
                <Skeleton className="h-2 w-48" />
              </div>
            ))
          }
        </div>
      </div>
    </LayoutClient>
  );
}
