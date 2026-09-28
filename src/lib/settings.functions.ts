import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

export type SiteSettings = {
  logo_path: string | null;
};

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("site_settings")
    .select("logo_path")
    .eq("id", "primary")
    .maybeSingle();

  if (error) return { logo_path: null } satisfies SiteSettings;
  return { logo_path: data?.logo_path ?? null } satisfies SiteSettings;
});