"use client";

import { getCategoriesAction } from "@/src/actions/category/categories";
import { useEffect, useState } from "react";
import { getOneCategorie } from "../definitions/server-categorie-actions";
import { useServerActionQuery } from "../hooks/server-actions-hooks";
import { CategoryType } from "../queryClient";

export const useGetCategories = () => {
    const [categories, setCategories] = useState<Array<CategoryType> | null>(null);
    const [count, setcount] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getCategoriesAction();
                if (data) {
                    setCategories(data.categories);
                    setcount(data.countCategory)
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des categories :", error);
            }
        }

        fetchData();
    }, []);


    return {
        categories,
        countCategory: count
    }
}

/// RECUPERER UNE CATEGORIE
export const useGetOneCategorie = (id: string) => {
    const { data, isPending } = useServerActionQuery(getOneCategorie, {
        input: id,
        enabled: !!id,
        queryKey: ["category", id]
    })


    return {
        onecategories: data as CategoryType,
        isCategoryLoading: isPending
    }
}