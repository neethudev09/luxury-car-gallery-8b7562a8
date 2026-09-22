DROP POLICY "published cars are public" ON public.cars;
CREATE POLICY "published cars are public" ON public.cars FOR SELECT TO anon USING (published);
CREATE POLICY "signed in can read cars" ON public.cars FOR SELECT TO authenticated
  USING (published OR public.has_role(auth.uid(), 'admin'));

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.ensure_profile() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.grant_admin_by_email(text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.ensure_profile() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.grant_admin_by_email(text) TO authenticated, service_role;