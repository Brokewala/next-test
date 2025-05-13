"use client";

import { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { ProduitType } from "../lib/queryClient";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Eye, Edit, Trash, Loader2Icon, Upload, X } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { useProductsManager } from "../lib/requests/useProductRequest";
import { toast } from "sonner";

// Taille maximale d'image en octets (4 Mo)
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

export default function ProductCardAdmin({ product }: { product: ProduitType }) {
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(product.image || []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateMyProduct, deleteMyProduct, updateProductImages } = useProductsManager();
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % existingImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [existingImages.length]);

  useEffect(() => {
    // Reset selected images when dialog opens/closes
    if (!isEditOpen) {
      setSelectedImages([]);
      setImagePreviewUrls([]);
      setExistingImages(product.image || []);
    }
  }, [isEditOpen, product.image]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % existingImages.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + existingImages.length) % existingImages.length);
  };

  const handleDelete = async () => {
    try {
      await deleteMyProduct(String(product.id));
      toast.success("Produit supprimé avec succès !", { position: 'top-center' });
      router.refresh(); // Actualise la liste des produits
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error);
      toast.error("Échec de la suppression du produit.");
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Vérifier la taille de chaque image
      const validFiles: File[] = [];
      const validFileUrls: string[] = [];
      
      newFiles.forEach(file => {
        if (file.size > MAX_IMAGE_SIZE) {
          toast.error(`L'image "${file.name}" dépasse la limite de 4 Mo.`, { 
            position: 'top-center',
            duration: 5000
          });
        } else {
          validFiles.push(file);
          validFileUrls.push(URL.createObjectURL(file));
        }
      });
      
      if (validFiles.length > 0) {
        setSelectedImages((prev) => [...prev, ...validFiles]);
        setImagePreviewUrls((prev) => [...prev, ...validFileUrls]);
      }
    }
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    
    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUpdate = async () => {
    try {
      if (selectedImages.length === 0 && existingImages.length === 0) {
        toast.error("Vous devez avoir au moins une image pour le produit.", { position: 'top-center' });
        return;
      }

      const formData = new FormData();
      
      // Add new images to form data
      selectedImages.forEach(file => {
        formData.append("images", file);
      });
      
      // Add existing images URLs
      existingImages.forEach(url => {
        formData.append("existingImages", url);
      });
      
      formData.append("productId", String(product.id));
      
      await updateProductImages(formData);
      toast.success("Images mises à jour avec succès !", { position: 'top-center' });
      router.refresh();
      setIsEditOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des images:", error);
      toast.error("Échec de la mise à jour des images.");
    }
  };

  const formik = useFormik({
    initialValues: {
      nom: product.nom,
      description: product.description,
      prix: product.prix,
      stock: product.stock,
      keyWord: product.keyWord,
    },
    validationSchema: Yup.object({
      nom: Yup.string().required("Nom est requis"),
      description: Yup.string().required("Description est requise"),
      prix: Yup.number().required("Prix est requis").positive("Prix doit être positif"),
      stock: Yup.number().required("Stock est requis").min(0, "Stock ne peut pas être négatif"),
      keyWord: Yup.string().required("Mot-clé est requis"),
    }),
    onSubmit: async (values) => {
      try {
        await updateMyProduct(String(product.id), values);
        
        // Si des images ont été modifiées, les mettre à jour séparément
        if (selectedImages.length > 0 || existingImages.length !== product.image.length) {
          await handleImageUpdate();
        }
        
        toast.success("Produit mis à jour avec succès !", { position: 'top-center' });
        router.push("/produits");
      } catch (error) {
        console.error("Erreur lors de la mise à jour du produit:", error);
        toast.error("Échec de la mise à jour du produit.");
      }
    },
  });

  return (
    <Card className="w-full max-w-sm p-4 shadow-lg rounded-xl">
      <div
        className="w-full h-48 rounded-lg overflow-hidden mb-2 relative"
        style={{
          backgroundImage: `url(${existingImages.length > 0 ? existingImages[currentSlide] : ""})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-white/20 backdrop-blur-md">
          {existingImages && existingImages.length > 1 ? (
            <div className="relative w-full h-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={existingImages[currentSlide]}
                  alt={"image-produit-" + product.nom}
                  fill
                  className="object-contain z-50"
                  style={{ objectPosition: "center" }}
                />
              </div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                {existingImages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${currentSlide === index ? "bg-white" : "bg-white/50"
                      }`}
                  />
                ))}
              </div>
              <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
                <button onClick={handlePrevSlide} className="bg-white/50 p-1 rounded-full">
                  {"<"}
                </button>
              </div>
              <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
                <button onClick={handleNextSlide} className="bg-white/50 p-1 rounded-full">
                  {">"}
                </button>
              </div>
            </div>
          ) : (
            existingImages && existingImages.length > 0 && (
              <Image
                src={existingImages[0]}
                alt={"image-produit-" + product.nom}
                fill
                className="object-contain z-50"
                style={{ objectPosition: "center" }}
              />
            )
          )}
        </div>
      </div>

      <CardContent className="mt-4">
        <h2 className="text-lg font-semibold">
          {product.nom.length > 20 ? product.nom.slice(0, 20) + "..." : product.nom}
        </h2>
        <p className="text-sm text-gray-600">
          {product.description.length > 25 ? product.description.slice(0, 25) + "..." : product.description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-row gap-2 justify-center mt-2">
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm">
              <Eye className="w-4 h-4 mr-1" /> Voir les détails
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Détails du produit</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[50dvh] flex flex-col gap-8">
              <div
                className="w-full h-48 rounded-lg overflow-hidden mb-2 relative"
                style={{
                  backgroundImage: `url(${existingImages.length > 0 ? existingImages[currentSlide] : ""})`,
                  backgroundSize: "cover",
                  backgroundPosition: "top",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="absolute top-0 left-0 w-full h-full bg-white/20 backdrop-blur-md">
                  {existingImages && existingImages.length > 0 && (
                    <Image
                      src={existingImages[currentSlide]}
                      alt={"image-produit-" + product.nom}
                      fill
                      className="object-contain z-50"
                      style={{ objectPosition: "center" }}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <h2 className="text-lg font-semibold mt-2">{product.nom}</h2>
                <p className="text-sm text-gray-600">{product.description}</p>
                <p className="text-black">Prix: <span className="text-xl font-semibold">{product.prix} KMF</span></p>
                <p className="text-black">Stock: <span className="text-xl font-semibold">{product.stock}</span></p>
                <p className="text-sm text-gray-600">Mot clé: {product.keyWord}</p>
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


        {/* ======================= MODIFICATION DU PRODUIT ======================= */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-transparent border border-black text-black">
              <Edit className="w-4 h-4 mr-1" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le produit</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[70dvh] flex flex-col gap-8">
              <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                <label htmlFor="nom" className="text-sm font-medium">Nom</label>
                <Input
                  id="nom"
                  name="nom"
                  placeholder="Nom"
                  value={formik.values.nom}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.nom && formik.errors.nom && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.nom}</p>
                )}

                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-24 w-full border rounded-md p-2"
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
                )}

                <label htmlFor="prix" className="text-sm font-medium">Prix</label>
                <Input
                  id="prix"
                  name="prix"
                  type="number"
                  placeholder="Prix"
                  value={formik.values.prix}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.prix && formik.errors.prix && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.prix}</p>
                )}

                <label htmlFor="stock" className="text-sm font-medium">Stock</label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="Stock"
                  value={formik.values.stock}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.stock && formik.errors.stock && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.stock}</p>
                )}

                <label htmlFor="keyWord" className="text-sm font-medium">Mot-clé</label>
                <Input
                  id="keyWord"
                  name="keyWord"
                  placeholder="Mot-clé"
                  value={formik.values.keyWord}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={formik.touched.keyWord && !!formik.errors.keyWord}
                />
                {formik.touched.keyWord && formik.errors.keyWord && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.keyWord}</p>
                )}

                {/* Gestion des images */}
                <div className="mt-4">
                  <label className="text-sm font-medium">Images du produit</label>
                  <p className="text-xs text-gray-500 mb-2">Limite de taille: 4 Mo par image</p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {/* Images existantes */}
                    {existingImages.map((url, index) => (
                      <div key={`existing-${index}`} className="relative h-24 border rounded">
                        <Image 
                          src={url} 
                          alt={`Image ${index + 1}`} 
                          fill
                          className="object-cover rounded"
                        />
                        <button 
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                          onClick={() => handleRemoveExistingImage(index)}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    
                    {/* Nouvelles images sélectionnées */}
                    {imagePreviewUrls.map((url, index) => (
                      <div key={`new-${index}`} className="relative h-24 border rounded">
                        <Image 
                          src={url} 
                          alt={`Nouvelle image ${index + 1}`} 
                          fill
                          className="object-cover rounded"
                        />
                        <button 
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                          onClick={() => handleRemoveNewImage(index)}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    
                    {/* Bouton d'ajout d'image */}
                    <div 
                      className="h-24 border rounded flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={24} className="text-gray-400" />
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                      />
                    </div>
                  </div>
                  {existingImages.length === 0 && selectedImages.length === 0 && (
                    <p className="text-red-500 text-sm mt-1">Au moins une image est requise</p>
                  )}
                </div>

                <DialogFooter>
                  <Button type="submit" className="flex justify-center items-center" disabled={formik.isSubmitting}>
                    {formik.isSubmitting ?
                    <div className="flex items-center justify-center gap-4">
                      <Loader2Icon className="animate-spin" size={16} />
                      <span>Enregistrement...</span>
                    </div>
                      : "Enregistrer"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                    Annuler
                  </Button>
                </DialogFooter>
              </form>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash className="w-4 h-4 mr-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}