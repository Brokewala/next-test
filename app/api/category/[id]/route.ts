import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const id = (await params).id;

  if (isNaN(Number(id))) {
    return NextResponse.json(
      { error: 'Invalid category ID' },
      { status: 400 }
    );
  }

  try {
    const categorie = await prisma.categorie.findUnique({
      where: { id: Number(id) },
      include: {
        produits: true
      }
    });

    if (!categorie) {
      return NextResponse.json(
        { message: "Catégorie non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(categorie, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de la catégorie:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération de la catégorie" },
      { status: 500 }
    );
  }
}