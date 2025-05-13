"use client";

import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import Text from "@/src/components/ui/text";
import Layout from "@/src/layouts/LayoutDash";
import { hashId } from "@/src/lib/hasheId";
import { CommandeType } from "@/src/lib/queryClient";
import { useCommandesManager } from "@/src/lib/requests/useCommandeRequest";
import { getDateHeure, sommeTableau } from "@/src/lib/utils";
import { ChevronLeftIcon, Loader2Icon, WalletIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  myCommande: CommandeType | null;
};

const CommandeDetail = ({ myCommande }: Props) => {
  const route = useRouter();

  const somme: Array<number> = [];

  const [loading, setloading] = useState(false);

  const { changeCommandeStatus } = useCommandesManager();

  const handleAction = async (id: number, statut: string) => {
    setloading(true);
    try {
      await changeCommandeStatus(Number(id), statut).then(() =>
        setloading(false)
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Layout>
      <div className="w-full flex flex-col gap-12">
        <div className="flex flex-row gap-4 items-center">
          <ChevronLeftIcon size={25} onClick={() => route.back()} />
          <Text format="p" weight="800" classNameStyle="text-2xl">
            Commande ({myCommande?.client?.utilisateur?.nom})
          </Text>
        </div>

        <div className="flex flex-row gap-6">
          {/* <ScrollArea className='w-[60%] max-h-[450px]'> */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produits</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myCommande?.items.map((item) => {
                somme.push(item.prixUnitaire * item.quantite);

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium py-4">
                      <div className="flex flex-col gap-4">
                        <div className="w-14 h-14 rounded-md bg-zinc-100 overflow-hidden">
                          {item.produit?.image && (
                            <Image
                              src={item.produit?.image[0]}
                              alt=""
                              width={500}
                              height={500}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex flex-col gap-3">
                          <Text format="p" weight="800">
                            {item.produit.nom}
                          </Text>
                          <Text format="p">
                            {item.produit.description.length > 100
                              ? item.produit.description.slice(0, 100) + "..."
                              : item.produit.description}
                          </Text>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Text
                        format="p"
                        weight="800"
                        classNameStyle="w-24 text-md"
                      >
                        {item.prixUnitaire} KMF
                      </Text>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.quantite}
                    </TableCell>
                    <TableCell className="text-right w-28">
                      <Text
                        format="p"
                        weight="800"
                        classNameStyle="text-md text-violet-700"
                      >
                        {item.prixUnitaire * item.quantite} KMF
                      </Text>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {/* </ScrollArea> */}

          {/* //// FACTURE  */}
          <div className="w-[40%] h-fit sticky top-12 border border-violet-50 bg-zinc-100 rounded-lg p-4 grid grid-cols-1 gap-8">
            <div className="w-full flex flex-col gap-4 text-sm">
              <div className="flex flex-row gap-2">
                <Text format="p" weight="800">
                  Clé panier :
                </Text>
                <Text format="p">
                  {myCommande?.id
                    ? hashId(myCommande?.id as number)
                    : "Non défini"}
                </Text>
              </div>
              <div className="flex flex-row gap-2">
                <Text format="p" weight="800">
                  Client :
                </Text>
                <Text format="p">
                  {myCommande
                    ? myCommande?.client?.utilisateur?.nom
                    : "Non défini"}
                </Text>
              </div>
              <div className="flex flex-row gap-2">
                <Text format="p" weight="800">
                  Date de la commande :
                </Text>
                <Text format="p">
                  {myCommande?.createdAt
                    ? getDateHeure(myCommande?.createdAt)
                    : "Non défini"}
                </Text>
              </div>
              <div className="flex flex-row gap-2">
                <Text format="p" weight="800">
                  Statut :
                </Text>
                <Text
                  format="p"
                  weight="800"
                  classNameStyle={
                    myCommande?.statut === "EN_ATTENTE"
                      ? "text-orange-400"
                      : myCommande?.statut === "LIVRE"
                      ? "text-green-400"
                      : myCommande?.statut === "ANNULE"
                      ? "text-red-600"
                      : ""
                  }
                >
                  {myCommande?.statut ? myCommande?.statut : "Non défini"}
                </Text>
              </div>
            </div>
            <div className="w-full">
              <div className="p-4 w-full h-fit bg-violet-400 rounded-md space-y-8">
                <div className="flex flex-row gap-2 items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-100">
                    <WalletIcon size={16} color="violet" />
                  </div>
                  <Text format="p" weight="600" classNameStyle="text-white">
                    Total commande
                  </Text>
                </div>
                <Text
                  format="p"
                  weight="800"
                  classNameStyle="text-xl text-white"
                >
                  {sommeTableau(somme)} KMF
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* /// ACTIONS BTN */}
        {myCommande?.statut === "EN_ATTENTE" && (
          <div className="w-full flex flex-row gap-6 justify-center items-center">
            {loading ? (
              <div className="flex flex-row gap-4">
                <p className="animate-pulse">Chargement</p>
                <Loader2Icon className="animate-spin" />
              </div>
            ) : (
              <>
                <Button
                  className="w-fit bg-red-500 hover:bg-red-600"
                  onClick={() =>
                    handleAction(myCommande?.id as number, "ANNULE")
                  }
                >
                  Annuler
                </Button>
                <Button
                  className="w-fit bg-green-500 hover:bg-green-600"
                  onClick={() =>
                    handleAction(myCommande?.id as number, "LIVRE")
                  }
                >
                  Valider la commande
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CommandeDetail;
