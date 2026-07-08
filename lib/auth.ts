import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "supply-session";

const secretKey = process.env.AUTH_SECRET!;
const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string | null;
};

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, encodedKey);

    return payload as SessionPayload;
  } catch {
    return null;
  }
}
