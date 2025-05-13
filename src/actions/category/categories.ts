"use cache";

import { CategoryType } from "@/src/lib/queryClient";
import { host } from "@/src/lib/service_api";
// import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache";
import { redirect } from "next/navigation";

/// RECUPERER TOUS LES CATEGORIES
export const getCategoriesAction = async () => {
  const res = await fetch(host + 'category', {
    next: {
      revalidate: 1
    }
  });

  if (res.ok) {
    const data = await res.json();
    return data as {"categories":Array<CategoryType>, "countCategory": number};
  }
}

/// RECUPERER UNE CATEGORIE
export const getOneCategorieAction = async (id: string) => {
  const res = await fetch(host + `category/${id}`);

  if (res.ok) {
    const data = await res.json();
    return data as CategoryType;
  }
} 

/// CREER UNE CATEGORIE
export const createCategoryAction = async (fomdata: FormData) => {
  const req = await fetch(host + 'category', {
    method: 'POST',
    body: fomdata
  })

  if (req.ok) {
    await req.json();
    redirect('/categories');
  }
}