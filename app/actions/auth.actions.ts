"use server";

import bcrypt from "bcryptjs";
import { createSession, destroySession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("User inactive");
  }

  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    throw new Error("Invalid credentials");
  }

  await createSession({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  });

  return {
    success: true,
  };
}

export async function logout() {
  await destroySession();

  return {
    success: true,
  };
}
