"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getSession, createSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export type ProfileDTO = {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
  status: string;
  createdAt: string;
};

export type ProfileInput = {
  username: string;
  email: string;
  avatar?: string;
};

export type PasswordInput = {
  currentPassword: string;
  newPassword: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");
  return session;
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

function toDTO(user: {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  role: string;
  status: string;
  createdAt: Date;
}): ProfileDTO {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar ?? "",
    role: user.role,
    status: user.status,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function getMyProfile(): Promise<ProfileDTO> {
  const session = await requireSession();
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) throw new Error("Account not found");
  return toDTO(user);
}

export async function updateProfile(input: ProfileInput): Promise<ProfileDTO> {
  const session = await requireSession();

  const username = input.username?.trim();
  const email = input.email?.trim().toLowerCase();

  if (!username || username.length < 3)
    throw new Error("Username must be at least 3 characters");
  if (!email || !EMAIL_RE.test(email))
    throw new Error("Enter a valid email address");

  let user;
  try {
    user = await prisma.user.update({
      where: { id: session.id },
      data: {
        username,
        email,
        avatar: input.avatar?.trim() || null,
      },
    });
  } catch (error) {
    if (isUniqueViolation(error))
      throw new Error("That username or email is already in use");
    throw error;
  }

  // Session stores username/email/avatar — refresh it so the UI stays in sync.
  await createSession({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  });

  revalidatePath("/settings");
  return toDTO(user);
}

export async function changePassword(
  input: PasswordInput
): Promise<{ success: true }> {
  const session = await requireSession();

  const { currentPassword, newPassword } = input;
  if (!currentPassword) throw new Error("Enter your current password");
  if (!newPassword || newPassword.length < 6)
    throw new Error("New password must be at least 6 characters");
  if (currentPassword === newPassword)
    throw new Error("New password must be different from the current one");

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) throw new Error("Account not found");

  const matched = await bcrypt.compare(currentPassword, user.password);
  if (!matched) throw new Error("Current password is incorrect");

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: session.id },
    data: { password: hashed },
  });

  return { success: true };
}
