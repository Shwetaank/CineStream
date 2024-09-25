

import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Global variable to hold Prisma instance
const prisma = global.prismaGlobal || prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}

// Graceful shutdown on process termination
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
