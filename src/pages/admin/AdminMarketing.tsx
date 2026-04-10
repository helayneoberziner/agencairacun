import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useMarketingContent, MarketingContent } from '@/hooks/useMarketingContent';
import { Field, ListEditor, StringListEditor, SectionCard } from '@/components/admin/ContentEditorFields';
import ImageUpload from '@/components/admin/ImageUpload';
import { Save } from 'lucide-react';

const AdminMarketing = () => {
  const { content, isLoading, updateContent, isUpdating } = useMarketingContent();
  const [data, setData] = useState<MarketingContent>(content);

  useEffect(() => { setData(content); }, [content]);

  const update = (section: keyof MarketingContent, field: string, value: unknown) => {
    setData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateContent(data);
      toast.success('Conteúdo de Marketing atualizado!');
    } catch {
      toast.error('Erro ao salvar');
    }
  };

  if (isLoading) return <AdminLayout title="Marketing"><p className="text-muted-foreground">Carregando...</p></AdminLayout>;

  return (
    <AdminLayout title="Marketing">
      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        <SectionCard title="Hero">
          <Field label="Badge" value={data.hero.badge} onChange={v => update('hero', 'badge', v)} />
          <Field label="Título" value={data.hero.title} onChange={v => update('hero', 'title', v)} />
          <Field label="Título (destaque)" value={data.hero.titleHighlight} onChange={v => update('hero', 'titleHighlight', v)} />
          <Field label="Subtítulo" value={data.hero.subtitle} onChange={v => update('hero', 'subtitle', v)} multiline />
          <Field label="Texto do botão principal" value={data.hero.ctaText} onChange={v => update('hero', 'ctaText', v)} />
          <Field label="Texto do botão secundário" value={data.hero.secondaryCtaText} onChange={v => update('hero', 'secondaryCtaText', v)} />
        </SectionCard>

        <SectionCard title="Serviços">
          <Field label="Título" value={data.services.sectionTitle} onChange={v => update('services', 'sectionTitle', v)} />
          <Field label="Título (destaque)" value={data.services.sectionTitleHighlight} onChange={v => update('services', 'sectionTitleHighlight', v)} />
          <Field label="Subtítulo" value={data.services.sectionSubtitle} onChange={v => update('services', 'sectionSubtitle', v)} multiline />
          <ListEditor
            label="Itens de serviço"
            items={data.services.items}
            onChange={items => update('services', 'items', items)}
            createItem={() => ({ title: '', description: '', features: [] })}
            renderItem={(item, _i, upd) => (
              <>
                <Field label="Título" value={item.title} onChange={v => upd('title', v)} />
                <Field label="Descrição" value={item.description} onChange={v => upd('description', v)} multiline />
                <StringListEditor
                  label="Features"
                  items={item.features}
                  onChange={features => {
                    const updated = [...data.services.items];
                    updated[_i] = { ...updated[_i], features };
                    update('services', 'items', updated);
                  }}
                />
              </>
            )}
          />
        </SectionCard>

        <SectionCard title="Resultados / Transparência">
          <Field label="Label" value={data.results.label} onChange={v => update('results', 'label', v)} />
          <Field label="Título" value={data.results.title} onChange={v => update('results', 'title', v)} />
          <Field label="Título (destaque)" value={data.results.titleHighlight} onChange={v => update('results', 'titleHighlight', v)} />
          <Field label="Subtítulo" value={data.results.subtitle} onChange={v => update('results', 'subtitle', v)} multiline />
          <StringListEditor
            label="Itens de resultado"
            items={data.results.items}
            onChange={items => update('results', 'items', items)}
          />
          <Field label="Título do dashboard" value={data.results.dashboardTitle} onChange={v => update('results', 'dashboardTitle', v)} />
          <Field label="Subtítulo do dashboard" value={data.results.dashboardSubtitle} onChange={v => update('results', 'dashboardSubtitle', v)} />
          <ImageUpload label="Imagem do dashboard" value={data.results.dashboardImage || ''} onChange={v => update('results', 'dashboardImage', v)} folder="marketing" />
        </SectionCard>

        <SectionCard title="Formatos de trabalho">
          <Field label="Título" value={data.modalities.sectionTitle} onChange={v => update('modalities', 'sectionTitle', v)} />
          <Field label="Título (destaque)" value={data.modalities.sectionTitleHighlight} onChange={v => update('modalities', 'sectionTitleHighlight', v)} />
          <Field label="Subtítulo" value={data.modalities.sectionSubtitle} onChange={v => update('modalities', 'sectionSubtitle', v)} multiline />
          <ListEditor
            label="Modalidades"
            items={data.modalities.items}
            onChange={items => update('modalities', 'items', items)}
            createItem={() => ({ title: '', description: '' })}
            renderItem={(item, _i, upd) => (
              <>
                <Field label="Título" value={item.title} onChange={v => upd('title', v)} />
                <Field label="Descrição" value={item.description} onChange={v => upd('description', v)} multiline />
              </>
            )}
          />
        </SectionCard>

        <SectionCard title="FAQ">
          <Field label="Título" value={data.faqs.sectionTitle} onChange={v => update('faqs', 'sectionTitle', v)} />
          <Field label="Título (destaque)" value={data.faqs.sectionTitleHighlight} onChange={v => update('faqs', 'sectionTitleHighlight', v)} />
          <ListEditor
            label="Perguntas"
            items={data.faqs.items}
            onChange={items => update('faqs', 'items', items)}
            createItem={() => ({ question: '', answer: '' })}
            renderItem={(item, _i, upd) => (
              <>
                <Field label="Pergunta" value={item.question} onChange={v => upd('question', v)} />
                <Field label="Resposta" value={item.answer} onChange={v => upd('answer', v)} multiline />
              </>
            )}
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
          {isUpdating ? 'Salvando...' : 'Salvar conteúdo de Marketing'}
        </Button>
      </form>
    </AdminLayout>
  );
};

export default AdminMarketing;
