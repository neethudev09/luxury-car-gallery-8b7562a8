import { createFileRoute, Link } from "@tanstack/react-router";
import showroomInterior from "@/assets/showroom-interior.jpg";
import { cars, brands } from "@/data/cars";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Luxury Car Gallery, Dubai" },
      {
        name: "description",
        content:
          "Luxury Car Gallery is a Dubai specialist in luxury, performance and classic cars, offering sourcing, inspection, finance and worldwide delivery.",
      },
      { property: "og:title", content: "About Luxury Car Gallery, Dubai" },
      {
        property: "og:description",
        content:
          "A Dubai specialist in luxury, performance and classic cars, with sourcing and worldwide delivery.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-[1500px] px-5 py-16 lg:px-10">
      <p className="engraved text-muted-foreground">About Us</p>
      <h1 className="mt-6 max-w-3xl text-3xl leading-tight md:text-4xl">
        The Ultimate Name In Luxury, Performance &amp; Classic Cars In Dubai
      </h1>

      <div className="mt-14 grid gap-14 lg:grid-cols-2">
        <div>
          <p className="leading-relaxed text-muted-foreground">
            Luxury Car Gallery was built on a simple principle: buy only the cars we would be happy
            to own ourselves. Our Dubai showroom holds {cars.length} vehicles across{" "}
            {brands.length} marques, each one hand selected, inspected and prepared before it is
            offered for sale.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            We take the time to talk through specification, history and ownership so you can make a
            confident, informed decision. Whether it is a first supercar, a refined grand tourer or
            a future classic for a collection, the process is calm, discreet and transparent from
            first enquiry to handover.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Finance can be tailored to you, and our export team arranges secure delivery anywhere in
            the world. Our relationship with owners continues long after the keys change hands.
          </p>
          <Link to="/inventory" search={{}} className="btn-ink mt-10">
            View Our Inventory
          </Link>
        </div>
        <img
          src={showroomInterior}
          alt="The Luxury Car Gallery showroom floor in Dubai"
          className="aspect-[4/3] w-full object-cover"
        />
      </div>
    </div>
  );
}
