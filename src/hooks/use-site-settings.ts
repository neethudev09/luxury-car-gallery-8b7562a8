import { useQuery } from "@tanstack/react-query";
import fallbackLogoUrl from "@/assets/brand/lcg-logo-portable.png";
import { getSiteSettings } from "@/lib/settings.functions";

export const SITE_SETTINGS_QUERY_KEY = ["site-settings"] as const;

export function siteLogoUrl(path: string | null | undefined) {
  return path ? `/api/public/photo/${path}` : fallbackLogoUrl;
}

export function useSiteSettings() {
  return useQuery({
    queryKey: SITE_SETTINGS_QUERY_KEY,
    queryFn: () => getSiteSettings(),
    staleTime: 60_000,
  });
}