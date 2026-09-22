import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Car } from "@/data/cars";
import { formatPrice } from "@/data/cars";

export function CarCard({ car }: { car: Car }) {
  return (
    <article className="group min-w-0">
      <Link to="/cars/$slug" params={{ slug: car.slug }} className="relative block overflow-hidden bg-secondary">
        <img src={car.image} alt={`${car.year} ${car.brand} ${car.model} for sale in Dubai`} loading="lazy" className="aspect-[1.28/1] w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
        <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1.5 text-[9px] font-semibold uppercase backdrop-blur-md">{car.sold ? "Sold" : "Available"}</span>
        <span className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full bg-background text-foreground opacity-0 transition duration-300 group-hover:opacity-100"><ArrowUpRight className="size-4" /></span>
      </Link>
      <div className="flex items-start justify-between gap-5 pt-5">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{car.brand} · {car.year}</p>
          <h3 className="mt-2 truncate text-base font-medium uppercase"><Link to="/cars/$slug" params={{ slug: car.slug }}>{car.model}</Link></h3>
          <p className="mt-2 text-xs text-muted-foreground">{car.mileage.toLocaleString("en-US")} km · {car.transmission}</p>
        </div>
        <p className="shrink-0 text-sm font-medium">{formatPrice(car.price)}</p>
      </div>
    </article>
  );
}