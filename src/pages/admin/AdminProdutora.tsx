import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useProdutoraContent, ProdutoraContent } from '@/hooks/useProdutoraContent';
import { Field, ListEditor, SectionCard } from '@/components/admin/ContentEditorFields';
import { Save } from 'lucide-react';

const AdminProdutora = () => {
  const { content, isLoading, updateContent, isUpdating } = useProdutoraContent();
  const [data, setData] = useState<ProdutoraContent>(content);

  useEffect(() => { setData(content); }, [content]);

  const update = (section: keyof ProdutoraContent, field: string, value: unknown) => {
    setData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateContent(data);
      toast.success('Conteúdo da Produtora atualizado!');
    } catch {
      toast.error('Erro ao salvar');
    }
  };

  if (isLoading) return <AdminLayout title="Produtora"><p className="text-muted-foreground">Carregando...</p></AdminLayout>;

  return (
    <AdminLayout title="Produtora">
      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        <SectionCard title="Hero">
          <Field label="Badge" value={data.hero.badge} onChange={v => update('hero', 'badge', v)} />
          <Field label="Título" value={data.hero.title} onChange={v => update('hero', 'title', v)} />
          <Field label="Título (destaque)" value={data.hero.titleHighlight} onChange={v => update('hero', 'titleHighlight', v)} />
          <Field label="Subtítulo" value={data.hero.subtitle} onChange={v => update('hero', 'subtitle', v)} multiline />
          <Field label="Texto do botão" value={data.hero.ctaText} onChange={v => update('hero', 'ctaText', v)} />
          <Field label="Label do showreel" value={data.hero.showreelLabel} onChange={v => update('hero', 'showreelLabel', v)} />
        </SectionCard>

        <SectionCard title="Serviços">
          <Field label="Título" value={data.services.sectionTitle} onChange={v => update('services', 'sectionTitle', v)} />
          <Field label="Título (destaque)" value={data.services.sectionTitleHighlight} onChange={v => update('services', 'sectionTitleHighlight', v)} />
          <Field label="Subtítulo" value={data.services.sectionSubtitle} onChange={v => update('services', 'sectionSubtitle', v)} multiline />
          <ListEditor
            label="Itens de serviço"
            items={data.services.items}
            onChange={items => update('services', 'items', items)}
            createItem={() => ({ title: '', description: '' })}
            renderItem={(item, _i, upd) => (
              <>
                <Field label="Título" value={item.title} onChange={v => upd('title', v)} />
                <Field label="Descrição" value={item.description} onChange={v => upd('description', v)} multiline />
              </>
            )}
          />
        </SectionCard>

        <SectionCard title="Portfólio">
          <Field label="Título" value={data.portfolio.sectionTitle} onChange={v => update('portfolio', 'sectionTitle', v)} />
          <Field label="Subtítulo" value={data.portfolio.sectionSubtitle} onChange={v => update('portfolio', 'sectionSubtitle', v)} multiline />
          <ListEditor
            label="Itens do portfólio"
            items={data.portfolio.items}
            onChange={items => update('portfolio', 'items', items)}
            createItem={() => ({ title: '', client: '' })}
            renderItem={(item, _i, upd) => (
              <>
                <Field label="Título" value={item.title} onChange={v => upd('title', v)} />
                <Field label="Cliente" value={item.client} onChange={v => upd('client', v)} />
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
          {isUpdating ? 'Salvando...' : 'Salvar conteúdo da Produtora'}
        </Button>
      </form>
    </AdminLayout>
  );
};

export default AdminProdutora;
