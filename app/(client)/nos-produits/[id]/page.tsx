"use client"

import { ProduitType } from '@/src/lib/queryClient';
import { useGetOneProduct } from '@/src/lib/requests/useProductRequest';
import { Suspense, useEffect, useState } from 'react';
import { Produit } from './Produit';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>("");
  const { myProduct } = useGetOneProduct(id);

  useEffect(() => {
    async function fetchId() {
      const { id } = await params;
      setId(id);
    }

    fetchId();
  }, [params]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Produit product={myProduct as ProduitType} />
    </Suspense>
  );
}