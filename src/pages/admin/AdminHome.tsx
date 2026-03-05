import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useHomeContent, HomeContent } from '@/hooks/useHomeContent';
import { Field, ListEditor, StringListEditor, SectionCard } from '@/components/admin/ContentEditorFields';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminHome = () => {
  const { content, isLoading, updateContent, isUpdating } = useHomeContent();
  const [form, setForm] = useState<HomeContent>(content);
  const { toast } = useToast();

  useEffect(() => {
    if (content) setForm(content);
  }, [content]);

  const handleSave = async () => {
    try {
      await updateContent(form);
      toast({ title: 'Conteúdo salvo com sucesso!' });
    } catch {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Página Inicial">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Página Inicial">
      <div className="max-w-4xl space-y-8">
        {/* Hero */}
        <SectionCard title="Hero">
          <Field label="Badge" value={form.hero.badge} onChange={v => setForm({ ...form, hero: { ...form.hero, badge: v } })} />
          <Field label="Título (parte 1)" value={form.hero.headline1} onChange={v => setForm({ ...form, hero: { ...form.hero, headline1: v } })} />
          <Field label="Título (destaque)" value={form.hero.headlineHighlight} onChange={v => setForm({ ...form, hero: { ...form.hero, headlineHighlight: v } })} />
          <Field label="Título (parte 2)" value={form.hero.headline2} onChange={v => setForm({ ...form, hero: { ...form.hero, headline2: v } })} />
          <Field label="Subtítulo" value={form.hero.subtitle} onChange={v => setForm({ ...form, hero: { ...form.hero, subtitle: v } })} multiline />
          <Field label="CTA Primário" value={form.hero.ctaPrimary} onChange={v => setForm({ ...form, hero: { ...form.hero, ctaPrimary: v } })} />
          <Field label="CTA Secundário" value={form.hero.ctaSecondary} onChange={v => setForm({ ...form, hero: { ...form.hero, ctaSecondary: v } })} />
          <ListEditor
            label="Pilares"
            items={form.hero.pillars}
            onChange={pillars => setForm({ ...form, hero: { ...form.hero, pillars } })}
            createItem={() => ({ title: '', description: '' })}
            renderItem={(item, _, update) => (
              <>
                <Field label="Título" value={item.title} onChange={v => update('title', v)} />
                <Field label="Descrição" value={item.description} onChange={v => update('description', v)} />
              </>
            )}
          />
        </SectionCard>

        {/* Services */}
        <SectionCard title="Serviços">
          <Field label="Badge" value={form.services.badge} onChange={v => setForm({ ...form, services: { ...form.services, badge: v } })} />
          <Field label="Título" value={form.services.title} onChange={v => setForm({ ...form, services: { ...form.services, title: v } })} />
          <Field label="Título (destaque)" value={form.services.titleHighlight} onChange={v => setForm({ ...form, services: { ...form.services, titleHighlight: v } })} />
          <Field label="Subtítulo" value={form.services.subtitle} onChange={v => setForm({ ...form, services: { ...form.services, subtitle: v } })} multiline />
          <Field label="CTA" value={form.services.cta} onChange={v => setForm({ ...form, services: { ...form.services, cta: v } })} />
          <ListEditor
            label="Serviços"
            items={form.services.items}
            onChange={items => setForm({ ...form, services: { ...form.services, items } })}
            createItem={() => ({ title: '', description: '', features: [] })}
            renderItem={(item, idx, update) => (
              <>
                <Field label="Título" value={item.title} onChange={v => update('title', v)} />
                <Field label="Descrição" value={item.description} onChange={v => update('description', v)} multiline />
                <StringListEditor
                  label="Features"
                  items={item.features}
                  onChange={features => {
                    const updated = [...form.services.items];
                    updated[idx] = { ...updated[idx], features };
                    setForm({ ...form, services: { ...form.services, items: updated } });
                  }}
                />
              </>
            )}
          />
        </SectionCard>

        {/* Social Proof */}
        <SectionCard title="Prova Social">
          <Field label="Badge" value={form.socialProof.badge} onChange={v => setForm({ ...form, socialProof: { ...form.socialProof, badge: v } })} />
          <Field label="Título" value={form.socialProof.title} onChange={v => setForm({ ...form, socialProof: { ...form.socialProof, title: v } })} />
          <Field label="Título (destaque)" value={form.socialProof.titleHighlight} onChange={v => setForm({ ...form, socialProof: { ...form.socialProof, titleHighlight: v } })} />
          <Field label="CTA" value={form.socialProof.cta} onChange={v => setForm({ ...form, socialProof: { ...form.socialProof, cta: v } })} />
          <StringListEditor
            label="Itens de prova"
            items={form.socialProof.proofs}
            onChange={proofs => setForm({ ...form, socialProof: { ...form.socialProof, proofs } })}
          />
        </SectionCard>

        {/* Produtora Teaser */}
        <SectionCard title="Teaser Produtora">
          <Field label="Badge" value={form.produtoraTeaser.badge} onChange={v => setForm({ ...form, produtoraTeaser: { ...form.produtoraTeaser, badge: v } })} />
          <Field label="Título" value={form.produtoraTeaser.title} onChange={v => setForm({ ...form, produtoraTeaser: { ...form.produtoraTeaser, title: v } })} />
          <Field label="Título (destaque)" value={form.produtoraTeaser.titleHighlight} onChange={v => setForm({ ...form, produtoraTeaser: { ...form.produtoraTeaser, titleHighlight: v } })} />
          <Field label="Descrição" value={form.produtoraTeaser.description} onChange={v => setForm({ ...form, produtoraTeaser: { ...form.produtoraTeaser, description: v } })} multiline />
          <Field label="Label do Showreel" value={form.produtoraTeaser.showreelLabel} onChange={v => setForm({ ...form, produtoraTeaser: { ...form.produtoraTeaser, showreelLabel: v } })} />
          <Field label="CTA" value={form.produtoraTeaser.cta} onChange={v => setForm({ ...form, produtoraTeaser: { ...form.produtoraTeaser, cta: v } })} />
          <Field label="Link do CTA" value={form.produtoraTeaser.ctaLink} onChange={v => setForm({ ...form, produtoraTeaser: { ...form.produtoraTeaser, ctaLink: v } })} />
          <StringListEditor
            label="Tags"
            items={form.produtoraTeaser.tags}
            onChange={tags => setForm({ ...form, produtoraTeaser: { ...form.produtoraTeaser, tags } })}
          />
        </SectionCard>

        {/* Restaurantes Teaser */}
        <SectionCard title="Teaser Restaurantes">
          <Field label="Badge" value={form.restaurantesTeaser.badge} onChange={v => setForm({ ...form, restaurantesTeaser: { ...form.restaurantesTeaser, badge: v } })} />
          <Field label="Título" value={form.restaurantesTeaser.title} onChange={v => setForm({ ...form, restaurantesTeaser: { ...form.restaurantesTeaser, title: v } })} />
          <Field label="Título (destaque)" value={form.restaurantesTeaser.titleHighlight} onChange={v => setForm({ ...form, restaurantesTeaser: { ...form.restaurantesTeaser, titleHighlight: v } })} />
          <Field label="Descrição" value={form.restaurantesTeaser.description} onChange={v => setForm({ ...form, restaurantesTeaser: { ...form.restaurantesTeaser, description: v } })} multiline />
          <Field label="CTA" value={form.restaurantesTeaser.cta} onChange={v => setForm({ ...form, restaurantesTeaser: { ...form.restaurantesTeaser, cta: v } })} />
          <Field label="Stat flutuante" value={form.restaurantesTeaser.floatingStat} onChange={v => setForm({ ...form, restaurantesTeaser: { ...form.restaurantesTeaser, floatingStat: v } })} />
          <Field label="Label do stat" value={form.restaurantesTeaser.floatingLabel} onChange={v => setForm({ ...form, restaurantesTeaser: { ...form.restaurantesTeaser, floatingLabel: v } })} />
          <Field label="Badge da imagem" value={form.restaurantesTeaser.badgeText} onChange={v => setForm({ ...form, restaurantesTeaser: { ...form.restaurantesTeaser, badgeText: v } })} />
          <ListEditor
            label="Features"
            items={form.restaurantesTeaser.features}
            onChange={features => setForm({ ...form, restaurantesTeaser: { ...form.restaurantesTeaser, features } })}
            createItem={() => ({ title: '', description: '' })}
            renderItem={(item, _, update) => (
              <>
                <Field label="Título" value={item.title} onChange={v => update('title', v)} />
                <Field label="Descrição" value={item.description} onChange={v => update('description', v)} />
              </>
            )}
          />
        </SectionCard>

        {/* Cases Preview */}
        <SectionCard title="Preview de Cases">
          <Field label="Badge" value={form.casesPreview.badge} onChange={v => setForm({ ...form, casesPreview: { ...form.casesPreview, badge: v } })} />
          <Field label="Título" value={form.casesPreview.title} onChange={v => setForm({ ...form, casesPreview: { ...form.casesPreview, title: v } })} />
          <Field label="Título (destaque)" value={form.casesPreview.titleHighlight} onChange={v => setForm({ ...form, casesPreview: { ...form.casesPreview, titleHighlight: v } })} />
          <Field label="Subtítulo" value={form.casesPreview.subtitle} onChange={v => setForm({ ...form, casesPreview: { ...form.casesPreview, subtitle: v } })} multiline />
          <Field label="CTA" value={form.casesPreview.cta} onChange={v => setForm({ ...form, casesPreview: { ...form.casesPreview, cta: v } })} />
        </SectionCard>

        {/* Process */}
        <SectionCard title="Processo">
          <Field label="Badge" value={form.process.badge} onChange={v => setForm({ ...form, process: { ...form.process, badge: v } })} />
          <Field label="Título" value={form.process.title} onChange={v => setForm({ ...form, process: { ...form.process, title: v } })} />
          <Field label="Título (destaque)" value={form.process.titleHighlight} onChange={v => setForm({ ...form, process: { ...form.process, titleHighlight: v } })} />
          <Field label="Subtítulo" value={form.process.subtitle} onChange={v => setForm({ ...form, process: { ...form.process, subtitle: v } })} multiline />
          <ListEditor
            label="Etapas"
            items={form.process.steps}
            onChange={steps => setForm({ ...form, process: { ...form.process, steps } })}
            createItem={() => ({ number: '', title: '', description: '' })}
            renderItem={(item, _, update) => (
              <>
                <Field label="Número" value={item.number} onChange={v => update('number', v)} />
                <Field label="Título" value={item.title} onChange={v => update('title', v)} />
                <Field label="Descrição" value={item.description} onChange={v => update('description', v)} multiline />
              </>
            )}
          />
        </SectionCard>

        {/* Contact */}
        <SectionCard title="Seção de Contato">
          <Field label="Badge" value={form.contact.badge} onChange={v => setForm({ ...form, contact: { ...form.contact, badge: v } })} />
          <Field label="Título" value={form.contact.title} onChange={v => setForm({ ...form, contact: { ...form.contact, title: v } })} />
          <Field label="Título (destaque)" value={form.contact.titleHighlight} onChange={v => setForm({ ...form, contact: { ...form.contact, titleHighlight: v } })} />
          <Field label="Subtítulo" value={form.contact.subtitle} onChange={v => setForm({ ...form, contact: { ...form.contact, subtitle: v } })} multiline />
        </SectionCard>

        {/* Save */}
        <div className="flex justify-end sticky bottom-6">
          <Button onClick={handleSave} disabled={isUpdating} size="lg">
            {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar alterações
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHome;
