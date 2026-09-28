import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  SITE_SETTINGS_QUERY_KEY,
  siteLogoUrl,
  useSiteSettings,
} from "@/hooks/use-site-settings";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({
    meta: [
      { title: "Website Settings — Luxury Car Gallery" },
      { name: "description", content: "Manage Luxury Car Gallery website branding." },
      { property: "og:title", content: "Website Settings — Luxury Car Gallery" },
      { property: "og:description", content: "Manage Luxury Car Gallery website branding." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminSettings,
});

const MAX_LOGO_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]);

function AdminSettings() {
  const queryClient = useQueryClient();
  const { data } = useSiteSettings();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function saveLogoPath(logoPath: string | null) {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ id: "primary", logo_path: logoPath }, { onConflict: "id" });
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: SITE_SETTINGS_QUERY_KEY });
  }

  async function uploadLogo(file: File) {
    setStatus(null);
    if (!ALLOWED_TYPES.has(file.type)) {
      setStatus("Please choose a PNG, JPG, WebP, or SVG logo.");
      return;
    }
    if (file.size > MAX_LOGO_SIZE) {
      setStatus("The logo must be smaller than 2 MB.");
      return;
    }

    setBusy(true);
    try {
      const extension = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `site-branding/logo-${Date.now()}.${extension}`;
      const { error } = await supabase.storage.from("car-photos").upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type,
      });
      if (error) throw error;
      await saveLogoPath(path);
      setStatus("Logo updated across the website.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The logo could not be uploaded.");
    } finally {
      setBusy(false);
    }
  }

  async function restoreLogo() {
    setBusy(true);
    setStatus(null);
    try {
      await saveLogoPath(null);
      setStatus("The original logo has been restored.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The original logo could not be restored.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="max-w-3xl">
      <p className="engraved text-muted-foreground">Website branding</p>
      <h2 className="mt-3 text-2xl font-medium uppercase">Logo settings</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
        Upload a clear logo with a transparent background. It will appear in the website header, menu, and footer.
      </p>

      <div className="mt-9 border-y border-hairline py-8">
        <div className="flex min-h-44 items-center justify-center bg-ink px-8 py-10">
          <img
            src={siteLogoUrl(data?.logo_path)}
            alt="Current Luxury Car Gallery logo"
            className="max-h-28 max-w-full object-contain"
          />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button asChild disabled={busy} className="btn-ink">
            <label>
              <Upload className="size-4" />
              {busy ? "Uploading…" : "Upload logo"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="sr-only"
                disabled={busy}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void uploadLogo(file);
                  event.target.value = "";
                }}
              />
            </label>
          </Button>
          {data?.logo_path ? (
            <Button type="button" variant="outline" disabled={busy} onClick={() => void restoreLogo()} className="rounded-full">
              <RotateCcw className="size-4" />
              Restore original
            </Button>
          ) : null}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">PNG, JPG, WebP, or SVG · Maximum 2 MB</p>
        {status ? <p role="status" className="mt-4 text-sm text-muted-foreground">{status}</p> : null}
      </div>
    </section>
  );
}