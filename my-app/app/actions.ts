"use server";

import { z } from "zod";

const contactSchema = z.object({
  email: z.string().email(),
  message: z.string().min(10),
});

export type ContactFormState = {
  errors?: {
    email?: string[];
    message?: string[];
  };
  message?: string;
  success?: boolean;
};

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const validatedFields = contactSchema.safeParse({
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to submit message.",
    };
  }

  // In a real app, you would send an email here using Resend, SendGrid, etc.
  // For now, we'll just simulate a delay and return success.
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("Contact form submitted:", validatedFields.data);

  return {
    message: "Message sent successfully! We'll be in touch soon.",
    success: true,
  };
}
