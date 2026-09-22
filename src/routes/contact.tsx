import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PHONE, EMAIL, whatsappLink } from "@/data/cars";
import { supabase } from "@/integrations/supabase/client";
import showroomInterior from "@/assets/showroom-interior.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Luxury Car Gallery, Dubai Showroom" },
      {
        name: "description",
        content:
          "Contact Luxury Car Gallery in Dubai to arrange a viewing, discuss a specific car or request a valuation. Call, email or message us on WhatsApp.",
      },
      { property: "og:title", content: "Contact Luxury Car Gallery, Dubai" },
      {
        property: "og:description",
        content: "Arrange a showroom viewing or speak to our sales team in Dubai.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <section className="relative min-h-[520px] overflow-hidden bg-ink text-ink-foreground">
        <img src={showroomInterior} alt="Luxury Car Gallery showroom in Dubai" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/50 to-transparent" />
        <div className="relative mx-auto flex min-h-[520px] max-w-[1600px] items-end px-5 py-16 lg:px-10 lg:py-24"><div><p className="engraved text-ink-foreground/55">Private appointments</p><h1 className="mt-6 max-w-4xl text-4xl font-medium uppercase leading-tight md:text-6xl">Visit Luxury Car Gallery.</h1><p className="mt-6 max-w-xl text-base leading-7 text-ink-foreground/70">Arrange a private viewing, discuss a specific vehicle, or speak to our sourcing team.</p></div></div>
      </section>
      <div className="mx-auto max-w-[1600px] px-5 py-20 lg:px-10 lg:py-28">

      <div className="mt-20 grid gap-px bg-border md:grid-cols-3">
        <div className="min-h-60 bg-card p-8">
          <p className="engraved text-muted-foreground">Telephone</p>
          <a
            href={`tel:${PHONE.replace(/\s/g, "")}`}
            className="mt-4 block font-display text-lg hover:text-accent"
          >
            {PHONE}
          </a>
          <p className="mt-3 text-sm text-muted-foreground">
            Saturday to Thursday, 9am – 8pm (GST)
          </p>
        </div>
        <div className="min-h-60 bg-card p-8">
          <p className="engraved text-muted-foreground">Email</p>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-4 block font-display text-lg break-words hover:text-accent"
          >
            {EMAIL}
          </a>
          <p className="mt-3 text-sm text-muted-foreground">
            We reply to every enquiry the same day.
          </p>
        </div>
        <div className="min-h-60 bg-card p-8">
          <p className="engraved text-muted-foreground">Showroom</p>
          <p className="mt-4 font-display text-lg">Al Quoz, Dubai</p>
          <p className="mt-3 text-sm text-muted-foreground">
            United Arab Emirates. Viewings by appointment.
          </p>
        </div>
      </div>

      <a
        href={whatsappLink("Hello, I would like to arrange a viewing.")}
        target="_blank"
        rel="noreferrer"
        className="btn-ink mt-14"
      >
        Message Us On WhatsApp
      </a>
      </div>
    </>
  );
}
