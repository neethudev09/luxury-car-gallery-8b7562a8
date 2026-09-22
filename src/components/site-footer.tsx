import { Link } from "@tanstack/react-router";
import { PHONE, EMAIL, brands, whatsappLink } from "@/data/cars";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-16 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-4">
          <p className="font-display text-xl tracking-[0.16em] uppercase">Luxury Car Gallery</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-foreground/65">
            Luxury, performance and classic cars, presented and sold from our Dubai showroom with
            worldwide delivery.
          </p>
          <div className="mt-8 flex flex-col gap-3 text-sm text-ink-foreground/75">
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="hover:text-accent">
              {PHONE}
            </a>
            <a href={`mailto:${EMAIL}`} className="hover:text-accent">
              {EMAIL}
            </a>
            <a
              href={whatsappLink("Hello, I would like to enquire about a car.")}
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent"
            >
              WhatsApp
            </a>
            <p>Al Quoz, Dubai, United Arab Emirates</p>
          </div>
        </div>

        <div className="lg:col-span-5">
          <p className="engraved text-accent">Shop By Brand</p>
          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
            {brands.map((b) => (
              <Link
                key={b.slug}
                to="/inventory"
                search={{ make: b.slug }}
                className="group flex items-center justify-between border-b border-white/5 py-2.5 text-sm text-ink-foreground/75 transition-colors hover:border-accent/40 hover:text-accent"
              >
                <span className="font-sans">{b.name}</span>
                <span className="font-sans text-xs text-ink-foreground/40">
                  {b.available} / {b.sold}
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink-foreground/40">
            Available / Sold
          </p>
        </div>

        <div className="lg:col-span-3">
          <p className="engraved text-accent">Quick Links</p>
          <ul className="mt-5 space-y-3 text-sm text-ink-foreground/75">
            <li>
              <Link to="/inventory" className="transition-colors hover:text-accent">
                All Cars For Sale
              </Link>
            </li>
            <li>
              <Link to="/inventory" search={{ latest: true }} className="transition-colors hover:text-accent">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link to="/inventory" search={{}} className="transition-colors hover:text-accent">
                Compare Models
              </Link>
            </li>
            <li>
              <Link to="/" hash="showroom" className="transition-colors hover:text-accent">
                360° Showroom
              </Link>
            </li>
            <li>
              <Link to="/sell" className="transition-colors hover:text-accent">
                Sell Your Car
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition-colors hover:text-accent">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition-colors hover:text-accent">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-2 px-5 py-6 text-xs text-ink-foreground/50 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p>© {new Date().getFullYear()} Luxury Car Gallery. All rights reserved.</p>
          <p>Prices in AED. Vehicle availability subject to change.</p>
        </div>
      </div>
    </footer>
  );
}
