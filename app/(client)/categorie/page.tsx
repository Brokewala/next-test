"use client";

import Text from "@/src/components/ui/text";
import { LayoutClient } from "@/src/layouts/LayoutClient";
import { useGetCategories } from "@/src/lib/requests/useCategoryRequest";
import { useGetUserConnect } from "@/src/lib/requests/userUserRequest";
import ButtonPrimary from "@/src/shared/Button/ButtonPrimary";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AllCategories() {
  const router = useRouter();

  const { categories } = useGetCategories();

  const { user_connecte } = useGetUserConnect();

  if (user_connecte) {
    if (user_connecte?.role === "ADMIN") {
      router.push("/admin/dashboard");
    }
  }

  return (
    <LayoutClient>
      <div className="w-full h-full container mx-auto p-8">
        <div className="flex flex-row items-center gap-4">
          <ArrowLeft size={14} onClick={() => router.back()} className="cursor-pointer" />
          <Text format="p" weight="800" classNameStyle="text-2xl">Toutes les Catégories</Text>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {categories?.map((category) => (
            <div
              key={category.id}
              className="border rounded-lg p-4 flex flex-col items-center text-center shadow-md"
            >
              <Image
                src={category.image}
                alt={category.nom}
                width={80}
                height={80}
                className="rounded-full mb-4"
              />
              <h2 className="text-lg font-semibold">{category.nom}</h2>
              {/* <p className="text-gray-600 mt-2">{category.description}</p> */}
              <ButtonPrimary
                href={`/categorie/${category.id}`}
                className="mt-4 py-2 rounded-none"
              >
                Voir les produits ➡
              </ButtonPrimary>
            </div>
          ))}
        </div>
      </div>
    </LayoutClient>
  );
}