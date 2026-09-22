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

      <EnquiryForm />

      <a
        href={whatsappLink("Hello, I would like to arrange a viewing.")}
        target="_blank"
        rel="noreferrer"
        className="btn-outline-ink mt-6"
      >
        Message Us On WhatsApp
      </a>
      </div>
    </>
  );
}

function EnquiryForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.from("enquiries").insert({
      name: form.name,
      email: form.email || null,
      phone: form.phone || null,
      message: form.message,
      source: "contact",
    });
    setBusy(false);
    if (err) setError("We could not send your message. Please call or WhatsApp us instead.");
    else {
      setSent(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    }
  }

  const field = "mt-3 w-full border border-hairline bg-background px-4 py-3 text-sm outline-none focus:border-accent";

  return (
    <form onSubmit={submit} className="mt-16 max-w-3xl bg-card p-7 shadow-[0_24px_70px_-50px_var(--color-ink)] sm:p-10">
      <p className="engraved text-muted-foreground">Send a message</p>
      <h2 className="mt-4 text-2xl font-medium uppercase">Make an enquiry</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="engraved text-muted-foreground">Your Name</span>
          <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Full name" className={field} />
        </label>
        <label className="block">
          <span className="engraved text-muted-foreground">Phone</span>
          <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+971 …" className={field} />
        </label>
        <label className="block sm:col-span-2">
          <span className="engraved text-muted-foreground">Email</span>
          <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className={field} />
        </label>
        <label className="block sm:col-span-2">
          <span className="engraved text-muted-foreground">Message</span>
          <textarea required rows={5} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Tell us which car you are interested in." className={field} />
        </label>
      </div>
      <button type="submit" disabled={busy} className="btn-ink mt-8 w-full justify-center">
        {busy ? "Sending…" : "Send Enquiry"}
      </button>
      {sent ? <p className="mt-4 text-sm text-muted-foreground">Thank you — we have your enquiry and will reply today.</p> : null}
      {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}
    </form>
  );
}
