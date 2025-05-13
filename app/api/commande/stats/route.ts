import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

// Récupérer des statistiques sur les commandes
export async function GET() {
  try {
    const stats = await prisma.$transaction([
      // Nombre total de commandes
      prisma.commande.count(),
      
      // Chiffre d'affaires total
      prisma.itemCommande.aggregate({
        _sum: {
          prixUnitaire: true
        }
      }),
      
      // Nombre de commandes par statut
      prisma.commande.groupBy({
        by: ['statut'],
        _count: true,
        orderBy: undefined
      }),
      
      // Top 5 des produits les plus vendus
      prisma.itemCommande.groupBy({
        by: ['produitId'],
        _sum: {
          quantite: true
        },
        orderBy: {
          _sum: {
            quantite: 'desc'
          }
        },
        take: 5
      })
    ]);

    return NextResponse.json({
      totalCommandes: stats[0],
      chiffreAffaires: stats[1]._sum.prixUnitaire || 0,
      commandesParStatut: stats[2],
      topProduits: stats[3]
    }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}