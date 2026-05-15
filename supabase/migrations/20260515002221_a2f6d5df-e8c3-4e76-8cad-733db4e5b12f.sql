
ALTER TABLE public.contact_messages
  ADD COLUMN IF NOT EXISTS segment TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'novo';

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_segment ON public.contact_messages(segment);
