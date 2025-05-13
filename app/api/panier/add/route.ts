// app/api/panier/add/route.ts
import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.formData();
    // const { clientId, produitId, quantite } = body;
    const clientId = body.get("clientId");
    const produitId = body.get("produitId");
    const quantite = body.get("quantite");

    // Vérifie si le client existe
    const client = await prisma.client.findUnique({
      where: { id: Number(clientId) },
      include: {
        panier: true
      }
    });

    if (!client) {
      return NextResponse.json(
        { message: "Client non trouvé" },
        { status: 404 }
      );
    }

    // Vérifie si le produit existe et s'il y a assez de stock
    const produit = await prisma.produit.findUnique({
      where: { id: Number(produitId) }
    });

    if (!produit) {
      return NextResponse.json(
        { message: "Produit non trouvé" },
        { status: 404 }
      );
    }

    if (produit.stock < Number(quantite)) {
      return NextResponse.json(
        { message: "Stock insuffisant" },
        { status: 400 }
      );
    }

    // Vérifie si le client a déjà un panier, sinon en crée un
    let panier = client.panier;
    
    if (!panier) {
      panier = await prisma.panier.create({
        data: {
          client: {
            connect: {
              id: client.id
            }
          }
        }
      });
    }

    // Vérifie si le produit est déjà dans le panier
    const itemExistant = await prisma.itemPanier.findFirst({
      where: {
        panierId: panier.id,
        produitId: Number(produitId)
      }
    });

    // Met à jour ou crée l'item du panier
    if (itemExistant) {
      await prisma.itemPanier.update({
        where: { id: itemExistant.id },
        data: { quantite: itemExistant.quantite + Number(quantite) }
      });
    } else {
      await prisma.itemPanier.create({
        data: {
          panier: {
            connect: {
              id: panier.id
            }
          },
          produit: {
            connect: {
              id: Number(produitId)
            }
          },
          quantite: Number(quantite)
        }
      });
    }

    // Récupère le panier mis à jour avec tous les items
    const panierMisAJour = await prisma.panier.findUnique({
      where: { id: panier.id },
      include: {
        items: {
          include: {
            produit: true
          }
        }
      }
    });

    // await prisma.produit.update({
    //   where: { id: Number(produitId) },
    //   data: {
    //     stock: produit.stock - Number(quantite)
    //   }
    // })

    return NextResponse.json(panierMisAJour, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier:", error);
    return NextResponse.json(
      { message: "Erreur lors de l'ajout au panier" },
      { status: 500 }
    );
  }
}