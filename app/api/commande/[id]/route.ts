import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Récupérer une commande spécifique
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (isNaN(parseInt((await params).id))) {
      return NextResponse.json({ message: "ID invalide" }, { status: 400 });
    }

    const commande = await prisma.commande.findUnique({
      where: { id: parseInt((await params).id) },
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
      }
    });

    
    if (!commande) {
      return NextResponse.json(
        { message: "Commande non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(commande, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération de la commande" },
      { status: 500 }
    );
  }
}

// Mettre à jour le statut d'une commande
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { statut } = await request.json();

    if (!['EN_ATTENTE', 'EN_PREPARATION', 'EXPEDIE', 'LIVRE', 'ANNULE'].includes(statut)) {
      return NextResponse.json(
        { message: "Statut invalide" },
        { status: 400 }
      );
    }

    const commande = await prisma.commande.update({
      where: { id: parseInt((await params).id) },
      data: { statut },
      include: {
        client: {
          include: {
            utilisateur: {
              select: {
                nom: true
              }
            }
          }
        },
        items: {
          include: {
            produit: true
          }
        }
      }
    });

    // Si la commande est annulée, remettre les produits en stock
    if (statut === 'ANNULE') {
      await prisma.$transaction(
        commande.items.map(item =>
          prisma.produit.update({
            where: { id: item.produit.id },
            data: {
              stock: {
                increment: item.quantite
              }
            }
          })
        )
      );
    }

    revalidatePath(`commandes/${(await params).id}`);

    return NextResponse.json(commande, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande:", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour de la commande" },
      { status: 500 }
    );
  }
}

// Supprimer une commande
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (isNaN(parseInt((await params).id))) {
      return NextResponse.json({ message: "ID invalide" }, { status: 400 });
    }

    // Vérifier si la commande existe
    const commande = await prisma.commande.findUnique({
      where: { id: parseInt((await params).id) },
      include: {
        items: {
          include: {
            produit: true
          }
        }
      }
    });

    if (!commande) {
      return NextResponse.json(
        { message: "Commande non trouvée" },
        { status: 404 }
      );
    }

    // Si la commande existe, remettre d'abord les produits en stock
    await prisma.$transaction(
      commande.items.map(item =>
        prisma.produit.update({
          where: { id: item.produit.id },
          data: {
            stock: {
              increment: item.quantite
            }
          }
        })
      )
    );

    // Supprimer d'abord les items de commande (relation)
    await prisma.itemCommande.deleteMany({
      where: { commandeId: parseInt((await params).id) }
    });

    // Puis supprimer la commande
    await prisma.commande.delete({
      where: { id: parseInt((await params).id) }
    });

    revalidatePath('/commande');

    return NextResponse.json(
      { message: "Commande supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de la commande:", error);
    return NextResponse.json(
      { message: "Erreur lors de la suppression de la commande" },
      { status: 500 }
    );
  }
}