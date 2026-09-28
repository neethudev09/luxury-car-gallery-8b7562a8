import type { Car } from "@/data/cars";

export function matchesQuery(car: Car, q: string | undefined): boolean {
  if (!q) return true;
  const hay = [car.title, car.brand, car.model, String(car.year), car.bodyType, car.exteriorColour, car.fuel]
    .join(" ")
    .toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((t) => hay.includes(t));
}
