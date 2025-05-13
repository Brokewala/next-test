import { prisma } from "@/src/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { put } from '@vercel/blob';
// import sharp from "sharp";

export async function GET() {
  try {
    const produits = await prisma.produit.findMany({
      include: {
        categorie: true
      },
      orderBy: {
        createdAt: 'desc' // Trier du plus récent au plus ancien
      }
    });

    return NextResponse.json(produits, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des produits" },
      { status: 500 }
    );
  }
}

async function uploadImagesToVercelBlob(files: File[]): Promise<string[]> {
  try {
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
    const data = await request.formData();

    // Récupérer toutes les images
    const images = data.getAll("images") as File[];

    // Vérifier si des images ont été fournies
    const imageUrls = await uploadImagesToVercelBlob(images);

    const produit = await prisma.produit.create({
      data: {
        nom: String(data.get('nom')),
        description: String(data.get('description')),
        prix: Number(data.get('prix') as string),
        stock: Number(data.get('stock')),
        keyWord: String(data.get('keyWord')),
        categorieId: parseInt(data.get('categorieId') as string),
        image: imageUrls // Stocker les URLs des images
      }
    });

    revalidateTag("produits");

    return NextResponse.json(produit, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du produit:", error);
    return NextResponse.json(
      { message: "Erreur lors de la création du produit" },
      { status: 500 }
    );
  }
}


/////////////////////////////// COMPRESSION DES IMAGES /////////////////////////////
// Fonction pour compresser une image si nécessaire
// async function compressImageIfNeeded(file: File): Promise<File> {
//   // Convertir le fichier en buffer
//   const arrayBuffer = await file.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);
  
//   // Si l'image fait moins de 1Mo, la retourner telle quelle
//   if (buffer.length <= 1024 * 1024) {
//     return file;
//   }
  
//   // Sinon, la compresser progressivement
//   const image = sharp(buffer);
//   const metadata = await image.metadata();
  
//   // Commencer avec une qualité de 80
//   let quality = 80;
//   let compressedBuffer = await image.jpeg({ quality }).toBuffer();
  
//   // Réduire la qualité progressivement jusqu'à obtenir une taille < 1Mo
//   while (compressedBuffer.length > 1024 * 1024 && quality > 10) {
//     quality -= 10;
//     compressedBuffer = await image.jpeg({ quality }).toBuffer();
//   }
  
//   // Si toujours trop grande, réduire la taille de l'image
//   if (compressedBuffer.length > 1024 * 1024 && metadata.width && metadata.height) {
//     const ratio = Math.min(1, Math.sqrt(1024 * 1024 / compressedBuffer.length));
//     const newWidth = Math.floor(metadata.width * ratio);
//     const newHeight = Math.floor(metadata.height * ratio);
    
//     compressedBuffer = await image
//       .resize(newWidth, newHeight)
//       .jpeg({ quality })
//       .toBuffer();
//   }
  
//   // Créer un nouveau File à partir du buffer compressé
//   return new File([compressedBuffer], file.name, { type: "image/jpeg" });
// }

// // Fonction pour télécharger les images vers Vercel Blob avec compression
// async function uploadImagesToVercelBlob(files: File[]): Promise<string[]> {
//   try {
//     // Compresser chaque image si nécessaire avant de l'uploader
//     const compressPromises = files.map(file => compressImageIfNeeded(file));
//     const compressedFiles = await Promise.all(compressPromises);
    
//     // Uploader les fichiers compressés
//     const uploadPromises = compressedFiles.map(file =>
//       put(file.name, file, {
//         access: 'public',
//       }).then(blob => blob.url)
//     );
    
//     return await Promise.all(uploadPromises);
//   } catch (error) {
//     console.error('Erreur upload images:', error);
//     throw new Error('Failed to upload images');
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const data = await request.formData();

//     // Récupérer toutes les images
//     const images = data.getAll("images") as File[];

//     // Vérifier si des images ont été fournies
//     const imageUrls = await uploadImagesToVercelBlob(images);

//     const produit = await prisma.produit.create({
//       data: {
//         nom: String(data.get('nom')),
//         description: String(data.get('description')),
//         prix: Number(data.get('prix') as string),
//         stock: Number(data.get('stock')),
//         keyWord: String(data.get('keyWord')),
//         categorieId: parseInt(data.get('categorieId') as string),
//         image: imageUrls // Stocker les URLs des images
//       }
//     });

//     revalidateTag("produits");

//     return NextResponse.json(produit, { status: 201 });
//   } catch (error) {
//     console.error("Erreur lors de la création du produit:", error);
//     return NextResponse.json(
//       { message: "Erreur lors de la création du produit" },
//       { status: 500 }
//     );
//   }
// }