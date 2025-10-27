import { NextResponse } from "next/server";
import { z } from "zod";
import { isDisposableEmail } from "@the_binod/disposable-email-check";
import { getServiceSupabase } from "@/lib/config/supabaseServer";

const ContactFormSchema = z.object({
  name: z.string(),
  email: z.email(),
  message: z.string(),
});

type ContactFormValues = z.infer<typeof ContactFormSchema>;

export async function POST(req: Request) {
  const supabase = getServiceSupabase();
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = ContactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, errors: z.treeifyError(parsed.error) },
        { status: 400 }
      );
    }

    const { name, email, message } = parsed.data as ContactFormValues;

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMessage = message.trim();

    // Disposable email check
    const isDisposable = await isDisposableEmail(cleanEmail);
    if (isDisposable) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please use a valid, non-disposable email address.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("contact")
      .insert([{ name: cleanName, email: cleanEmail, message: cleanMessage }])
      .select()
      .single();

    if (error) {
      console.log("Supabase error (contact insert):", error);
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }

    // if successful
    return NextResponse.json(
      { ok: true, message: "Thanks for your message!", data },
      { status: 201 }
    );
  } catch (err) {
    console.error("Unexpected error in /api/contact-form:", err);
    return NextResponse.json(
      { ok: false, message: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
