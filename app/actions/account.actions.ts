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

export type NewUserInput = {
  username: string;
  email: string;
  password: string;
  role: string;
  status?: string;
};

export type UpdateUserInput = {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  password?: string;
};

const USER_ROLES = ["SUPER_ADMIN", "ADMIN", "MANAGER"] as const;
const MANAGER_ROLES: readonly string[] = ["SUPER_ADMIN", "ADMIN"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");
  return session;
}

// Only super admins and admins may create/update/delete users.
async function requireUserManager() {
  const session = await requireSession();
  if (!MANAGER_ROLES.includes(session.role))
    throw new Error("You don't have permission to manage users");
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

export async function listUsers(): Promise<ProfileDTO[]> {
  await requireSession();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  return users.map(toDTO);
}

export async function createUser(input: NewUserInput): Promise<ProfileDTO> {
  const session = await requireUserManager();

  const username = input.username?.trim();
  const email = input.email?.trim().toLowerCase();
  const password = input.password;
  const role = input.role;
  const status = input.status === "INACTIVE" ? "INACTIVE" : "ACTIVE";

  if (!username || username.length < 3)
    throw new Error("Username must be at least 3 characters");
  if (!email || !EMAIL_RE.test(email))
    throw new Error("Enter a valid email address");
  if (!password || password.length < 6)
    throw new Error("Password must be at least 6 characters");
  if (!USER_ROLES.includes(role as (typeof USER_ROLES)[number]))
    throw new Error("Select a valid role");
  // Only a super admin can create another super admin.
  if (role === "SUPER_ADMIN" && session.role !== "SUPER_ADMIN")
    throw new Error("Only a super admin can create a super admin");

  const hashed = await bcrypt.hash(password, 10);

  let user;
  try {
    user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashed,
        role: role as (typeof USER_ROLES)[number],
        status,
      },
    });
  } catch (error) {
    if (isUniqueViolation(error))
      throw new Error("That username or email is already in use");
    throw error;
  }

  revalidatePath("/settings");
  return toDTO(user);
}

export async function updateUser(input: UpdateUserInput): Promise<ProfileDTO> {
  const session = await requireUserManager();

  const target = await prisma.user.findUnique({ where: { id: input.id } });
  if (!target) throw new Error("User not found");

  // Only a super admin may modify another super admin.
  if (target.role === "SUPER_ADMIN" && session.role !== "SUPER_ADMIN")
    throw new Error("Only a super admin can modify a super admin");

  const username = input.username?.trim();
  const email = input.email?.trim().toLowerCase();
  const role = input.role;
  const status = input.status === "INACTIVE" ? "INACTIVE" : "ACTIVE";

  if (!username || username.length < 3)
    throw new Error("Username must be at least 3 characters");
  if (!email || !EMAIL_RE.test(email))
    throw new Error("Enter a valid email address");
  if (!USER_ROLES.includes(role as (typeof USER_ROLES)[number]))
    throw new Error("Select a valid role");
  if (input.password && input.password.length < 6)
    throw new Error("Password must be at least 6 characters");
  // Only a super admin can grant the super admin role.
  if (role === "SUPER_ADMIN" && session.role !== "SUPER_ADMIN")
    throw new Error("Only a super admin can assign the super admin role");

  // Don't allow demoting/deactivating the last active super admin (lockout guard).
  const demotingSuperAdmin =
    target.role === "SUPER_ADMIN" &&
    (role !== "SUPER_ADMIN" || status !== "ACTIVE");
  if (demotingSuperAdmin) {
    const activeSuperAdmins = await prisma.user.count({
      where: { role: "SUPER_ADMIN", status: "ACTIVE" },
    });
    if (activeSuperAdmins <= 1)
      throw new Error("There must be at least one active super admin");
  }

  const data: {
    username: string;
    email: string;
    role: (typeof USER_ROLES)[number];
    status: "ACTIVE" | "INACTIVE";
    password?: string;
  } = {
    username,
    email,
    role: role as (typeof USER_ROLES)[number],
    status,
  };
  if (input.password) data.password = await bcrypt.hash(input.password, 10);

  let user;
  try {
    user = await prisma.user.update({ where: { id: input.id }, data });
  } catch (error) {
    if (isUniqueViolation(error))
      throw new Error("That username or email is already in use");
    throw error;
  }

  revalidatePath("/settings");
  return toDTO(user);
}

export async function deleteUser(id: string): Promise<{ success: true }> {
  const session = await requireUserManager();

  if (id === session.id)
    throw new Error("You can't delete your own account");

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) throw new Error("User not found");

  if (target.role === "SUPER_ADMIN" && session.role !== "SUPER_ADMIN")
    throw new Error("Only a super admin can delete a super admin");

  if (target.role === "SUPER_ADMIN") {
    const superAdmins = await prisma.user.count({
      where: { role: "SUPER_ADMIN" },
    });
    if (superAdmins <= 1)
      throw new Error("You can't delete the last super admin");
  }

  try {
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    // Foreign-key constraint: user owns supplies/invoices.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2003"
    )
      throw new Error(
        "This user has linked records and can't be deleted. Deactivate them instead."
      );
    throw error;
  }

  revalidatePath("/settings");
  return { success: true };
}
