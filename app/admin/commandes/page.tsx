"use client";

import Layout from "@/src/layouts/LayoutDash";
import { Input } from "@/src/components/ui/input";
import Text from "@/src/components/ui/text";
import ButtonNavigate from "@/src/lib/buttonNavigate";
import { hashId } from "@/src/lib/hasheId";
import {
  useCommandesManager,
} from "@/src/lib/requests/useCommandeRequest";
import { ChevronLeftIcon, KeyRoundIcon, ListFilterIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const route = useRouter();

  const { loading, loadAllCommandes, commandes } = useCommandesManager();

  useEffect(() => {
      loadAllCommandes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [nomRecherche, setnomRecherche] = React.useState("");

  const myCommandes = commandes?.filter((commande) =>
    hashId(commande.id).includes(nomRecherche)
  );

  // if (loading) {
  //   return <div className="loading">Chargement des commandes...</div>;
  // }
  
  // if (error) {
  //   return <div className="error">Erreur: {error}</div>;
  // }

  return (
    <Layout>
      <div className="flex flex-col gap-12">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-row gap-4 items-center">
            <ChevronLeftIcon size={25} onClick={() => route.back()} className="cursor-poitner" />
            <Text format="p" weight="800" classNameStyle="text-2xl">
              Commandes (Paniers)
            </Text>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Input
              type="search"
              placeholder="Rechercher un produit"
              className="w-64"
              onChange={(e) => setnomRecherche(e.target.value)}
            />
            <ListFilterIcon size={18} strokeWidth={1.5} />
          </div>
        </div>

        {loading &&
          <div className="w-full h-[350px] flex justify-center items-center">
            <Loader2Icon size={35} className="animate-spin" />
            <p className="text-center">Chargement</p>
          </div>
        }

        <div className="w-full grid grid-cols-4 gap-6">
          {myCommandes?.map((item) => (
            <ButtonNavigate path={`commandes/${item.id}`} key={item.id}>
              <div className="w-full p-4 border border-zinc-100 hover:border-violet-400 shadow-lg hover:bg-violet-200 rounded-lg space-y-6 ease-in-out duration-200 cursor-pointer">
                <div className="w-full flex flex-row items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                    <KeyRoundIcon size={16} strokeWidth={1.5} color="violet" />
                  </div>
                  <Text format="p" weight="800">
                    {hashId(item.id)}
                  </Text>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Text
                    format="p"
                    classNameStyle="text-black text-center"
                    weight="800"
                  >
                    Client :
                  </Text>
                  <Text format="p" classNameStyle="text-black text-center">
                    {item.client.utilisateur.nom}
                  </Text>
                </div>
              </div>
            </ButtonNavigate>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Page;
