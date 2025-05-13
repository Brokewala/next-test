import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { 
  UserType, 
  ProduitType, 
  CategoryType, 
  CommandeType,
  Client 
} from "../queryClient";
import { deleteSession, getUser } from "../session";

// Interface pour l'état de l'administrateur
interface AdminState {
  // États
  currentAdmin: UserType | null;
  isAuthenticated: boolean;
  commandes: CommandeType[];
  clients: Client[];
  categories: CategoryType[];
  produits: ProduitType[];
  loading: {
    commandes: boolean;
    clients: boolean;
    categories: boolean;
    produits: boolean;
  };
  error: {
    commandes: string | null;
    clients: string | null;
    categories: string | null;
    produits: string | null;
  };

  // Fonctions d'authentification
  setCurrentAdmin: (admin: UserType | null) => void;
  loadAdminData: () => Promise<void>;
  logout: () => void;

  // Gestion des commandes
  setCommandes: (commandes: CommandeType[]) => void;
  updateCommande: (commandeId: string, updatedCommande: Partial<CommandeType>) => void;
  getCommande: (commandeId: string) => CommandeType | undefined;
  
  // Gestion des clients
  setClients: (clients: Client[]) => void;
  
  // Gestion des catégories
  setCategories: (categories: CategoryType[]) => void;
  addCategorie: (categorie: CategoryType) => void;
  updateCategorie: (categorieId: string, updatedCategorie: Partial<CategoryType>) => void;
  deleteCategorie: (categorieId: string) => void;
  
  // Gestion des produits
  setProduits: (produits: ProduitType[]) => void;
  addProduit: (produit: ProduitType) => void;
  updateProduit: (produitId: string, updatedProduit: Partial<ProduitType>) => void;
  deleteProduit: (produitId: string) => void;

  // État de chargement et d'erreur
  setLoading: (key: keyof AdminState['loading'], value: boolean) => void;
  setError: (key: keyof AdminState['error'], value: string | null) => void;
  
  // Réinitialiser le store
  clearStore: () => void;
}

const initialState: AdminState = {
  currentAdmin: null,
  isAuthenticated: false,
  commandes: [],
  clients: [],
  categories: [],
  produits: [],
  loading: {
    commandes: false,
    clients: false,
    categories: false,
    produits: false,
  },
  error: {
    commandes: null,
    clients: null,
    categories: null,
    produits: null,
  },
  setCurrentAdmin: () => {},
  loadAdminData: async () => {},
  logout: () => {},
  setCommandes: () => {},
  updateCommande: () => {},
  setClients: () => {},
  setCategories: () => {},
  addCategorie: () => {},
  updateCategorie: () => {},
  deleteCategorie: () => {},
  setProduits: () => {},
  addProduit: () => {},
  updateProduit: () => {},
  deleteProduit: () => {},
  setLoading: () => {},
  setError: () => {},
  clearStore: () => {},
  getCommande: () => undefined,
};

const useAdminStore = create<AdminState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Authentification
        setCurrentAdmin: (admin: UserType | null) =>
          set((state) => ({
            ...state,
            currentAdmin: admin,
            isAuthenticated: admin !== null,
          })),
          
        loadAdminData: async () => {
          try {
            const userData = await getUser();
            if (userData && userData.role === "ADMIN") {
              set((state) => ({
                ...state,
                currentAdmin: userData as UserType,
                isAuthenticated: true,
              }));
            } else {
              console.error("User is not an admin");
              set((state) => ({
                ...state,
                error: {
                  ...state.error,
                  commandes: "Accès non autorisé. Vous devez être administrateur.",
                }
              }));
            }
          } catch (error) {
            console.error("Failed to load admin data:", error);
          }
        },
        
        logout: () => {
          deleteSession();
          set(initialState);
        },

        // Gestion des commandes
        setCommandes: (commandes: CommandeType[]) =>
          set((state) => ({
            ...state,
            commandes,
          })),
          
        updateCommande: (commandeId: string, updatedCommande: Partial<CommandeType>) =>
          set((state) => {
            const updatedCommandes = state.commandes.map((commande) =>
              commande.id.toString() === commandeId
                ? { ...commande, ...updatedCommande, updatedAt: new Date().toISOString() }
                : commande
            );
            
            return {
              ...state,
              commandes: updatedCommandes,
            };
          }),

        // Gestion des clients
        setClients: (clients: Client[]) =>
          set((state) => ({
            ...state,
            clients,
          })),

        // Gestion des catégories
        setCategories: (categories: CategoryType[]) =>
          set((state) => ({
            ...state,
            categories,
          })),
          
        addCategorie: (categorie: CategoryType) =>
          set((state) => ({
            ...state,
            categories: [...state.categories, categorie],
          })),
          
        updateCategorie: (categorieId: string, updatedCategorie: Partial<CategoryType>) =>
          set((state) => {
            const updatedCategories = state.categories.map((categorie) =>
              categorie.id.toString() === categorieId
                ? { ...categorie, ...updatedCategorie, updatedAt: new Date().toISOString() }
                : categorie
            );
            
            return {
              ...state,
              categories: updatedCategories,
            };
          }),
          
        deleteCategorie: (categorieId: string) =>
          set((state) => ({
            ...state,
            categories: state.categories.filter(
              (categorie) => categorie.id.toString() !== categorieId
            ),
          })),

        // Gestion des produits
        setProduits: (produits: ProduitType[]) =>
        set((state) => ({
          ...state,
          produits,
        })),
        addProduit: (produit: ProduitType) =>
          set((state) => ({
            ...state,
            produits: [...state.produits, produit],
          })),
          
        updateProduit: (produitId: string, updatedProduit: Partial<ProduitType>) =>
          set((state) => {
            const updatedProduits = state.produits.map((produit) =>
              produit.id.toString() === produitId
                ? { ...produit, ...updatedProduit, updatedAt: new Date().toISOString() }
                : produit
            );
            
            return {
              ...state,
              produits: updatedProduits,
            };
          }),
          
        deleteProduit: (produitId: string) =>
          set((state) => ({
            ...state,
            produits: state.produits.filter(
              (produit) => produit.id.toString() !== produitId
            ),
          })),

        // Gestion du chargement et des erreurs
        setLoading: (key: keyof AdminState['loading'], value: boolean) =>
          set((state) => ({
            ...state,
            loading: {
              ...state.loading,
              [key]: value,
            },
          })),
          
        setError: (key: keyof AdminState['error'], value: string | null) =>
          set((state) => ({
            ...state,
            error: {
              ...state.error,
              [key]: value,
            },
          })),
        
        // Réinitialiser le store
        clearStore: () => {
          set(initialState);
        },

        // Gestion des commandes
        getCommande: (commandeId: string) => {
          const state = get();
          return state.commandes.find(
            (commande) => commande.id.toString() === commandeId
          );
        },
      }),
      {
        name: "admin-store", // nom de l'élément dans le stockage
        partialize: (state) => ({
          currentAdmin: state.currentAdmin,
          isAuthenticated: state.isAuthenticated,
          commandes: state.commandes,
          clients: state.clients,
          categories: state.categories,
          produits: state.produits,
        }),
      }
    )
  )
);

export default useAdminStore;