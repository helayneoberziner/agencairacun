import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  email: z.string().trim().email('E-mail inválido').max(255, 'E-mail muito longo'),
  phone: z.string().trim().max(30, 'Telefone muito longo').optional().or(z.literal('')),
  company: z.string().trim().max(100, 'Empresa muito longa').optional().or(z.literal('')),
  service: z.string().trim().max(100, 'Serviço muito longo').optional().or(z.literal('')),
  message: z.string().trim().min(1, 'Mensagem é obrigatória').max(2000, 'Mensagem muito longa'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface UseContactFormOptions {
  onSuccess?: () => void;
}

export function useContactForm(options?: UseContactFormOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  const submit = async (data: ContactFormData) => {
    setErrors({});

    const result = contactSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone || null,
        company: result.data.company || null,
        service: result.data.service || null,
        message: result.data.message,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success('Mensagem enviada com sucesso!');
      options?.onSuccess?.();

      setTimeout(() => setIsSubmitted(false), 5000);
      return true;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting, isSubmitted, errors };
}
