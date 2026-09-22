import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CarCard } from "@/components/car-card";
import { brands, cars, bodyTypes } from "@/data/cars";
import heroShowroom from "@/assets/hero-showroom.jpg";

type InventorySearch = {
  make?: string | undefined;
  body?: string | undefined;
  sort?: string | undefined;
  new?: string | undefined;
};

export const Route = createFileRoute("/inventory")({
  validateSearch: (search: Record<string, unknown>): InventorySearch => ({
    make: typeof search["make"] === "string" ? search["make"] : undefined,
    body: typeof search["body"] === "string" ? search["body"] : undefined,
    sort: typeof search["sort"] === "string" ? search["sort"] : undefined,
    new: typeof search["new"] === "string" ? search["new"] : undefined,
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
  const newArrival = search.newArrival === "true";

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
      <section className="relative">
        <img
          src={heroShowroom}
          alt="Luxury Car Gallery showroom in Dubai"
          className="h-[38vh] min-h-[280px] w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/55 px-6 text-center">
          <h1 className="text-3xl text-white uppercase md:text-5xl">Current Inventory</h1>
          <span className="mt-6 block h-px w-24 bg-white/70" />
        </div>
      </section>

      <div className="mx-auto max-w-[1500px] px-5 lg:px-10">
        <div className="flex flex-wrap items-center gap-4 border-b border-hairline py-6">
          <p className="engraved text-muted-foreground">Showing {list.length} Vehicles</p>

          <div className="ml-auto flex flex-wrap gap-3">
            <select
              value={make ?? ""}
              onChange={(e) =>
                navigate({
                  to: "/inventory",
                  search: (prev) => ({ ...prev, make: e.target.value || undefined }),
                })
              }
              className="engraved border border-hairline bg-background px-4 py-3"
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
              className="engraved border border-hairline bg-background px-4 py-3"
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
              className="engraved border border-hairline bg-background px-4 py-3"
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
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 py-14 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((car) => (
              <CarCard key={car.slug} car={car} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
