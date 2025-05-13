export function CategoryMethode(categories: Array<CategoryType>): Array<CategoryType> {
    const categoryMap: Record<string, CategoryType> = {}; // Stocke les catégories par ID
    const rootCategories: CategoryType[] = []; // Stocke les catégories racines

    // Initialiser les catégories avec un champ `children`
    categories.forEach(category => {
        categoryMap[String(category.id)] = { ...category, children: [] };
    });

    // Construire la hiérarchie des catégories
    categories.forEach(category => {
        if (category.parentId) {
            const parent = categoryMap[String(category.parentId)];
            if (parent) {
                // Assurer que `children` existe toujours
                parent.children = parent.children || [];
                parent.children.push(categoryMap[String(category.id)]);
            }
        } else {
            // Ajouter à la liste des catégories racines si pas de parent
            rootCategories.push(categoryMap[String(category.id)]);
        }
    });

    return rootCategories;
}

// Définition des types
export interface CategoryType {
    id: number;
    nom: string;
    parentId?: string;  // Facultatif car certaines catégories sont au niveau racine
    produits: Array<ProduitType>;
    children?: Array<CategoryType>; // Gérer les sous-catégories à l'infini
}

export interface ProduitType {
    id: number;
    nom: string;
}
