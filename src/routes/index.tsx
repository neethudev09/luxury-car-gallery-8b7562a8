import { createFileRoute, Link } from "@tanstack/react-router";
import { CarCard } from "@/components/car-card";
import { brands, cars, featuredCars, PHONE, whatsappLink } from "@/data/cars";
import heroShowroom from "@/assets/hero-showroom.jpg";
import showroomInterior from "@/assets/showroom-interior.jpg";
import heroVideoAsset from "@/assets/brand/hero-video.mp4.asset.json";
import logoAsset from "@/assets/brand/lcg-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Luxury Car Gallery — Luxury, Performance & Classic Cars In Dubai" },
      {
        name: "description",
        content:
          "Luxury Car Gallery is Dubai's destination for luxury, performance and classic cars. Browse our current inventory of Ferrari, Lamborghini, Porsche, Rolls-Royce and more.",
      },
      { property: "og:title", content: "Luxury Car Gallery — Luxury & Classic Cars In Dubai" },
      {
        property: "og:description",
        content:
          "A handpicked collection of luxury, performance and classic cars for sale in Dubai, with worldwide delivery.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AutoDealer",
          name: "Luxury Car Gallery",
          description:
            "Dealer of luxury, performance and classic cars based in Dubai, United Arab Emirates.",
          telephone: PHONE,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Dubai",
            addressCountry: "AE",
          },
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const available = cars.filter((c) => !c.sold).length;
  const grid = (featuredCars.length ? featuredCars : cars).slice(0, 6);

  const counts: Record<string, number> = {};
  for (const c of cars) counts[c.brandSlug] = (counts[c.brandSlug] ?? 0) + 1;

  return (
    <>
      <section className="relative h-[calc(100svh-5rem)] min-h-[560px] max-h-[920px] overflow-hidden lg:h-[calc(100svh-6rem)]">
        <img
          src={heroShowroom}
          alt="Luxury and classic cars inside the Luxury Car Gallery showroom in Dubai"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroShowroom}
          aria-hidden="true"
        >
          <source src={heroVideoAsset.url} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-ink/50" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-[1500px] flex-col items-start justify-end px-5 pb-16 lg:px-10 lg:pb-20">
          <img
            src={logoAsset.url}
            alt="Luxury Car Gallery"
            className="mb-7 h-auto w-48 object-contain md:w-60"
          />
          <p className="engraved border-l border-accent pl-4 text-ink-foreground/80">
            Dubai · Luxury, Performance &amp; Classic Cars
          </p>
          <h1 className="mt-6 max-w-5xl text-3xl leading-tight text-ink-foreground uppercase md:text-5xl lg:text-6xl">
            Exceptional Cars.<br />Personally Selected.
          </h1>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/inventory" search={{}} className="btn-light">
              Explore {available} Cars
            </Link>
            <Link to="/sell" className="btn-ghost-light">
              Sell Your Car
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-hairline bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 lg:grid-cols-4">
          {[
            [String(available), "Cars Available"],
            [String(brands.length), "Prestige Marques"],
            ["Dubai", "Private Showroom"],
            ["Worldwide", "Delivery Available"],
          ].map(([value, label]) => (
            <div key={label} className="border-r border-white/10 px-5 py-7 last:border-r-0 lg:px-10">
              <strong className="block font-display text-xl font-normal text-accent md:text-2xl">{value}</strong>
              <span className="engraved mt-2 block text-ink-foreground/60">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-20 lg:px-10">
        <div className="flex flex-col gap-4 border-b border-hairline pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="engraved text-accent">Shop By Marque</p>
            <h2 className="mt-2 text-2xl md:text-3xl">Available Inventory</h2>
          </div>
          <Link
            to="/inventory"
            search={{}}
            className="engraved inline-flex items-center gap-2 self-start border-b border-accent pb-1 transition-colors hover:text-accent sm:self-auto"
          >
            All Vehicles
            <span className="text-ink-foreground/40">({available})</span>
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((b) => {
            const count = counts[b.slug] ?? 0;
            return (
              <Link
                key={b.slug}
                to="/inventory"
                search={{ make: b.slug }}
                className="group flex items-center justify-between border border-hairline bg-background p-5 transition-all duration-300 hover:border-accent hover:bg-ink hover:text-ink-foreground"
              >
                <span className="font-display text-base uppercase tracking-[0.12em] transition-colors group-hover:text-accent sm:text-lg">
                  {b.name}
                </span>
                <div className="text-right">
                  <span className="block font-display text-xl font-normal leading-none sm:text-2xl">{count}</span>
                  <span className="engraved block text-[10px] uppercase tracking-[0.18em] text-muted-foreground group-hover:text-ink-foreground/60">
                    Available
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((car) => (
            <CarCard key={car.slug} car={car} />
          ))}
        </div>
      </section>

      <section id="showroom" className="border-y border-hairline bg-card">
        <div className="mx-auto grid max-w-[1500px] gap-14 px-5 py-20 lg:grid-cols-2 lg:px-10">
          <div>
            <h2 className="rule-accent text-2xl md:text-3xl">Welcome To Luxury Car Gallery</h2>
            <p className="mt-12 leading-relaxed text-muted-foreground">
              We believe in no substitutes and no compromises. Every car in our Dubai showroom is
              hand selected, inspected by our own workshop and described honestly, so that what you
              read here is exactly what you find when you arrive.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              In the unlikely event that we do not have the car you are looking for, our global
              network of collectors, dealers and specialists allows us to source it for you. From
              Rolls-Royce to Ferrari, Porsche to Lamborghini, the latest supercars to ultra-rare
              classics.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/about" className="btn-ink">
                More About Us
              </Link>
              <a
                href={whatsappLink("Hello, I would like to speak to your sales team.")}
                target="_blank"
                rel="noreferrer"
                className="btn-outline-ink"
              >
                Speak To Us
              </a>
            </div>
          </div>
          <img
            src={showroomInterior}
            alt="Inside the Luxury Car Gallery showroom in Dubai"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-20 lg:px-10">
        <div className="grid gap-12 md:grid-cols-3">
          {[
            {
              title: "Sourcing",
              copy: "Tell us the specification you want and we will find it, drawing on a trusted network built over decades.",
            },
            {
              title: "Selling Your Car",
              copy: "A competitive valuation within hours, with paperwork, transfer and payment handled discreetly.",
            },
            {
              title: "Worldwide Delivery",
              copy: "Export, shipping and registration arranged to your door, wherever in the world that is.",
            },
          ].map((item) => (
            <div key={item.title} className="border-t border-hairline pt-6">
              <h3 className="text-xl">{item.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
