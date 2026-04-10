import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useProdutoraContent, ProdutoraContent } from '@/hooks/useProdutoraContent';
import { Field, ListEditor, SectionCard, StringListEditor } from '@/components/admin/ContentEditorFields';
import ImageUpload from '@/components/admin/ImageUpload';
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

        {/* HERO */}
        <SectionCard title="Hero">
          <Field label="Título" value={data.hero.title} onChange={v => update('hero', 'title', v)} />
          <Field label="Título (destaque)" value={data.hero.titleHighlight} onChange={v => update('hero', 'titleHighlight', v)} />
          <Field label="Subtítulo" value={data.hero.subtitle} onChange={v => update('hero', 'subtitle', v)} multiline />
          <Field label="Texto do botão" value={data.hero.ctaText} onChange={v => update('hero', 'ctaText', v)} />
          <Field label="YouTube ID do vídeo de fundo (Hero)" value={data.hero.heroYoutubeId} onChange={v => update('hero', 'heroYoutubeId', v)} placeholder="ex: dQw4w9WgXcQ" />
          <Field label="YouTube ID do Showreel" value={data.hero.showreelYoutubeId} onChange={v => update('hero', 'showreelYoutubeId', v)} placeholder="ex: dQw4w9WgXcQ" />
        </SectionCard>

        {/* SERVIÇOS */}
        <SectionCard title="Serviços">
          <Field label="Título" value={data.services.sectionTitle} onChange={v => update('services', 'sectionTitle', v)} />
          <Field label="Título (destaque)" value={data.services.sectionTitleHighlight} onChange={v => update('services', 'sectionTitleHighlight', v)} />
          <Field label="Subtítulo" value={data.services.sectionSubtitle} onChange={v => update('services', 'sectionSubtitle', v)} multiline />
          <ListEditor
            label="Itens de serviço"
            items={data.services.items}
            onChange={items => update('services', 'items', items)}
            createItem={() => ({ num: String(data.services.items.length + 1).padStart(2, '0'), title: '', description: '' })}
            renderItem={(item, _i, upd) => (
              <>
                <Field label="Número" value={item.num} onChange={v => upd('num', v)} />
                <Field label="Título" value={item.title} onChange={v => upd('title', v)} />
                <Field label="Descrição" value={item.description} onChange={v => upd('description', v)} multiline />
              </>
            )}
          />
        </SectionCard>

        {/* PORTFÓLIO */}
        <SectionCard title="Portfólio">
          <Field label="Título" value={data.portfolio.sectionTitle} onChange={v => update('portfolio', 'sectionTitle', v)} />
          <Field label="Subtítulo" value={data.portfolio.sectionSubtitle} onChange={v => update('portfolio', 'sectionSubtitle', v)} multiline />
          <ListEditor
            label="Itens do portfólio"
            items={data.portfolio.items}
            onChange={items => update('portfolio', 'items', items)}
            createItem={() => ({ title: '', client: '', youtubeId: '' })}
            renderItem={(item, _i, upd) => (
              <>
                <Field label="Título" value={item.title} onChange={v => upd('title', v)} />
                <Field label="Cliente" value={item.client} onChange={v => upd('client', v)} />
                <Field label="YouTube ID" value={item.youtubeId} onChange={v => upd('youtubeId', v)} placeholder="ex: dQw4w9WgXcQ" />
              </>
            )}
          />
        </SectionCard>

        {/* SEGMENTOS */}
        <SectionCard title="Segmentos">
          <Field label="Título" value={data.segments.sectionTitle} onChange={v => update('segments', 'sectionTitle', v)} />
          <Field label="Título (destaque)" value={data.segments.sectionTitleHighlight} onChange={v => update('segments', 'sectionTitleHighlight', v)} />
          <ListEditor
            label="Segmentos"
            items={data.segments.items}
            onChange={items => update('segments', 'items', items)}
            createItem={() => ({ title: '', description: '' })}
            renderItem={(item, _i, upd) => (
              <>
                <Field label="Título" value={item.title} onChange={v => upd('title', v)} />
                <Field label="Descrição" value={item.description} onChange={v => upd('description', v)} />
              </>
            )}
          />
        </SectionCard>

        {/* FOTOS */}
        <SectionCard title="Fotografia">
          <Field label="Título da seção" value={data.fotos.sectionTitle} onChange={v => update('fotos', 'sectionTitle', v)} />
          <Field label="Subtítulo" value={data.fotos.sectionSubtitle} onChange={v => update('fotos', 'sectionSubtitle', v)} multiline />
          <ListEditor
            label="Fotos do portfólio"
            items={data.fotos.items}
            onChange={items => update('fotos', 'items', items)}
            createItem={() => ({ title: '', image: '' })}
            renderItem={(item, _i, upd) => (
              <>
                <Field label="Título" value={item.title} onChange={v => upd('title', v)} />
                <ImageUpload
                  label="Imagem"
                  value={item.image}
                  onChange={url => upd('image', url)}
                  folder="produtora/fotos"
                />
              </>
            )}
          />
        </SectionCard>
        <SectionCard title="Bastidores (Imagens)">
          <Field label="Título da seção" value={data.bastidores.sectionTitle} onChange={v => update('bastidores', 'sectionTitle', v)} />
          {data.bastidores.images.map((img, i) => (
            <ImageUpload
              key={i}
              label={`Imagem ${i + 1}`}
              value={img}
              onChange={url => {
                const updated = [...data.bastidores.images];
                updated[i] = url;
                update('bastidores', 'images', updated);
              }}
              folder="produtora"
            />
          ))}
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => update('bastidores', 'images', [...data.bastidores.images, ''])}>
              Adicionar imagem
            </Button>
            {data.bastidores.images.length > 1 && (
              <Button type="button" variant="outline" size="sm" onClick={() => update('bastidores', 'images', data.bastidores.images.slice(0, -1))}>
                Remover última
              </Button>
            )}
          </div>
        </SectionCard>

        {/* FAQ */}
        <SectionCard title="FAQ">
          <Field label="Título" value={data.faq.sectionTitle} onChange={v => update('faq', 'sectionTitle', v)} />
          <Field label="Título (destaque)" value={data.faq.sectionTitleHighlight} onChange={v => update('faq', 'sectionTitleHighlight', v)} />
          <ListEditor
            label="Perguntas"
            items={data.faq.items}
            onChange={items => update('faq', 'items', items)}
            createItem={() => ({ question: '', answer: '' })}
            renderItem={(item, _i, upd) => (
              <>
                <Field label="Pergunta" value={item.question} onChange={v => upd('question', v)} />
                <Field label="Resposta" value={item.answer} onChange={v => upd('answer', v)} multiline />
              </>
            )}
          />
        </SectionCard>

        {/* CTA */}
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
