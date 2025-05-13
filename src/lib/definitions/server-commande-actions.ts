import { createCommande, deleteCommandeAction, getCommandeClientAction } from "@/src/actions/commande/commandes";
import { z } from "zod";
import { createServerAction } from "zsa";
import { toForm } from "../utils";

/// DEFINITION ENVOIE COMMANDE
export const createCommandeClient = createServerAction()
  .input(
    z.object({
        clientId: z.string()
      }),
      {
        type: "formData"
      }
  )
  .handler(async ({ input }) => {
    try {
      const panier = await createCommande(toForm(input));
      return panier;
    } catch (error) {
      throw error;  
    }
  }
)

/// DEFINITION GET COMMANDE D'UN CLIENT
export const getCommandeClient = createServerAction()
  .input(
    z.object({
        clientId: z.string()
      }),
  )
  .handler(async ({ input }) => {
    try {
      const commande = await getCommandeClientAction(input.clientId);
      return commande;
    } catch (error) {
      throw error;
    }
  }
)

// SUPPRIMER COMMANDE
export const deleteCommandeClient = createServerAction()
  .input(
    z.object({
        idCommande: z.string()
      }),
  )
  .handler(async ({ input }) => {
    try {
      const commande = await deleteCommandeAction(input.idCommande);
      return commande;
    } catch (error) {
      throw error;  
    }
  }
)