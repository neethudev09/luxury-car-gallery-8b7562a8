import { createFileRoute } from "@tanstack/react-router";
import { PHONE, EMAIL, whatsappLink } from "@/data/cars";

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
    <div className="mx-auto max-w-[1500px] px-5 py-16 lg:px-10">
      <p className="engraved text-muted-foreground">Contact Us</p>
      <h1 className="mt-6 max-w-3xl text-3xl leading-tight md:text-4xl">
        Arrange A Viewing At Our Dubai Showroom
      </h1>

      <div className="mt-14 grid gap-12 md:grid-cols-3">
        <div className="border-t border-hairline pt-6">
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
        <div className="border-t border-hairline pt-6">
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
        <div className="border-t border-hairline pt-6">
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
  );
}
