import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Client, Item, PanierType, ProduitType, ShopState, UserType } from "../queryClient";
import { deleteSession, getUser } from "../session";

// Extend the ShopState interface to include user authentication and setCart
interface ExtendedShopState extends ShopState {
  currentUser: UserType | null;
  isAuthenticated: boolean;
  setCurrentUser: (user: UserType | null) => void;
  loadUserData: () => Promise<void>;
  logout: () => void;
  setCart: (cart: PanierType[]) => void; // Add the setCart function
}

const initialState: ExtendedShopState = {
  products: [],
  cart: [],
  currency: "",
  currentUser: null,
  isAuthenticated: false,
  addProduct: () => {},
  addToCart: () => {},
  addToCartStatus: {
    loading: false,
    error: null,
    success: null,
  },
  removeFromCart: () => {},
  clearCart: () => {},
  totalPrice: () => 0,
  totalQuantity: () => 0,
  updateCartQuantity: () => {},
  setCurrency: () => {},
  setCurrentUser: () => {},
  loadUserData: async () => {},
  logout: () => {},
  setCart: () => {}, // Initialize the setCart function
};

const useShopStore = create<ExtendedShopState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        // Add the setCart function implementation
        setCart: (newCart: PanierType[]) =>
          set((state) => ({
            ...state,
            cart: newCart,
          })),
        addProduct: (newProducts: ProduitType[]) =>
          set((state) => {
            return {
              ...state,
              products: newProducts,
            };
          }
        ),
          addToCart: (product: ProduitType) => {
            set((state) => {
              // Local cart update logic
              if (state.cart.length === 0) {
                // Create a client based on currentUser if available
                let clientData: Client;
                
                if (state.currentUser) {
                  clientData = {
                    id: state.currentUser.client?.id || 0,
                    utilisateurId: state.currentUser.id,
                    utilisateur: state.currentUser
                  };
                } else {
                  clientData = {
                    id: 0,
                    utilisateurId: 0,
                    utilisateur: {
                      id: 0,
                      nom: "",
                      email: "",
                      adresse: "",
                      client: { id: 0 },
                      role: "CLIENT"
                    }
                  };
                }
                
                // Create a new cart
                const newPanier: PanierType = {
                  id: "temp-" + Date.now(),
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  clientId: clientData.id,
                  items: [{
                    id: 0,
                    quantite: 1,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    produitId: product.id,
                    panierId: "temp-" + Date.now(),
                    produit: product
                  }],
                  client: clientData
                };
                
                return {
                  ...state,
                  cart: [newPanier],
                };
              } else {
                // Update existing cart
                const existingCart = [...state.cart];
                const cartIndex = 0;
                const existingItemIndex = existingCart[cartIndex].items.findIndex(
                  (item) => item.produitId === product.id
                );
  
                if (existingItemIndex >= 0) {
                  // Update quantity for existing item
                  const updatedItems = [...existingCart[cartIndex].items];
                  updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantite: updatedItems[existingItemIndex].quantite + 1,
                    updatedAt: new Date().toISOString()
                  };
  
                  existingCart[cartIndex] = {
                    ...existingCart[cartIndex],
                    items: updatedItems,
                    updatedAt: new Date().toISOString()
                  };
                } else {
                  // Add new item
                  const newItem: Item = {
                    id: 0,
                    quantite: 1,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    produitId: product.id,
                    panierId: existingCart[cartIndex].id,
                    produit: product
                  };
  
                  existingCart[cartIndex] = {
                    ...existingCart[cartIndex],
                    items: [...existingCart[cartIndex].items, newItem],
                    updatedAt: new Date().toISOString()
                  };
                }
  
                return {
                  ...state,
                  cart: existingCart,
                };
              }
            });
          },
        updateCartQuantity: (productId: string, quantity: number) =>
          set((state) => {
            if (state.cart.length === 0) return state;
            
            const existingCart = [...state.cart];
            const cartIndex = 0; // Assuming we're always working with the first cart
            
            const updatedItems = existingCart[cartIndex].items.map(item => 
              item.produit.id.toString() === productId 
                ? { ...item, quantite: quantity, updatedAt: new Date().toISOString() } 
                : item
            );
            
            existingCart[cartIndex] = {
              ...existingCart[cartIndex],
              items: updatedItems,
              updatedAt: new Date().toISOString()
            };
            
            return {
              ...state,
              cart: existingCart
            };
          }),
        removeFromCart: (productId: number) =>
          set((state) => {
            if (state.cart.length === 0) return state;
            
            const existingCart = [...state.cart];
            const cartIndex = 0; // Assuming we're always working with the first cart
            
            const filteredItems = existingCart[cartIndex].items.filter(
              item => item.produit.id.toString() !== productId.toString()
            );
            
            // If there are no items left, clear the cart
            if (filteredItems.length === 0) {
              return {
                ...state,
                cart: []
              };
            }
            
            existingCart[cartIndex] = {
              ...existingCart[cartIndex],
              items: filteredItems,
              updatedAt: new Date().toISOString()
            };
            
            return {
              ...state,
              cart: existingCart
            };
          }),
        clearCart: () =>
          set((state) => ({
            ...state,
            cart: [],
          })),
        totalPrice: () => {
          const cart = get().cart;
          if (cart.length === 0) return 0;
          
          return cart[0].items.reduce((total, item) => {
            return total + (item.produit.prix * item.quantite);
          }, 0);
        },
        setCurrency: (currency: string) =>
          set((state) => ({
            ...state,
            currency: currency,
          })),

        totalQuantity: () => {
          const cart = get().cart;
          if (cart.length === 0) return 0;
          
          return cart[0].items.reduce((total, item) => total + item.quantite, 0);
        },
        // User authentication functions
        setCurrentUser: (user: UserType | null) =>
          set((state) => ({
            ...state,
            currentUser: user,
            isAuthenticated: user !== null,
          })),
        loadUserData: async () => {
          try {
            const userData = await getUser();
            if (userData) {
              set((state) => ({
                ...state,
                currentUser: userData as UserType,
                isAuthenticated: true,
              }));
            }
          } catch (error) {
            console.error("Failed to load user data:", error);
          }
        },
        logout: () => {
          deleteSession()
          set((state) => ({
            ...state,
            currentUser: null,
            isAuthenticated: false,
            cart: [], // Clear cart on logout
          }))
        },
        clearStore: () => {
          set(initialState);
        },
      }),
      {
        name: "shop-store", // name of the item in storage
        partialize: (state) => ({
          products: state.products,
          cart: state.cart,
          currency: state.currency,
          currentUser: state.currentUser,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);

export default useShopStore;