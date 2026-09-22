import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import "car-makes-icons/dist/style.css";
import { CarCard } from "@/components/car-card";
import { brands, cars, featuredCars, PHONE, whatsappLink } from "@/data/cars";
import heroShowroom from "@/assets/hero-showroom.jpg";
import showroomInterior from "@/assets/showroom-interior.jpg";
import heroVideoAsset from "@/assets/brand/hero-video.mp4.asset.json";

const brandIconMap: Record<string, string> = {
  "aston-martin": "car-aston-martin",
  bentley: "car-bentley",
  bmw: "car-bmw",
  ferrari: "car-ferrari",
  lamborghini: "car-lamborghini",
  "mercedes-benz": "car-mercedes-benz",
  porsche: "car-porsche",
  "range-rover": "car-land-rover",
  "rolls-royce": "car-rolls-royce",
  tesla: "car-tesla",
};

const brandColorMap: Record<string, string> = {
  "aston-martin": "#00665E",
  bentley: "#1C1C1C",
  bmw: "#0066B1",
  ferrari: "#FF2800",
  lamborghini: "#DDB05F",
  "mercedes-benz": "#00ADEF",
  porsche: "#B12B28",
  "range-rover": "#005A2E",
  "rolls-royce": "#1C1C1C",
  tesla: "#E82127",
};

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Luxury Car Gallery — Luxury, Performance & Classic Cars In Dubai" },
    { name: "description", content: "Luxury Car Gallery is Dubai's destination for luxury, performance and classic cars. Browse Ferrari, Lamborghini, Porsche, Rolls-Royce and more." },
    { property: "og:title", content: "Luxury Car Gallery — Luxury & Classic Cars In Dubai" },
    { property: "og:description", content: "A handpicked collection of luxury, performance and classic cars for sale in Dubai, with worldwide delivery." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/" }], scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "AutoDealer", name: "Luxury Car Gallery", telephone: PHONE, address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" } }) }] }),
  component: Home,
});

