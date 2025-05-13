"use client"

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { RiMicrosoftLoopFill } from "react-icons/ri";
import useShopStore from "../lib/store/shopStore";
import Text from "./ui/text";

interface CardPType {
  id: number;
  image: string[];
  nom: string;
  description: string;
  prix: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
  role: "CLIENT" | "ADMIN"
}

export default function CardProduct({ id, image, nom, description, prix, role, stock }: CardPType) {
  // const router = useRouter();

  // const cart = useShopStore((state) => state.cart);
  // const isInCart = cart.some((prod) => prod.items.some(item => item.produitId === id));
  // const addToCart = useShopStore((state) => state.addToCart);
  // const removeFromCart = useShopStore((state) => state.removeFromCart);
  // const user_connecte = useShopStore((state) => state.currentUser);
  const isLoggedIn = useShopStore((state) => state.isAuthenticated);

  // const [loading, setLoading] = useState(false);

  // const queryClient = useQueryClient();

  // const { mutate: mutationAddPanier, isPending } = useServerActionMutation(addPanierUser, {
  //   onSuccess: (data) => {
  //     const productToAdd: ProduitType = { id, nom, description, prix: parseFloat(prix), image, stock, createdAt, updatedAt };

  //     // if (data?.message === "Produit ajouté au panier") {
  //       toast(data?.message, { position: "top-center" });

  //       queryClient.refetchQueries({
  //         queryKey: QueryKeyFactory.getPanier(user_connecte ? user_connecte?.id.toString() as string : ""), //return the same query key as defined in our factory
  //       });
  //       router.refresh();
  //       addToCart(productToAdd);
  //     // } else {
  //     //   toast("Pas assez de produits. Stock insuffisant", { position: "top-center" });
  //     // }
  //   },
  //   onError: (error) => {
  //     throw error;
  //   }
  // })

  // const handleAddToCart = async () => {
  //   // setLoading(true);
  //   try {
  //     // const productToAdd: ProduitType = { id, nom, description, prix: parseFloat(prix), image, stock, createdAt, updatedAt };
  //     // await addToCart(productToAdd);
  //     if (parseInt(stock.toString()) === 0) {
  //       toast("Pas assez de produits. Stock insuffisant", { position: "top-center" });
  //       return;
  //     }

  //     const data = {
  //       clientId: user_connecte?.client.id.toString(),
  //       produitId: id,
  //       quantite: "1"
  //     };

  //     mutationAddPanier(toForm(data))
  //   } catch (e) {
  //     console.log(e)
  //   }
  // };

  // const { mutate, isPending: loadingRemove } = useServerActionMutation(deletePanierUser, {
  //   onSuccess: () => {
  //     removeFromCart(id);
  //     queryClient.refetchQueries({
  //       queryKey: QueryKeyFactory.getPanier(user_connecte ? user_connecte?.id.toString() as string : ""), //return the same query key as defined in our factory
  //     });
  //     router.refresh();
  //   }
  // })

  // const handleRemoveToCart = () => {
  //   // setLoading(true);
  //   try {
  //     mutate(toForm({ itemId: id }))
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  return (
    <div className="relative min-h-40 flex flex-col gap-4">
      {image ? (
        <div className="w-full h-64 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${image[0]})` }} />
      ) : (
        // <Skeleton className="w-full h-64 bg-cover bg-center rounded-lg" />
        <div className="w-full h-64 rounded-lg flex justify-center items-center">
          <RiMicrosoftLoopFill className="text-xl text-primary" />
        </div>
      )}

      <Text format="p" classNameStyle="text-black text-md" weight="800">{nom}</Text>
      <Text format="p" classNameStyle="text-sm">{description.length > 35 ? description.slice(0, 35) + "..." : description}</Text>

      <div className="flex flex-col gap-6">
        <div className="flex flex-row gap-2 items-end">
          <Text format="p" classNameStyle="text-lg text-sky-700" weight="800">{prix}</Text>
          <Text format="p" weight="800" classNameStyle="text-xs">KMF</Text>
        </div>

        <div><Text format="p" classNameStyle={stock > 0 ? "text-green-600" : "text-red-600"}>{stock > 0 ? "Stock disponible" : "Stock indisponible"}</Text></div>

        <div className="w-fit absolute top-4 right-4">
          {(
            <Link href={(role === "CLIENT" || !isLoggedIn) ? `/nos-produits/${id}` : ""} className="w-fit h-8 px-6 bg-white flex flex-row gap-2 items-center justify-center rounded-full text-black shadow-none">
              Voir <ArrowUpRight size={14} color="#252525" />
            </Link>
          )}

          {/* {(
            <Button
              onClick={isInCart ? handleRemoveToCart : handleAddToCart}
              className={`w-full ${isInCart ? "border border-red-600 hover:bg-red-100 bg-transparent text-red-600" : "bg-yellow-400 hover:bg-yellow-300 text-black border border-yellow-400"} flex gap-4 justify-center items-center py-2 rounded-md`}
              disabled={isPending || loadingRemove || !isLoggedIn && role !== "CLIENT" || !stock || stock === 0}
              aria-disabled={isPending || loadingRemove}
            >
              {isPending || loadingRemove ? (
                <Loader2Icon className="animate-spin" strokeWidth={2} size={18} color="#252525" />
              ) : isInCart ? (
                <>
                  <Text format="p">Retirer du panier</Text>
                  <TrashIcon strokeWidth={2} size={14} color="red" />
                </>
              ) : (
                <>
                  <Text format="p">Ajouter au panier</Text>
                  <ShoppingCartIcon strokeWidth={2} size={18} color="#252525" />
                </>
              )}
            </Button>
          )} */}
        </div>
      </div>
    </div>
  );
}