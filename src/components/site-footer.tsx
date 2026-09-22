import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PHONE, EMAIL, brands, whatsappLink } from "@/data/cars";
import logoAsset from "@/assets/brand/lcg-logo.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="mx-auto max-w-[1600px] px-5 pb-8 pt-16 lg:px-10 lg:pt-24">
        <div className="flex flex-col justify-between gap-10 border-b border-ink-foreground/10 pb-14 lg:flex-row lg:items-end">
          <div><p className="engraved text-ink-foreground/40">Private appointments in Dubai</p><h2 className="mt-5 max-w-3xl text-3xl font-medium uppercase leading-tight sm:text-5xl">Find the exceptional.</h2></div>
          <a href={whatsappLink("Hello, I would like to speak with your sales team.")} target="_blank" rel="noreferrer" className="btn-light self-start">Start a conversation <ArrowUpRight className="size-4" /></a>
        </div>

        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div><img src={logoAsset.url} alt="Luxury Car Gallery" className="h-20 w-40 object-contain" /><p className="mt-5 max-w-xs text-sm leading-6 text-ink-foreground/55">Exceptional luxury, performance and classic cars, selected in Dubai and delivered worldwide.</p></div>
          <div><p className="engraved text-ink-foreground/35">Explore</p><ul className="mt-5 space-y-3 text-sm"><li><Link to="/inventory" search={{}}>Available cars</Link></li><li><Link to="/inventory" search={{ latest: true }}>New arrivals</Link></li><li><Link to="/sell">Sell your car</Link></li><li><Link to="/about">Our showroom</Link></li></ul></div>
          <div><p className="engraved text-ink-foreground/35">Marques</p><div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 text-sm">{brands.slice(0, 10).map((brand) => <Link key={brand.slug} to="/inventory" search={{ make: brand.slug }} className="text-ink-foreground/70 hover:text-ink-foreground">{brand.name}</Link>)}</div></div>
          <div><p className="engraved text-ink-foreground/35">Contact</p><div className="mt-5 space-y-3 text-sm text-ink-foreground/70"><a href={`tel:${PHONE.replace(/\s/g, "")}`} className="block hover:text-ink-foreground">{PHONE}</a><a href={`mailto:${EMAIL}`} className="block break-words hover:text-ink-foreground">{EMAIL}</a><p>Al Quoz, Dubai<br />United Arab Emirates</p></div></div>
        </div>
        <div className="flex flex-col gap-3 border-t border-ink-foreground/10 pt-6 text-[10px] uppercase text-ink-foreground/35 sm:flex-row sm:justify-between"><p>© {new Date().getFullYear()} Luxury Car Gallery</p><p>Prices in AED · Availability subject to change</p></div>
      </div>
    </footer>
  );
}