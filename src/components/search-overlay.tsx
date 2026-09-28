import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X, ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { brands, formatPrice } from "@/data/cars";
import { useCatalogue } from "@/hooks/use-catalogue";
import { matchesQuery } from "@/lib/car-search";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { cars } = useCatalogue();

  useEffect(() => {
    if (!open) return;
    setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => (q.trim() ? cars.filter((c) => matchesQuery(c, q.trim())).slice(0, 6) : []), [cars, q]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/inventory", search: { q: q.trim() || undefined } });
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[80] bg-background/80 backdrop-blur-md transition duration-300 ${open ? "visible opacity-100" : "invisible opacity-0"}`} aria-hidden={!open} role="dialog" aria-label="Search vehicles">
      <div className="mx-auto max-w-3xl px-5 pt-6 lg:pt-16">
        <div className="flex justify-end">
          <button type="button" onClick={onClose} aria-label="Close search" className="flex size-10 items-center justify-center rounded-full hover:bg-secondary">
            <X className="size-5" />
          </button>
        </div>
        <form onSubmit={submit} className="mt-4 flex items-center gap-3 border-b border-foreground pb-3">
          <Search className="size-5 shrink-0" strokeWidth={1.6} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search make, model, year…"
            aria-label="Search vehicles"
            className="w-full bg-transparent text-xl outline-none placeholder:text-muted-foreground md:text-3xl"
          />
        </form>

        {q.trim() ? (
          <div className="mt-6">
            {results.length === 0 ? (
              <p className="text-sm text-muted-foreground">No vehicles match “{q}”.</p>
            ) : (
              <ul className="divide-y divide-border">
                {results.map((c) => (
                  <li key={c.slug}>
                    <Link to="/cars/$slug" params={{ slug: c.slug }} onClick={onClose} className="flex items-center gap-4 py-3 hover:bg-secondary/60">
                      <img src={c.image} alt={c.title} className="h-14 w-20 object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{c.year} · {c.sold ? "Sold" : formatPrice(c.price)}</p>
                      </div>
                      <ArrowUpRight className="size-4 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <button type="button" onClick={submit} className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] underline underline-offset-4">
              See all results in inventory
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <p className="engraved text-muted-foreground">Browse by marque</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {brands.map((b) => (
                <Link key={b.slug} to="/inventory" search={{ make: b.slug }} onClick={onClose} className="rounded-full border border-border px-4 py-2 text-[11px] font-medium uppercase hover:border-foreground">
                  {b.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
