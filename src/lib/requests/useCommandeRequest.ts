import { getAllCommandesAction, getCommandeClientAction, getCommmandesStatAction, getOneCommandAction, updateCommandeAction } from "@/src/actions/commande/commandes";
import { useEffect, useState } from "react";
import { CommandeClientType, CommandeType } from '../queryClient';
import { useServerActionQuery } from "../hooks/server-actions-hooks";
import { getCommandeClient } from "../definitions/server-commande-actions";
import useAdminStore from "../store/adminStore";

export const useGetCommandeStat = () => {
    const [commandeTotal, setCommandeTotal] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCommmandesStatAction();
        if (data) {
          setCommandeTotal(data.totalCommandes);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
      }
    }

    fetchData();
  }, []);

  return {
    commandeTotal
    }
}

/// RECUPERER TOUTES LES COMMANDES
export const useGetAllCommande = () => {
    const [commandes, setcommandes] = useState<Array<CommandeType>>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllCommandesAction();
        if (data) {
            setcommandes(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
      }
    }

    fetchData();
  }, []);

  return {
    commandes
    }
}

/// RECUPERER UNE COMMANDE
export const useGetOneCommande = (id: string | null) => {
  const [oneCommande, setoneCommande] = useState<CommandeType | null>(null);

  useEffect(() => {
      async function fetchData() {
        if (id) {
          try {
              const data = await getOneCommandAction(id);
              if (data) {
                  setoneCommande(data);
              }
          } catch (error) {
              console.error("Erreur lors de la récupération d'une commande :", error);
          }
        }
      }

      fetchData();
  }, [id]);


  return {
      oneCommande,
  }
}

/// RECUPERER UNE COMMANDE D'UN CLIENT
export const useGetCommandeClient = (id: string) => {
  const { data, isPending } = useServerActionQuery(getCommandeClient, {
      input: { clientId: id },
      enabled: !!id,
      queryKey: ["commande-client", id]
  })

  return {
      myCommande: data as Array<CommandeClientType>,
      isCommandeClientLoading: isPending 
  }
}

//// COMMANDE MANAGER
export const useCommandesManager = () => {
  const { 
    commandes, 
    loading, 
    error, 
    getCommande 
  } = useAdminStore();

  const loadAllCommandes = async () => {
    return await getAllCommandesAction();
  };

  const loadOneCommande = async (id: string) => {
    return await getOneCommandAction(id);
  };

  const loadCommandeClient = async (id: string) => {
    return await getCommandeClientAction(id);
  };

  const changeCommandeStatus = async (id: number, statut: string) => {
    return await updateCommandeAction(id, statut);
  };

  return {
    commandes,
    loading: loading.commandes,
    error: error.commandes,
    getCommande,
    loadAllCommandes,
    loadOneCommande,
    loadCommandeClient,
    changeCommandeStatus
  };
};