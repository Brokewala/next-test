import { prisma } from "@/src/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

// Récupérer toutes les commandes d'un client
// GET /api/commandes?clientId=X
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const clientId = searchParams.get('clientId')

  try {
    if (!clientId) {
      return NextResponse.json(
        { message: "clientId est requis" },
        { status: 400 }
      );
    }

    const commandes = await prisma.commande.findMany({
      where: {
        clientId: parseInt(clientId)
      },
      include: {
        items: {
          include: {
            produit: true
          }
        },
        client: {
          include: {
            utilisateur: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(commandes, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des commandes" },
      { status: 500 }
    );
  }
}