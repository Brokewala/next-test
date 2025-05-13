import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { generateToken } from "@/src/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.formData();
    const email = body.get("email") as string;
    const password = body.get("password") as string;

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email }
    });

    if (!utilisateur || !(await compare(password, utilisateur.motDePasse))) {
      return NextResponse.json(
        { message: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    const token = generateToken(utilisateur.id.toString());

    return NextResponse.json({
      id: utilisateur.id,
      nom: utilisateur.nom,
      email: utilisateur.email,
      adresse: utilisateur.adresse,
      role: utilisateur.role,
      token
    }, { status: 200 });

  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return NextResponse.json(
      { message: "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
}