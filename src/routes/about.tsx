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
    <>
      <section className="relative min-h-[620px] overflow-hidden bg-ink text-ink-foreground">
        <img src={showroomInterior} alt="The Luxury Car Gallery showroom floor in Dubai" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/45 to-transparent" />
        <div className="relative mx-auto flex min-h-[620px] max-w-[1600px] items-end px-5 py-16 lg:px-10 lg:py-24"><div className="max-w-4xl"><p className="engraved text-ink-foreground/55">About us</p><h1 className="mt-6 text-4xl font-medium uppercase leading-tight sm:text-6xl">Driven by distinction.</h1><p className="mt-6 max-w-2xl text-base leading-7 text-ink-foreground/70">A private Dubai showroom for collectors and drivers searching for exceptional luxury, performance and classic cars.</p></div></div>
      </section>
      <section className="mx-auto max-w-[1600px] px-5 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-[0.65fr_1fr]">
          <div><p className="engraved text-muted-foreground">Our approach</p><h2 className="mt-5 text-3xl font-medium uppercase leading-tight">Selected as if each car were our own.</h2></div>
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
            <Link to="/inventory" search={{}} className="btn-ink mt-10">View our inventory</Link>
          </div>
        </div>
        <div className="mt-20 grid grid-cols-3 border-y border-border py-9 text-center"><div><strong className="text-3xl sm:text-5xl">{cars.length}</strong><p className="engraved mt-3 text-muted-foreground">Vehicles</p></div><div><strong className="text-3xl sm:text-5xl">{brands.length}</strong><p className="engraved mt-3 text-muted-foreground">Marques</p></div><div><strong className="text-3xl sm:text-5xl">Global</strong><p className="engraved mt-3 text-muted-foreground">Delivery</p></div></div>
      </section>
    </>
  );
}
