import { prisma } from "@repo/database";
import type { SupabaseUser } from "../lib/verifySupabaseToken.ts";

export async function findOrCreateUser(supabaseUser: SupabaseUser) {
  const { sub: supabaseId, email, user_metadata } = supabaseUser;

  let user = await prisma.user.findUnique({ where: { supabaseId } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        supabaseId,
        email,
        name: user_metadata?.full_name || "",
        avatarUrl: user_metadata?.avatar_url || "",
      },
    });
  }

  return user;
}
