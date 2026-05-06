CREATE TABLE public.lgpd_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  tipo_solicitacao TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lgpd_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit LGPD requests"
ON public.lgpd_requests FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins can view LGPD requests"
ON public.lgpd_requests FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update LGPD requests"
ON public.lgpd_requests FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete LGPD requests"
ON public.lgpd_requests FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_lgpd_requests_updated_at
BEFORE UPDATE ON public.lgpd_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();