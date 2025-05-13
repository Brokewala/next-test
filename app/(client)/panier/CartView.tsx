import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import Text from '@/src/components/ui/text';
import { createCommandeClient } from '@/src/lib/definitions/server-commande-actions';
import { updatePanierUser } from '@/src/lib/definitions/server-panier-actions';
import { QueryKeyFactory, useServerActionMutation } from '@/src/lib/hooks/server-actions-hooks';
import useShopStore from '@/src/lib/store/shopStore';
import { toForm } from '@/src/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Loader2Icon, MinusIcon, PlusIcon, ShoppingBagIcon, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

// Types pour les objets
interface Produit {
  id: number;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  image: string[];
}

interface CartItem {
  id: number;
  produit: Produit;
  quantite: number;
}

interface Cart {
  items: CartItem[];
}

interface CartViewProps {
  cart: Cart[];
  loading: boolean;
  handleRemoveToCart: (productId: string) => void;
}

const CartView: React.FC<CartViewProps> = ({ cart, loading, handleRemoveToCart }) => {
  const user_connecte = useShopStore((state) => state.currentUser);
  const router = useRouter();
  
  // Calcul de la somme totale AVANT le rendu des composants
  const calculerSommeTotal = (): number => {
    if (!cart[0]?.items || cart[0]?.items.length === 0) return 0;
    return cart[0].items.reduce((total, item) => total + (item.produit.prix * item.quantite), 0);
  };
  
  const sommeTotal = calculerSommeTotal();

  /// ENVOIE COMMANDE
  const queryClient = useQueryClient();
  const clearCart = useShopStore((state) => state.clearCart);
  
  const { isPending, mutate } = useServerActionMutation(createCommandeClient, {
    onSuccess: (data) => {
      if (data?.message === "Commande créée avec succès") {
        clearCart();
        toast.success("Envoyé ✅ ", {
          position: "top-center",
          action: {
            label: "Voir mes commandes",
            onClick: () => router.push("/commande"),
          }
        });
        queryClient.refetchQueries({
          queryKey: QueryKeyFactory.getPanier(user_connecte ? user_connecte?.id.toString() as string : ""), //return the same query key as defined in our factory
        });
        router.refresh();
        router.push("/panier");
      } else {
        toast("Votre commande n'est pas prise en compte", { position: "top-center" });
      }
    },
    onError: (error) => {
      throw error;
    }
  });

  // Affichage mode carte pour mobile
  const MobileCartView = () => (
    <div className="flex flex-col gap-4 md:hidden">
      {cart[0]?.items.map(item => {
        return (
          <Card key={item.id} className="p-4 space-y-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-3">
                <div className="w-14 h-14 rounded-md bg-cover" style={{ backgroundImage: `url(${item.produit.image[0]})` }} />
                <div>
                  <Text format="p" weight="800">{item.produit.nom}</Text>
                  <Text format="p" classNameStyle="text-xs">
                    {item.produit.description.length > 30
                      ? item.produit.description.slice(0, 30) + "..."
                      : item.produit.description}
                  </Text>
                </div>
              </div>

              {!loading ? (
                <Button className="bg-transparent hover:bg-transparent shadow-none p-1" onClick={() => handleRemoveToCart(item.produit.id.toString())}>
                  <Trash2Icon size={16} color="red" />
                </Button>
              ) : (
                <Loader2 size={16} color="red" className="animate-spin" />
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <Text format="p" weight="600" classNameStyle="text-sm text-gray-500">Prix unitaire</Text>
                <Text format="p" weight="800">{item.produit.prix} KMF</Text>
              </div>
              <div>
                <Text format="p" weight="600" classNameStyle="text-sm text-gray-500 pb-4">Quantité</Text>
                <ShowQtite
                  quantite={item.quantite}
                  produitId={item.id}
                  stock={item.produit.stock}
                  idPanier={item.id}
                  idUser={user_connecte?.id as number}
                />
              </div>
              <div className="text-center">
                <Text format="p" weight="600" classNameStyle="text-sm text-gray-500">Total</Text>
                <Text format="p" weight="800" classNameStyle="text-violet-700">
                  {item.produit.prix * item.quantite} KMF
                </Text>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  // Table pour desktop
  const DesktopCartView = () => (
    <div className="hidden md:block w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-2/5">Produits</TableHead>
            <TableHead className="w-1/6">Prix</TableHead>
            <TableHead className="w-1/6">Quantité</TableHead>
            <TableHead className="text-right w-1/6">Total</TableHead>
            <TableHead className="text-right w-1/12">Retirer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cart[0]?.items.map(item => {
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium py-4">
                  <div className="flex flex-row gap-4">
                    <div className="w-14 h-14 rounded-md bg-cover" style={{ backgroundImage: `url(${item.produit.image[0]})` }} />
                    <div className="flex flex-col gap-3">
                      <Text format="p" weight="800">{item.produit.nom}</Text>
                      <Text format="p">
                        {item.produit.description.length > 45
                          ? item.produit.description.slice(0, 45) + "..."
                          : item.produit.description}
                      </Text>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Text format="p" weight="800">{item.produit.prix} KMF</Text>
                </TableCell>
                <TableCell>
                  <ShowQtite
                    quantite={item.quantite}
                    produitId={item.id}
                    stock={item.produit.stock}
                    idPanier={item.id}
                    idUser={user_connecte?.id as number}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Text format="p" weight="800" classNameStyle="text-violet-700">
                    {item.produit.prix * item.quantite} KMF
                  </Text>
                </TableCell>
                <TableCell className="text-center">
                  {!loading ? (
                    <Button className="bg-transparent hover:bg-transparent shadow-none" onClick={() => handleRemoveToCart(item.produit.id.toString())}>
                      <Trash2Icon size={16} color="red" />
                    </Button>
                  ) : (
                    <Loader2 size={16} color="red" className="animate-spin" />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="w-full h-auto relative flex flex-col lg:flex-row gap-8">
      <ScrollArea className="w-full flex flex-1 min-h-[450px]">
        <div className="w-full p-1">
          <MobileCartView />
          <DesktopCartView />
        </div>
      </ScrollArea>

      <div className="w-full lg:w-[350px] h-screen relative">
        <div className='sticky top-12 w-[350px] h-[350px] border border-sky-700/50 bg-sky-700/5 p-4 rounded-xl'>
          <div className="py-6 px-4 border-b">
            <Text format="p" weight="800" classNameStyle="text-xl">Totalité</Text>
          </div>
          <div className="py-6 px-4 border-b flex justify-between items-center">
            <Text format="p">Total</Text>
            <Text format="p" weight="800" classNameStyle="text-md text-sky-700">
              {sommeTotal} KMF
            </Text>
          </div>
          <div className='absolute bottom-6 w-full flex justify-center items-center'>
            <Button onClick={() => mutate(toForm({ clientId: user_connecte?.client.id }))} className="w-1/2 bg-rose-600 hover:bg-rose-500" disabled={isPending}>
              {isPending ?
                <div className="flex flex-row gap-4 items-center">
                  <Text format="p">En cours...</Text>
                  <Loader2Icon size="18" className="animate-spin" />
                </div>
                :
                <div className="flex flex-row gap-4 items-center">
                  <Text format="p">Commander</Text>
                  <ShoppingBagIcon size={18} />
                </div>
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;

const ShowQtite = ({ quantite, produitId, stock, idPanier, idUser }: { quantite: number; produitId: number; stock: number; idPanier: number, idUser: number }) => {
  const router = useRouter();
  const { updateCartQuantity } = useShopStore((state) => state);
  // const updatedItem = quantite; // Stocke la valeur actuelle de la quantité

  const [status, setstatus] = useState("");

  const queryClient = useQueryClient();

  const { isPending: loadingPanier, mutate: mutationUpdatePanier } = useServerActionMutation(updatePanierUser, {
    onSuccess: (data) => {
      if (data?.message === "Modifier") {
        if (status === "moins") {
          updateCartQuantity(produitId.toString(), quantite - 1);
        } else if (status === "plus") {
          updateCartQuantity(produitId.toString(), quantite + 1);
        }

        // toast(data?.message, { position: "top-center" });
        queryClient.refetchQueries({
          queryKey: QueryKeyFactory.getPanier(idUser.toString() as string), //return the same query key as defined in our factory
        });
        router.refresh();
      } else {
        toast("Votre panier n'est pas mis à jour", { position: "top-center" });
      }
    },
    onError: (error) => {
      throw error;
    }
  });

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantite > 1) {
      setstatus("moins")
      // updateCartQuantity(produitId.toString(), quantite - 1);
      mutationUpdatePanier(toForm({ itemId: idPanier, quantite: quantite - 1 }));
    }
  };

  const increaseQuantity = () => {
    if (quantite + 1 > stock) return;
    setstatus("plus")
    mutationUpdatePanier(toForm({ itemId: idPanier, quantite: quantite + 1 }));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between items-center gap-4 border py-2 px-4 rounded-md">
        <MinusIcon size={18} className="cursor-pointer" onClick={decreaseQuantity} />
        {loadingPanier ? <Loader2Icon size={18} className="animate-spin" /> :
          quantite
        }
        <PlusIcon size={18} className="cursor-pointer" onClick={increaseQuantity} />
      </div>
      {/* {updatedItem !== quantite && <Button>Modifier</Button>} */}
    </div>
  );
};