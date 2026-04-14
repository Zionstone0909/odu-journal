
INSERT INTO storage.buckets (id, name, public)
VALUES ('manuscripts', 'manuscripts', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload manuscripts"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'manuscripts');

CREATE POLICY "Anyone can view manuscripts"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'manuscripts');
