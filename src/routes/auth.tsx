import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Team Sign In — Luxury Car Gallery Dubai" },
      { name: "description", content: "Private sign in for the Luxury Car Gallery team to manage listings, enquiries and valuation requests." },
      { property: "og:title", content: "Team Sign In — Luxury Car Gallery" },
      { property: "og:description", content: "Private team access for managing the Luxury Car Gallery collection." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/auth" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        navigate({ to: "/admin", replace: true });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    if (mode === "signup") {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth` },
      });
      if (err) setError(err.message);
      else if (!data.session) setMessage("Check your email to confirm your address, then sign in.");
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError(err.message);
    }
    setBusy(false);
  }

  async function google() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (result.error) setError("Google sign-in failed. Please try again.");
  }

  return (
    <section className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-20">
      <p className="engraved text-muted-foreground">Luxury Car Gallery</p>
      <h1 className="mt-4 text-3xl font-medium uppercase">{mode === "signin" ? "Team sign in" : "Create team access"}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Private area for managing listings, enquiries and valuation requests.
      </p>

      <form onSubmit={submit} className="mt-10 space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="w-full rounded-full border border-hairline bg-background px-5 py-3.5 text-sm outline-none focus:border-foreground"
        />
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-full border border-hairline bg-background px-5 py-3.5 text-sm outline-none focus:border-foreground"
        />
        {error ? <p className="text-sm text-accent">{error}</p> : null}
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        <button type="submit" disabled={busy} className="btn-ink w-full justify-center">
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button type="button" onClick={google} className="btn-outline-ink mt-4 w-full justify-center">
        Continue with Google
      </button>

      <button
        type="button"
        onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setMessage(null); }}
        className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
      >
        {mode === "signin" ? "Need access? Create an account" : "Already have access? Sign in"}
      </button>

      <Link to="/" className="mt-6 text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">
        Back to website
      </Link>
    </section>
  );
}
