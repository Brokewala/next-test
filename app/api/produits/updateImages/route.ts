// app/api/produits/updateImages/route.ts
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { revalidateTag } from "next/cache";
import { prisma } from "@/src/lib/prisma";

async function uploadImagesToVercelBlob(files: File[]): Promise<string[]> {
  try {
    // Uploader les fichiers sans compression
    const uploadPromises = files.map(file =>
      put(file.name, file, {
        access: 'public',
      }).then(blob => blob.url)
    );
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Erreur upload images:', error);
    throw new Error('Failed to upload images');
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Récupérer l'ID du produit
    const productId = formData.get('productId') as string;
    
    if (!productId) {
      return NextResponse.json(
        { message: "ID de produit manquant" },
        { status: 400 }
      );
    }

    // Récupérer les nouvelles images
    const newImages = formData.getAll("images") as File[];
    
    // Récupérer les URLs des images existantes que l'on souhaite conserver
    const existingImages = formData.getAll("existingImages") as string[];
    
    // Télécharger les nouvelles images
    const newImageUrls = newImages.length > 0 ? await uploadImagesToVercelBlob(newImages) : [];
    
    // Combiner les URLs des images existantes et nouvelles
    const updatedImageUrls = [...existingImages, ...newImageUrls];
    
    // Mettre à jour le produit avec les nouvelles URLs d'images
    const updatedProduct = await prisma.produit.update({
      where: {
        id: parseInt(productId)
      },
      data: {
        image: updatedImageUrls
      }
    });

    // Revalider le cache
    revalidateTag("produits");

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des images:", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour des images" },
      { status: 500 }
    );
  }
}