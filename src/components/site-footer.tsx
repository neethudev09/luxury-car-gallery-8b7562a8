import { Link } from "@tanstack/react-router";
import { PHONE, EMAIL, brands, whatsappLink } from "@/data/cars";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-16 lg:grid-cols-4 lg:px-10">
        <div>
          <p className="font-display text-xl tracking-[0.16em] uppercase">Luxury Car Gallery</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-foreground/65">
            Luxury, performance and classic cars, presented and sold from our Dubai showroom with
            worldwide delivery.
          </p>
        </div>

        <div>
          <p className="engraved text-accent">Browse</p>
          <ul className="mt-5 space-y-3 text-sm text-ink-foreground/75">
            <li>
              <Link to="/inventory" className="hover:text-accent">
                Current Inventory
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-accent">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/sell" className="hover:text-accent">
                Selling Your Car
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-accent">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="engraved text-accent">Marques</p>
          <ul className="mt-5 space-y-3 text-sm text-ink-foreground/75">
            {brands.slice(0, 6).map((b) => (
              <li key={b.slug}>
                <Link
                  to="/inventory"
                  search={{ make: b.slug }}
                  className="hover:text-accent"
                >
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="engraved text-accent">Enquiries</p>
          <ul className="mt-5 space-y-3 text-sm text-ink-foreground/75">
            <li>
              <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="hover:text-accent">
                {PHONE}
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="hover:text-accent">
                {EMAIL}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink("Hello, I would like to enquire about a car.")}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent"
              >
                WhatsApp
              </a>
            </li>
            <li>Al Quoz, Dubai, United Arab Emirates</li>
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
