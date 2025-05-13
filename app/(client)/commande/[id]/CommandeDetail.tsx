"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import Text from "@/src/components/ui/text";
import { LayoutClient } from "@/src/layouts/LayoutClient";
import { hashId } from "@/src/lib/hasheId";
import { CommandeType } from "@/src/lib/queryClient";
import { getDateHeure, sommeTableau } from "@/src/lib/utils";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import { useRef } from "react";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useRouter } from "next/navigation";
import { useGetUserConnect } from "@/src/lib/requests/userUserRequest";

type Props = {
  myCommande: CommandeType | null;
};

const CommandeDetail = ({ myCommande }: Props) => {
  const route = useRouter();

  const { user_connecte } = useGetUserConnect();

  if (user_connecte) {
    if (user_connecte?.role === "ADMIN") {
      route.push("/admin/dashboard");
    }
  }

  const somme: Array<number> = [];

  const ref = useRef<HTMLDivElement>(null);

  const downloadPDF = async (): Promise<void> => {
    if (!ref.current) return;

    const canvas = await html2canvas(ref.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 5, 5, 200, 0);
    pdf.save(`commande-${hashId(myCommande?.id as number)}.pdf`);
  };

  return (
    <LayoutClient>
      <div className="w-full flex flex-col gap-12 p-12" ref={ref}>
        <div className="flex flex-row gap-4 items-center">
          {/* <ChevronLeftIcon size={25} onClick={() => route.back()} /> */}
          <Text format="p" weight="800" classNameStyle="text-2xl">
            Référence n° {hashId(parseInt(myCommande?.id.toString() as string))}
          </Text>
        </div>

        <div className="flex flex-col gap-6">
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
                              src={item.produit?.image[0] as string}
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
                    <TableCell className="text-right w-fit">
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
          <div className="w-full h-fit top-12 rounded-lg pt-8 grid grid-cols-1 gap-8 border-t-2">
            <div className="w-full flex flex-col gap-4 text-sm">
              <div className="flex flex-row gap-2">
                <Text format="p" weight="800">
                  Référence :
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
              <div className="w-full h-fit  rounded-md space-y-4">
                <div className="flex flex-row gap-2 items-center">
                  {/* <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black">
                    <WalletIcon size={16} color="violet" />
                  </div> */}
                  <Text format="p" weight="600" classNameStyle="text-black">
                    Total commande
                  </Text>
                </div>
                <Text
                  format="p"
                  weight="800"
                  classNameStyle="text-2xl text-black"
                >
                  {sommeTableau(somme)} KMF
                </Text>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div onClick={downloadPDF} className="fixed bottom-12 right-12 w-fit px-4 py-2 bg-red-400 rounded cursor-pointer text-white">Télécharger la facture</div>
    </LayoutClient>
  );
};

export default CommandeDetail;
