import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/admin/ImageUpload';
import VideoInput from '@/components/admin/VideoInput';
import CaseMediaEditor from '@/components/admin/CaseMediaEditor';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Eye, Star, Film, Image as ImageIcon, Save } from 'lucide-react';
import { parseYouTubeId, resolveVideoCover } from '@/lib/videoUtils';
import { Link } from 'react-router-dom';
import { SEGMENTS, APPEARS_OPTIONS } from '@/lib/segments';

interface CaseRow {
  id: string;
  slug: string;
  client_name: string;
  title: string;
  subtitle: string | null;
  hero_kind: string;
  hero_media_url: string | null;
  hero_youtube_id: string | null;
  hero_image_url: string | null;
  challenge: string | null;
  strategy: string | null;
  solution: string | null;
  results_text: string | null;
  metrics: Array<{ label: string; value: string }>;
  testimonial_text: string | null;
  testimonial_author: string | null;
  categories: string[];
  segments: string[];
  is_active: boolean;
  is_featured: boolean;
  show_on_home: boolean;
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  category?: string | null;
  subcategory?: string | null;
  appears_in?: string[];
  home_featured?: boolean;
  cover_media_id?: string | null;
}

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
   .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const emptyForm = {
  slug: '', client_name: '', title: '', subtitle: '',
  hero_kind: 'image' as 'image' | 'video',
  hero_media_url: '', hero_image_url: '',
  challenge: '', strategy: '', solution: '',
  results_text: '',
  metricsRaw: '',
  testimonial_text: '', testimonial_author: '',
  categoriesRaw: '',
  segments: [] as string[],
  appears_in: [] as string[],
  category: '',
  subcategory: '',
  home_featured: false,
  is_active: true, is_featured: false, show_on_home: true,
  seo_title: '', seo_description: '', og_image_url: '',
};

const CATEGORY_OPTIONS = ['Vídeo', 'Fotografia', 'Marketing', 'Branding', 'Filme', 'Drone', 'Institucional'];

