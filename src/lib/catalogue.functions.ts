import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { CAR_ROW_COLUMNS, type CarRow } from "./catalogue-types";

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
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

export const listPublicCars = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("cars")
    .select(CAR_ROW_COLUMNS)
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) return [] as CarRow[];
  return (data ?? []) as unknown as CarRow[];
});

export const getPublicCar = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data.slug) }))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: row } = await supabase
      .from("cars")
      .select(CAR_ROW_COLUMNS)
      .eq("published", true)
      .eq("slug", data.slug)
      .maybeSingle();
    return (row ?? null) as unknown as CarRow | null;
  });
