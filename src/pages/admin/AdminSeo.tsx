import AdminLayout from '@/components/admin/AdminLayout';
import SeoAiAssistant from '@/components/admin/SeoAiAssistant';

const AdminSeo = () => (
  <AdminLayout title="SEO com IA">
    <p className="mb-4 text-sm text-muted-foreground">
      Cole o conteúdo de qualquer página e receba títulos e descrições prontos para o Google e para assistentes de IA.
    </p>
    <SeoAiAssistant />
  </AdminLayout>
);

export default AdminSeo;
