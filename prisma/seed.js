
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const password1 = await bcrypt.hash("karthi123", 10);
  const password2 = await bcrypt.hash("sugu123", 10);

  // Upsert first user
  const user1 = await prisma.user.upsert({
    where: { email: "karthi@123.com" },
    update: { password: password1 }, // update password if exists
    create: { name: "Karthick", email: "karthi@123.com", password: password1 },
  });

  // Upsert second user
  const user2 = await prisma.user.upsert({
    where: { email: "sugumar@123.com" },
    update: { password: password2 }, // update password if exists
    create: { name: "Sugumar", email: "sugumar@123.com", password: password2 },
  });

  // Create a conversation with both participants
  const conversation = await prisma.conversation.create({
    data: {
      participants: {
        create: [{ userId: user1.id }, { userId: user2.id }],
      },
    },
  });

  console.log({ user1, user2, conversation });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
