import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/enquiries")({
  component: AdminEnquiries,
});

interface Enquiry {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  car_title: string | null;
  source: string;
  status: string;
  created_at: string;
}


function AdminEnquiries() {
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: ["admin-enquiries"],
    queryFn: async () => {
      const { data: rows, error } = await supabase
        .from("enquiries")
        .select("id, name, email, phone, message, car_title, source, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (rows ?? []) as unknown as Enquiry[];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-enquiries"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("enquiries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-enquiries"] }),
  });

  if (isPending) return <p className="py-16 text-sm text-muted-foreground">Loading enquiries…</p>;
  if (!data?.length) return <p className="py-16 text-sm text-muted-foreground">No enquiries yet.</p>;

  return (
    <div className="divide-y divide-hairline border-y border-hairline">
      {data.map((row) => (
        <article key={row.id} className="py-6">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-sm font-semibold uppercase">{row.name}</p>
            <span className="rounded-full border border-hairline px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {row.status}
            </span>
            <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {new Date(row.created_at).toLocaleString("en-GB")}
            </span>
          </div>
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
            {[row.email, row.phone, row.car_title, row.source].filter(Boolean).join(" · ")}
          </p>
          {row.message ? <p className="mt-4 max-w-3xl text-sm leading-6">{row.message}</p> : null}
          <div className="mt-4 flex flex-wrap gap-3">
            {row.email ? (
              <a href={`mailto:${row.email}`} className="text-[10px] font-semibold uppercase tracking-[0.14em] underline">
                Reply by email
              </a>
            ) : null}
            {row.phone ? (
              <a
                href={`https://wa.me/${row.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-semibold uppercase tracking-[0.14em] underline"
              >
                WhatsApp
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => setStatus.mutate({ id: row.id, status: row.status === "new" ? "handled" : "new" })}
              className="text-[10px] font-semibold uppercase tracking-[0.14em] underline"
            >
              Mark as {row.status === "new" ? "handled" : "new"}
            </button>
            <button
              type="button"
              onClick={() => { if (window.confirm("Delete this enquiry?")) remove.mutate(row.id); }}
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
