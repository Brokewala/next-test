import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // const { itemId, quantite } = await request.json();
    const req = await request.formData();
    const itemId = (await req).get('itemId') as string;
    const quantite = (await req).get('quantite') as string;

    await prisma.itemPanier.update({
      where: {id: Number(itemId) },
      data: { quantite: parseInt(quantite) }
    });

    return NextResponse.json(
      { message: "Quantité mise à jour" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la quantité:", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour de la quantité" },
      { status: 500 }
    );
  }
}