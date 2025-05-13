"use client"

import { Suspense, useEffect, useState } from 'react';
import { OneCategory } from './OneCategory';
import { CategoryType } from '@/src/lib/queryClient';
import { useGetOneCategorie } from '@/src/lib/requests/useCategoryRequest';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>("");
  const { onecategories, isCategoryLoading } = useGetOneCategorie(id);

  useEffect(() => {
    async function fetchData() {
      const { id } = await params;
      setId(id);
    }
    fetchData();
  }, [params]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OneCategory onecategories={onecategories as CategoryType} isLoading={isCategoryLoading} />
    </Suspense>
  );
}