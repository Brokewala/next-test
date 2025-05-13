// USERS
export interface UserType {
    id: number;
    nom: string;
    email: string;
    adresse: string;
    client: {
      id: number;
    };
    role: "CLIENT" | "ADMIN";
  }

// CATEGORIES
export interface CategoryType {
    id: number;
    nom: string;
    image: string;
    produits: Array<ProduitType>
}

// STAT COMMANDE
export interface CommandeStatType {
    totalCommandes: number;
    topProduits: number
}

export type Client = {
    id: number;
    utilisateurId: number;
    utilisateur: UserType;
  };
  
// PRODUITS
export type ProduitType = {
    id: number;
    nom: string;
    description: string;
    prix: number;
    stock: number;
    image: string[];
    createdAt: string;
    updatedAt: string;
    keyWord: string;
    categorieId: number;
  };
  
export type ItemCommande = {
    id: number;
    quantite: number;
    prixUnitaire: number;
    createdAt: string;
    updatedAt: string;
    produitId: number;
    commandeId: number;
    produit: ProduitType;
  };
  
export type CommandeType = {
    id: number;
    date: string;
    statut: "EN_ATTENTE" | "EN_PREPARATION" | "EXPEDIE" | "LIVRE" | "ANNULE";
    createdAt: string;
    updatedAt: string;
    clientId: number;
    items: ItemCommande[];
    client: Client;
};
  
export type Item = {
    id: number;
    quantite: number;
    createdAt: string;
    updatedAt: string;
    produitId: number;
    panierId: string;
    produit: ProduitType;
  };
  
 export type PanierType = {
    id: string;
    createdAt: string;
    updatedAt: string;
    clientId: number;
    items: Item[];
    client: Client;
  };

export type CommandeClientType = {
  id: number;
  date: string;
  statut: "EN_ATTENTE" | "VALIDÉ" | "EXPÉDIÉ" | "LIVRE" | "ANNULE"; // Ajoute d'autres statuts si nécessaire
  createdAt: string;
  updatedAt: string;
  clientId: number;
  items: Item[];
  client: Client;
};

export interface ShopState {
  products: ProduitType[];
  cart: PanierType[];
  currency: string;
  addProduct: (product: ProduitType[]) => void;
  addToCart: (product: ProduitType) => void;
  addToCartStatus: { loading: boolean; error: string | null; success: string | null };
  removeFromCart: (productId: number) => void;
  setCart: (cart: PanierType[]) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalQuantity: () => number;
  updateCartQuantity: (productId: string, quantity: number) => void;
  setCurrency: (currency: string) => void;
}