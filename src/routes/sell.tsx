import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PHONE, EMAIL, whatsappLink } from "@/data/cars";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "Selling Your Car — Luxury Car Valuations In Dubai | Luxury Car Gallery" },
      {
        name: "description",
        content:
          "Sell your luxury, performance or classic car in Dubai. Receive a competitive valuation within hours, with paperwork, transfer and payment handled discreetly.",
      },
      { property: "og:title", content: "Selling Your Car — Luxury Car Gallery Dubai" },
      {
        property: "og:description",
        content: "A competitive valuation within hours, with everything handled for you.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/sell" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/sell" }],
  }),
  component: SellPage,
});

function SellPage() {
  const [form, setForm] = useState({ name: "", phone: "", car: "", year: "", mileage: "" });

  const message = `Valuation request%0AName: ${form.name}%0APhone: ${form.phone}%0ACar: ${form.car}%0AYear: ${form.year}%0AMileage: ${form.mileage} km`;

  const field = (
    label: string,
    key: keyof typeof form,
    placeholder: string,
    type = "text",
  ) => (
    <label className="block">
      <span className="engraved text-muted-foreground">{label}</span>
      <input
        type={type}
        value={form[key]}
        placeholder={placeholder}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="mt-3 w-full border border-hairline bg-background px-4 py-3 text-sm outline-none focus:border-accent"
      />
    </label>
  );

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-16 lg:px-10">
      <p className="engraved text-muted-foreground">Selling Your Car</p>
      <h1 className="mt-6 max-w-3xl text-3xl leading-tight md:text-4xl">
        The Effortless Way To Sell Your Luxury Car
      </h1>

      <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="leading-relaxed text-muted-foreground">
            We buy outright and we buy quickly. Send us the details of your car and our team will
            come back to you with a competitive valuation, usually within a few hours. If you accept,
            we handle inspection, paperwork, transfer and payment with complete discretion.
          </p>
          <ul className="mt-10">
            {[
              "Valuation within hours, no obligation",
              "Payment on the same day as collection",
              "Finance settlement handled for you",
              "Collection anywhere in the UAE",
            ].map((item) => (
              <li key={item} className="border-b border-hairline py-4 text-sm text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm text-muted-foreground">
            Prefer to talk?{" "}
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="border-b border-accent">
              {PHONE}
            </a>
          </p>
        </div>

        <div className="border border-hairline p-8">
          <h2 className="text-xl">Request A Valuation</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {field("Your Name", "name", "Full name")}
            {field("Phone", "phone", "+971 …", "tel")}
            <div className="sm:col-span-2">{field("Car", "car", "e.g. Ferrari 812 GTS")}</div>
            {field("Year", "year", "2024")}
            {field("Mileage (km)", "mileage", "12,000")}
          </div>
          <a
            href={`${whatsappLink("")}${message}`}
            target="_blank"
            rel="noreferrer"
            className="btn-ink mt-8 w-full"
          >
            Send Via WhatsApp
          </a>
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent("Valuation request")}&body=${message.replace(/%0A/g, "%0D%0A")}`}
            className="btn-outline-ink mt-3 w-full"
          >
            Send By Email
          </a>
        </div>
      </div>
    </div>
  );
}
