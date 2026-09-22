import { Link } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { PHONE, EMAIL, cars } from "@/data/cars";
import logoAsset from "@/assets/brand/lcg-logo.png.asset.json";
import { Button } from "@/components/ui/button";

const nav = [
  { label: "Inventory", to: "/inventory" as const },
  { label: "About Us", to: "/about" as const },
  { label: "Selling Your Car", to: "/sell" as const },
  { label: "Contact Us", to: "/contact" as const },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const available = cars.filter((c) => !c.sold).length;

  return (
    <header className="sticky top-0 z-50 border-b border-ink-foreground/10 bg-ink/95 text-ink-foreground backdrop-blur-xl">
      <div className="mx-auto flex h-[4.75rem] max-w-[1600px] items-center px-5 lg:h-[5.5rem] lg:px-10 xl:px-14">
        <Link
          to="/"
          aria-label="Luxury Car Gallery home"
          className="flex shrink-0 items-center transition-opacity hover:opacity-80"
        >
          <img
            src={logoAsset.url}
            alt="Luxury Car Gallery"
            className="h-[62px] w-[116px] object-contain lg:h-[74px] lg:w-[142px]"
          />
        </Link>

        <nav className="ml-auto hidden h-full items-center gap-7 lg:flex xl:gap-10" aria-label="Main navigation">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="group relative flex h-full items-center font-sans text-[0.68rem] font-normal uppercase tracking-[0.2em] text-ink-foreground/65 transition-colors duration-300 hover:text-ink-foreground"
              activeProps={{ className: "text-ink-foreground" }}
            >
              {item.label}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-[width] duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-5 lg:flex xl:ml-12">
          <Link
            to="/inventory"
            aria-label="Browse inventory"
            title="Browse inventory"
            className="flex size-9 items-center justify-center text-ink-foreground/55 transition-colors hover:text-accent"
          >
            <Search className="size-[18px]" strokeWidth={1.5} />
          </Link>
          <span className="h-5 w-px bg-ink-foreground/15" aria-hidden="true" />
          <div className="hidden text-right 2xl:block">
            <p className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-ink-foreground/45">
              {available} motor cars available
            </p>
            <a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              className="font-sans text-xs tracking-[0.08em] text-ink-foreground transition-colors hover:text-accent"
            >
              {PHONE}
            </a>
          </div>
          <Link
            to="/contact"
            className="border border-ink-foreground/30 px-5 py-3 font-sans text-[0.65rem] font-medium uppercase tracking-[0.18em] text-ink-foreground transition-all duration-300 hover:border-accent hover:bg-accent hover:text-accent-foreground xl:px-7"
          >
            Book Appointment
          </Link>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="ml-auto size-11 border border-ink-foreground/20 text-ink-foreground hover:border-accent hover:bg-transparent hover:text-accent lg:hidden"
        >
          {open ? <X className="size-5" strokeWidth={1.5} /> : <Menu className="size-5" strokeWidth={1.5} />}
        </Button>
      </div>

      {open && (
        <div className="border-t border-ink-foreground/10 bg-ink lg:hidden">
          <nav className="px-5 py-3" aria-label="Mobile navigation">
            {nav.map((item, index) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-ink-foreground/10 py-5 font-display text-base uppercase tracking-[0.12em] text-ink-foreground/85 transition-colors hover:text-accent"
              >
                <span>{item.label}</span>
                <span className="font-sans text-[0.6rem] tracking-[0.16em] text-ink-foreground/35">
                  0{index + 1}
                </span>
              </Link>
            ))}
          </nav>
          <div className="grid grid-cols-2 border-t border-ink-foreground/10">
            <a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              className="border-r border-ink-foreground/10 px-5 py-5 font-sans text-[0.65rem] uppercase tracking-[0.14em] text-accent"
            >
              Call showroom
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="px-5 py-5 text-right font-sans text-[0.65rem] uppercase tracking-[0.14em] text-ink-foreground/60"
            >
              Email us
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
