import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Globe2, SearchCheck, ShieldCheck, Sparkles } from "lucide-react";
import showroomInterior from "@/assets/showroom-interior.jpg";
import { brands, whatsappLink } from "@/data/cars";

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
  const standards = [
    {
      icon: Sparkles,
      title: "Curated collection",
      copy: "Only distinctive luxury, performance and classic cars that meet our exacting standards.",
    },
    {
      icon: SearchCheck,
      title: "Certified & inspected",
      copy: "Every vehicle is carefully assessed, verified and transparently presented before sale.",
    },
    {
      icon: Globe2,
      title: "Global delivery",
      copy: "Export documentation, secure transport and worldwide shipping managed from end to end.",
    },
    {
      icon: ShieldCheck,
      title: "Trusted expertise",
      copy: "More than 15 years of specialist knowledge and long-standing client relationships.",
    },
  ];

  const faqs = [
    {
      question: "Do you ship vehicles internationally?",
      answer: "Yes. We manage export documentation, secure transport and shipping to most countries worldwide, keeping you informed throughout the journey.",
    },
    {
      question: "Can I reserve a vehicle remotely?",
      answer: "Yes. Our team can provide a detailed remote presentation, confirm the vehicle's condition and guide you through reservation and payment securely.",
    },
    {
      question: "Do you offer financing?",
      answer: "We can help arrange tailored finance options for eligible UAE clients through our finance partners. Contact us to discuss your requirements.",
    },
    {
      question: "How do I sell my car to you?",
      answer: "Share your vehicle's make, model, year, mileage and photographs through our Sell Your Car page. Our team will review it and contact you privately.",
    },
    {
      question: "Are your vehicles inspected?",
      answer: "Every vehicle is carefully inspected and its history and specification reviewed before it is presented for sale.",
    },
  ];

  return (
    <>
      <section className="relative min-h-[620px] overflow-hidden bg-ink text-ink-foreground">
        <img src={showroomInterior} alt="The Luxury Car Gallery showroom floor in Dubai" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/45 to-transparent" />
        <div className="relative mx-auto flex min-h-[620px] max-w-[1600px] items-end px-5 py-16 lg:px-10 lg:py-24">
          <div className="max-w-4xl">
            <p className="engraved text-ink-foreground/55">About us</p>
            <h1 className="mt-6 text-4xl font-medium uppercase leading-tight sm:text-6xl">A passion for the extraordinary.</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-ink-foreground/70">For over 15 years, Luxury Car Gallery Dubai has been a trusted destination for discerning collectors seeking the world&apos;s most desirable automobiles.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1fr] lg:gap-20">
          <div>
            <p className="engraved text-muted-foreground">Our approach</p>
            <h2 className="mt-5 text-3xl font-medium uppercase leading-tight sm:text-4xl">Selected as if each car were our own.</h2>
          </div>
          <div>
            <p className="leading-7 text-muted-foreground">From rare supercars to handcrafted grand tourers and significant classics, we maintain an uncompromising standard of curation and service. Every vehicle is selected for its specification, provenance, condition and ability to inspire.</p>
            <p className="mt-5 leading-7 text-muted-foreground">Our reputation is built on trust, transparency and obsessive attention to detail. We take time to explain each car&apos;s specification, history and ownership so every client can make a confident, informed decision.</p>
            <p className="mt-5 leading-7 text-muted-foreground">Whether you are acquiring your first performance car, adding to an established collection or selling an exceptional vehicle, our service remains calm, personal and discreet from the first conversation to final handover.</p>
            <Link to="/inventory" search={{}} className="btn-ink mt-10">View our inventory <ArrowRight className="size-4" /></Link>
          </div>
        </div>
        <div className="mt-20 grid grid-cols-2 border-y border-border lg:grid-cols-4">
          {[
            ["15+", "Years in business"],
            ["2,400+", "Cars sold"],
            [String(brands.length), "Marques"],
            ["1,800+", "Happy clients"],
          ].map(([value, label], index) => (
            <div key={label} className={`px-3 py-9 text-center sm:py-11 ${index % 2 ? "border-l border-border" : ""} ${index > 1 ? "border-t border-border lg:border-t-0" : ""} ${index === 2 ? "lg:border-l" : ""}`}>
              <strong className="text-3xl font-medium sm:text-5xl">{value}</strong>
              <p className="engraved mt-3 text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink py-20 text-ink-foreground lg:py-28">
        <div className="mx-auto max-w-[1600px] px-5 lg:px-10">
          <div className="max-w-3xl">
            <p className="engraved text-ink-foreground/50">Why choose us</p>
            <h2 className="mt-5 text-3xl font-medium uppercase leading-tight sm:text-5xl">The Luxury Car Gallery standard.</h2>
          </div>
          <div className="mt-14 grid border-y border-ink-foreground/15 sm:grid-cols-2 lg:grid-cols-4">
            {standards.map(({ icon: Icon, title, copy }, index) => (
              <article key={title} className={`py-9 sm:px-8 lg:py-12 ${index % 2 ? "sm:border-l sm:border-ink-foreground/15" : ""} ${index > 1 ? "border-t border-ink-foreground/15 lg:border-t-0" : index > 0 ? "border-t border-ink-foreground/15 sm:border-t-0" : ""} ${index === 2 ? "lg:border-l" : ""}`}>
                <Icon className="size-6 text-accent" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-8 text-lg font-medium uppercase">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-ink-foreground/55">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.6fr_1fr] lg:gap-20">
          <div>
            <p className="engraved text-muted-foreground">FAQ</p>
            <h2 className="mt-5 text-3xl font-medium uppercase leading-tight sm:text-5xl">Frequently asked questions.</h2>
            <p className="mt-6 max-w-md text-sm leading-6 text-muted-foreground">Our team is available for personal guidance if your question is not covered here.</p>
          </div>
          <div className="border-t border-border">
            {faqs.map(({ question, answer }, index) => (
              <details key={question} className="group border-b border-border" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-sm font-medium uppercase marker:content-none sm:text-base">
                  {question}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border text-lg font-light transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="max-w-2xl pb-7 pr-12 text-sm leading-7 text-muted-foreground">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-8 px-5 py-16 sm:flex-row sm:items-center lg:px-10 lg:py-20">
          <div>
            <p className="engraved text-muted-foreground">Begin a conversation</p>
            <h2 className="mt-4 text-2xl font-medium uppercase sm:text-4xl">What are you looking for?</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={whatsappLink("Hello, I would like to enquire about a vehicle.")} target="_blank" rel="noreferrer" className="btn-ink">WhatsApp us <ArrowRight className="size-4" /></a>
            <Link to="/sell" className="btn-outline-ink">Sell your car</Link>
          </div>
        </div>
      </section>
    </>
  );
}
