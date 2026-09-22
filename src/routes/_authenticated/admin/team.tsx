import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/team")({
  component: AdminTeam,
});

function AdminTeam() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ["admin-team"],
    queryFn: async () => {
      const { data: roles, error } = await supabase.from("user_roles").select("id, user_id, role, created_at");
      if (error) throw error;
      const ids = (roles ?? []).map((r) => r.user_id);
      const { data: profiles } = ids.length
        ? await supabase.from("profiles").select("id, email").in("id", ids)
        : { data: [] as { id: string; email: string | null }[] };
      const byId = new Map((profiles ?? []).map((p) => [p.id, p.email]));
      return (roles ?? []).map((r) => ({ ...r, email: byId.get(r.user_id) ?? "Unknown account" }));
    },
  });

  const grant = useMutation({
    mutationFn: async (value: string) => {
      const { data: ok, error } = await supabase.rpc("grant_admin_by_email", { _email: value });
      if (error) throw error;
      return Boolean(ok);
    },
    onSuccess: (ok) => {
      setStatus(ok ? "Access granted." : "No account found with that email. Ask them to create an account first, then try again.");
      if (ok) setEmail("");
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
    },
    onError: () => setStatus("Could not grant access."),
  });

  const revoke = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-team"] }),
  });

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-medium uppercase">Team access</h2>
      <p className="mt-3 text-sm text-muted-foreground">
        Colleagues create an account at the sign-in page first. Then add their email here to give them management
        access.
      </p>

      <form
        onSubmit={(e) => { e.preventDefault(); setStatus(null); grant.mutate(email.trim()); }}
        className="mt-8 flex flex-wrap gap-3"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="colleague@example.com"
          className="min-w-64 flex-1 rounded-full border border-hairline bg-background px-5 py-3.5 text-sm outline-none focus:border-foreground"
        />
        <button type="submit" className="btn-ink">Give access</button>
      </form>
      {status ? <p className="mt-4 text-sm text-muted-foreground">{status}</p> : null}

      <div className="mt-10 divide-y divide-hairline border-y border-hairline">
        {(data ?? []).map((row) => (
          <div key={row.id} className="flex items-center justify-between gap-4 py-4">
            <p className="text-sm">{row.email}</p>
            <button
              type="button"
              onClick={() => { if (window.confirm(`Remove access for ${row.email}?`)) revoke.mutate(row.id); }}
              className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
