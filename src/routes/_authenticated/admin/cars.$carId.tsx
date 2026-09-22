import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CAR_ROW_COLUMNS, photoUrl, type CarRow } from "@/lib/catalogue-types";
import { bodyTypes, fuelTypes, transmissions } from "@/data/cars";

export const Route = createFileRoute("/_authenticated/admin/cars/$carId")({
  component: CarEditor,
});

type Draft = Omit<CarRow, "id">;

const empty: Draft = {
  slug: "",
  title: "",
  brand: "",
  brand_slug: "",
  model: "",
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  fuel: "Petrol",
  transmission: "Automatic",
  body_type: "Coupe",
  exterior_colour: "",
  interior_colour: "",
  description: "",
  featured: false,
  sold: false,
  published: true,
  gallery_slug: null,
  image_urls: [],
  sort_order: 0,
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function CarEditor() {
  const { carId } = Route.useParams();
  const isNew = carId === "new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Draft>(empty);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const { data: existing } = useQuery({
    queryKey: ["admin-car", carId],
    enabled: !isNew,
    queryFn: async () => {
      const { data, error } = await supabase.from("cars").select(CAR_ROW_COLUMNS).eq("id", carId).maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as CarRow | null;
    },
  });

  useEffect(() => {
    if (existing) {
      const { id: _id, ...rest } = existing;
      setDraft({ ...rest, price: Number(rest.price) });
    }
  }, [existing]);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function uploadPhotos(files: FileList) {
    setBusy(true);
    setStatus(null);
    const folder = draft.slug || slugify(draft.title) || "unsorted";
    const paths: string[] = [];
    for (const file of Array.from(files)) {
      const path = `${folder}/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${file.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("car-photos").upload(path, file, { upsert: true });
      if (error) {
        setStatus(`Photo upload failed: ${error.message}`);
        setBusy(false);
        return;
      }
      paths.push(path);
    }
    set("image_urls", [...draft.image_urls, ...paths]);
    setBusy(false);
    setStatus(`${paths.length} photo(s) added. Remember to save.`);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    const payload: Draft = {
      ...draft,
      slug: draft.slug || slugify(draft.title),
      brand_slug: draft.brand_slug || slugify(draft.brand),
    };
    const { error } = isNew
      ? await supabase.from("cars").insert(payload)
      : await supabase.from("cars").update(payload).eq("id", carId);
    setBusy(false);
    if (error) {
      setStatus(error.message);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
    queryClient.invalidateQueries({ queryKey: ["catalogue"] });
    navigate({ to: "/admin/cars" });
  }

  const field = "w-full rounded-2xl border border-hairline bg-background px-4 py-3 text-sm outline-none focus:border-foreground";

  return (
    <form onSubmit={save} className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-medium uppercase">{isNew ? "Add a car" : draft.title || "Edit car"}</h2>
        <Link to="/admin/cars" className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">
          Back to listings
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="sm:col-span-2 space-y-2">
          <span className="engraved text-muted-foreground">Title</span>
          <input required value={draft.title} onChange={(e) => set("title", e.target.value)} className={field} />
        </label>
        <label className="space-y-2">
          <span className="engraved text-muted-foreground">Brand</span>
          <input required value={draft.brand} onChange={(e) => set("brand", e.target.value)} className={field} />
        </label>
        <label className="space-y-2">
          <span className="engraved text-muted-foreground">Model</span>
          <input required value={draft.model} onChange={(e) => set("model", e.target.value)} className={field} />
        </label>
        <label className="space-y-2">
          <span className="engraved text-muted-foreground">Year</span>
          <input type="number" required value={draft.year} onChange={(e) => set("year", Number(e.target.value))} className={field} />
        </label>
        <label className="space-y-2">
          <span className="engraved text-muted-foreground">Price (AED)</span>
          <input type="number" required value={draft.price} onChange={(e) => set("price", Number(e.target.value))} className={field} />
        </label>
        <label className="space-y-2">
          <span className="engraved text-muted-foreground">Mileage (km)</span>
          <input type="number" value={draft.mileage} onChange={(e) => set("mileage", Number(e.target.value))} className={field} />
        </label>
        <label className="space-y-2">
          <span className="engraved text-muted-foreground">Fuel</span>
          <select value={draft.fuel} onChange={(e) => set("fuel", e.target.value)} className={field}>
            {fuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </label>
        <label className="space-y-2">
          <span className="engraved text-muted-foreground">Transmission</span>
          <select value={draft.transmission} onChange={(e) => set("transmission", e.target.value)} className={field}>
            {transmissions.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="space-y-2">
          <span className="engraved text-muted-foreground">Body type</span>
          <select value={draft.body_type} onChange={(e) => set("body_type", e.target.value)} className={field}>
            {bodyTypes.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </label>
        <label className="space-y-2">
          <span className="engraved text-muted-foreground">Exterior colour</span>
          <input value={draft.exterior_colour} onChange={(e) => set("exterior_colour", e.target.value)} className={field} />
        </label>
        <label className="space-y-2">
          <span className="engraved text-muted-foreground">Interior colour</span>
          <input value={draft.interior_colour} onChange={(e) => set("interior_colour", e.target.value)} className={field} />
        </label>
        <label className="sm:col-span-2 space-y-2">
          <span className="engraved text-muted-foreground">Description</span>
          <textarea rows={5} value={draft.description} onChange={(e) => set("description", e.target.value)} className={field} />
        </label>
      </div>

      <div className="mt-8 flex flex-wrap gap-6">
        {(["featured", "sold", "published"] as const).map((key) => (
          <label key={key} className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em]">
            <input type="checkbox" checked={draft[key]} onChange={(e) => set(key, e.target.checked)} />
            {key === "published" ? "On website" : key}
          </label>
        ))}
      </div>

      <div className="mt-10">
        <p className="engraved text-muted-foreground">Photos</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {draft.image_urls.map((path) => (
            <div key={path} className="relative h-24 w-36 overflow-hidden rounded-xl border border-hairline">
              <img src={photoUrl(path)} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => set("image_urls", draft.image_urls.filter((p) => p !== path))}
                className="absolute right-1 top-1 rounded-full bg-ink px-2 py-1 text-[9px] font-semibold uppercase text-ink-foreground"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => { if (e.target.files?.length) void uploadPhotos(e.target.files); }}
          className="mt-4 text-sm"
        />
        {!draft.image_urls.length ? (
          <p className="mt-3 text-xs text-muted-foreground">
            With no photos uploaded, the website falls back to the existing gallery for this car where available.
          </p>
        ) : null}
      </div>

      {status ? <p className="mt-6 text-sm text-muted-foreground">{status}</p> : null}

      <button type="submit" disabled={busy} className="btn-ink mt-10">
        {busy ? "Saving…" : isNew ? "Publish listing" : "Save changes"}
      </button>
    </form>
  );
}
