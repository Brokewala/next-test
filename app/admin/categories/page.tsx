"use client"

import Layout from '@/src/layouts/LayoutDash';
import { Button } from '@/src/components/ui/button';
import { Dialog } from '@/src/components/ui/dialog';
import { Input } from '@/src/components/ui/input';
import Text from '@/src/components/ui/text';
import ButtonNavigate from '@/src/lib/buttonNavigate';
import { useGetCategories } from '@/src/lib/requests/useCategoryRequest';
import { ArrowUpRight, ChevronLeftIcon, ListFilterIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

// was --------dd
const Page = () => {
  const route = useRouter();

  const { categories } = useGetCategories();

  const [nomRecherche, setnomRecherche] = React.useState("");

  const myCategorys = categories?.filter(categorie =>
    categorie.nom.toLowerCase().includes(nomRecherche.toLowerCase())
  );

  return (
    <Layout>
      <div className='flex flex-col gap-6'>
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-row gap-4 items-center">
            <ChevronLeftIcon size={25} onClick={() => route.back()} className='cursor-pointer' />
            <Text format="p" weight="800" classNameStyle="text-2xl">
              Catégories
            </Text>
          </div>
          <div className='flex flex-row gap-6'>
            <div className='flex flex-row gap-2 items-center'>
              <Input type='search' placeholder='Rechercher un produit' className='w-64' onChange={(e) => setnomRecherche(e.target.value)} />
              <ListFilterIcon size={18} strokeWidth={1.5} />
            </div>
            <Link href={'/admin/categories/add'}>
              <Button>
                Ajouter une catégorie
              </Button>
            </Link>
          </div>
        </div>

        <div className='w-full grid grid-cols-4 gap-6'>
          {myCategorys?.map(item => (
            <div className="relative p-1 h-40 border flex justify-center items-center rounded-lg shadow-lg bg-white border-zinc-100" key={item.id}>
              <Text format="p" classNameStyle="text-black text-lg">
                {item.nom}
              </Text>
              <ButtonNavigate path={`categories/${item.id}`}>
                <Button className="absolute bottom-4 right-4 w-8 h-8 rounded-lg">
                  <ArrowUpRight size={14} color="#FFF" />
                </Button>
              </ButtonNavigate>
            </div>
          ))}
        </div>
      </div>

      {/* /// MODAL CREATION CategoryType */}
      <Dialog open></Dialog>
    </Layout>
  );
}

export default Page;
