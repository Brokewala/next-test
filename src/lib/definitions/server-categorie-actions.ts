import { getOneCategorieAction } from "@/src/actions/category/categories";
import { z } from "zod";
import { createServerAction } from "zsa";

/// DEFINITION GET CATEGORIE
export const getOneCategorie = createServerAction()
  .input(
    z.string()
  )
  .handler(async ({ input }) => {
    try {
      const categorie = await getOneCategorieAction(input);
      return categorie;
    } catch (error) {
      throw error;  
    }
  }
)