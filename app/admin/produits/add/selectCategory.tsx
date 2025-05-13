import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { useGetCategories } from '@/src/lib/requests/useCategoryRequest';
import React from 'react';

interface SCType {
  setCategory: React.Dispatch<React.SetStateAction<{
    id: number;
    nom: string;
  }>>;
}

export function SelectCategory({ setCategory }: SCType) {
  const { categories } = useGetCategories();

  const handleCategoryChange = (category: { id: number; nom: string }) => {
    setCategory(category);
  };

  return (
    <div className='w-full flex flex-col gap-6 mt-6'>
      <div className='w-full'>
        <Input type='search' placeholder='Trouver une catégorie' />
      </div>
      <ScrollArea className='w-full h-72'>
        <div className='w-full flex flex-col gap-4'>
          {categories && categories.map((category) => (
            <div key={category.id} className='w-full flex items-center gap-2 border px-4 rounded-md'>
              <Input
                type='radio'
                id={category.id.toString()}
                name='categorieId'
                value={category.id}
                className='w-4 h-4'
                onChange={() => handleCategoryChange(category)}
              />
              <Label htmlFor={category.id.toString()} className='w-full h-12 flex items-center'>{category.nom}</Label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
