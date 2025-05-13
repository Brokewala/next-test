"use client";

import React from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import Text from "@/src/components/ui/text";
import Layout from "@/src/layouts/LayoutDash";
import { ChevronLeftIcon, Loader2Icon, MoreHorizontalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SelectCategory } from "./selectCategory";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import Image from "next/image";
import { Textarea } from "@/src/components/ui/textarea";
import { useProductsManager } from "@/src/lib/requests/useProductRequest";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

export default function Page() {
  const router = useRouter();

  const [openCategories, setopenCategories] = React.useState(false);
  const [category, setCategory] = React.useState({
    id: 0,
    nom: "",
  });

  const [files, setFiles] = React.useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = React.useState<string[]>([]);

  React.useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    const validFiles: File[] = [];
  
    newFiles.forEach((file) => {
      if (file.size > 4 * 1024 * 1024) {
        toast.warning(`L'image ${file.name} dépasse 4 Mo et n'a pas été ajoutée.`, {
          position: "top-center",
          duration: 5000,
          style: {
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
          },
        });
      } else {
        validFiles.push(file);
      }
    });
  
    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };
  

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const { ajoutProduit } = useProductsManager();

  const validationSchema = Yup.object().shape({
    nom: Yup.string().required("Le nom est requis"),
    description: Yup.string().required("La description est requise"),
    prix: Yup.number()
      .required("Le prix est requis")
      .positive("Le prix doit être positif"),
    stock: Yup.number()
      .required("La quantité est requise")
      .min(0, "La quantité doit être au moins 0"),
    keyWord: Yup.string().required("Le mot clé est requis"),
  });

  const handleSubmit = async (
    values: {
      nom: string;
      description: string;
      prix: number;
      stock: number;
      keyWord: string;
    },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    if (category.id === 0) {
      toast.warning("Sélectionner une catégorie !");
      setSubmitting(false);
      return;
    }

    const formdata = new FormData();
    formdata.append("nom", values.nom);
    formdata.append("description", values.description);
    formdata.append("prix", values.prix.toString());
    formdata.append("stock", values.stock.toString());
    formdata.append("keyWord", values.keyWord);
    formdata.append("categorieId", category.id.toString());
    files.forEach((file) => formdata.append("images", file));

    try {
      await ajoutProduit(formdata);
      toast.success("Produit créé avec succès !");
      router.push("/admin/produits");
    } catch (e) {
      toast.error("Une erreur est survenue lors de la création du produit.");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="w-full min-h-[70dvh] flex flex-col gap-12">
        <div className="w-full flex flex-row gap-4 items-center">
          <ChevronLeftIcon size={25} onClick={() => router.back()} className="cursor-pointer" />
          <Text format="p" weight="800" classNameStyle="text-md">
            Retour
          </Text>
        </div>
        <ScrollArea className="min-h-[80dvh]">
          <div className="w-full flex justify-center items-center">
            <Card className="w-full">
              <CardHeader>
                <Text format="h2" weight="600">
                  Créer un produit
                </Text>
              </CardHeader>
              <CardContent>
                <Formik
                  initialValues={{
                    nom: "",
                    description: "",
                    prix: 0,
                    stock: 0,
                    keyWord: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, errors, touched }) => (
                    <Form className="flex flex-row gap-6">
                      <div className="w-full flex flex-1 flex-col items-center gap-2">
                        <label className="w-full h-full flex flex-col gap-6 items-center justify-center px-4 py-2 bg-transparent text-black rounded-lg border cursor-pointer">
                          <Text format="p">📁 Choisir des images</Text>
                          <input
                            type="file"
                            name="images"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                        <div className="w-full grid grid-cols-3 gap-4 mt-4">
                          {previewUrls.map((url, index) => (
                            <div key={index} className="relative">
                              <Image
                                src={url}
                                alt={`Image ${index + 1}`}
                                width={100}
                                height={100}
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(index)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col gap-6">
                        <div className="flex flex-col gap-4">
                          <Label htmlFor="nom">Nom</Label>
                          <Field
                            as={Input}
                            type="text"
                            name="nom"
                            placeholder="Entrer le nom du produit"
                          />
                          {errors.nom && touched.nom && (
                            <Text format="p" classNameStyle="text-red-500">
                              {errors.nom}
                            </Text>
                          )}
                        </div>
                        <div className="flex flex-col gap-4">
                          <Label htmlFor="description">Description</Label>
                          <Field
                            as={Textarea}
                            rows={5}
                            name="description"
                            placeholder="Entrer la description du produit"
                          />
                          {errors.description && touched.description && (
                            <Text format="p" classNameStyle="text-red-500">
                              {errors.description}
                            </Text>
                          )}
                        </div>

                        <div className="flex flex-col gap-4">
                          <Label htmlFor="prix">Prix</Label>
                          <div className="flex flex-row gap-2 items-center">
                            <Field
                              as={Input}
                              type="number"
                              name="prix"
                              placeholder="0"
                              className="flex flex-1"
                            />
                            <Text
                              format="p"
                              weight="800"
                              classNameStyle="text-sm"
                            >
                              KMF
                            </Text>
                          </div>
                          {errors.prix && touched.prix && (
                            <Text format="p" classNameStyle="text-red-500">
                              {errors.prix}
                            </Text>
                          )}
                        </div>

                        <div className="flex flex-col gap-4">
                          <Label htmlFor="stock">Quantité</Label>
                          <Field
                            as={Input}
                            type="number"
                            name="stock"
                            placeholder="0"
                            className="flex flex-1"
                          />
                          {errors.stock && touched.stock && (
                            <Text format="p" classNameStyle="text-red-500">
                              {errors.stock}
                            </Text>
                          )}
                        </div>

                        <div className="flex flex-col gap-4">
                          <Label htmlFor="keyWord">Mot clé</Label>
                          <Field
                            as={Input}
                            type="text"
                            name="keyWord"
                            placeholder="Entrer un mot clé"
                            className="flex flex-1"
                          />
                          {errors.keyWord && touched.keyWord && (
                            <Text format="p" classNameStyle="text-red-500">
                              {errors.keyWord}
                            </Text>
                          )}
                        </div>

                        <div className="flex flex-col gap-4">
                          <Label>Catégorie</Label>
                          <div className="flex flex-row gap-2">
                            <div className="w-full h-10 rounded-md bg-zinc-100 flex items-center px-2">
                              <Text format="p" classNameStyle="text-sm">
                                {category.nom
                                  ? category.nom
                                  : "Selectionner une catégorie"}
                              </Text>
                            </div>
                            <Dialog
                              open={openCategories}
                              onOpenChange={setopenCategories}
                            >
                              <DialogTrigger>
                                <div className="w-10 h-10 rounded-md flex items-center justify-center border border-zinc-300 cursor-pointer">
                                  <MoreHorizontalIcon size={18} />
                                </div>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogTitle>Choisir une catégorie</DialogTitle>
                                <SelectCategory setCategory={setCategory} />
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="flex flex-row gap-4 items-center justify-center">
                              <p className="animate-puls">En cours</p>
                              <Loader2Icon size={18} className="animate-spin" />
                            </div>
                          ) : (
                            "Créer"
                          )}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </Layout>
  );
}
