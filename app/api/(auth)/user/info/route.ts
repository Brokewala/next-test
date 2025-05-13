import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";

// Récupère tous les clients connectés (avec leurs adresses)
export async function GET() {
  try {
    const res = await prisma.utilisateur.findMany({
      where: {
        client: {
          isNot: null
        }
      },
      select: {
        id: true,
        nom: true,
        email: true,
        adresse: true,
      },
    });

    return NextResponse.json({"users": res, "count": res.length})
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des clients" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.formData();
    const token = body.get("token") as string;

    if (!token) {
      return NextResponse.json(
        { message: "Token manquant" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: parseInt(decoded.id) },
      select: {
        id: true,
        nom: true,
        email: true,
        adresse: true,
        role: true,
        createdAt: true,
        client: {
          select: {
            panier: true,
            commandes: true,
            id: true,
          }
        },
        admin: true
      }
    });

    if (!utilisateur) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(utilisateur, { status: 200 });

  } catch (error) {
    console.error("Erreur lors de la récupération des informations:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des informations" + error },
      { status: 500 }
    );
  }
}