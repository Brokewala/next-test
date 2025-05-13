"use client"

import { createProduct, deleteProduct, getAllProductsAction, updateProduct } from "@/src/actions/produits/produitActions";
import { useEffect, useState } from "react";
import { getOneProductDefinition } from "../definitions/server-product-actions";
import { QueryKeyFactory, useServerActionQuery } from "../hooks/server-actions-hooks";
import { ProduitType } from "../queryClient";
import useAdminStore from "../store/adminStore";

export const useGetAllProducts = () => {
    const [products, setproducts] = useState<Array<ProduitType> | null>(null);
    const [count, setcount] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getAllProductsAction();
                if (data) {
                    setproducts(data);
                    setcount(data.length)
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des products :", error);
            }
        }

        fetchData();
    }, []);


    return {
        products,
        countProducts: count
    }
}

/// RECUPERER UN PRODUIT
// export const useGetOneProduct = (id: string) => {
//     const [product, setproducts] = useState<ProduitType | null>(null);

//     useEffect(() => {
//         async function fetchData() {
//             try {
//                 const data = await getOneProductAction(id);
//                 if (data) {
//                     setproducts(data);
//                 }
//             } catch (error) {
//                 console.error("Erreur lors de la récupération des products :", error);
//             }
//         }

//         fetchData();
//     }, [id]);

//     return {
//         product,
//     }
// }

export const useGetOneProduct = (id: string) => {
    const { data, isPending } = useServerActionQuery(getOneProductDefinition, {
        input: id,
        enabled: !!id,
        queryKey: QueryKeyFactory.getOneProduit(id ? id : "")
    })

    return {
        myProduct: data as ProduitType,
        isProductLoading: isPending 
    }
}

//// PRODUITS MANAGER
export const useProductsManager = () => {
    const { 
      produits,
      loading,
      error,
    } = useAdminStore();
  
    const loadAllProducts = async () => {
      return await getAllProductsAction();
    };
  
    const ajoutProduit = async (formdata: FormData) => {
      return await createProduct(formdata);
    };

    const updateMyProduct = async (id: string, formdata: { nom: string; description: string; stock: number; prix: number; keyWord: string }) => {
        return await updateProduct(id, formdata);
    }

    const deleteMyProduct = async (id: string) => {
        return await deleteProduct(id);
    }

    const updateProductImages = async (formData: FormData) => {
        try {
            const response = await fetch('/api/produits/updateImages', {
                method: 'POST',
                body: formData,
                
            });
            
            if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour des images');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la mise à jour des images:', error);
            throw error;
        }
    };
  
    return {
        produits,
        loading: loading.commandes,
        error: error.commandes,
        loadAllProducts,
        ajoutProduit,
        updateMyProduct,
        deleteMyProduct,
        updateProductImages
    };
  };