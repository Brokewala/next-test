"use client"

import Text from '@/src/components/ui/text';
import { LayoutClient } from '@/src/layouts/LayoutClient';
import { deletePanierUser } from '@/src/lib/definitions/server-panier-actions';
import { QueryKeyFactory, useServerActionMutation } from '@/src/lib/hooks/server-actions-hooks';
import useShopStore from '@/src/lib/store/shopStore';
import { toForm } from '@/src/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ShoppingBagIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CartView from './CartView';

export default function Page() {
  const router = useRouter();

  const user_connecte = useShopStore((state) => state.currentUser);
  const cart = useShopStore((state) => state.cart);

  if (user_connecte) {
    if (user_connecte?.role === "ADMIN") {
      router.push("/admin/dashboard");
    }
  }

  // const somme: Array<number> = [];


  const removeFromCart = useShopStore((state) => state.removeFromCart);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: mutateDelete } = useServerActionMutation(deletePanierUser, {
    onSuccess: (data) => {
      removeFromCart(data.data.id);
      queryClient.refetchQueries({
        queryKey: QueryKeyFactory.getPanier(user_connecte ? user_connecte?.id.toString() as string : ""), //return the same query key as defined in our factory
      });
      router.refresh();
    }
  })

  const handleRemoveToCart = (id: string) => {
    setLoading(true);
    try {
      mutateDelete(toForm({ itemId: id }))
      // removeFromCart(id);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LayoutClient>
      <div className='container mx-auto px-8 flex flex-col gap-12 relative top-12'>
        <div className='flex flex-row gap-4 items-center'>
          <ChevronLeft size={25} onClick={() => router.back()} />
          <Text format='h1' weight='800' classNameStyle='text-2xl md:text-3xl'>Mon panier</Text>
        </div>

        {cart[0]?.items ? cart[0]?.items.length <= 0 ? <None /> :
          <div className="w-full h-auto relative flex flex-col lg:flex-row gap-8">
            <CartView cart={cart} handleRemoveToCart={handleRemoveToCart} loading={loading} />


          </div>
          :
          <None />
        }
      </div>
    </LayoutClient>
  )
}

const None = () => {
  return <div className="w-full h-80 flex flex-col gap-4 items-center justify-center">
    <ShoppingBagIcon size={120} strokeWidth={1} className='text-zinc-200 animate-bounce' />
    <div className="flex flex-col justify-center items-center gap-4">
      <Text format="p" weight="800" classNameStyle="text-xl text-zinc-600">Votre panier est vide</Text>
      <Link href='/nos-produits'>
        <Text format='p' classNameStyle="text-sky-600 underline">Effectuer d&apos;autres achats</Text>
      </Link>
    </div>
  </div>
}