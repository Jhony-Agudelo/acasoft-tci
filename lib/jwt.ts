import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const getJwtSecretKey = () => {
  // Use env variable or fallback for development
  const secret = process.env.JWT_SECRET || 'super_secret_tci_fallback_key_2026!';
  return new TextEncoder().encode(secret);
};

export interface SessionPayload extends JWTPayload {
  user: {
    id: string;
    email: string;
    role: string;
    status: string;
    nombres: string;
    apellidos: string;
  };
}

export async function signJwt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // 1 day expiration
    .sign(getJwtSecretKey());
}

export async function verifyJwt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload as SessionPayload;
  } catch (error) {
    // Return null if token is invalid or expired
    return null;
  }
}
