import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CAR_ROW_COLUMNS, type CarRow } from "@/lib/catalogue-types";
import { formatPrice } from "@/data/cars";

export const Route = createFileRoute("/_authenticated/admin/cars/")({
  component: AdminCars,
});

function AdminCars() {
  const queryClient = useQueryClient();
  const { data: rows, isPending } = useQuery({
    queryKey: ["admin-cars"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select(CAR_ROW_COLUMNS)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as CarRow[];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<CarRow> }) => {
      const { error } = await supabase.from("cars").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
      queryClient.invalidateQueries({ queryKey: ["catalogue"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cars").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
      queryClient.invalidateQueries({ queryKey: ["catalogue"] });
    },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-medium uppercase">{rows?.length ?? 0} listings</h2>
        <Link to="/admin/cars/$carId" params={{ carId: "new" }} className="btn-ink">
          Add a car
        </Link>
      </div>

      {isPending ? (
        <p className="py-16 text-sm text-muted-foreground">Loading listings…</p>
      ) : (
        <div className="mt-8 divide-y divide-hairline border-y border-hairline">
          {(rows ?? []).map((row) => (
            <div key={row.id} className="flex flex-wrap items-center gap-4 py-5">
              <div className="min-w-56 flex-1">
                <p className="text-sm font-semibold uppercase">{row.title}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {row.year} · {row.brand} · {formatPrice(Number(row.price))}
                </p>
              </div>
              <label className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em]">
                <input
                  type="checkbox"
                  checked={row.sold}
                  onChange={(e) => update.mutate({ id: row.id, patch: { sold: e.target.checked } })}
                />
                Sold
              </label>
              <label className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em]">
                <input
                  type="checkbox"
                  checked={row.featured}
                  onChange={(e) => update.mutate({ id: row.id, patch: { featured: e.target.checked } })}
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em]">
                <input
                  type="checkbox"
                  checked={row.published}
                  onChange={(e) => update.mutate({ id: row.id, patch: { published: e.target.checked } })}
                />
                On website
              </label>
              <Link
                to="/admin/cars/$carId"
                params={{ carId: row.id }}
                className="rounded-full border border-hairline px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] hover:bg-ink hover:text-ink-foreground"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Remove ${row.title} permanently?`)) remove.mutate(row.id);
                }}
                className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
