import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import {
  createServerActionsKeyFactory,
  setupServerActionHooks,
} from "zsa-react-query"

export const QueryKeyFactory = createServerActionsKeyFactory({ 
  getPanier: (userId: string) => ["panier", userId ? userId : "default"],
  getAllCommandes: () => ["commandes"],
  getCommande: (commandeId: string) => ["commande", commandeId ? commandeId : "default"],
  getCommandeClient: (clientId: string) => ["commande-client", clientId ? clientId : "default"],
  getProduits: () => ["produits"],  
  getOneProduit: (produitId: string) => ["produits", produitId ? produitId : "default"],  
  getCategory: (id: string) => ["category", id ? id : "default"],
  getCategories: () => ["categories"], 
})  

const {
  useServerActionQuery,
  useServerActionMutation,
  useServerActionInfiniteQuery,
} = setupServerActionHooks({
  hooks: {
    useQuery: useQuery,
    useMutation: useMutation,
    useInfiniteQuery: useInfiniteQuery,
  },
  queryKeyFactory: QueryKeyFactory, 
})

export {
  useServerActionInfiniteQuery,
  useServerActionMutation,
  useServerActionQuery,
}