const AdminCases = () => {
  const [list, setList] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CaseRow | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const isDirtyRef = { current: isDirty };
  isDirtyRef.current = isDirty;

  // Wrap setForm to track dirty state
  const updateForm = (updater: any) => {
    setIsDirty(true);
    setForm(updater);
  };

  const fetchAll = async () => {
    setLoading(true);
    const { data } = await supabase.from('cases' as any).select('*').order('display_order');
    setList((data ?? []) as unknown as CaseRow[]);
    setLoading(false);
  };
  useEffect(() => { fetchAll(); }, []);

  const open = (c?: CaseRow) => {
    if (c) {
      setEditing(c);
      setForm({
        slug: c.slug, client_name: c.client_name, title: c.title, subtitle: c.subtitle ?? '',
        hero_kind: (c.hero_kind === 'video' ? 'video' : 'image'),
        hero_media_url: c.hero_media_url ?? '',
        hero_image_url: c.hero_image_url ?? '',
        challenge: c.challenge ?? '', strategy: c.strategy ?? '', solution: c.solution ?? '',
        results_text: c.results_text ?? '',
        metricsRaw: (c.metrics || []).map(m => `${m.label}|${m.value}`).join('\n'),
        testimonial_text: c.testimonial_text ?? '', testimonial_author: c.testimonial_author ?? '',
        categoriesRaw: (c.categories || []).join(', '),
        segments: c.segments || [],
        appears_in: c.appears_in || [],
        category: c.category || '',
        subcategory: c.subcategory || '',
        home_featured: !!c.home_featured,
        is_active: c.is_active, is_featured: c.is_featured, show_on_home: c.show_on_home,
        seo_title: c.seo_title ?? '', seo_description: c.seo_description ?? '',
        og_image_url: c.og_image_url ?? '',
      });
    } else {
      setEditing(null);
      setForm(emptyForm);
    }
    setIsOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await performSave();
  };

  const performSave = async (options: { silent?: boolean; asDraft?: boolean } = {}) => {
    const metrics = form.metricsRaw.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
      const [label, ...rest] = l.split('|');
      return { label: (label || '').trim(), value: rest.join('|').trim() };
    }).filter(m => m.label && m.value);

    const payload: any = {
      slug: form.slug || slugify(form.client_name || form.title),
      client_name: form.client_name,
      title: form.title,
      subtitle: form.subtitle || null,
      hero_kind: form.hero_kind,
      hero_media_url: form.hero_media_url || null,
      hero_youtube_id: parseYouTubeId(form.hero_media_url),
      hero_image_url: form.hero_image_url || null,
      challenge: form.challenge || null,
      strategy: form.strategy || null,
      solution: form.solution || null,
      results_text: form.results_text || null,
      metrics,
      testimonial_text: form.testimonial_text || null,
      testimonial_author: form.testimonial_author || null,
      categories: form.categoriesRaw.split(',').map(s => s.trim()).filter(Boolean),
      segments: form.segments,
      appears_in: form.appears_in,
      category: form.category || null,
      subcategory: form.subcategory || null,
      home_featured: form.home_featured,
      is_active: options.asDraft ? false : form.is_active,
      is_featured: form.is_featured,
      show_on_home: form.show_on_home,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      og_image_url: form.og_image_url || null,
    };

    try {
      setIsSaving(true);
      if (editing) {
        const { error } = await supabase.from('cases' as any).update(payload).eq('id', editing.id);
        if (error) throw error;
        if (!options.silent) toast.success('Case atualizado');
      } else {
        payload.display_order = list.length;
        const { data, error } = await supabase.from('cases' as any).insert(payload).select().single();
        if (error) throw error;
        if (!options.silent) toast.success('Case criado');
        if (data && options.asDraft) setEditing(data as any);
      }
      setIsDirty(false);
      if (!options.asDraft) setIsOpen(false);
      fetchAll();
    } catch (err: any) {
      console.error(err);
      if (!options.silent) toast.error('Erro: ' + (err.message || ''));
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save as draft when closing without explicit save
  const closeEditor = async () => {
    if (isDirty && (form.client_name || form.title)) {
      await performSave({ silent: true, asDraft: !editing });
      toast.info('Rascunho salvo automaticamente');
    }
    setIsOpen(false);
    setIsDirty(false);
  };

  // Warn on unload if dirty
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const remove = async (id: string) => {
    if (!confirm('Excluir este case?')) return;
    await supabase.from('cases' as any).delete().eq('id', id);
    toast.success('Excluído');
    fetchAll();
  };

  const toggleField = async (id: string, field: 'show_on_home' | 'is_featured' | 'is_active', current: boolean) => {
    await supabase.from('cases' as any).update({ [field]: !current }).eq('id', id);
    fetchAll();
  };

  return (
    <AdminLayout title="Cases">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Cada cliente, uma página viva e evolutiva.</p>
          <Button onClick={() => open()}><Plus className="w-4 h-4 mr-2" /> Novo case</Button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : list.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-muted-foreground mb-4">Nenhum case cadastrado.</p>
            <Button onClick={() => open()}><Plus className="w-4 h-4 mr-2" /> Criar primeiro case</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map(c => {
              const cover = c.hero_image_url || resolveVideoCover({ videoUrl: c.hero_media_url, youtubeId: c.hero_youtube_id });
              return (
                <div key={c.id} className="glass-card overflow-hidden group">
                  <div className="aspect-video relative bg-muted">
                    {cover ? <img src={cover} alt={c.title} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary" />}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Link to={`/cases/${c.slug}`} target="_blank"><Button size="sm" variant="secondary"><Eye className="w-4 h-4" /></Button></Link>
                      <Button size="sm" variant="secondary" onClick={() => open(c)}><Pencil className="w-4 h-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => remove(c.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-xs text-primary uppercase tracking-wider">{c.client_name}</span>
                        <h3 className="font-semibold truncate">{c.title}</h3>
                        <p className="text-xs text-muted-foreground truncate">/cases/{c.slug}</p>
                      </div>
                      <button
                        onClick={() => toggleField(c.id, 'show_on_home', c.show_on_home)}
                        title={c.show_on_home ? 'Aparece na página inicial' : 'Adicionar à página inicial'}
                        className={`shrink-0 p-2 rounded-lg transition ${c.show_on_home ? 'text-yellow-400 bg-yellow-400/10' : 'text-muted-foreground hover:text-yellow-400/70'}`}
                      >
                        <Star className={`w-5 h-5 ${c.show_on_home ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3 text-[10px] uppercase tracking-wider">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${c.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-muted/40 text-muted-foreground'}`}>
                        {c.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                      {c.is_featured && <span className="px-2 py-0.5 rounded bg-primary/10 text-primary">Destaque</span>}
                      {c.show_on_home && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-400/10 text-yellow-400"><Star className="w-3 h-3 fill-current" /> Home</span>}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 text-muted-foreground">
                        {c.hero_kind === 'video' ? <><Film className="w-3 h-3" /> Vídeo</> : <><ImageIcon className="w-3 h-3" /> Imagem</>}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-background/80 backdrop-blur-sm" onClick={closeEditor}>
          <div className="glass-card w-full max-w-4xl max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm p-4 md:p-6 border-b border-border flex items-center justify-between z-20 gap-3">
              <h2 className="text-lg md:text-xl font-display font-semibold truncate">{editing ? 'Editar case' : 'Novo case'} {isDirty && <span className="text-xs text-yellow-400 font-normal">• não salvo</span>}</h2>
              <div className="flex items-center gap-2 shrink-0">
                <Button type="submit" form="case-edit-form" disabled={isSaving} size="sm" className="shadow-lg shadow-primary/20">
                  <Save className="w-4 h-4 mr-1.5" /> {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
                <button onClick={closeEditor} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <form onSubmit={save} className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cliente *</Label>
                  <Input required value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value, slug: form.slug || slugify(e.target.value) })} placeholder="Ex.: Prisma Construtora" />
                </div>
                <div className="space-y-2">
                  <Label>Slug (URL)</Label>
                  <Input value={form.slug} onChange={e => setForm({ ...form, slug: slugify(e.target.value) })} placeholder="prisma-construtora" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Título do case *</Label>
                  <Input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Subtítulo</Label>
                  <Input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} />
                </div>
              </div>

              {/* Hero */}
              <div className="space-y-3 border-t border-border pt-6">
                <h3 className="font-semibold">Hero</h3>
                <div className="flex gap-2">
                  <Button type="button" size="sm" variant={form.hero_kind === 'image' ? 'default' : 'outline'} onClick={() => setForm({ ...form, hero_kind: 'image' })}>Imagem</Button>
                  <Button type="button" size="sm" variant={form.hero_kind === 'video' ? 'default' : 'outline'} onClick={() => setForm({ ...form, hero_kind: 'video' })}>Vídeo</Button>
                </div>
                {form.hero_kind === 'video' ? (
                  <VideoInput label="Vídeo do hero" value={form.hero_media_url} onChange={(v) => setForm({ ...form, hero_media_url: v })} folder="cases" />
                ) : null}
                <ImageUpload label={form.hero_kind === 'video' ? 'Capa (opcional, usa thumb do YouTube se vazia)' : 'Imagem do hero'} value={form.hero_image_url} onChange={(v) => setForm({ ...form, hero_image_url: v })} folder="cases" />
              </div>

              {/* O que fizemos */}
              <div className="space-y-3 border-t border-border pt-6">
                <h3 className="font-semibold">O que fizemos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Desafio</Label>
                    <Textarea rows={5} value={form.challenge} onChange={e => setForm({ ...form, challenge: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Estratégia</Label>
                    <Textarea rows={5} value={form.strategy} onChange={e => setForm({ ...form, strategy: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Solução</Label>
                    <Textarea rows={5} value={form.solution} onChange={e => setForm({ ...form, solution: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Resultados */}
              <div className="space-y-3 border-t border-border pt-6">
                <h3 className="font-semibold">Resultados</h3>
                <div className="space-y-2">
                  <Label>Métricas (uma por linha — formato <code>Rótulo|Valor</code>)</Label>
                  <Textarea rows={4} value={form.metricsRaw} onChange={e => setForm({ ...form, metricsRaw: e.target.value })} placeholder={'Alcance|+2M\nVendas|+38%\nROI|x4.2'} />
                </div>
                <div className="space-y-2">
                  <Label>Texto de resultados</Label>
                  <Textarea rows={3} value={form.results_text} onChange={e => setForm({ ...form, results_text: e.target.value })} />
                </div>
              </div>

              {/* Depoimento */}
              <div className="space-y-3 border-t border-border pt-6">
                <h3 className="font-semibold">Depoimento</h3>
                <div className="space-y-2">
                  <Label>Texto</Label>
                  <Textarea rows={3} value={form.testimonial_text} onChange={e => setForm({ ...form, testimonial_text: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Autor</Label>
                  <Input value={form.testimonial_author} onChange={e => setForm({ ...form, testimonial_author: e.target.value })} />
                </div>
              </div>

              {/* Categorias */}
              <div className="space-y-3 border-t border-border pt-6">
                <h3 className="font-semibold">Classificação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Categoria principal</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                    >
                      <option value="">Selecione...</option>
                      {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Subcategoria</Label>
                    <Input value={form.subcategory} onChange={e => setForm({ ...form, subcategory: e.target.value })} placeholder="Ex.: Institucional, Reels, Drone" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Tags extras (separadas por vírgula)</Label>
                    <Input value={form.categoriesRaw} onChange={e => setForm({ ...form, categoriesRaw: e.target.value })} placeholder="Vídeo, Marketing" />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label>Segmentos relacionados</Label>
                  <div className="flex flex-wrap gap-2">
                    {SEGMENTS.map(s => {
                      const active = form.segments.includes(s.slug);
                      return (
                        <button
                          type="button"
                          key={s.slug}
                          onClick={() => setForm({
                            ...form,
                            segments: active ? form.segments.filter(x => x !== s.slug) : [...form.segments, s.slug],
                          })}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${active ? 'bg-primary text-primary-foreground border-primary' : 'bg-white/5 text-muted-foreground border-white/10 hover:border-primary/40'}`}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label>Onde esse projeto deve aparecer</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {APPEARS_OPTIONS.map(opt => {
                      const active = form.appears_in.includes(opt.value);
                      return (
                        <label key={opt.value} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition ${active ? 'bg-primary/10 border-primary/40' : 'bg-white/5 border-white/10 hover:border-primary/30'}`}>
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => setForm({
                              ...form,
                              appears_in: active ? form.appears_in.filter(x => x !== opt.value) : [...form.appears_in, opt.value],
                            })}
                          />
                          {opt.label}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.show_on_home} onChange={e => setForm({ ...form, show_on_home: e.target.checked })} /> Exibir na Home</label>
                  <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} /> Destacar em Cases</label>
                  <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.home_featured} onChange={e => setForm({ ...form, home_featured: e.target.checked })} /> Destaque na Home Produtora</label>
                  <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Ativo</label>
                </div>
              </div>

              {/* SEO */}
              <div className="space-y-3 border-t border-border pt-6">
                <h3 className="font-semibold">SEO</h3>
                <Input placeholder="Título SEO" value={form.seo_title} onChange={e => setForm({ ...form, seo_title: e.target.value })} />
                <Textarea rows={2} placeholder="Descrição SEO" value={form.seo_description} onChange={e => setForm({ ...form, seo_description: e.target.value })} />
                <ImageUpload label="Imagem OG (compartilhamento)" value={form.og_image_url} onChange={(v) => setForm({ ...form, og_image_url: v })} folder="cases" />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit">{editing ? 'Salvar alterações' : 'Criar case'}</Button>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              </div>

              {/* Galeria evolutiva: somente após salvar */}
              {editing && (
                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold mb-3">Galeria evolutiva</h3>
                  <p className="text-sm text-muted-foreground mb-4">Adicione vídeos e fotos por seção. Tudo o que entrar aqui vira parte deste case.</p>
                  <CaseMediaEditor caseId={editing.id} />
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCases;