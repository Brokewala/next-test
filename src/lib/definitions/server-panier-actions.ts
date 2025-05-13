"use server";

import { addPanierAction, deletePanierAction, getMyPanierAction, updatePanierAction } from "@/src/actions/panier/panierAction";
import { z } from "zod";
import { createServerAction } from "zsa";
import { toForm } from '../utils';

/// DEFINITION GET PANIER
export const getPanierUser = createServerAction()
  .input(
    z.string()
  )
  .handler(async ({ input }) => {
    try {
      const panier = await getMyPanierAction(input);
      return panier;
    } catch (error) {
      throw error;
    }
  }
)

/// DEFINITION AJOUT PANIER
export const addPanierUser = createServerAction()
  .input(
    z.object({
        clientId: z.string(),
        produitId: z.string(),
        quantite: z.string()
      }),
      {
        type: "formData"
      }
  )
  .handler(async ({ input }) => {
    try {
      const panier = await addPanierAction(toForm(input));
      return panier;
    } catch (error) {
      throw error;  
    }
  }
)

/// DEFINITION AJOUT PANIER
export const updatePanierUser = createServerAction()
  .input(
    z.object({
        itemId: z.string(),
        quantite: z.string()
      }),
      {
        type: "formData"
      }
  )
  .handler(async ({ input }) => {
    try {
      const panier = await updatePanierAction(toForm(input));
      return panier;
    } catch (error) {
      throw error;  
    }
  }
)

/// DEFINITION AJOUT PANIER
export const deletePanierUser = createServerAction()
  .input(
    z.object({
        itemId: z.string(),
      }),
      {
        type: "formData"
      }
  )
  .handler(async ({ input }) => {
    try {
      const panier = await deletePanierAction(toForm(input));
      return panier;
    } catch (error) {
      throw error;  
    }
  }
)