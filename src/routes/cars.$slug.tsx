import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { CarCard } from "@/components/car-card";
import { cars, getCar, formatPrice, PHONE, EMAIL, whatsappLink } from "@/data/cars";
import { getRequestOrigin } from "@/lib/origin.functions";

export const Route = createFileRoute("/cars/$slug")({
  loader: async ({ params }) => {
    const car = getCar(params.slug);
    if (!car) throw notFound();
    const origin = await getRequestOrigin();
    return { car, origin };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Vehicle Unavailable — Luxury Car Gallery" }, { name: "robots", content: "noindex" }],
      };
    }
    const { car, origin } = loaderData;
    const label = `${car.year} ${car.brand} ${car.model}`;
    const title = `${label} For Sale In Dubai | Luxury Car Gallery`;
    const description = `${label} in ${car.exteriorColour} — ${car.mileage.toLocaleString("en-US")} km, ${car.engine}, ${car.horsepower} bhp. ${formatPrice(car.price)}${car.sold ? " (sold)" : ""}. Available from our Dubai showroom with worldwide delivery.`;
    const path = `/cars/${params.slug}`;
    const url = origin ? `${origin}${path}` : path;
    const shareImage = car.image?.startsWith("/") && origin ? `${origin}${car.image}` : null;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:site_name", content: "Luxury Car Gallery" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        ...(shareImage
          ? [
              { property: "og:image", content: shareImage },
              { property: "og:image:alt", content: `${label} for sale in Dubai` },
              { name: "twitter:image", content: shareImage },
            ]
          : []),
        { property: "product:price:amount", content: String(car.price) },
        { property: "product:price:currency", content: "AED" },
        { property: "product:availability", content: car.sold ? "oos" : "in stock" },
      ],
      links: [{ rel: "canonical", href: path }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Car",
            url,
            description,
            ...(shareImage ? { image: [shareImage] } : {}),
            itemCondition: "https://schema.org/UsedCondition",
            numberOfDoors: car.bodyType === "Coupe" ? 2 : undefined,
            vehicleEngine: { "@type": "EngineSpecification", name: car.engine },
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
              url,
              price: car.price,
              priceCurrency: "AED",
              itemCondition: "https://schema.org/UsedCondition",
              availability: car.sold
                ? "https://schema.org/SoldOut"
                : "https://schema.org/InStock",
              seller: {
                "@type": "AutoDealer",
                name: "Luxury Car Gallery",
                telephone: PHONE,
                email: EMAIL,
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Al Quoz",
                  addressLocality: "Dubai",
                  addressCountry: "AE",
                },
              },
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: origin || "/" },
              {
                "@type": "ListItem",
                position: 2,
                name: "Inventory",
                item: origin ? `${origin}/inventory` : "/inventory",
              },
              { "@type": "ListItem", position: 3, name: label, item: url },
            ],
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

  const openAt = (i: number) => {
    setActive(i);
    setLightbox(true);
  };

  const similar = cars
    .filter((c) => c.slug !== car.slug && (c.brandSlug === car.brandSlug || c.bodyType === car.bodyType))
    .slice(0, 3);

  const enquiry = `Hello, I am interested in the ${car.year} ${car.brand} ${car.model} (${formatPrice(car.price)}).`;

  const feature = [gallery[1] ?? heroImage, gallery[2] ?? gallery[0] ?? heroImage];

  const specs: [string, string][] = [
    ["Year", String(car.year)],
    ["Colour", car.exteriorColour],
    ["Interior Trim", car.interiorColour],
    ["Mileage", `${car.mileage.toLocaleString("en-US")} km`],
    ["Body Style", car.bodyType],
    ["Transmission", car.transmission],
    ["Engine", car.engine],
    ["Fuel Type", car.fuel],
    ["Power", `${car.horsepower} bhp`],
    ["0–100 km/h", `${car.accel}s`],
  ];

  return (
    <div>
      {/* Full-bleed hero slider */}
      <section className="group relative bg-ink">
        <img
          src={heroImage}
          alt={`${label} for sale in Dubai — photo ${index + 1} of ${gallery.length}`}
          className="h-[52vw] max-h-[780px] min-h-[260px] w-full cursor-zoom-in object-cover"
          onClick={() => setLightbox(true)}
        />

        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-ink/50 p-4 text-ink-foreground transition hover:bg-ink lg:p-5"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-ink/50 p-4 text-ink-foreground transition hover:bg-ink lg:p-5"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => setLightbox(true)}
          aria-label="View full screen"
          className="engraved absolute bottom-0 right-0 flex items-center gap-2 bg-ink/75 px-4 py-2.5 text-ink-foreground transition hover:bg-ink"
        >
          <Expand className="size-3.5" />
          <span>
            {index + 1} / {gallery.length}
          </span>
        </button>
      </section>

      <div className="mx-auto max-w-[1500px] px-5 lg:px-10">
        {/* Title band */}
        <header className="border-b border-hairline py-10 lg:py-14">
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

          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="engraved text-muted-foreground">
                {car.brand} · {car.year}
              </p>
              <h1 className="mt-4 text-3xl leading-tight md:text-5xl">{car.model}</h1>
            </div>
            <div className="lg:text-right">
              <p className="font-display text-2xl md:text-3xl">{formatPrice(car.price)}</p>
              <p className="engraved mt-2 text-muted-foreground">
                {car.sold ? "Sold" : "Available · Dubai Showroom"}
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a href={whatsappLink(enquiry)} target="_blank" rel="noreferrer" className="btn-ink">
              Enquire On WhatsApp
            </a>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="btn-outline-ink">
              Call {PHONE}
            </a>
            <a
              href={`mailto:${EMAIL}?subject=${encodeURIComponent(enquiry)}`}
              className="btn-outline-ink"
            >
              Email Sales
            </a>
          </div>
        </header>

        {/* Large stacked feature images */}
        <div className="space-y-5 py-12 lg:space-y-8 lg:py-16">
          {feature.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => openAt(gallery.indexOf(img) === -1 ? 0 : gallery.indexOf(img))}
              className="block w-full cursor-zoom-in"
              aria-label={`View larger photo of ${label}`}
            >
              <img
                src={img}
                alt={`${label} — detail ${i + 1}`}
                loading="lazy"
                className="aspect-[16/9] w-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Overview + spec table */}
        <div className="grid gap-14 border-t border-hairline pt-12 lg:grid-cols-[1.4fr_1fr] lg:pt-16">
          <div>
            <h2 className="rule-accent text-2xl">Overview</h2>
            <p className="mt-10 leading-relaxed text-muted-foreground">{car.description}</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Inspected and prepared by our own workshop, with full documentation and history
              available on request. We arrange finance, registration and secure worldwide delivery,
              and are happy to talk through specification in detail before you visit.
            </p>
          </div>

          <div>
            <h2 className="rule-accent text-2xl">Vehicle Details</h2>
            <dl className="mt-10 border-t border-hairline">
              {specs.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 border-b border-hairline py-3">
                  <dt className="engraved text-muted-foreground">{k}</dt>
                  <dd className="text-sm">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Specification list */}
        <section className="mt-20 border-t border-hairline pt-12 lg:pt-16">
          <h2 className="rule-accent text-2xl">Specification</h2>
          <ul className="mt-12 grid gap-x-12 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
            {car.features.map((f) => (
              <li
                key={f}
                className="flex gap-3 border-b border-hairline py-3 text-sm text-muted-foreground"
              >
                <span aria-hidden="true" className="text-accent">
                  +
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Full gallery */}
        {gallery.length > 1 && (
          <section className="mt-20 border-t border-hairline pt-12 lg:pt-16">
            <h2 className="rule-accent text-2xl">Gallery</h2>
            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
              {gallery.map((img, i) => (
                <button
                  key={`${img}-thumb-${i}`}
                  type="button"
                  onClick={() => openAt(i)}
                  aria-label={`View photo ${i + 1} of ${gallery.length}`}
                  className={`border transition ${
                    i === index ? "border-accent" : "border-hairline hover:border-accent"
                  }`}
                >
                  <img src={img} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Selling your car */}
        <section className="mt-20 flex flex-col gap-8 bg-ink px-6 py-12 text-ink-foreground lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl">Selling Your Car</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-foreground/70">
              If you have a luxury vehicle you would like us to consider in part exchange against
              this car, or an outright sale, our team will give you a considered valuation the same
              day.
            </p>
          </div>
          <Link to="/sell" className="btn-light self-start whitespace-nowrap">
            Request A Valuation
          </Link>
        </section>

        {similar.length > 0 && (
          <section className="mt-20 pb-4">
            <h2 className="rule-accent text-2xl">You May Also Consider</h2>
            <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((c) => (
                <CarCard key={c.slug} car={c} />
              ))}
            </div>
          </section>
        )}
      </div>

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
  );
}
