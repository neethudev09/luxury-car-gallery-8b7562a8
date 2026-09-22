import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { PHONE, EMAIL, cars } from "@/data/cars";

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
    <header className="sticky top-0 z-50 bg-ink text-ink-foreground">
      <div className="mx-auto flex max-w-[1500px] items-center gap-6 px-5 py-4 lg:px-10">
        <Link to="/" className="flex shrink-0 items-baseline gap-3">
          <span className="font-display text-lg tracking-[0.18em] uppercase lg:text-2xl">
            Luxury Car Gallery
          </span>
        </Link>

        <div className="ml-auto hidden flex-col items-end gap-3 lg:flex">
          <div className="engraved flex items-center gap-5 text-ink-foreground/70">
            <span>{available} Cars In Stock</span>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="hover:text-accent">
              {PHONE}
            </a>
            <a href={`mailto:${EMAIL}`} className="hover:text-accent">
              {EMAIL}
            </a>
          </div>
          <nav className="flex items-center gap-8 border-t border-white/15 pt-3">
            {nav.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="engraved text-ink-foreground/85 transition-colors hover:text-accent"
                activeProps={{ className: "engraved text-accent" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="engraved ml-auto border border-white/25 px-4 py-2 lg:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/15 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setOpen(false)}
              className="engraved block border-b border-white/10 px-5 py-4"
            >
              {item.label}
            </Link>
          ))}
          <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="engraved block px-5 py-4 text-accent">
            {PHONE}
          </a>
        </nav>
      )}
    </header>
  );
}
