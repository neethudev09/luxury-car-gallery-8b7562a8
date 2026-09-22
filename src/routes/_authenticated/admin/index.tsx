import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const { data } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const [cars, sold, enquiries, newEnquiries, submissions, newSubmissions] = await Promise.all([
        supabase.from("cars").select("id", { count: "exact", head: true }),
        supabase.from("cars").select("id", { count: "exact", head: true }).eq("sold", true),
        supabase.from("enquiries").select("id", { count: "exact", head: true }),
        supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("sell_submissions").select("id", { count: "exact", head: true }),
        supabase.from("sell_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);
      return {
        cars: cars.count ?? 0,
        sold: sold.count ?? 0,
        enquiries: enquiries.count ?? 0,
        newEnquiries: newEnquiries.count ?? 0,
        submissions: submissions.count ?? 0,
        newSubmissions: newSubmissions.count ?? 0,
      };
    },
  });

  const cards = [
    { label: "Listings", value: data?.cars ?? 0, note: `${data?.sold ?? 0} marked sold`, to: "/admin/cars" as const },
    { label: "Enquiries", value: data?.enquiries ?? 0, note: `${data?.newEnquiries ?? 0} new`, to: "/admin/enquiries" as const },
    { label: "Sell requests", value: data?.submissions ?? 0, note: `${data?.newSubmissions ?? 0} new`, to: "/admin/submissions" as const },
  ];

  return (
    <div className="grid gap-px bg-border sm:grid-cols-3">
      {cards.map((card) => (
        <Link key={card.label} to={card.to} className="group bg-background p-8 transition-colors hover:bg-ink hover:text-ink-foreground">
          <p className="engraved text-muted-foreground group-hover:text-ink-foreground/55">{card.label}</p>
          <strong className="mt-6 block text-5xl font-medium">{card.value}</strong>
          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-muted-foreground group-hover:text-ink-foreground/55">{card.note}</p>
        </Link>
      ))}
    </div>
  );
}
