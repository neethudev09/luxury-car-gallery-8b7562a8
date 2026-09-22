import { createFileRoute, Link } from "@tanstack/react-router";
import { CarCard } from "@/components/car-card";
import { brands, cars, featuredCars, PHONE, whatsappLink } from "@/data/cars";
import heroShowroom from "@/assets/hero-showroom.jpg";
import showroomInterior from "@/assets/showroom-interior.jpg";

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
      <section className="relative">
        <img
          src={heroShowroom}
          alt="Luxury and classic cars inside the Luxury Car Gallery showroom in Dubai"
          className="h-[68vh] min-h-[420px] w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/55 px-6 text-center">
          <p className="engraved text-white/75">Dubai · Established Specialists</p>
          <h1 className="mt-8 max-w-4xl text-2xl leading-tight text-white uppercase md:text-4xl lg:text-5xl">
            Over {available} Luxury, Performance &amp; Classic Cars In Our Inventory
          </h1>
          <span className="mt-8 block h-px w-28 bg-white/70" />
          <Link to="/inventory" search={{}} className="btn-ghost-light mt-10">
            View Our Inventory
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-20 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-hairline pb-6">
          <h2 className="text-2xl">Available Inventory</h2>
          <Link to="/inventory" search={{}} className="engraved border-b border-accent pb-1">
            All Vehicles
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          {brands.map((b) => (
            <Link
              key={b.slug}
              to="/inventory"
              search={{ make: b.slug }}
              className="engraved text-muted-foreground transition-colors hover:text-accent"
            >
              {b.name} ({counts[b.slug] ?? 0})
            </Link>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((car) => (
            <CarCard key={car.slug} car={car} />
          ))}
        </div>
      </section>

      <section className="border-y border-hairline bg-card">
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
