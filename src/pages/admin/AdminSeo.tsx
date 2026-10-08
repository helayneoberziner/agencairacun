import AdminLayout from '@/components/admin/AdminLayout';
import SeoAiAssistant from '@/components/admin/SeoAiAssistant';
import SocialSharingPreview from '@/components/admin/SocialSharingPreview';
import { useState } from 'react';

const AdminSeo = () => {
  const [suggestion, setSuggestion] = useState<{ title: string; description: string }>();
  return (
  <AdminLayout title="SEO com IA">
    <p className="mb-4 text-sm text-muted-foreground">
      Cole o conteúdo de qualquer página e receba títulos e descrições prontos para o Google e para assistentes de IA.
    </p>
    <div className="space-y-8">
      <SeoAiAssistant onApply={setSuggestion} />
      <SocialSharingPreview suggestion={suggestion} />
    </div>
  </AdminLayout>
  );
};

export default AdminSeo;
