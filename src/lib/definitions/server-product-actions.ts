import { getOneProductAction } from "@/src/actions/produits/produitActions";
import { z } from "zod";
import { createServerAction } from "zsa";

/// DEFINITION GET PRODUCT
export const getOneProductDefinition = createServerAction()
  .input(
    z.string()
  )
  .handler(async ({ input }) => {
    try {
      const panier = await getOneProductAction(input);
      return panier;
    } catch (error) {
      throw error;
    }
  }
)