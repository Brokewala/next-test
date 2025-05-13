import { PanierType } from "@/src/lib/queryClient";
import { host } from "@/src/lib/service_api";

//// AJOUTER AU PANIER
export const addPanierAction = async (panier: FormData) => {
  const req = await fetch(host + "panier/add", {
    method: "POST",
    body: panier
  });

  if (req.ok) {
    const data = await req.json();
    if (req.status === 400 || req.status === 500) {
      return { message: "Pas assez de produits. Stock insuffisant" };
    }
    return {message: "Produit ajouté au panier", data};
  }
}

/// RECUPERER PANIER USER
export const getMyPanierAction = async (userId: string) => {
  const req = await fetch(host + `panier/${userId}`);

  if (req.ok) {
    const data = await req.json();
    return data as PanierType;
  }
}

//// AJOUTER AU PANIER
export const updatePanierAction = async (panier: FormData) => {
  const req = await fetch(host + "panier/update-quantity", {
    method: "POST",
    body: panier
  });

  if (req.ok) {
    const data = await req.json();
    if (req.status === 400 || req.status === 500) {
      return { message: "Pas assez de produits. Stock insuffisant" };
    }
    return {message: "Modifier", data};
  }
}

//// SUPPRIMER ELEMENT DANS PANIER
export const deletePanierAction = async (panier: FormData) => {
  const req = await fetch(host + "panier/remove", {
    method: "DELETE",
    body: panier
  });

  if (req.ok) {
    const data = await req.json();
    if (req.status === 400 || req.status === 500) {
      return { message: "Element non supprimé" };
    }
    return {message: "Delete", data};
  }
}