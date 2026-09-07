import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import LoginForm from "./components/ui/login-form";

type LoginState = {
  ok: boolean;
  message: string;
};

async function authenticate(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  "use server";

  const email = (formData.get("email") ?? "").toString().trim();
  const password = (formData.get("password") ?? "").toString();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      ok: false,
      message: "Supabase credentials are not configured.",
    };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      ok: false,
      message: error?.message || "Invalid email or password.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_auth", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect("/dashboard");

  return {
    ok: false,
    message: "Invalid email or password.",
  };
}

export default function Home() {
  return (
    <main className="login-shell">
      <section className="login-card" aria-label="Admin login">
        <div className="login-brand anim">
          <Image
            src="/cncp-logo.jpg"
            alt="CNCP logo"
            className="login-logo"
            width={48}
            height={48}
          />
          <h1 className="login-brand-name">CNCP Membership</h1>
          <span className="login-badge">Admin console</span>
        </div>

        <div className="anim" style={{ animationDelay: "60ms" }}>
          <h2 className="login-title">Welcome back</h2>
          <p className="login-lead">
            Sign in to manage membership submissions across all departments.
          </p>
        </div>

        <LoginForm action={authenticate} />

        <p className="login-footer anim" style={{ animationDelay: "220ms" }}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          </svg>
          Restricted area — authorized officers only
        </p>
      </section>
    </main>
  );
}
