"use client";
import Nodata from '@/src/components/Nodata';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import Text from '@/src/components/ui/text';
import { LayoutClient } from '@/src/layouts/LayoutClient';
import { deleteCommandeClient } from '@/src/lib/definitions/server-commande-actions';
import { hashId } from '@/src/lib/hasheId';
import { QueryKeyFactory, useServerActionMutation } from '@/src/lib/hooks/server-actions-hooks';
import { CommandeClientType } from '@/src/lib/queryClient';
import { useGetCommandeClient } from '@/src/lib/requests/useCommandeRequest';
import { useGetUserConnect } from '@/src/lib/requests/userUserRequest';
import { getDateHeure } from '@/src/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Loader2Icon, LoaderCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';



export default function CommandesClient() {
    const router = useRouter();

    const { user_connecte } = useGetUserConnect();

    if (user_connecte) {
        if (user_connecte?.role === "ADMIN") {
            router.push("/admin/dashboard");
        }
    }

    const { myCommande } = useGetCommandeClient(user_connecte ? user_connecte?.client.id.toString() as string : "");

    return (
        <LayoutClient>
            <div className="w-full h-[25dvh] bg-cover bg-no-repeat bg-center flex justify-between relative before:absolute before:inset-0 before:bg-black/30 z-0">
                <div className="h-full flex flex-1 items-center justify-center flex-col gap-6 px-12 z-50">
                    <Text format="h1" weight="800" classNameStyle="text-2xl md:text-3xl text-start text-white uppercase">Jetter un coup d&apos;oeil à vos commandes</Text>
                </div>
            </div>
            <section className='w-full h-full p-6 relative bottom-8'>
                <div className="w-full">
                    <div className="w-full text-center   sm:text-left flex flex-row items-center gap-2">
                        <ChevronLeft size={25} className="cursor-pointer" onClick={() => router.back()} />
                        <Text format='h1' weight='800' classNameStyle='text-xl sm:text-2xl'>Commandes</Text>
                    </div>
                    <div className="w-full mt-8 ">
                        <Tabs defaultValue="EN_ATTENTE" className="w-full bg-transparent">
                            <TabsList className="w-full bg-transparent py-4 border-b border-teal-600 rounded-none flex justify-start">
                                <TabsTrigger value="EN_ATTENTE" className="px-4 py-1 bg-none">
                                    <Text format='h1' weight='normal' classNameStyle='text-md'>En attente</Text>
                                </TabsTrigger>
                                <TabsTrigger value="LIVRE" className="px-4 py-1 bg-none">
                                    <Text format='h1' weight='normal' classNameStyle='text-md'>Livré</Text>
                                </TabsTrigger>
                                <TabsTrigger value="ANNULER" className="px-4 py-1 bg-none">
                                    <Text format='h1' weight='normal' classNameStyle='text-md'>Annulée(s)</Text>
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="EN_ATTENTE" >
                                <div className="w-full h-full ">
                                    {myCommande ? myCommande.length > 0 ?
                                        <CommandeTable myCommande={myCommande} statut="EN_ATTENTE" clientId={user_connecte ? user_connecte?.client.id.toString() as string : ""} /> : <Nodata />
                                        :
                                        <div className="w-full h-[40dvh] flex justify-center items-center">
                                            <LoaderCircleIcon className="animate-spin text-teal-700" size={50} />
                                        </div>
                                    }
                                </div>
                            </TabsContent>
                            <TabsContent value="LIVRE">
                                <div className="w-full h-full ">
                                    {myCommande ? myCommande.length > 0 ?
                                        <CommandeTable myCommande={myCommande} statut="LIVRE" clientId={user_connecte ? user_connecte?.client.id.toString() as string : ""} /> : <Nodata />
                                        :
                                        <div className="w-full h-[40dvh] flex justify-center items-center">
                                            <LoaderCircleIcon className="animate-spin text-teal-700" size={50} />
                                        </div>
                                    }
                                </div>
                            </TabsContent>
                            <TabsContent value="ANNULER">
                                <div className="w-full h-full ">
                                    {myCommande ? myCommande.length > 0 ?
                                        <CommandeTable myCommande={myCommande} statut="ANNULER" clientId={user_connecte ? user_connecte?.client.id.toString() as string : ""} /> : <Nodata />
                                        :
                                        <div className="w-full h-[40dvh] flex justify-center items-center">
                                            <LoaderCircleIcon className="animate-spin text-teal-700" size={50} />
                                        </div>
                                    }
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </section>
        </LayoutClient>
    )
}

const CommandeTable = ({ myCommande, statut, clientId }: { myCommande: CommandeClientType[]; statut: "EN_ATTENTE" | "LIVRE" | "ANNULER"; clientId: string }) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    // Utiliser un objet pour suivre l'état de chargement de chaque commande
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

    const { mutate } = useServerActionMutation(deleteCommandeClient, {
        onSuccess: (_, variables) => {
            // Mettre à jour l'état de chargement pour cette commande spécifique
            setLoadingMap(prev => ({
                ...prev,
                [variables.idCommande]: false
            }));

            toast.success("Votre commande a été annulée !", {
                position: "top-center",
            });

            queryClient.refetchQueries({
                queryKey: QueryKeyFactory.getCommandeClient(clientId),
            });

            queryClient.refetchQueries({
                queryKey: QueryKeyFactory.getProduits(),
            });

            router.refresh();
            router.push("/commande");
        },
        onError: (error, variables) => {
            console.error(error);
            // Désactiver le chargement en cas d'erreur
            setLoadingMap(prev => ({
                ...prev,
                [variables.idCommande]: false
            }));
        }
    });

    const cancelCommande = (id: string) => {
        // Activer le chargement uniquement pour cette commande
        setLoadingMap(prev => ({
            ...prev,
            [id]: true
        }));

        try {
            mutate({ idCommande: id });
        } catch (e) {
            console.error(e);
            // Désactiver le chargement en cas d'erreur
            setLoadingMap(prev => ({
                ...prev,
                [id]: false
            }));
        }
    };

    return (
        <div className='w-full h-full mt-5'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Numéro de commande</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {myCommande?.filter(item => item.statut === statut).map(item => (
                        <TableRow key={item.id} className="cursor-pointer">
                            <TableCell className="font-medium">
                                <Text format="p" weight="800" classNameStyle="font-bold py-2">
                                    {hashId(item.id)}
                                </Text>
                            </TableCell>
                            <TableCell>{getDateHeure(item.createdAt)}</TableCell>
                            <TableCell>
                                {item.statut}
                            </TableCell>
                            {statut === "EN_ATTENTE" &&
                                <TableCell>
                                    {loadingMap[item.id.toString()] ?
                                        <Loader2Icon size={25} className='text-red-600 animate-spin' /> :
                                        <p className="text-red-600 cursor-pointer" onClick={() => cancelCommande(item.id.toString() as string)}>
                                            Supprimer
                                        </p>
                                    }
                                </TableCell>
                            }
                            <TableCell>
                                <Link href={`/commande/${item.id}`}>Voir</Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {myCommande?.filter(item => item.statut === statut).length === 0 && <Nodata />}
        </div>
    );
};