import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const req = await request.formData();
    const itemId = req.get("itemId") as string;

    await prisma.itemPanier.delete({
      where: { produitId: Number(itemId) }
    });

    return NextResponse.json(
      { message: "Produit retiré du panier", id: itemId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de l'item du panier:", error);
    return NextResponse.json(
      { message: "Erreur lors de la suppression de l'item du panier" },
      { status: 500 }
    );
  }
}