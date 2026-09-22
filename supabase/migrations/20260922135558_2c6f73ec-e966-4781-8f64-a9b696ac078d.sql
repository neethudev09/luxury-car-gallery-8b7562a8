CREATE POLICY "car photos readable" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'car-photos');
CREATE POLICY "admins upload car photos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'car-photos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update car photos" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'car-photos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete car photos" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'car-photos' AND public.has_role(auth.uid(), 'admin'));