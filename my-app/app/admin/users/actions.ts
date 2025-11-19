"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { db } from "@/lib/supabase/drizzle";
import { profiles } from "@/lib/supabase/schema";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
  role: z.enum(["admin", "editor"]),
});

export type ActionState = {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

export async function createUser(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const validatedFields = createUserSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, fullName, role } = validatedFields.data;
  const supabase = createAdminClient();

  try {
    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (authError) {
      return { error: authError.message };
    }

    if (!authData.user) {
      return { error: "Failed to create user" };
    }

    // 2. Create profile in database
    if (!db) {
      return { error: "Database connection not available" };
    }
    
    await db
      .insert(profiles)
      .values({
        id: authData.user.id,
        full_name: fullName,
        role: role,
      })
      .onConflictDoUpdate({
        target: profiles.id,
        set: {
          full_name: fullName,
          role: role,
        },
      });

    revalidatePath("/admin/users");
    return { success: true, message: "User created successfully" };
  } catch (error) {
    console.error("Create user error:", error);
    return { error: "Failed to create user" };
  }
}
