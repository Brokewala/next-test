import { CommandeStatType, CommandeType } from "@/src/lib/queryClient";
import { host } from "@/src/lib/service_api";
import useAdminStore from "@/src/lib/store/adminStore";
// import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache";
// import { host } from "@/lib/service_api";

/// RECUPERER TOUS LES STATISTIQUES COMMANDES
export const getCommmandesStatAction = async () => {
  const res = await fetch(host + 'commande/stats');

  if (res.ok) {
    const data = await res.json();
    return data as CommandeStatType;
  }
}

// RECUPERER TOUS LES COMMANDES
export const getAllCommandesAction = async () => {
  const setCommandes = useAdminStore.getState().setCommandes;
  const setLoading = useAdminStore.getState().setLoading;
  const setError = useAdminStore.getState().setError;

  try {
    setLoading('commandes', true);
    const res = await fetch(host + 'commande');
    
    if (res.ok) {
      const data = await res.json();
      setCommandes(data as Array<CommandeType>);
      setError('commandes', null);
      return data;
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

/// RECUPERER UNE commande
export const getOneCommandAction = async (id: string) => {
  const setLoading = useAdminStore.getState().setLoading;
  const setError = useAdminStore.getState().setError;
  const updateCommande = useAdminStore.getState().updateCommande;
  
  try {
    setLoading('commandes', true);
    const res = await fetch(host + `commande/${parseInt(id)}`);

    if (res.status === 404) {
      console.log({ message: 'Commande non trouvée' });
      setError('commandes', 'Commande non trouvée');
      return null;
    }
  
    if (res.ok) {
      const data = await res.json() as CommandeType;
      // Mettre à jour le store avec les détails complets de la commande
      updateCommande(id, data);
      setError('commandes', null);
      return data;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande:", error);
    setError('commandes', error instanceof Error ? error.message : 'Une erreur est survenue');
    return null;
  } finally {
    setLoading('commandes', false);
  }
} 

/// MODIFIER STATUT COMMANDE
export const updateCommandeAction = async (id: number, statut: string) => {
  const setLoading = useAdminStore.getState().setLoading;
  const setError = useAdminStore.getState().setError;
  const updateCommande = useAdminStore.getState().updateCommande;
  
  try {
    setLoading('commandes', true);
    const req = await fetch(host + `commande/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ statut })
    });

    if (req.ok) {
      const data = await req.json() as CommandeType;
      // Mettre à jour le store avec les données de la commande mise à jour
      updateCommande(id.toString(), data);
      setError('commandes', null);
      return data;
    } else {
      throw new Error(`Erreur ${req.status}: ${req.statusText}`);
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande:", error);
    setError('commandes', error instanceof Error ? error.message : 'Une erreur est survenue');
    return null;
  } finally {
    setLoading('commandes', false);
  }
}

/// CREER UNE COMMANDE
export const createCommande = async (formdata: FormData) => {
  const req = await fetch(host + 'commande', {
    method: 'POST',
    body: formdata
  });

  if (req.status === 400 || req.status === 500) {
    return { message: "Erreur lors de la création de la commande" };
  }

  if (req.ok) {
    const data: CommandeType = await req.json();

    return { message: "Commande créée avec succès" , data };
  }
}

/// RECUPERER COMMANDE CLIENT
export const getCommandeClientAction = async (id: string) => {
  const setCommandes = useAdminStore.getState().setCommandes;
  const setLoading = useAdminStore.getState().setLoading;
  const setError = useAdminStore.getState().setError;

  try {
    setLoading('commandes', true);
    const res = await fetch("/api/" + `commande/clients?clientId=${parseInt(id)}`);

    if (res.ok) {
      const data = await res.json();
      setCommandes(data as Array<CommandeType>);
      setError('commandes', null);
      return data;
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

// DELETE COMMANDE
export const deleteCommandeAction = async (id: string) => {
  const req = await fetch(host + `commande/${id}`, {
    method: 'DELETE',
    // headers: {
    //   'Content-Type': 'application/json'
    // },
    // body: JSON.stringify({ statut })
  })

  if (req.ok) {
    const data: CommandeType = await req.json();
    return data;
  }
}