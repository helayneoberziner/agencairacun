-- Copy projects into cases (skip if slug already exists)
INSERT INTO cases (slug, client_name, title, subtitle, hero_kind, hero_media_url, hero_image_url,
  challenge, solution, results_text, categories, is_active, is_featured, show_on_home,
  display_order, category, subcategory, testimonial_text, testimonial_author, seo_description)
SELECT
  COALESCE(NULLIF(p.slug,''), lower(regexp_replace(p.title, '[^a-zA-Z0-9]+', '-', 'g'))) as slug,
  COALESCE(p.client_name, p.title) as client_name,
  p.title,
  p.description as subtitle,
  CASE WHEN p.video_url IS NOT NULL AND p.video_url <> '' THEN 'video' ELSE 'image' END,
  p.video_url,
  p.image_url,
  p.context,
  p.actions,
  p.results,
  CASE WHEN p.category IS NOT NULL THEN ARRAY[p.category]::text[] ELSE '{}'::text[] END,
  true, COALESCE(p.is_featured,false), true,
  COALESCE(p.display_order,0),
  p.category, p.subcategory,
  p.testimonial_text, p.testimonial_author,
  p.seo_description
FROM projects p
WHERE NOT EXISTS (
  SELECT 1 FROM cases c
  WHERE c.slug = COALESCE(NULLIF(p.slug,''), lower(regexp_replace(p.title, '[^a-zA-Z0-9]+', '-', 'g')))
);
