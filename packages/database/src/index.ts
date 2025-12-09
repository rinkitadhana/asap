import { prisma } from "./client";

export { prisma };
export default prisma;
export * from "../generated/prisma/client"; // export Prisma types (User, etc.)
