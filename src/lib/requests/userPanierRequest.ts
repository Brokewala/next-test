"use client"

import { useEffect } from "react";
import { getPanierUser } from "../definitions/server-panier-actions";
import { QueryKeyFactory, useServerActionQuery } from "../hooks/server-actions-hooks";
import { PanierType } from "../queryClient";
import useShopStore from "../store/shopStore";

/// RECUPERER PANIER
export const useGetMyPanier = (userId: string) => {
  const addToCart = useShopStore((state) => state.setCart);

  const { data, isPending } = useServerActionQuery(getPanierUser, {
    input: userId,
    queryKey: QueryKeyFactory.getPanier(userId ? userId : ""),
    enabled: !!userId
  });

  useEffect(() => {
    if (data) {
      addToCart([data as PanierType])
    };
  }, [data, addToCart])

  return {
    panier: data as PanierType,
    isLoading: isPending,
  };
}

/// AJOUTER PANIER
// export const useAddPanier = () => {
//   const { user_connecte } = useGetUserConnect();
//   const queryClient = useQueryClient();

//   const { isPending } = useServerActionMutation(addPanierUser, {
//     onSuccess: () => {
//       queryClient.refetchQueries({
//         queryKey: QueryKeyFactory.getPanier(user_connecte?.id.toString() as string), //return the same query key as defined in our factory
//       })
//     }
//   })
// }