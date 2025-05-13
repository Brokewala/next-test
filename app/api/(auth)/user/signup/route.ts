import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { generateToken } from "@/src/lib/auth";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.formData();
    const email = body.get("email") as string;

    // Vérification de l'email existant
    const existingUser = await prisma.utilisateur.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }

    // Création de l'utilisateur
    const hashedPassword = await hash(body.get("password") as string, 12);
    const utilisateur = await prisma.utilisateur.create({
      data: {
        nom: `${body.get("first_name")} ${body.get("last_name")}`,
        email,
        motDePasse: hashedPassword,
        adresse: body.get("adress") as string || "Non définie",
        role: (body.get("role") as Role) || "CLIENT",
      }
    });

    // Création automatique du profil client si role CLIENT
    if (utilisateur.role === "CLIENT") {
      await prisma.client.create({
        data: {
          utilisateurId: utilisateur.id,
        }
      });
    } else if (utilisateur.role === "ADMIN") {
      await prisma.admin.create({
        data: {
          utilisateurId: utilisateur.id,
        }
      });
    }

    const token = generateToken(utilisateur.id.toString());

    return NextResponse.json({
      id: utilisateur.id,
      nom: utilisateur.nom,
      email: utilisateur.email,
      adresse: utilisateur.adresse,
      role: utilisateur.role,
      token
    }, { status: 201 });
    
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { message: "Erreur lors de la création du compte" },
      { status: 500 }
    );
  }
}