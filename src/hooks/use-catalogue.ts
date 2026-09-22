import { useQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { cars as staticCars, carFromRow, type Car, type Brand } from "@/data/cars";
import { listPublicCars } from "@/lib/catalogue.functions";

export const catalogueQueryOptions = queryOptions({
  queryKey: ["catalogue"],
  queryFn: async (): Promise<Car[]> => {
    const rows = await listPublicCars();
    if (!rows.length) return staticCars;
    return rows.map(carFromRow);
  },
});

export function deriveBrands(list: Car[]): Brand[] {
  const map = new Map<string, Brand>();
  for (const car of list) {
    const entry = map.get(car.brandSlug) ?? { name: car.brand, slug: car.brandSlug, available: 0, sold: 0 };
    if (car.sold) entry.sold += 1;
    else entry.available += 1;
    map.set(car.brandSlug, entry);
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function useCatalogue() {
  const { data } = useQuery({ ...catalogueQueryOptions, initialData: staticCars });
  const cars = data ?? staticCars;
  return {
    cars,
    brands: deriveBrands(cars),
    available: cars.filter((c) => !c.sold),
    featured: cars.filter((c) => c.featured && !c.sold),
  };
}
