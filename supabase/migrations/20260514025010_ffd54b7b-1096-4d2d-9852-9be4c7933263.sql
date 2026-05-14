UPDATE site_content
SET content = jsonb_set(
  content,
  '{segments,items}',
  (content->'segments'->'items') || '[{"title":"Política e Eleição","description":"Comunicação estratégica para campanhas."}]'::jsonb
)
WHERE section_key = 'produtora_content'
  AND NOT EXISTS (
    SELECT 1 FROM jsonb_array_elements(content->'segments'->'items') AS item
    WHERE item->>'title' = 'Política e Eleição'
  );