function Home() {
  const available = cars.filter((car) => !car.sold).length;
  const featured = (featuredCars.length ? featuredCars : cars).slice(0, 6);
  const spotlight = featured[0] ?? cars[0];

  return <>
    <section className="relative min-h-[640px] h-[calc(100svh-4rem)] overflow-hidden bg-ink">
      <img src={heroShowroom} alt="Luxury Car Gallery showroom in Dubai" className="absolute inset-0 h-full w-full object-cover" />
      <video className="absolute inset-0 h-full w-full object-cover brightness-110" autoPlay muted loop playsInline preload="metadata" poster={heroShowroom} aria-hidden="true"><source src={heroVideoAsset.url} type="video/mp4" /></video>
      <div className="absolute inset-0 bg-ink/25" /><div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />
      <div className="relative mx-auto flex h-full max-w-[1600px] items-end px-5 pb-14 lg:px-10 lg:pb-20">
        <div className="max-w-2xl text-ink-foreground"><p className="engraved text-ink-foreground/65">Dubai · United Arab Emirates</p><h1 className="mt-5 text-4xl font-medium uppercase leading-[1.03] sm:text-6xl lg:text-7xl">Luxury Car Gallery</h1><p className="mt-4 text-sm uppercase text-ink-foreground/65">Exceptional cars. Personally selected.</p>{spotlight ? <Link to="/cars/$slug" params={{ slug: spotlight.slug }} className="btn-light mt-8">Explore featured car <ArrowRight className="size-4" /></Link> : <Link to="/inventory" search={{}} className="btn-light mt-8">View inventory <ArrowRight className="size-4" /></Link>}</div>
      </div>
    </section>

    <section id="showroom" className="relative min-h-[760px] overflow-hidden bg-ink text-ink-foreground">
      <img src={showroomInterior} alt="Inside the Luxury Car Gallery showroom in Dubai" className="absolute inset-0 h-full w-full object-cover opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/10" />
      <div className="relative mx-auto flex min-h-[760px] max-w-[1600px] flex-col justify-between px-5 py-20 lg:px-10 lg:py-28">
        <div className="max-w-4xl"><p className="engraved text-ink-foreground/55">Dubai's destination for exceptional cars</p><h2 className="mt-6 text-4xl font-medium uppercase leading-tight sm:text-6xl">Luxury Car Gallery</h2><p className="mt-8 max-w-2xl text-base leading-7 text-ink-foreground/68">A carefully selected collection of modern performance cars, refined grand tourers and sought-after classics. Every vehicle is inspected, honestly presented and supported from first enquiry to worldwide delivery.</p><Link to="/about" className="btn-ghost-light mt-9">Discover our story <ArrowUpRight className="size-4" /></Link></div>
        <div className="mt-20 grid grid-cols-3 border-t border-ink-foreground/20 pt-8"><Link to="/inventory" search={{}} className="group transition-colors hover:text-accent"><strong className="text-3xl font-medium sm:text-5xl">{available}</strong><p className="engraved mt-3 text-ink-foreground/45 transition-colors group-hover:text-ink-foreground">Available</p></Link><a href="#marques" className="group transition-colors hover:text-accent"><strong className="text-3xl font-medium sm:text-5xl">{brands.length}</strong><p className="engraved mt-3 text-ink-foreground/45 transition-colors group-hover:text-ink-foreground">Marques</p></a><div><strong className="text-3xl font-medium sm:text-5xl">Global</strong><p className="engraved mt-3 text-ink-foreground/45">Delivery</p></div></div>
      </div>
    </section>

    <section className="overflow-hidden py-16 lg:py-20"><div className="mx-auto max-w-[1600px] px-5 lg:px-10"><p className="engraved text-muted-foreground">The world's finest marques</p></div><div className="mt-9 overflow-hidden border-y border-border py-7"><div className="marquee-track items-center">{[...brands, ...brands].map((brand, index) => <Link key={`${brand.slug}-${index}`} to="/inventory" search={{ make: brand.slug }} className="group flex items-center gap-3 px-7 transition-colors sm:px-10"><i className={`${brandIconMap[brand.slug]} text-3xl leading-none text-foreground/65 transition-colors group-hover:text-[var(--brand-color)]`} style={{ ["--brand-color" as any]: brandColorMap[brand.slug] }} aria-hidden="true" /><span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors group-hover:text-foreground">{brand.name}</span></Link>)}</div></div></section>

    <section className="mx-auto max-w-[1600px] px-5 py-10 lg:px-10 lg:py-20"><div className="flex items-end justify-between gap-8"><div><p className="engraved text-muted-foreground">Available now</p><h2 className="mt-4 text-3xl font-medium uppercase sm:text-5xl">The collection</h2></div><Link to="/inventory" search={{}} className="hidden items-center gap-2 text-xs font-semibold uppercase sm:flex">View all <ArrowRight className="size-4" /></Link></div><div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">{featured.map((car) => <CarCard key={car.slug} car={car} />)}</div><Link to="/inventory" search={{}} className="btn-outline-ink mt-12 sm:hidden">View all cars</Link></section>

    <section className="mx-auto grid max-w-[1600px] gap-px bg-border px-0 lg:grid-cols-2">
      <ActionLink index={0} title="Available Cars" copy="Explore the collection" to="inventory" />
      <ActionLink index={1} title="New Arrivals" copy="See the latest additions" to="latest" />
      <ActionLink index={2} title="Sell Your Car" copy="Request a private valuation" to="sell" />
      <ActionLink index={3} title="Contact" copy="Arrange a showroom visit" to="contact" />
    </section>

    <section className="mx-auto max-w-[1600px] px-5 py-24 text-center lg:px-10 lg:py-32"><p className="engraved text-muted-foreground">Personal service, worldwide reach</p><h2 className="mx-auto mt-5 max-w-4xl text-3xl font-medium uppercase leading-tight sm:text-5xl">Looking for something exceptional?</h2><p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-muted-foreground">Tell our team what you are searching for. We can source, inspect and deliver the right vehicle discreetly.</p><a href={whatsappLink("Hello, I am looking for a specific car.")} target="_blank" rel="noreferrer" className="btn-ink mt-9">Speak with our team <ArrowUpRight className="size-4" /></a></section>
  </>;
}

function ActionLink({ index, title, copy, to }: { index: number; title: string; copy: string; to: "inventory" | "latest" | "sell" | "contact" }) {
  const className = "group flex min-h-64 flex-col justify-between bg-ink p-8 text-ink-foreground transition-colors hover:bg-foreground lg:min-h-80 lg:p-12";
  const content = <><span className="engraved text-ink-foreground/35">0{index + 1}</span><div><h3 className="text-2xl font-medium uppercase sm:text-3xl">{title}</h3><div className="mt-4 flex items-center justify-between text-sm text-ink-foreground/55"><span>{copy}</span><ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div></div></>;
  if (to === "inventory") return <Link to="/inventory" search={{}} className={className}>{content}</Link>;
  if (to === "latest") return <Link to="/inventory" search={{ latest: true }} className={className}>{content}</Link>;
  if (to === "sell") return <Link to="/sell" className={className}>{content}</Link>;
  return <Link to="/contact" className={className}>{content}</Link>;
}