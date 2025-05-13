import { prisma } from "@/src/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const produit = await prisma.produit.findUnique({
      where: { id: parseInt((await params).id) },
      include: {
        categorie: true
      }
    });

    if (!produit) {
      return NextResponse.json(
        { message: "Produit non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(produit, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération du produit" },
      { status: 500 }
    );
  }
}

// Mise à jour d'un produit
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json();
    const { nom, description, prix, stock, keyWord } = data;

    const produit = await prisma.produit.update({
      where: { id: parseInt((await params).id) },
      data: {
        nom,
        description,
        prix: parseFloat(prix),
        stock: parseInt(stock),
        keyWord: keyWord,
        // categorieId: parseInt(categorieId)
      }
    });

    revalidateTag("produits");

    return NextResponse.json(produit, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour du produit" },
      { status: 500 }
    );
  }
}

// Suppression d'un produit
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const produit = await prisma.produit.delete({
      where: { id: parseInt((await params).id) }
    });

    revalidateTag("produits");

    return NextResponse.json(
      { message: "Produit supprimé avec succès", produit },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error);
    return NextResponse.json(
      { message: "Erreur lors de la suppression du produit" },
      { status: 500 }
    );
  }
}