"use client";

import { createCategoryAction } from '@/src/actions/category/categories';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import Text from '@/src/components/ui/text';
import Layout from '@/src/layouts/LayoutDash';
import { ChevronLeftIcon } from 'lucide-react';
// import { revalidateTag } from 'next/cache';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useFormStatus } from 'react-dom';
import IconChoise from './iconChoise';
import Image from 'next/image';

export default function Page() {
  const router = useRouter();
  const [imageCategory, setimageCategory] = React.useState<string>("");
  const [openIconDialog, setopenIconDialog] = React.useState(false);

  return (
    <Layout>
      <div className='w-full min-h-[70dvh] flex flex-col'>
        <div className='w-full flex flex-row gap-4 items-center'>
          <ChevronLeftIcon size={25} onClick={() => router.back()} className="cursor-pointer" />
          <Text format='p' weight='800' classNameStyle='text-md'>
            Retour
          </Text>
        </div>
        <div className='w-full h-[70dvh] flex justify-center items-center'>
          <Card className='w-1/3'>
            <CardHeader>
              <Text format='h2' weight='600'>Créer une catégorie</Text>
            </CardHeader>
            <CardContent>
              <form action={async (formdata) => {
                formdata.append('image', String(imageCategory));
                await createCategoryAction(formdata);
                // return revalidateTag("categories");
              }} className='flex flex-col gap-6'>
                <div className='flex flex-col gap-4'>
                  <Label htmlFor='nom'>Nom</Label>
                  <Input type='text' name='nom' placeholder='Entrer le nom de la catégorie' />
                </div>
                {/* parente ID */}
                <div className="w-ful">
                  <div className='flex flex-col gap-4'>
                    <Label>Icone</Label>
                    <Dialog
                      open={openIconDialog}
                      onOpenChange={setopenIconDialog}
                    >
                      <DialogTrigger>
                        <div className="flex flex-col gap-4">
                          <div className='w-full py-2 flex justify-center border border-black/50 border-dashed cursor-pointer rounded'>
                            <span className='text-sm'>Choisir l&apos;icône</span>
                          </div>
                          <div className='w-full h-8 flex justify-center items-center'>
                            {imageCategory && (
                              <Image src={imageCategory} alt="icon" width={30} height={30} />
                            )}
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Choisir une icône</DialogTitle>
                        <IconChoise imageCategory={imageCategory} setimageCategory={setimageCategory} />
                      </DialogContent>
                    </Dialog>
                    {/* <Input 
                      type='text' 
                      name='parent' 
                      value={searchParent} 
                      onChange={(e) => setSearchParent(e.target.value)} 
                       onFocus={() => setModleValue(true)}
                        onBlur={() => setTimeout(() => setModleValue(false), 200)}
                      placeholder='Entrer le parente de la catégorie' 
                      /> */}
                  </div>
                  {/* <div className="w-full relative">
                    {
                      modleValue && (
                        <div className="w-full flex  flex-col shadow-md absolute max-h-24 z-50 bg-white  rounded-sm overflow-auto">
                          {
                            dataCategorie ? dataCategorie.map((categorie, index) => (
                              <span onClick={() => handleParentId(categorie)} key={index} className=' px-5 hover:bg-slate-500 cursor-pointer hover:text-white transition-all duration-200'>{categorie.nom}</span>
                            )) : (
                              <span className=' px-5 hover:bg-slate-500 cursor-pointer hover:text-white transition-all duration-200'>Aucun resultat</span>
                            )
                          }

                        </div>
                      )
                    }

                  </div> */}

                </div>
                {/* submit */}
                <SubmitButton />
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' className='w-full' disabled={pending}>
      {pending ? 'Création...' : 'Créer'}
    </Button>
  );
}