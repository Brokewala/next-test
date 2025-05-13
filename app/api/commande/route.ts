import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";


// Créer une nouvelle commande à partir du panier
export async function POST(request: Request) {
  try {
    const body = await request.formData();
    const clientId = body.get("clientId");


    // Récupérer le panier du client
    const panier = await prisma.panier.findFirst({
      where: { clientId: Number(clientId) },
      include: {
        items: {
          include: {
            produit: true
          }
        }
      }
    });

    if (!panier || !panier.items.length) {
      return NextResponse.json(
        { message: "Panier vide ou inexistant" },
        { status: 400 }
      );
    }

    // Vérifier le stock disponible
    for (const item of panier.items) {
      if (item.quantite > item.produit.stock) {
        return NextResponse.json(
          { 
            message: "Stock insuffisant",
            produit: item.produit.nom,
            stockDisponible: item.produit.stock,
            quantiteDemandee: item.quantite
          },
          { status: 400 }
        );
      }
    }

    // Créer la commande
    const commande = await prisma.$transaction(async (prisma) => {
      // 1. Créer la commande
      const nouvelleCommande = await prisma.commande.create({
        data: {
          clientId: Number(clientId),
          statut: 'EN_ATTENTE',
          items: {
            create: panier.items.map(item => ({
              produitId: item.produit.id,
              quantite: item.quantite,
              prixUnitaire: item.produit.prix
            }))
          }
        }
      });

      // 2. Mettre à jour le stock des produits
      for (const item of panier.items) {
        await prisma.produit.update({
          where: { id: item.produit.id },
          data: {
            stock: {
              decrement: item.quantite
            }
          }
        });
      }

      // 3. Vider le panier
      await prisma.itemPanier.deleteMany({
        where: { panierId: panier.id }
      });

      return nouvelleCommande;
    });

    return NextResponse.json(commande, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error);
    return NextResponse.json(
      { message: "Erreur lors de la création de la commande" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const commandes = await prisma.commande.findMany({
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