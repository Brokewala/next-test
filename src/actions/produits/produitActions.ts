import { ProduitType } from "@/src/lib/queryClient";
import { host } from "@/src/lib/service_api";
import useAdminStore from "@/src/lib/store/adminStore";
// import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache";
import { redirect } from "next/navigation";

// RECUPERER TOUS LES PRODUITS
export const getAllProductsAction = async () => {
  const setProducts = useAdminStore.getState().setProduits;
  const setLoading = useAdminStore.getState().setLoading;
  const setError = useAdminStore.getState().setError;

  try {
    setLoading('produits', true);
    const res = await fetch(host + 'produits');
    
    if (res.ok) {
      const data = await res.json();
      setProducts(data as Array<ProduitType>);
      setError('produits', null);
      return data as Array<ProduitType>;
    } else {
      throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    setError('commandes', error instanceof Error ? error.message : 'Une erreur est survenue');
    return [];
  } finally {
    setLoading('commandes', false);
  }
}

// RECUPERER UN PRODUIT
export const getOneProductAction = async (id: string) => {
  const res = await fetch(host + `produits/${id}`);

    if (res.ok) {
      const data = await res.json();
      return data as ProduitType;
    }
}

// CREER UN PRODUIT
export const createProduct = async (formdata: FormData) => {
  const setLoading = useAdminStore.getState().setLoading;
  const setError = useAdminStore.getState().setError;
  const addProduct = useAdminStore.getState().addProduit;

  try {
    setLoading('produits', true);
    const req = await fetch(host + 'produits', {
      method: 'POST',
      body: formdata
    })

    if (req.ok) {
      const data = await req.json();
      addProduct(data);
      setError('commandes', null);
      redirect('/produits');
    } else {
      throw new Error(`Erreur ${req.status}: ${req.statusText}`);
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande:", error);
    setError('produits', error instanceof Error ? error.message : 'Une erreur est survenue');
    return null;
  } finally {
    setLoading('produits', false);
  }
}

// MODIFIER UN PRODUIT
export const updateProduct = async (
  id: string,
  { nom, description, stock, prix, keyWord }: { nom: string; description: string; stock: number; prix: number; keyWord: string }
) => {
  const setLoading = useAdminStore.getState().setLoading;
  const setError = useAdminStore.getState().setError;
  const updateProduit = useAdminStore.getState().updateProduit;

  try {
    setLoading('produits', true);
    const req = await fetch(host + `produits/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nom, description, stock, prix, keyWord }),
    });

    if (req.ok) {
      const data = await req.json();
      updateProduit(id, data);
      setError('produits', null);
      redirect('/produits');
    } else {
      throw new Error(`Erreur ${req.status}: ${req.statusText}`);
    }
  } catch (error) {
    console.error("Erreur lors de la modification du produit:", error);
    setError('produits', error instanceof Error ? error.message : 'Une erreur est survenue');
    return null;
  } finally {
    setLoading('produits', false);
  }
};

// SUPPRIMER UN PRODUIT
export const deleteProduct = async (id: string) => {
  const setLoading = useAdminStore.getState().setLoading;
  const setError = useAdminStore.getState().setError;
  const removeProduit = useAdminStore.getState().deleteProduit;

  try {
    setLoading('produits', true);
    const req = await fetch(host + `produits/${id}`, {
      method: 'DELETE',
    });

    if (req.ok) {
      removeProduit(id);
      setError('produits', null);
      redirect('/produits');
    } else {
      throw new Error(`Erreur ${req.status}: ${req.statusText}`);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error);
    setError('produits', error instanceof Error ? error.message : 'Une erreur est survenue');
    return null;
  } finally {
    setLoading('produits', false);
  }
};