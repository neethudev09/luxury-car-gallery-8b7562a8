import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CarCard } from "@/components/car-card";
import { brands, cars, bodyTypes } from "@/data/cars";
import heroShowroom from "@/assets/hero-showroom.jpg";
import { SlidersHorizontal } from "lucide-react";

type InventorySearch = {
  make?: string | undefined;
  body?: string | undefined;
  sort?: string | undefined;
  latest?: boolean | undefined;
};

export const Route = createFileRoute("/inventory")({
  validateSearch: (search: Record<string, unknown>): InventorySearch => ({
    make: typeof search["make"] === "string" ? search["make"] : undefined,
    body: typeof search["body"] === "string" ? search["body"] : undefined,
    sort: typeof search["sort"] === "string" ? search["sort"] : undefined,
    latest: search["latest"] === true || search["latest"] === "true" ? true : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Current Inventory — Luxury Cars For Sale In Dubai | Luxury Car Gallery" },
      {
        name: "description",
        content:
          "Browse our current inventory of luxury, performance and classic cars for sale in Dubai, including Ferrari, Lamborghini, Porsche, Rolls-Royce and Bentley.",
      },
      { property: "og:title", content: "Current Inventory — Luxury Car Gallery Dubai" },
      {
        property: "og:description",
        content: "Luxury, performance and classic cars for sale in Dubai, with worldwide delivery.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/inventory" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/inventory" }],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [sort, setSort] = useState(search.sort ?? "price-desc");

  const make = search.make;
  const body = search.body;
  const newArrival = search.latest === true;

  const list = useMemo(() => {
    let out = cars.filter((c) => (make ? c.brandSlug === make : true));
    if (body) out = out.filter((c) => c.bodyType === body);
    if (newArrival) out = out.filter((c) => c.newArrival);
    const sorted = [...out];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "year-desc") sorted.sort((a, b) => b.year - a.year);
    else if (sort === "km-asc") sorted.sort((a, b) => a.mileage - b.mileage);
    else sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [make, body, newArrival, sort]);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of cars) m[c.brandSlug] = (m[c.brandSlug] ?? 0) + 1;
    return m;
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-ink">
        <img
          src={heroShowroom}
          alt="Luxury Car Gallery showroom in Dubai"
          className="h-[48vh] min-h-[380px] w-full object-cover opacity-65"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-ink/70 to-ink/10 px-6 text-center text-ink-foreground">
          <p className="engraved text-ink-foreground/55">Dubai showroom</p>
          <h1 className="mt-5 text-4xl font-medium uppercase md:text-6xl">The Collection</h1>
          <p className="mt-5 max-w-lg text-sm leading-6 text-ink-foreground/65">Luxury, performance and classic cars, selected for distinction.</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1500px] px-5 lg:px-10">
        <div className="flex flex-wrap items-center gap-4 border-b border-hairline py-7">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase"><SlidersHorizontal className="size-4" /> {list.length} Vehicles</p>

          <div className="ml-auto flex flex-wrap gap-3">
            <select
              value={make ?? ""}
              onChange={(e) =>
                navigate({
                  to: "/inventory",
                  search: (prev) => ({ ...prev, make: e.target.value || undefined }),
                })
              }
              aria-label="Filter by manufacturer"
              className="rounded-full border border-hairline bg-background px-5 py-3 text-[10px] font-semibold uppercase outline-none focus:border-foreground"
            >
              <option value="">All Manufacturers</option>
              {brands.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.name} ({counts[b.slug] ?? 0})
                </option>
              ))}
            </select>

            <select
              value={body ?? ""}
              onChange={(e) =>
                navigate({
                  to: "/inventory",
                  search: (prev) => ({ ...prev, body: e.target.value || undefined }),
                })
              }
              aria-label="Filter by body type"
              className="rounded-full border border-hairline bg-background px-5 py-3 text-[10px] font-semibold uppercase outline-none focus:border-foreground"
            >
              <option value="">All Body Types</option>
              {bodyTypes.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort vehicles"
              className="rounded-full border border-hairline bg-background px-5 py-3 text-[10px] font-semibold uppercase outline-none focus:border-foreground"
            >
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="year-desc">Newest Year</option>
              <option value="km-asc">Lowest Mileage</option>
            </select>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg">No vehicles match this selection.</p>
            <Link to="/inventory" search={{}} className="btn-outline-ink mt-8">
              View All Vehicles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 py-14 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((car) => (
              <CarCard key={car.slug} car={car} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
