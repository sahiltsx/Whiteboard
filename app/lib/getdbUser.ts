import { currentUser } from "@clerk/nextjs/server";
import prisma from "./db";
export async function getDbUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const linked = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });
  if (linked) return linked;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  return prisma.user.upsert({
    where: { email },
    update: { clerkId: clerkUser.id },
    create: {
      email,
      clerkId: clerkUser.id,
      name: clerkUser.fullName ?? null,
    },
  });
}