import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/submissions")({
  component: AdminSubmissions,
});

interface Submission {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  mileage: number | null;
  price_expectation: number | null;
  notes: string;
  status: string;
  created_at: string;
}

function AdminSubmissions() {
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: ["admin-submissions"],
    queryFn: async () => {
      const { data: rows, error } = await supabase
        .from("sell_submissions")
        .select("id, name, email, phone, brand, model, year, mileage, price_expectation, notes, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (rows ?? []) as unknown as Submission[];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("sell_submissions").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-submissions"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sell_submissions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-submissions"] }),
  });

  if (isPending) return <p className="py-16 text-sm text-muted-foreground">Loading requests…</p>;
  if (!data?.length) return <p className="py-16 text-sm text-muted-foreground">No sell requests yet.</p>;

  return (
    <div className="divide-y divide-hairline border-y border-hairline">
      {data.map((row) => (
        <article key={row.id} className="py-6">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-sm font-semibold uppercase">
              {[row.year, row.brand, row.model].filter(Boolean).join(" ") || "Vehicle details not given"}
            </p>
            <span className="rounded-full border border-hairline px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {row.status}
            </span>
            <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {new Date(row.created_at).toLocaleString("en-GB")}
            </span>
          </div>
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
            {[row.name, row.phone, row.email].filter(Boolean).join(" · ")}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
            {[row.mileage ? `${row.mileage.toLocaleString("en-US")} km` : null, row.price_expectation ? `AED ${Number(row.price_expectation).toLocaleString("en-US")} expected` : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {row.notes ? <p className="mt-4 max-w-3xl text-sm leading-6">{row.notes}</p> : null}
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${row.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-semibold uppercase tracking-[0.14em] underline"
            >
              WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setStatus.mutate({ id: row.id, status: row.status === "new" ? "handled" : "new" })}
              className="text-[10px] font-semibold uppercase tracking-[0.14em] underline"
            >
              Mark as {row.status === "new" ? "handled" : "new"}
            </button>
            <button
              type="button"
              onClick={() => { if (window.confirm("Delete this request?")) remove.mutate(row.id); }}
              className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent"
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
