import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const postFormSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3, "Title is required"),
  slug: z
    .string()
    .regex(slugRegex, "Use lowercase letters, numbers, and dashes"),
  excerpt: z
    .string()
    .min(40, "Write at least 40 characters")
    .max(220, "Keep the excerpt under 220 characters"),
  cover_image_url: z
    .union([z.string().url("Provide a valid URL"), z.literal(""), z.null()])
    .transform((value) => (value ? value : null)),
  content: z.string().min(20, "Content is required"),
  tags: z.string().optional(),
  is_published: z.boolean().default(false),
});

export type PostFormValues = z.infer<typeof postFormSchema>;
export type PostFormInput = z.infer<typeof postFormSchema> & { id?: string };
