ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS client_email text;

CREATE TABLE IF NOT EXISTS public.proposal_sends (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id uuid REFERENCES public.proposals(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  link text NOT NULL,
  subject text,
  message text,
  status text NOT NULL DEFAULT 'sent',
  resend_email_id text,
  error text,
  sent_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.proposal_sends TO authenticated;
GRANT ALL ON public.proposal_sends TO service_role;

ALTER TABLE public.proposal_sends ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage proposal sends" ON public.proposal_sends;
CREATE POLICY "Admins manage proposal sends" ON public.proposal_sends
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));