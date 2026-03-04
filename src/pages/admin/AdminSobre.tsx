import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSobreContent, SobreContent } from '@/hooks/useSobreContent';
import { Field, ListEditor, StringListEditor, SectionCard } from '@/components/admin/ContentEditorFields';
import { Save } from 'lucide-react';

const AdminSobre = () => {
  const { content, isLoading, updateContent, isUpdating } = useSobreContent();
  const [data, setData] = useState<SobreContent>(content);

  useEffect(() => { setData(content); }, [content]);

  const update = (section: keyof SobreContent, field: string, value: unknown) => {
    setData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateContent(data);
      toast.success('Conteúdo do Sobre atualizado!');
    } catch {
      toast.error('Erro ao salvar');
    }
  };

  if (isLoading) return <AdminLayout title="Sobre"><p className="text-muted-foreground">Carregando...</p></AdminLayout>;

  return (
    <AdminLayout title="Sobre">
      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        <SectionCard title="Hero">
          <Field label="Título" value={data.hero.title} onChange={v => update('hero', 'title', v)} />
          <Field label="Título (destaque)" value={data.hero.titleHighlight} onChange={v => update('hero', 'titleHighlight', v)} />
          <Field label="Subtítulo" value={data.hero.subtitle} onChange={v => update('hero', 'subtitle', v)} multiline />
        </SectionCard>

        <SectionCard title="Nossa história">
          <Field label="Label" value={data.story.label} onChange={v => update('story', 'label', v)} />
          <Field label="Título" value={data.story.title} onChange={v => update('story', 'title', v)} />
          <Field label="Título (destaque)" value={data.story.titleHighlight} onChange={v => update('story', 'titleHighlight', v)} />
          <StringListEditor
            label="Parágrafos"
            items={data.story.paragraphs}
            onChange={items => update('story', 'paragraphs', items)}
          />
          <ListEditor
            label="Estatísticas"
            items={data.story.stats}
            onChange={items => update('story', 'stats', items)}
            createItem={() => ({ value: '', label: '' })}
            renderItem={(item, _i, upd) => (
              <>
                <Field label="Valor" value={item.value} onChange={v => upd('value', v)} />
                <Field label="Label" value={item.label} onChange={v => upd('label', v)} />
              </>
            )}
          />
        </SectionCard>

        <SectionCard title="Valores">
          <Field label="Título" value={data.values.title} onChange={v => update('values', 'title', v)} />
          <Field label="Título (destaque)" value={data.values.titleHighlight} onChange={v => update('values', 'titleHighlight', v)} />
          <Field label="Subtítulo" value={data.values.subtitle} onChange={v => update('values', 'subtitle', v)} multiline />
          <ListEditor
            label="Itens de valor"
            items={data.values.items}
            onChange={items => update('values', 'items', items)}
            createItem={() => ({ title: '', description: '' })}
            renderItem={(item, _i, upd) => (
              <>
                <Field label="Título" value={item.title} onChange={v => upd('title', v)} />
                <Field label="Descrição" value={item.description} onChange={v => upd('description', v)} multiline />
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
          {isUpdating ? 'Salvando...' : 'Salvar conteúdo do Sobre'}
        </Button>
      </form>
    </AdminLayout>
  );
};

export default AdminSobre;
