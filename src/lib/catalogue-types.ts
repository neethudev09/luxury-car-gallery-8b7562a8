export interface CarRow {
  id: string;
  slug: string;
  title: string;
  brand: string;
  brand_slug: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  body_type: string;
  exterior_colour: string;
  interior_colour: string;
  description: string;
  featured: boolean;
  sold: boolean;
  published: boolean;
  gallery_slug: string | null;
  image_urls: string[];
  sort_order: number;
}

export const CAR_ROW_COLUMNS =
  "id, slug, title, brand, brand_slug, model, year, price, mileage, fuel, transmission, body_type, exterior_colour, interior_colour, description, featured, sold, published, gallery_slug, image_urls, sort_order";

export function photoUrl(pathOrUrl: string) {
  if (/^https?:\/\//.test(pathOrUrl) || pathOrUrl.startsWith("/")) return pathOrUrl;
  return `/api/public/photo/${pathOrUrl}`;
}
