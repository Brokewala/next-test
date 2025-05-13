import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const user = await prisma.client.findUnique({
    where: { utilisateurId: parseInt((await params).id) }
  })

  console.log("USER ===> " ,user);

  if (!(await params).id)
    return NextResponse.json(
      { message: "ID de user requis" },
      { status: 400 }
    );

  try {
    const panier = await prisma.panier.findUnique({
      where: { clientId: user?.id},
      include: {
        items: {
          include: {
            produit: true
          }
        },
        client: true
      }
    });

    if (!panier) {
      return NextResponse.json(
        { message: "Panier non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(panier, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération du panier:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération du panier" },
      { status: 500 }
    );
  }
}