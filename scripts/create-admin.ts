import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const password = await bcrypt.hash("664566", 10);

  console.log("password", password);
  console.log("type of password", typeof password);

  await prisma.user.create({
    data: {
      username: "Nj Milon",
      email: "njmilon1@gmail.com",
      password,
      role: "ADMIN",
      status: "ACTIVE",
      avatar: "https://www.svgrepo.com/show/452030/avatar-default.svg",
    },
  });

  console.log("Admin created");
}

main();
