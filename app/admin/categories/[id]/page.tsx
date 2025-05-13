"use client"

import { CategoryType } from '@/src/lib/queryClient';
import { useGetOneCategorie } from '@/src/lib/requests/useCategoryRequest';
import { Suspense, useEffect, useState } from 'react';
import { OneCategory } from './OneCategory';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const { onecategories } = useGetOneCategorie(id ? id : "");

  useEffect(() => {
    async function fetchData() {
      const { id } = await params;
      setId(id);
    }
    fetchData();
  }, [params]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OneCategory onecategories={onecategories as CategoryType} />
    </Suspense>
  );
}