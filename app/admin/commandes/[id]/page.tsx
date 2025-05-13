"use client"

import { CommandeType } from '@/src/lib/queryClient';
import { useCommandesManager } from '@/src/lib/requests/useCommandeRequest';
import { Suspense, useEffect, useState } from 'react';
import CommandeDetail from './CommandeDetail';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { id } = await params;
      setId(id);
    }
    fetchData();
  }, [params]);
  
  const { getCommande, loadOneCommande } = useCommandesManager();

  const commande = getCommande(id ? id :"");

  useEffect(() => {
    if (id) {
      if (!commande) {
        loadOneCommande(id);
      }
    }
  }, [id, commande, loadOneCommande]);


  // if (loading) return <div>Chargement des détails de la commande...</div>;
  // if (error) return <div>Erreur: {error}</div>;
  // if (!commande) return <div>Commande non trouvée</div>;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CommandeDetail myCommande={commande as CommandeType} />
    </Suspense>
  );
}