'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LayoutClient } from '@/src/layouts/LayoutClient';
import { CategoryType, ProduitType } from '@/src/lib/queryClient';
import Button from '@/src/shared/Button/Button';
import { useGetAllProducts } from '@/src/lib/requests/useProductRequest';
import { useGetCategories } from '@/src/lib/requests/useCategoryRequest';
import { RiMicrosoftLoopFill } from 'react-icons/ri';
import { useGetUserConnect } from '@/src/lib/requests/userUserRequest';

const RecherchePage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const { products } = useGetAllProducts();
  const { categories } = useGetCategories();
  const [filteredProducts, setFilteredProducts] = useState<ProduitType[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryType[]>([]); // Nouvel état pour les catégories filtrées
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const router = useRouter();

  const { user_connecte } = useGetUserConnect();

  if (user_connecte) {
    if (user_connecte?.role === "ADMIN") {
      router.push("/admin/dashboard");
    }
  }

  // Filtrer les produits quand la requête ou la catégorie change
  useEffect(() => {
    let results = products || [];

    if (query.trim()) {
      results = results.filter((product) =>
        product.nom.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (selectedCategory) {
      results = results.filter((product) => product.categorieId === selectedCategory);
    }

    setFilteredProducts(results);
  }, [query, products, selectedCategory]);

  // Filtrer les catégories quand la requête change
  useEffect(() => {
    if (!categories) return;

    const results = categories.filter((category) =>
      category.nom.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredCategories(results);
  }, [query, categories]);

  // Trier les produits
  useEffect(() => {
    if (!filteredProducts.length) return;

    const sortedProducts = [...filteredProducts];

    switch (sortBy) {
      case 'price-asc':
        sortedProducts.sort((a, b) => a.prix - b.prix);
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.prix - a.prix);
        break;
      case 'relevance':
      default:
        break;
    }

    setFilteredProducts(sortedProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  return (
    <LayoutClient>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {query
              ? `Résultats de recherche pour "${query}"`
              : 'Tous nos produits'}
          </h1>
          <div className="flex items-center justify-between border-b pb-4">
            <p className="text-gray-600">
              {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Trier par:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="relevance">Pertinence</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Affichage des catégories filtrées */}
        {filteredCategories && filteredCategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Catégories</h2>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => setSelectedCategory(null)}
                className={`border px-4 py-2 rounded ${!selectedCategory ? 'bg-gray-200' : ''
                  }`}
              >
                Toutes
              </Button>
              {filteredCategories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`border px-4 py-2 rounded flex flex-row gap-4 items-center ${selectedCategory === category.id ? 'bg-gray-200' : ''
                    }`}
                >
                  {category.image ?
                    <Image
                      src={category.image}
                      alt={category.nom}
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    :
                    <RiMicrosoftLoopFill className="text-md text-primary" />
                  }
                  {category.nom}
                </Button>
              ))}
            </div>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl mb-4">Aucun produit trouvé pour &quot;{query}&quot;</p>
            <Button href="/nos-produits" className="border border-sky-600 w-fit mx-auto py-2 px-4">
              Voir tous nos produits
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link href={`/nos-produits/${product.id}`} key={product.id}>
                <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 relative">
                    <Image
                      src={product.image[0]}
                      alt={product.nom}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="font-semibold mb-2">{product.nom}</h2>
                    <p className="text-cyan-600 font-bold">{product.prix} €</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </LayoutClient>
  );
};

export default RecherchePage;