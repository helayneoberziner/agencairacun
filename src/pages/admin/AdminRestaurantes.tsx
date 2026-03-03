import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRestaurantesContent, RestaurantesContent } from '@/hooks/useRestaurantesContent';
import { Field, ListEditor, StringListEditor, SectionCard } from '@/components/admin/ContentEditorFields';
import { Save } from 'lucide-react';

const AdminRestaurantes = () => {
  const { content, isLoading, updateContent, isUpdating } = useRestaurantesContent();
  const [data, setData] = useState<RestaurantesContent>(content);

  useEffect(() => { setData(content); }, [content]);

  const update = (section: keyof RestaurantesContent, field: string, value: unknown) => {
    setData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateContent(data);
      toast.success('Conteúdo de Restaurantes atualizado!');
    } catch {
      toast.error('Erro ao salvar');
    }
  };

  if (isLoading) return <AdminLayout title="Restaurantes"><p className="text-muted-foreground">Carregando...</p></AdminLayout>;

  return (
    <AdminLayout title="Restaurantes">
      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        <SectionCard title="Hero">
          <Field label="Badge" value={data.hero.badge} onChange={v => update('hero', 'badge', v)} />
          <Field label="Título" value={data.hero.title} onChange={v => update('hero', 'title', v)} />
          <Field label="Título (destaque)" value={data.hero.titleHighlight} onChange={v => update('hero', 'titleHighlight', v)} />
          <Field label="Subtítulo" value={data.hero.subtitle} onChange={v => update('hero', 'subtitle', v)} multiline />
          <Field label="Texto do botão" value={data.hero.ctaText} onChange={v => update('hero', 'ctaText', v)} />
        </SectionCard>

        <SectionCard title="Entregas">
          <Field label="Título" value={data.deliverables.sectionTitle} onChange={v => update('deliverables', 'sectionTitle', v)} />
          <Field label="Título (destaque)" value={data.deliverables.sectionTitleHighlight} onChange={v => update('deliverables', 'sectionTitleHighlight', v)} />
          <Field label="Subtítulo" value={data.deliverables.sectionSubtitle} onChange={v => update('deliverables', 'sectionSubtitle', v)} multiline />
          <ListEditor
            label="Itens de entrega"
            items={data.deliverables.items}
            onChange={items => update('deliverables', 'items', items)}
            createItem={() => ({ title: '', description: '' })}
            renderItem={(item, _i, upd) => (
              <>
                <Field label="Título" value={item.title} onChange={v => upd('title', v)} />
                <Field label="Descrição" value={item.description} onChange={v => upd('description', v)} multiline />
              </>
            )}
          />
        </SectionCard>

        <SectionCard title="Fluxo do mês">
          <Field label="Título" value={data.monthFlow.sectionTitle} onChange={v => update('monthFlow', 'sectionTitle', v)} />
          <Field label="Título (destaque)" value={data.monthFlow.sectionTitleHighlight} onChange={v => update('monthFlow', 'sectionTitleHighlight', v)} />
          <Field label="Subtítulo" value={data.monthFlow.sectionSubtitle} onChange={v => update('monthFlow', 'sectionSubtitle', v)} multiline />
          <ListEditor
            label="Etapas"
            items={data.monthFlow.items}
            onChange={items => update('monthFlow', 'items', items)}
            createItem={() => ({ week: '', title: '', description: '' })}
            renderItem={(item, _i, upd) => (
              <>
                <Field label="Semana" value={item.week} onChange={v => upd('week', v)} />
                <Field label="Título" value={item.title} onChange={v => upd('title', v)} />
                <Field label="Descrição" value={item.description} onChange={v => upd('description', v)} multiline />
              </>
            )}
          />
        </SectionCard>

        <SectionCard title="Pilares de conteúdo">
          <Field label="Título" value={data.contentPillars.title} onChange={v => update('contentPillars', 'title', v)} />
          <Field label="Título (destaque)" value={data.contentPillars.titleHighlight} onChange={v => update('contentPillars', 'titleHighlight', v)} />
          <Field label="Subtítulo" value={data.contentPillars.subtitle} onChange={v => update('contentPillars', 'subtitle', v)} multiline />
          <ListEditor
            label="Pilares"
            items={data.contentPillars.items}
            onChange={items => update('contentPillars', 'items', items)}
            createItem={() => ({ title: '', description: '' })}
            renderItem={(item, _i, upd) => (
              <>
                <Field label="Título" value={item.title} onChange={v => upd('title', v)} />
                <Field label="Descrição" value={item.description} onChange={v => upd('description', v)} multiline />
              </>
            )}
          />
        </SectionCard>

        <SectionCard title="Benefícios de tráfego pago">
          <Field label="Título" value={data.trafficBenefits.title} onChange={v => update('trafficBenefits', 'title', v)} />
          <Field label="Título (destaque)" value={data.trafficBenefits.titleHighlight} onChange={v => update('trafficBenefits', 'titleHighlight', v)} />
          <Field label="Subtítulo" value={data.trafficBenefits.subtitle} onChange={v => update('trafficBenefits', 'subtitle', v)} multiline />
          <StringListEditor
            label="Lista de benefícios"
            items={data.trafficBenefits.items}
            onChange={items => update('trafficBenefits', 'items', items)}
          />
        </SectionCard>

        <SectionCard title="CTA Final">
          <Field label="Título" value={data.cta.title} onChange={v => update('cta', 'title', v)} />
          <Field label="Título (destaque)" value={data.cta.titleHighlight} onChange={v => update('cta', 'titleHighlight', v)} />
          <Field label="Subtítulo" value={data.cta.subtitle} onChange={v => update('cta', 'subtitle', v)} multiline />
          <Field label="Texto do botão" value={data.cta.ctaText} onChange={v => update('cta', 'ctaText', v)} />
        </SectionCard>

        <Button type="submit" disabled={isUpdating} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {isUpdating ? 'Salvando...' : 'Salvar conteúdo de Restaurantes'}
        </Button>
      </form>
    </AdminLayout>
  );
};

export default AdminRestaurantes;
