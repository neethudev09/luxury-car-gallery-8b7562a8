import { Link } from "@tanstack/react-router";
import { Menu, Search, X, Phone, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { PHONE, EMAIL, whatsappLink } from "@/data/cars";
import { Button } from "@/components/ui/button";
import { siteLogoUrl, useSiteSettings } from "@/hooks/use-site-settings";

const nav = [
  { label: "Inventory", to: "/inventory" as const },
  { label: "About", to: "/about" as const },
  { label: "Sell Your Car", to: "/sell" as const },
  { label: "Contact", to: "/contact" as const },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { data: settings } = useSiteSettings();
  const logoUrl = siteLogoUrl(settings?.logo_path);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="relative mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 lg:h-20 lg:px-10">
          <Button type="button" variant="ghost" onClick={() => setOpen(true)} className="h-10 gap-3 rounded-full px-3 text-foreground hover:bg-secondary" aria-label="Open menu">
            <Menu className="size-[18px]" strokeWidth={1.6} />
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.25em] sm:inline">Menu</span>
          </Button>

          <Link to="/" aria-label="Luxury Car Gallery home" className="absolute left-1/2 -translate-x-1/2">
            <img src={logoUrl} alt="Luxury Car Gallery" className="h-12 w-auto object-contain lg:h-16" />
          </Link>

          <div className="flex items-center gap-1">
            <Link to="/inventory" aria-label="Search inventory" title="Search inventory" className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-secondary">
              <Search className="size-[17px]" strokeWidth={1.6} />
            </Link>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} aria-label="Call showroom" title="Call showroom" className="hidden size-10 items-center justify-center rounded-full transition-colors hover:bg-secondary sm:flex">
              <Phone className="size-[17px]" strokeWidth={1.6} />
            </a>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-[70] bg-ink text-ink-foreground transition duration-500 ${open ? "visible opacity-100" : "invisible opacity-0"}`} aria-hidden={!open}>
        <div className="mx-auto flex h-full max-w-[1600px] flex-col px-5 lg:px-10">
          <div className="relative flex h-16 shrink-0 items-center justify-between border-b border-ink-foreground/10">
            <span className="engraved text-ink-foreground/45">Dubai · UAE</span>
            <img src={logoUrl} alt="Luxury Car Gallery" className="absolute left-1/2 h-14 w-28 -translate-x-1/2 object-contain" />
            <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-full text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground">
              <X className="size-5" />
            </Button>
          </div>

          <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[1fr_0.42fr]">
            <nav aria-label="Main navigation">
              {nav.map((item, index) => (
                <Link key={item.label} to={item.to} onClick={() => setOpen(false)} className="group flex items-center justify-between border-b border-ink-foreground/12 py-4 text-3xl font-medium uppercase transition-colors hover:text-accent sm:text-5xl lg:py-5 lg:text-6xl">
                  <span>{item.label}</span>
                  <span className="flex items-center gap-4 text-xs font-normal text-ink-foreground/35"><span>0{index + 1}</span><ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></span>
                </Link>
              ))}
            </nav>
            <div className="space-y-7 lg:border-l lg:border-ink-foreground/10 lg:pl-12">
              <div><p className="engraved text-ink-foreground/40">Showroom</p><p className="mt-3 text-sm">Al Quoz, Dubai, UAE</p></div>
              <div><p className="engraved text-ink-foreground/40">Speak with us</p><a href={`tel:${PHONE.replace(/\s/g, "")}`} className="mt-3 block text-sm hover:text-accent">{PHONE}</a><a href={`mailto:${EMAIL}`} className="mt-2 block text-sm hover:text-accent">{EMAIL}</a></div>
              <a href={whatsappLink("Hello, I would like to enquire about a car.")} target="_blank" rel="noreferrer" className="btn-light">WhatsApp Us <ArrowUpRight className="size-4" /></a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}