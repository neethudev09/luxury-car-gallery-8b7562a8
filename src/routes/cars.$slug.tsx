import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { CarCard } from "@/components/car-card";
import { cars, getCar, formatPrice, PHONE, EMAIL, whatsappLink } from "@/data/cars";

export const Route = createFileRoute("/cars/$slug")({
  loader: ({ params }) => {
    const car = getCar(params.slug);
    if (!car) throw notFound();
    return { car };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Vehicle Unavailable — Luxury Car Gallery" }, { name: "robots", content: "noindex" }],
      };
    }
    const { car } = loaderData;
    const title = `${car.year} ${car.brand} ${car.model} For Sale In Dubai | Luxury Car Gallery`;
    return {
      meta: [
        { title },
        { name: "description", content: car.description },
        { property: "og:title", content: title },
        { property: "og:description", content: car.description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/cars/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/cars/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Car",
            name: `${car.year} ${car.brand} ${car.model}`,
            brand: { "@type": "Brand", name: car.brand },
            vehicleModelDate: String(car.year),
            bodyType: car.bodyType,
            fuelType: car.fuel,
            vehicleTransmission: car.transmission,
            color: car.exteriorColour,
            mileageFromOdometer: {
              "@type": "QuantitativeValue",
              value: car.mileage,
              unitCode: "KMT",
            },
            offers: {
              "@type": "Offer",
              price: car.price,
              priceCurrency: "AED",
              availability: car.sold
                ? "https://schema.org/SoldOut"
                : "https://schema.org/InStock",
            },
          }),
        },
      ],
    };
  },
  component: CarDetail,
});

function CarDetail() {
  const { car } = Route.useLoaderData();
  const gallery = car.images?.length ? car.images : [car.image];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const index = Math.min(active, gallery.length - 1);
  const heroImage = gallery[index] ?? car.image;
  const label = `${car.year} ${car.brand} ${car.model}`;

  const go = useCallback(
    (dir: number) => setActive((i) => (i + dir + gallery.length) % gallery.length),
    [gallery.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox]);


  const similar = cars
    .filter((c) => c.slug !== car.slug && (c.brandSlug === car.brandSlug || c.bodyType === car.bodyType))
    .slice(0, 3);

  const enquiry = `Hello, I am interested in the ${car.year} ${car.brand} ${car.model} (${formatPrice(car.price)}).`;

  return (
    <div className="mx-auto max-w-[1500px] px-5 pt-8 lg:px-10">
      <nav className="engraved text-muted-foreground">
        <Link to="/" className="hover:text-accent">
          Home
        </Link>
        <span className="px-2">/</span>
        <Link to="/inventory" search={{}} className="hover:text-accent">
          Inventory
        </Link>
        <span className="px-2">/</span>
        <span className="text-foreground">{car.model}</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1.55fr_1fr]">
        <div>
          <div className="group relative bg-card">
            <img
              src={heroImage}
              alt={`${label} for sale in Dubai — photo ${index + 1} of ${gallery.length}`}
              className="aspect-[4/3] w-full cursor-zoom-in object-cover"
              onClick={() => setLightbox(true)}
            />

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous photo"
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-ink/60 p-3 text-ink-foreground opacity-0 transition hover:bg-ink focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next photo"
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-ink/60 p-3 text-ink-foreground opacity-0 transition hover:bg-ink focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setLightbox(true)}
              aria-label="View full screen"
              className="engraved absolute bottom-0 right-0 flex items-center gap-2 bg-ink/75 px-3 py-2 text-ink-foreground transition hover:bg-ink"
            >
              <Expand className="size-3.5" />
              <span>
                {index + 1} / {gallery.length}
              </span>
            </button>
          </div>

          {gallery.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
              {gallery.map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`View photo ${i + 1}`}
                  aria-current={i === index}
                  className={`w-[110px] shrink-0 border transition sm:w-[130px] ${
                    i === index
                      ? "border-accent"
                      : "border-hairline opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {lightbox && (
            <div
              className="fixed inset-0 z-50 flex flex-col bg-ink/97"
              role="dialog"
              aria-modal="true"
              aria-label={`${label} photo gallery`}
            >
              <div className="flex items-center justify-between px-5 py-4 lg:px-10">
                <p className="engraved text-ink-foreground">
                  {label} · {index + 1} / {gallery.length}
                </p>
                <button
                  type="button"
                  onClick={() => setLightbox(false)}
                  aria-label="Close gallery"
                  className="p-2 text-ink-foreground transition hover:text-accent"
                >
                  <X className="size-6" />
                </button>
              </div>

              <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-6">
                <img src={heroImage} alt="" className="max-h-full max-w-full object-contain" />
                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => go(-1)}
                      aria-label="Previous photo"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-ink/60 p-3 text-ink-foreground transition hover:bg-ink lg:left-6"
                    >
                      <ChevronLeft className="size-6" />
                    </button>
                    <button
                      type="button"
                      onClick={() => go(1)}
                      aria-label="Next photo"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-ink/60 p-3 text-ink-foreground transition hover:bg-ink lg:right-6"
                    >
                      <ChevronRight className="size-6" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>


        <div>
          <p className="engraved text-muted-foreground">
            {car.brand} · {car.year}
          </p>
          <h1 className="mt-4 text-3xl leading-tight md:text-4xl">{car.model}</h1>
          <p className="mt-8 font-display text-2xl">{formatPrice(car.price)}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {car.sold ? "This vehicle has been sold" : "Available now · Dubai showroom"}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappLink(enquiry)}
              target="_blank"
              rel="noreferrer"
              className="btn-ink"
            >
              Enquire On WhatsApp
            </a>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="btn-outline-ink">
              Call {PHONE}
            </a>
          </div>

          <dl className="mt-10 border-t border-hairline">
            {[
              ["Year", String(car.year)],
              ["Mileage", `${car.mileage.toLocaleString("en-US")} km`],
              ["Body Type", car.bodyType],
              ["Fuel", car.fuel],
              ["Transmission", car.transmission],
              ["Exterior", car.exteriorColour],
              ["Interior", car.interiorColour],
              ["Engine", car.engine],
              ["Power", `${car.horsepower} bhp`],
              ["0–100 km/h", `${car.accel}s`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-6 border-b border-hairline py-3">
                <dt className="engraved text-muted-foreground">{label}</dt>
                <dd className="text-sm">{value}</dd>
              </div>
            ))}
          </dl>

          <a href={`mailto:${EMAIL}?subject=${encodeURIComponent(enquiry)}`} className="engraved mt-8 inline-block border-b border-accent pb-1">
            Email Our Sales Team
          </a>
        </div>
      </div>

      <div className="mt-20 grid gap-12 border-t border-hairline pt-14 lg:grid-cols-[1.55fr_1fr]">
        <div>
          <h2 className="rule-accent text-2xl">Description</h2>
          <p className="mt-10 leading-relaxed text-muted-foreground">{car.description}</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Inspected and prepared by our own workshop, with full documentation and history
            available on request. We arrange finance, registration and secure worldwide delivery,
            and are happy to talk through specification in detail before you visit.
          </p>
        </div>
        <div>
          <h2 className="rule-accent text-2xl">Specification Highlights</h2>
          <ul className="mt-10 space-y-3">
            {car.features.map((f) => (
              <li key={f} className="border-b border-hairline pb-3 text-sm text-muted-foreground">
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-24">
          <h2 className="rule-accent text-2xl">You May Also Consider</h2>
          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((c) => (
              <CarCard key={c.slug} car={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
