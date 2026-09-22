CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "own profile write" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "roles read" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins grant roles" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins revoke roles" ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') AND user_id <> auth.uid());

CREATE OR REPLACE FUNCTION public.ensure_profile()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
  mail text := (auth.jwt() ->> 'email');
  is_admin boolean;
BEGIN
  IF uid IS NULL THEN RETURN false; END IF;
  INSERT INTO public.profiles (id, email) VALUES (uid, mail)
    ON CONFLICT (id) DO UPDATE SET email = COALESCE(EXCLUDED.email, public.profiles.email);
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  SELECT public.has_role(uid, 'admin') INTO is_admin;
  RETURN is_admin;
END;
$$;
GRANT EXECUTE ON FUNCTION public.ensure_profile() TO authenticated;

CREATE OR REPLACE FUNCTION public.grant_admin_by_email(_email text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE target uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Not authorised'; END IF;
  SELECT id INTO target FROM auth.users WHERE lower(email) = lower(_email);
  IF target IS NULL THEN RETURN false; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (target, 'admin') ON CONFLICT DO NOTHING;
  INSERT INTO public.profiles (id, email) VALUES (target, lower(_email)) ON CONFLICT (id) DO NOTHING;
  RETURN true;
END;
$$;
GRANT EXECUTE ON FUNCTION public.grant_admin_by_email(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TABLE public.cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  brand text NOT NULL,
  brand_slug text NOT NULL,
  model text NOT NULL DEFAULT '',
  year integer NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  mileage integer NOT NULL DEFAULT 0,
  fuel text NOT NULL DEFAULT 'Petrol',
  transmission text NOT NULL DEFAULT 'Automatic',
  body_type text NOT NULL DEFAULT 'Coupe',
  exterior_colour text NOT NULL DEFAULT '',
  interior_colour text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  featured boolean NOT NULL DEFAULT false,
  sold boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  gallery_slug text,
  image_urls text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cars TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cars TO authenticated;
GRANT ALL ON public.cars TO service_role;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published cars are public" ON public.cars FOR SELECT TO anon, authenticated
  USING (published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage cars" ON public.cars FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER cars_updated_at BEFORE UPDATE ON public.cars
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  message text NOT NULL DEFAULT '',
  car_slug text,
  car_title text,
  source text NOT NULL DEFAULT 'contact',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can send an enquiry" ON public.enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read enquiries" ON public.enquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update enquiries" ON public.enquiries FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete enquiries" ON public.enquiries FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.sell_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text NOT NULL DEFAULT '',
  brand text,
  model text,
  year integer,
  mileage integer,
  price_expectation numeric,
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.sell_submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sell_submissions TO authenticated;
GRANT ALL ON public.sell_submissions TO service_role;
ALTER TABLE public.sell_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit a car" ON public.sell_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read submissions" ON public.sell_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update submissions" ON public.sell_submissions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete submissions" ON public.sell_submissions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.cars (slug, title, brand, brand_slug, model, year, price, mileage, fuel, transmission, body_type, exterior_colour, interior_colour, description, featured, sold, gallery_slug, sort_order) VALUES
('bentley-continental-gt-2024', 'Bentley GT Speed', 'Bentley', 'bentley', 'GT Speed', 2024, 930000, 11964, 'Petrol', 'Automatic', 'Coupe', 'White', 'Beige', 'Bentley GT Speed (2024). GCC spec, finished in White over Beige. 11,964 km. Presented by Luxury Car Gallery, Dubai.', false, false, 'bentley-continental-gt-2024', 0),
('bmw-x7-2019', 'BMW X7', 'BMW', 'bmw', 'X7', 2019, 159000, 61300, 'Petrol', 'Automatic', 'SUV', 'Black', 'Cream white/ Blue', 'BMW X7 (2019). European spec, finished in black over Cream white/ Blue. 61,300 km. Presented by Luxury Car Gallery, Dubai.', false, false, 'bmw-x7-2019', 1),
('bmw-520i-2021', 'BMW 520I', 'BMW', 'bmw', '520I', 2021, 95000, 39500, 'Petrol', 'Automatic', 'Sedan', 'White', 'BEIGE Alcantara', 'BMW 520I (2021). Chinese spec, finished in White over BEIGE Alcantara. 39,500 km. Presented by Luxury Car Gallery, Dubai.', false, false, 'bmw-520i-2021', 2),
('ferrari-sf90-stradale-assetto-fiorano-2021', 'Ferrari SF90 Stradale Assetto Fiorano', 'Ferrari', 'ferrari', 'SF90 Stradale Assetto Fiorano', 2021, 1250000, 3222, 'Petrol', 'Automatic', 'Coupe', 'Rosso Corsa', 'Black / Alcantara', 'Ferrari SF90 Stradale Assetto Fiorano (2021). Euro spec, finished in Rosso Corsa over Black / Alcantara. 3,222 km. Presented by Luxury Car Gallery, Dubai.', true, false, 'ferrari-sf90-stradale-assetto-fiorano-2021', 3),
('ferrari-812-gts-2024', 'Ferrari 812 GTS', 'Ferrari', 'ferrari', '812 GTS', 2024, 2000000, 690, 'Petrol', 'Automatic', 'Coupe', 'Verde', 'Cuoio / Alcantara', 'Ferrari 812 GTS (2024). European spec, finished in Verde over Cuoio / Alcantara. 690 km. Presented by Luxury Car Gallery, Dubai.', true, false, 'ferrari-812-gts-2024', 4),
('porsche-911-carrera-gts-2023', 'Porsche 911 Carrera GTS', 'Porsche', 'porsche', '911 Carrera GTS', 2023, 750000, 16310, 'Petrol', 'Automatic', 'Convertible', 'Black', 'Red', 'Porsche 911 Carrera GTS (2023). European spec, finished in Black over Red. 16,310 km. Presented by Luxury Car Gallery, Dubai.', false, false, 'porsche-911-carrera-gts-2023', 5),
('lamborghini-aventador-2012', 'Lamborghini Aventador', 'Lamborghini', 'lamborghini', 'Aventador', 2012, 700000, 31000, 'Petrol', 'Automatic', 'Coupe', 'Black', 'orange/black', 'Lamborghini Aventador (2012). Gcc spec, finished in black over orange/black. 31,000 km. Presented by Luxury Car Gallery, Dubai.', false, false, 'lamborghini-aventador-2012', 6),
('lamborghini-urus-se-2025', 'Lamborghini urus se', 'Lamborghini', 'lamborghini', 'urus se', 2025, 1420000, 76, 'Petrol', 'Automatic', 'SUV', 'Black', 'Black / Yellow stitching', 'Lamborghini urus se (2025). European spec, finished in Black over Black / Yellow stitching. 76 km. Presented by Luxury Car Gallery, Dubai.', true, false, 'lamborghini-urus-se-2025', 7),
('lamborghini-urus-mansory-kit-2019', 'Lamborghini Urus MANSORY KIT', 'Lamborghini', 'lamborghini', 'Urus MANSORY KIT', 2019, 730000, 54500, 'Petrol', 'Automatic', 'SUV', 'Yellow with Black Carbon', 'Black / Yellow', 'Lamborghini Urus MANSORY KIT (2019). GCC spec, finished in Yellow with Black Carbon over Black / Yellow. 54,500 km. Presented by Luxury Car Gallery, Dubai.', false, false, 'lamborghini-urus-mansory-kit-2019', 8),
('mercedes-benz-g63-2022', 'Mercedes-Benz G63', 'Mercedes-Benz', 'mercedes-benz', 'G63', 2022, 480000, 91000, 'Petrol', 'Automatic', 'SUV', 'Grey', 'black', 'Mercedes-Benz G63 (2022). European spec, finished in grey over black. 91,000 km. Presented by Luxury Car Gallery, Dubai.', false, false, 'mercedes-benz-g63-2022', 9),
('porsche-992-911-gt3-rs-weissach-2025', 'Porsche 992 911 GT3 RS Weissach', 'Porsche', 'porsche', '992 911 GT3 RS Weissach', 2025, 1325000, 5900, 'Petrol', 'Automatic', 'Coupe', 'Chalk Grey', 'Red Leather', 'Porsche 992 911 GT3 RS Weissach (2025). European spec, finished in Chalk Grey over Red Leather. 5,900 km. Presented by Luxury Car Gallery, Dubai.', false, false, 'porsche-992-911-gt3-rs-weissach-2025', 10),
('porsche-cayenne-turbo-gt-2025', 'Porsche Cayenne Turbo GT', 'Porsche', 'porsche', 'Cayenne Turbo GT', 2025, 775000, 28000, 'Petrol', 'Automatic', 'SUV', 'Nardo Grey', 'Black', 'Porsche Cayenne Turbo GT (2025). GCC spec, finished in Nardo Grey over Black. 28,000 km. Presented by Luxury Car Gallery, Dubai.', false, false, 'porsche-cayenne-turbo-gt-2025', 11),
('range-rover-autobiography-long-wheel-base-2024', 'Range Rover autobiography long wheel base', 'Range Rover', 'range-rover', 'autobiography long wheel base', 2024, 615000, 22000, 'Petrol', 'Automatic', 'SUV', 'White', 'Maroon', 'Range Rover autobiography long wheel base (2024). Korean spec, finished in white over Maroon. 22,000 km. Presented by Luxury Car Gallery, Dubai.', false, false, 'range-rover-autobiography-long-wheel-base-2024', 12),
('rolls-royce-phantom-2019', 'Rolls-Royce Phantom', 'Rolls-Royce', 'rolls-royce', 'Phantom', 2019, 1350000, 15400, 'Petrol', 'Automatic', 'Sedan', 'Black Metallic', 'Black', 'Rolls-Royce Phantom (2019). European spec, finished in Black Metallic over Black. 15,400 km. Presented by Luxury Car Gallery, Dubai.', true, false, 'rolls-royce-phantom-2019', 13),
('rolls-royce-cullinan-black-badge-2021', 'Rolls-Royce CULLINAN Black Badge', 'Rolls-Royce', 'rolls-royce', 'CULLINAN Black Badge', 2021, 1350000, 19000, 'Petrol', 'Automatic', 'SUV', 'Black', 'Blue', 'Rolls-Royce CULLINAN Black Badge (2021). GCC spec, finished in black over Blue. 19,000 km. Presented by Luxury Car Gallery, Dubai.', true, false, 'rolls-royce-cullinan-black-badge-2021', 14),
('tesla-cybertruck-2024', 'Tesla Cybertruck', 'Tesla', 'tesla', 'Cybertruck', 2024, 375000, 21099, 'Electric', 'Automatic', 'SUV', 'Silver', 'black', 'Tesla Cybertruck (2024). American spec, finished in silver over black. 21,099 km. Presented by Luxury Car Gallery, Dubai.', false, false, 'tesla-cybertruck-2024', 15),
('porsche-911-turbo-s-techart-2020', 'Porsche 911 Turbo S Techart', 'Porsche', 'porsche', '911 Turbo S Techart', 2020, 1650000, 26000, 'Petrol', 'Automatic', 'Coupe', 'Black', 'Black / Yellow Accents', 'Porsche 911 Turbo S Techart (2020). European spec, finished in Black over Black / Yellow Accents. 26,000 km. Presented by Luxury Car Gallery, Dubai.', true, false, 'porsche-911-turbo-s-techart-2020', 16),
('aston-martin-db12-coupe-2024', 'Aston Martin DB12 Coupe', 'Aston Martin', 'aston-martin', 'DB12 Coupe', 2024, 109900, 1500, 'Petrol', 'Automatic', 'Coupe', 'Green', 'Beige', 'Aston Martin DB12 Coupe (2024). GCC spec, finished in Green over Beige. 1,500 km. Presented by Luxury Car Gallery, Dubai.', false, false, 'aston-martin-db12-coupe-2024', 17),
('mercedes-benz-g63-4x4-amg-2022', 'Mercedes-Benz G63 4x4 AMG', 'Mercedes-Benz', 'mercedes-benz', 'G63 4x4 AMG', 2022, 930000, 17700, 'Petrol', 'Automatic', 'SUV', 'Grey', 'Black', 'Mercedes-Benz G63 4x4 AMG (2022). European spec, finished in Grey over Black. 17,700 km. Presented by Luxury Car Gallery, Dubai.', false, false, 'mercedes-benz-g63-4x4-amg-2022', 18),
('porsche-911-carrera-classic-coupe-1973', 'Porsche 911 Carrera Classic Coupe', 'Porsche', 'porsche', '911 Carrera Classic Coupe', 1973, 730000, 81000, 'Petrol', 'Automatic', 'Coupe', 'Brown', 'Beige', 'Porsche 911 Carrera Classic Coupe (1973). European spec, finished in Brown over Beige. 81,000 km. Presented by Luxury Car Gallery, Dubai.', false, false, 'porsche-911-carrera-classic-coupe-1973', 19),
('porsche-911-gt3rs-2016', 'Porsche 911 GT3RS', 'Porsche', 'porsche', '911 GT3RS', 2016, 580000, 46600, 'Petrol', 'Automatic', 'Coupe', 'Orange', 'Black Alcantara with Orange Stitching', 'Porsche 911 GT3RS (2016). GCC spec, finished in Orange  over Black Alcantara with Orange Stitching. 46,600 km. Presented by Luxury Car Gallery, Dubai.', false, false, 'porsche-911-gt3rs-2016', 20);