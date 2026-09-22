import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminShell,
});

export function useAdminAccess() {
  return useQuery({
    queryKey: ["admin-access"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("ensure_profile");
      if (error) throw error;
      return Boolean(data);
    },
  });
}

const links = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/cars", label: "Listings" },
  { to: "/admin/enquiries", label: "Enquiries" },
  { to: "/admin/submissions", label: "Sell requests" },
  { to: "/admin/team", label: "Team" },
] as const;

function AdminShell() {
  const { data: isAdmin, isPending, error } = useAdminAccess();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-12 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-hairline pb-7">
        <div>
          <p className="engraved text-muted-foreground">Luxury Car Gallery</p>
          <h1 className="mt-3 text-3xl font-medium uppercase">Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">
            View website
          </Link>
          <button type="button" onClick={signOut} className="btn-outline-ink">
            Sign out
          </button>
        </div>
      </div>

      {isPending ? (
        <p className="py-20 text-sm text-muted-foreground">Checking your access…</p>
      ) : error || !isAdmin ? (
        <div className="py-20">
          <h2 className="text-2xl font-medium uppercase">No access yet</h2>
          <p className="mt-4 max-w-lg text-sm text-muted-foreground">
            Your account is signed in but has not been given management access. Ask a colleague who already has
            access to add your email address under Team.
          </p>
        </div>
      ) : (
        <>
          <nav className="flex flex-wrap gap-2 py-7">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: link.to === "/admin" }}
                activeProps={{ className: "rounded-full bg-ink px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-foreground" }}
                inactiveProps={{ className: "rounded-full border border-hairline px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Outlet />
        </>
      )}
    </div>
  );
}
