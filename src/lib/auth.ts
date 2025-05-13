import { sign, verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "votre_secret_jwt_securise";
const TOKEN_EXPIRATION = '24h';

export const generateToken = (userId: string) => {
  return sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
};

export const verifyToken = (token: string) => {
  try {
    return verify(token, JWT_SECRET) as { id: string };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Token invalide ou expiré ${error.message}`);
    } else {
      throw new Error(`An unknown error occurred`);
    }
  }
};