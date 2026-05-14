import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save, ExternalLink } from 'lucide-react';
import { Field, ListEditor, SectionCard, StringListEditor } from '@/components/admin/ContentEditorFields';
import ImageUpload from '@/components/admin/ImageUpload';
import { useSegmentsList, useUpdateSegmentPage, SegmentPage } from '@/hooks/useSegmentPage';
import { useTestimonials } from '@/hooks/useTestimonials';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ICONS = ['Target','MapPin','Users','Repeat','MessageSquare','LineChart','Search','FileText','Globe','Mic','Camera','Plane','Video','Film','Building2','Sparkles','ShoppingBag'];

const AdminSegments = () => {
  const { data: segments = [], isLoading } = useSegmentsList();
  const { mutateAsync: updatePage, isPending } = useUpdateSegmentPage();
  const { testimonials } = useTestimonials();
  const [activeSlug, setActiveSlug] = useState<string>('');
  const [draft, setDraft] = useState<SegmentPage | null>(null);

  const { data: allProjects = [] } = useQuery({
    queryKey: ['admin-all-projects'],
    queryFn: async () => {
      const { data } = await supabase.from('projects').select('id,title,subcategory,category').order('title');
      return data ?? [];
    },
  });

  useEffect(() => {
    if (segments.length && !activeSlug) setActiveSlug(segments[0].slug);
  }, [segments, activeSlug]);

  useEffect(() => {
    const found = segments.find(s => s.slug === activeSlug);
    if (found) setDraft(JSON.parse(JSON.stringify(found)));
  }, [activeSlug, segments]);

  if (isLoading || !draft) {
    return <AdminLayout title="Segmentos"><p className="text-muted-foreground">Carregando...</p></AdminLayout>;
  }

  const c = draft.content;

  const setContent = (updater: (cc: typeof c) => typeof c) => {
    setDraft(prev => prev ? ({ ...prev, content: updater(prev.content) }) : prev);
  };

  const save = async () => {
    try {
      await updatePage(draft);
      toast.success(`Segmento "${draft.name}" salvo com sucesso.`);
    } catch (e) {
      toast.error('Erro ao salvar.');
    }
  };

  return (
    <AdminLayout title="Segmentos">
      <div className="max-w-5xl space-y-6">
        {/* Switcher de segmento */}
        <div className="flex flex-wrap gap-2">
          {segments.map(s => (
            <button
              key={s.slug}
              onClick={() => setActiveSlug(s.slug)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                activeSlug === s.slug
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white/5 border border-white/10 hover:border-primary/30'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between glass-card p-4">
          <div className="flex items-center gap-6">
            <div>
              <Label className="text-xs text-muted-foreground">Slug (URL)</Label>
              <div className="font-mono text-sm">/{draft.slug}</div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={draft.is_active} onCheckedChange={v => setDraft({ ...draft, is_active: v })} />
              <Label>Ativo</Label>
            </div>
          </div>
          <a href={`/${draft.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary inline-flex items-center gap-1">
            Ver página <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="flex-wrap h-auto justify-start">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="intro">Intro</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
            <TabsTrigger value="gallery">Galeria</TabsTrigger>
            <TabsTrigger value="video">Vídeo</TabsTrigger>
            <TabsTrigger value="testimonials">Depoimentos</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="cta">CTA</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="mt-4">
            <SectionCard title="Hero">
              <Field label="Título" value={c.hero.title} onChange={v => setContent(cc => ({ ...cc, hero: { ...cc.hero, title: v } }))} />
              <Field label="Destaque (em rosa)" value={c.hero.highlight} onChange={v => setContent(cc => ({ ...cc, hero: { ...cc.hero, highlight: v } }))} />
              <Field label="Subtítulo" value={c.hero.subtitle} onChange={v => setContent(cc => ({ ...cc, hero: { ...cc.hero, subtitle: v } }))} multiline />
              <Field label="Texto do botão" value={c.hero.ctaText} onChange={v => setContent(cc => ({ ...cc, hero: { ...cc.hero, ctaText: v } }))} />
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Tipo de mídia do hero</Label>
                <select
                  value={c.hero.mediaType}
                  onChange={e => setContent(cc => ({ ...cc, hero: { ...cc.hero, mediaType: e.target.value as 'image' | 'video' } }))}
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                >
                  <option value="image">Imagem</option>
                  <option value="video">Vídeo (YouTube)</option>
                </select>
              </div>
              {c.hero.mediaType === 'video' ? (
                <Field label="URL ou ID do vídeo do YouTube" value={c.hero.mediaUrl} onChange={v => setContent(cc => ({ ...cc, hero: { ...cc.hero, mediaUrl: v } }))} placeholder="https://youtube.com/watch?v=..." />
              ) : (
                <ImageUpload label="Imagem de fundo" value={c.hero.mediaUrl} onChange={url => setContent(cc => ({ ...cc, hero: { ...cc.hero, mediaUrl: url } }))} folder={`segments/${draft.slug}/hero`} />
              )}
            </SectionCard>
          </TabsContent>

          <TabsContent value="intro" className="mt-4">
            <SectionCard title="Introdução">
              <Field label="Título" value={c.intro.title} onChange={v => setContent(cc => ({ ...cc, intro: { ...cc.intro, title: v } }))} />
              <Field label="Descrição" value={c.intro.description} onChange={v => setContent(cc => ({ ...cc, intro: { ...cc.intro, description: v } }))} multiline />
            </SectionCard>
          </TabsContent>

          <TabsContent value="services" className="mt-4 space-y-6">
            <SectionCard title="Marketing Digital">
              <Field label="Título" value={c.marketing.title} onChange={v => setContent(cc => ({ ...cc, marketing: { ...cc.marketing, title: v } }))} />
              <Field label="Subtítulo" value={c.marketing.subtitle} onChange={v => setContent(cc => ({ ...cc, marketing: { ...cc.marketing, subtitle: v } }))} multiline />
              <ListEditor
                label="Itens"
                items={c.marketing.items}
                onChange={items => setContent(cc => ({ ...cc, marketing: { ...cc.marketing, items } }))}
                createItem={() => ({ icon: 'Target', title: '', description: '' })}
                renderItem={(item, _i, upd) => (
                  <>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Ícone</Label>
                      <select value={item.icon} onChange={e => upd('icon', e.target.value)} className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm">
                        {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <Field label="Título" value={item.title} onChange={v => upd('title', v)} />
                    <Field label="Descrição" value={item.description} onChange={v => upd('description', v)} multiline />
                  </>
                )}
              />
            </SectionCard>

            <SectionCard title="Audiovisual">
              <Field label="Título" value={c.audiovisual.title} onChange={v => setContent(cc => ({ ...cc, audiovisual: { ...cc.audiovisual, title: v } }))} />
              <Field label="Subtítulo" value={c.audiovisual.subtitle} onChange={v => setContent(cc => ({ ...cc, audiovisual: { ...cc.audiovisual, subtitle: v } }))} multiline />
              <ListEditor
                label="Itens"
                items={c.audiovisual.items}
                onChange={items => setContent(cc => ({ ...cc, audiovisual: { ...cc.audiovisual, items } }))}
                createItem={() => ({ icon: 'Video', title: '', description: '' })}
                renderItem={(item, _i, upd) => (
                  <>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Ícone</Label>
                      <select value={item.icon} onChange={e => upd('icon', e.target.value)} className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm">
                        {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <Field label="Título" value={item.title} onChange={v => upd('title', v)} />
                    <Field label="Descrição" value={item.description} onChange={v => upd('description', v)} multiline />
                  </>
                )}
              />
            </SectionCard>
          </TabsContent>

          <TabsContent value="portfolio" className="mt-4">
            <SectionCard title="Portfólio do segmento">
              <Field label="Título" value={c.portfolio.title} onChange={v => setContent(cc => ({ ...cc, portfolio: { ...cc.portfolio, title: v } }))} />
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Selecione os projetos a exibir (vazio = mostra todos)
                </Label>
                <div className="max-h-80 overflow-y-auto border border-border rounded-lg p-3 space-y-2">
                  {allProjects.map((p: any) => {
                    const checked = c.portfolio.projectIds.includes(p.id);
                    return (
                      <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/40 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => setContent(cc => ({
                            ...cc,
                            portfolio: {
                              ...cc.portfolio,
                              projectIds: checked
                                ? cc.portfolio.projectIds.filter(id => id !== p.id)
                                : [...cc.portfolio.projectIds, p.id],
                            },
                          }))}
                        />
                        <span className="font-medium">{p.title}</span>
                        <span className="text-xs text-muted-foreground">{p.category} {p.subcategory ? `· ${p.subcategory}` : ''}</span>
                      </label>
                    );
                  })}
                  {allProjects.length === 0 && <p className="text-xs text-muted-foreground">Nenhum projeto cadastrado.</p>}
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="gallery" className="mt-4">
            <SectionCard title="Galeria de imagens">
              <Field label="Título" value={c.gallery.title} onChange={v => setContent(cc => ({ ...cc, gallery: { ...cc.gallery, title: v } }))} />
              {c.gallery.images.map((img, i) => (
                <ImageUpload
                  key={i}
                  label={`Imagem ${i + 1}`}
                  value={img}
                  onChange={url => {
                    const updated = [...c.gallery.images];
                    updated[i] = url;
                    setContent(cc => ({ ...cc, gallery: { ...cc.gallery, images: updated } }));
                  }}
                  folder={`segments/${draft.slug}/gallery`}
                />
              ))}
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setContent(cc => ({ ...cc, gallery: { ...cc.gallery, images: [...cc.gallery.images, ''] } }))}>
                  Adicionar imagem
                </Button>
                {c.gallery.images.length > 0 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => setContent(cc => ({ ...cc, gallery: { ...cc.gallery, images: cc.gallery.images.slice(0, -1) } }))}>
                    Remover última
                  </Button>
                )}
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="video" className="mt-4">
            <SectionCard title="Vídeo em destaque">
              <Field label="Título" value={c.videoFeatured.title} onChange={v => setContent(cc => ({ ...cc, videoFeatured: { ...cc.videoFeatured, title: v } }))} />
              <Field label="ID ou URL do YouTube" value={c.videoFeatured.youtubeId} onChange={v => setContent(cc => ({ ...cc, videoFeatured: { ...cc.videoFeatured, youtubeId: v } }))} placeholder="dQw4w9WgXcQ" />
            </SectionCard>
          </TabsContent>

          <TabsContent value="testimonials" className="mt-4">
            <SectionCard title="Depoimentos do segmento">
              <Label className="text-xs text-muted-foreground">Selecione os depoimentos cadastrados</Label>
              <div className="space-y-2">
                {testimonials.map(t => {
                  const checked = c.testimonialIds.includes(t.id);
                  return (
                    <label key={t.id} className="flex items-start gap-2 text-sm cursor-pointer hover:bg-muted/40 p-2 rounded border border-border">
                      <input
                        type="checkbox"
                        checked={checked}
                        className="mt-1"
                        onChange={() => setContent(cc => ({
                          ...cc,
                          testimonialIds: checked
                            ? cc.testimonialIds.filter(id => id !== t.id)
                            : [...cc.testimonialIds, t.id],
                        }))}
                      />
                      <div>
                        <div className="font-medium">{t.name} <span className="text-xs text-muted-foreground">· {t.role}</span></div>
                        <div className="text-xs text-muted-foreground italic">"{t.quote.slice(0, 120)}..."</div>
                      </div>
                    </label>
                  );
                })}
                {testimonials.length === 0 && <p className="text-xs text-muted-foreground">Nenhum depoimento cadastrado.</p>}
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="faq" className="mt-4">
            <SectionCard title="FAQ">
              <Field label="Título" value={c.faq.title} onChange={v => setContent(cc => ({ ...cc, faq: { ...cc.faq, title: v } }))} />
              <ListEditor
                label="Perguntas"
                items={c.faq.items}
                onChange={items => setContent(cc => ({ ...cc, faq: { ...cc.faq, items } }))}
                createItem={() => ({ question: '', answer: '' })}
                renderItem={(item, _i, upd) => (
                  <>
                    <Field label="Pergunta" value={item.question} onChange={v => upd('question', v)} />
                    <Field label="Resposta" value={item.answer} onChange={v => upd('answer', v)} multiline />
                  </>
                )}
              />
            </SectionCard>
          </TabsContent>

          <TabsContent value="cta" className="mt-4">
            <SectionCard title="CTA Final">
              <Field label="Título" value={c.finalCta.title} onChange={v => setContent(cc => ({ ...cc, finalCta: { ...cc.finalCta, title: v } }))} />
              <Field label="Subtítulo" value={c.finalCta.subtitle} onChange={v => setContent(cc => ({ ...cc, finalCta: { ...cc.finalCta, subtitle: v } }))} multiline />
              <Field label="Texto do botão" value={c.finalCta.buttonText} onChange={v => setContent(cc => ({ ...cc, finalCta: { ...cc.finalCta, buttonText: v } }))} />
              <Field label="Mensagem inicial do WhatsApp" value={c.finalCta.whatsappMessage} onChange={v => setContent(cc => ({ ...cc, finalCta: { ...cc.finalCta, whatsappMessage: v } }))} multiline />
            </SectionCard>
          </TabsContent>

          <TabsContent value="seo" className="mt-4">
            <SectionCard title="SEO da página">
              <Field label="Título SEO (até 60 chars)" value={draft.seo_title || ''} onChange={v => setDraft({ ...draft, seo_title: v })} />
              <Field label="Descrição SEO (até 160 chars)" value={draft.seo_description || ''} onChange={v => setDraft({ ...draft, seo_description: v })} multiline />
              <ImageUpload label="Imagem Open Graph (compartilhamento)" value={draft.og_image_url || ''} onChange={url => setDraft({ ...draft, og_image_url: url })} folder={`segments/${draft.slug}/og`} />
            </SectionCard>
          </TabsContent>
        </Tabs>

        <div className="sticky bottom-4 flex justify-end">
          <Button onClick={save} disabled={isPending} size="lg">
            <Save className="w-4 h-4 mr-2" />
            {isPending ? 'Salvando...' : 'Salvar segmento'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSegments;