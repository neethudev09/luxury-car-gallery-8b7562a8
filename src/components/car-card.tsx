import { Link } from "@tanstack/react-router";
import type { Car } from "@/data/cars";
import { formatPrice } from "@/data/cars";

export function CarCard({ car }: { car: Car }) {
  const photos = car.images?.length ?? 0;

  return (
    <article className="group">
      <Link
        to="/cars/$slug"
        params={{ slug: car.slug }}
        className="relative block overflow-hidden bg-card"
      >
        <img
          src={car.image}
          alt={`${car.year} ${car.brand} ${car.model} for sale in Dubai`}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {photos > 1 && (
          <span className="engraved absolute bottom-3 left-3 bg-ink/80 px-2.5 py-1.5 text-ink-foreground">
            {photos} Photos
          </span>
        )}
        {car.sold && (
          <span className="engraved absolute top-3 left-3 bg-ink px-2.5 py-1.5 text-ink-foreground">
            Sold
          </span>
        )}
      </Link>

      <div className="mt-4 border-t border-hairline pt-4">
        <p className="engraved text-muted-foreground">
          {car.brand} · {car.year}
        </p>
        <h3 className="mt-2 text-lg leading-snug">
          <Link to="/cars/$slug" params={{ slug: car.slug }} className="hover:text-accent">
            {car.model}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {car.mileage.toLocaleString("en-US")} km · {car.fuel} · {car.transmission}
        </p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <p className="font-display text-base">{formatPrice(car.price)}</p>
          <Link
            to="/cars/$slug"
            params={{ slug: car.slug }}
            className="engraved border-b border-accent pb-1 text-foreground hover:text-accent"
          >
            More Details
          </Link>
        </div>
      </div>
    </article>
  );
}
