import { NextResponse } from "next/server";
import { z } from "zod";
import { isDisposableEmail } from "@the_binod/disposable-email-check";
import { getServiceSupabase } from "@/lib/config/supabaseServer";

const WaitlistSchema = z.object({
  email: z.email(),
  honeypot: z.string().optional(),
});

type WaitlistInput = z.infer<typeof WaitlistSchema>;

export async function POST(req: Request) {
  const supabase = getServiceSupabase();
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = WaitlistSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, errors: z.treeifyError(parsed.error) },
        { status: 400 }
      );
    }

    const { email, honeypot } = parsed.data as WaitlistInput;

    // honeypot simple check
    if (honeypot && honeypot.trim().length > 0) {
      return NextResponse.json(
        { ok: false, message: "Bot detected" },
        { status: 400 }
      );
    }

    // Disposable email check
    const isDisposable = await isDisposableEmail(email);
    if (isDisposable) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please use a valid, non-disposable email address.",
        },
        { status: 400 }
      );
    }

    // checking the waitlist table
    const { error: existingError, data: existing } = await supabase
      .from("waitlist")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (existingError) {
      console.error("Supabase error (checking existing):", existingError);
      return NextResponse.json(
        { ok: false, message: "Database error" },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { ok: false, message: "You're already on the waitlist 💧" },
        { status: 409 } // 409 = Conflict
      );
    }

    const { data, error } = await supabase
      .from("waitlist")
      .insert([{ email }])
      .select()
      .single();

    if (error) {
      console.error("Supabase error (waitlist insert):", error);
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }

    // return NextResponse.json({ ok: true, data }, { status: 201 });
    return NextResponse.json(
      { ok: true, data, message: "Thanks for joining the waitlist!" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Unexpected error in /api/waitlist:", err);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
