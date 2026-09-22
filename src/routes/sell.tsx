import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PHONE, EMAIL, whatsappLink } from "@/data/cars";
import { supabase } from "@/integrations/supabase/client";
import showroomInterior from "@/assets/showroom-interior.jpg";

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
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const message = `Valuation request%0AName: ${form.name}%0APhone: ${form.phone}%0ACar: ${form.car}%0AYear: ${form.year}%0AMileage: ${form.mileage} km`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const [brand, ...rest] = form.car.trim().split(" ");
    const { error: err } = await supabase.from("sell_submissions").insert({
      name: form.name,
      phone: form.phone,
      brand: brand || null,
      model: rest.join(" ") || null,
      year: form.year ? Number(form.year.replace(/\D/g, "")) : null,
      mileage: form.mileage ? Number(form.mileage.replace(/\D/g, "")) : null,
      notes: `Submitted from the website valuation form. Vehicle: ${form.car}`,
    });
    setBusy(false);
    if (err) setError("We could not send your request. Please try WhatsApp below.");
    else {
      setSent(true);
      setForm({ name: "", phone: "", car: "", year: "", mileage: "" });
    }
  }

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
    <>
      <section className="relative min-h-[560px] overflow-hidden bg-ink text-ink-foreground">
        <img src={showroomInterior} alt="Luxury cars in our Dubai showroom" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/10" />
        <div className="relative mx-auto flex min-h-[560px] max-w-[1600px] items-end px-5 py-16 lg:px-10 lg:py-24"><div className="max-w-4xl"><p className="engraved text-ink-foreground/55">Sell your car</p><h1 className="mt-6 text-4xl font-medium uppercase leading-tight md:text-6xl">A discreet, effortless sale.</h1><p className="mt-6 max-w-xl text-base leading-7 text-ink-foreground/70">A considered valuation, prompt payment, and every detail handled by our team.</p></div></div>
      </section>

      <div className="mx-auto max-w-[1600px] px-5 py-20 lg:px-10 lg:py-28">
      <div className="grid gap-16 lg:grid-cols-[0.75fr_1fr]">
        <div>
          <p className="leading-relaxed text-muted-foreground">
            We buy outright and we buy quickly. Send us the details of your car and our team will
            come back to you with a competitive valuation, usually within a few hours. If you accept,
            we handle inspection, paperwork, transfer and payment with complete discretion.
          </p>
          <ul className="mt-12 border-t border-hairline">
            {[
              "Valuation within hours, no obligation",
              "Payment on the same day as collection",
              "Finance settlement handled for you",
              "Collection anywhere in the UAE",
            ].map((item) => (
              <li key={item} className="flex items-center gap-4 border-b border-hairline py-5 text-sm text-muted-foreground">
                <span className="size-1.5 rounded-full bg-accent" />{item}
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

        <form onSubmit={submit} className="bg-card p-7 shadow-[0_24px_70px_-50px_var(--color-ink)] sm:p-10">
          <p className="engraved text-muted-foreground">Your vehicle</p>
          <h2 className="mt-4 text-2xl font-medium uppercase">Request a valuation</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {field("Your Name", "name", "Full name")}
            {field("Phone", "phone", "+971 …", "tel")}
            <div className="sm:col-span-2">{field("Car", "car", "e.g. Ferrari 812 GTS")}</div>
            {field("Year", "year", "2024")}
            {field("Mileage (km)", "mileage", "12,000")}
          </div>
          <button type="submit" disabled={busy || !form.name || !form.phone} className="btn-ink mt-8 w-full justify-center">
            {busy ? "Sending…" : "Request Valuation"}
          </button>
          {sent ? <p className="mt-4 text-sm text-muted-foreground">Thank you — our team has your details and will be in touch shortly.</p> : null}
          {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}
          <a
            href={`${whatsappLink("")}${message}`}
            target="_blank"
            rel="noreferrer"
            className="btn-outline-ink mt-3 w-full"
          >
            Send Via WhatsApp
          </a>
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent("Valuation request")}&body=${message.replace(/%0A/g, "%0D%0A")}`}
            className="btn-outline-ink mt-3 w-full"
          >
            Send By Email
          </a>
        </form>
      </div>
      </div>
    </>
  );
}
