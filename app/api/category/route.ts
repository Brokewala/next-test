import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
// import { uploadImageToVercelBlob } from "../produits/route";

export async function GET() {
  try {
    const categories = await prisma.categorie.findMany({
      include: {
        produits: true
      }
    });

    return NextResponse.json({ categories, "countCategory": categories.length }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des catégories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const response = await request.formData();
  // Récupérer une seule image au lieu de plusieurs
  const image = String(response.get("image")) as string;
  const nom = String(response.get("nom"));
  // const parentId = String(response.get("parentId"));
  
  // Vérifier si une image a été fournie
  // let imageUrl = null
  // if (image) {
  //   imageUrl = await uploadImageToVercelBlob(image);
  // }


  try {
    const categorie = await prisma.categorie.create({
      data: {
        nom: nom,
        // parentId: parentId ? parentId : null,
        image: image
      }
    });

    return NextResponse.json(categorie, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie:", error);
    return NextResponse.json(
      { message: "Erreur lors de la création de la catégorie" },
      { status: 500 }
    );
  }
}