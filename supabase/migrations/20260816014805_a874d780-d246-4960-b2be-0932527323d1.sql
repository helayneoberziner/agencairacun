-- Add resend_email_id to contact_messages for correlation
ALTER TABLE public.contact_messages
  ADD COLUMN IF NOT EXISTS resend_email_id TEXT;

CREATE INDEX IF NOT EXISTS idx_contact_messages_resend_email_id ON public.contact_messages(resend_email_id);

-- Create table for Resend webhook events
CREATE TABLE public.resend_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_id TEXT,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS and grant access
GRANT SELECT, INSERT ON public.resend_events TO service_role;
GRANT SELECT ON public.resend_events TO authenticated;

ALTER TABLE public.resend_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert resend events"
ON public.resend_events
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Admins can view resend events"
ON public.resend_events
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
