import { cookies } from "next/headers";
import { encrypt, decrypt } from "./auth";

const COOKIE_NAME = "supply-session";

export async function createSession(payload: {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string | null;
}) {
  const token = await encrypt(payload);

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  return await decrypt(token);
}

export async function destroySession() {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAME);
}
