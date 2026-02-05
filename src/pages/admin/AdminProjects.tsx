 import { useEffect, useState } from 'react';
 import AdminLayout from '@/components/admin/AdminLayout';
 import { supabase } from '@/integrations/supabase/client';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
 import { toast } from 'sonner';
 import { Plus, Pencil, Trash2, X, Youtube, Image, Star, GripVertical } from 'lucide-react';
 
 interface Project {
   id: string;
   title: string;
   category: string;
   description: string | null;
   context: string | null;
   actions: string | null;
   results: string | null;
   deliveries: string[] | null;
   image_url: string | null;
   video_url: string | null;
   is_featured: boolean;
   display_order: number;
   created_at: string;
 }
 
 const AdminProjects = () => {
   const [projects, setProjects] = useState<Project[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingProject, setEditingProject] = useState<Project | null>(null);
   const [formData, setFormData] = useState({
     title: '',
     category: '',
     description: '',
     context: '',
     actions: '',
     results: '',
     deliveries: '',
     image_url: '',
     video_url: '',
     is_featured: false,
   });
 
   const categories = ['Conteúdo', 'Tráfego', 'Filme', 'Branding', 'Social Media'];
 
   useEffect(() => {
     fetchProjects();
   }, []);
 
   const fetchProjects = async () => {
     try {
       const { data, error } = await supabase
         .from('projects')
         .select('*')
         .order('display_order', { ascending: true });
 
       if (error) throw error;
       setProjects(data ?? []);
     } catch (error) {
       console.error('Error fetching projects:', error);
       toast.error('Erro ao carregar projetos');
     } finally {
       setIsLoading(false);
     }
   };
 
   const openModal = (project?: Project) => {
     if (project) {
       setEditingProject(project);
       setFormData({
         title: project.title,
         category: project.category,
         description: project.description ?? '',
         context: project.context ?? '',
         actions: project.actions ?? '',
         results: project.results ?? '',
         deliveries: project.deliveries?.join('\n') ?? '',
         image_url: project.image_url ?? '',
         video_url: project.video_url ?? '',
         is_featured: project.is_featured,
       });
     } else {
       setEditingProject(null);
       setFormData({
         title: '',
         category: '',
         description: '',
         context: '',
         actions: '',
         results: '',
         deliveries: '',
         image_url: '',
         video_url: '',
         is_featured: false,
       });
     }
     setIsModalOpen(true);
   };
 
   const closeModal = () => {
     setIsModalOpen(false);
     setEditingProject(null);
   };
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
 
     const deliveriesArray = formData.deliveries
       .split('\n')
       .map(d => d.trim())
       .filter(d => d.length > 0);
 
     const projectData = {
       title: formData.title,
       category: formData.category,
       description: formData.description || null,
       context: formData.context || null,
       actions: formData.actions || null,
       results: formData.results || null,
       deliveries: deliveriesArray.length > 0 ? deliveriesArray : null,
       image_url: formData.image_url || null,
       video_url: formData.video_url || null,
       is_featured: formData.is_featured,
     };
 
     try {
       if (editingProject) {
         const { error } = await supabase
           .from('projects')
           .update(projectData)
           .eq('id', editingProject.id);
 
         if (error) throw error;
         toast.success('Projeto atualizado!');
       } else {
         const { error } = await supabase
           .from('projects')
           .insert([{ ...projectData, display_order: projects.length }]);
 
         if (error) throw error;
         toast.success('Projeto criado!');
       }
 
       closeModal();
       fetchProjects();
     } catch (error) {
       console.error('Error saving project:', error);
       toast.error('Erro ao salvar projeto');
     }
   };
 
   const deleteProject = async (id: string) => {
     if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
 
     try {
       const { error } = await supabase
         .from('projects')
         .delete()
         .eq('id', id);
 
       if (error) throw error;
       
       setProjects(prev => prev.filter(p => p.id !== id));
       toast.success('Projeto excluído');
     } catch (error) {
       console.error('Error deleting project:', error);
       toast.error('Erro ao excluir projeto');
     }
   };
 
   const toggleFeatured = async (id: string, isFeatured: boolean) => {
     try {
       const { error } = await supabase
         .from('projects')
         .update({ is_featured: !isFeatured })
         .eq('id', id);
 
       if (error) throw error;
       
       setProjects(prev => prev.map(p => 
         p.id === id ? { ...p, is_featured: !isFeatured } : p
       ));
     } catch (error) {
       console.error('Error updating project:', error);
       toast.error('Erro ao atualizar projeto');
     }
   };
 
   return (
     <AdminLayout title="Projetos">
       <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
           <p className="text-muted-foreground">
             Gerencie os projetos do portfólio
           </p>
           <Button onClick={() => openModal()}>
             <Plus className="w-4 h-4 mr-2" />
             Novo projeto
           </Button>
         </div>
 
         {/* Projects Grid */}
         {isLoading ? (
           <p className="text-muted-foreground">Carregando...</p>
         ) : projects.length === 0 ? (
           <div className="glass-card p-12 text-center">
             <p className="text-muted-foreground mb-4">Nenhum projeto cadastrado.</p>
             <Button onClick={() => openModal()}>
               <Plus className="w-4 h-4 mr-2" />
               Adicionar primeiro projeto
             </Button>
           </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {projects.map((project) => (
               <div key={project.id} className="glass-card overflow-hidden group">
                 {/* Image */}
                 <div className="aspect-video relative bg-muted">
                   {project.image_url ? (
                     <img 
                       src={project.image_url} 
                       alt={project.title}
                       className="w-full h-full object-cover"
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center">
                       <Image className="w-12 h-12 text-muted-foreground/30" />
                     </div>
                   )}
 
                   {project.video_url && (
                     <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600">
                       <Youtube className="w-4 h-4 text-white" />
                     </div>
                   )}
 
                   {/* Overlay */}
                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                     <Button size="sm" variant="secondary" onClick={() => openModal(project)}>
                       <Pencil className="w-4 h-4" />
                     </Button>
                     <Button size="sm" variant="destructive" onClick={() => deleteProject(project.id)}>
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   </div>
                 </div>
 
                 {/* Content */}
                 <div className="p-4">
                   <div className="flex items-start justify-between gap-2">
                     <div>
                       <span className="text-xs text-primary font-medium uppercase">
                         {project.category}
                       </span>
                       <h3 className="font-semibold mt-1">{project.title}</h3>
                     </div>
                     <button
                       onClick={() => toggleFeatured(project.id, project.is_featured)}
                       className={`p-1.5 rounded-lg transition-colors ${
                         project.is_featured 
                           ? 'text-yellow-500 bg-yellow-500/10' 
                           : 'text-muted-foreground hover:text-yellow-500'
                       }`}
                       title={project.is_featured ? 'Remover destaque' : 'Destacar projeto'}
                     >
                       <Star className={`w-4 h-4 ${project.is_featured && 'fill-current'}`} />
                     </button>
                   </div>
                   {project.description && (
                     <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                       {project.description}
                     </p>
                   )}
                 </div>
               </div>
             ))}
           </div>
         )}
       </div>
 
       {/* Modal */}
       {isModalOpen && (
         <div 
           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
           onClick={closeModal}
         >
           <div 
             className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
             onClick={(e) => e.stopPropagation()}
           >
             <div className="sticky top-0 bg-card/95 backdrop-blur-sm p-6 border-b border-border flex items-center justify-between">
               <h2 className="text-xl font-display font-semibold">
                 {editingProject ? 'Editar projeto' : 'Novo projeto'}
               </h2>
               <button onClick={closeModal} className="p-2 hover:bg-muted rounded-lg">
                 <X className="w-5 h-5" />
               </button>
             </div>
 
             <form onSubmit={handleSubmit} className="p-6 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="title">Título *</Label>
                   <Input
                     id="title"
                     value={formData.title}
                     onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                     required
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="category">Categoria *</Label>
                   <select
                     id="category"
                     value={formData.category}
                     onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                     required
                     className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                   >
                     <option value="">Selecione...</option>
                     {categories.map(cat => (
                       <option key={cat} value={cat}>{cat}</option>
                     ))}
                   </select>
                 </div>
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="description">Descrição breve</Label>
                 <Input
                   id="description"
                   value={formData.description}
                   onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                 />
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="context">Contexto</Label>
                 <Textarea
                   id="context"
                   value={formData.context}
                   onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                   rows={3}
                 />
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="actions">O que fizemos</Label>
                 <Textarea
                   id="actions"
                   value={formData.actions}
                   onChange={(e) => setFormData(prev => ({ ...prev, actions: e.target.value }))}
                   rows={3}
                 />
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="results">Resultados</Label>
                 <Textarea
                   id="results"
                   value={formData.results}
                   onChange={(e) => setFormData(prev => ({ ...prev, results: e.target.value }))}
                   rows={3}
                 />
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="deliveries">Entregas (uma por linha)</Label>
                 <Textarea
                   id="deliveries"
                   value={formData.deliveries}
                   onChange={(e) => setFormData(prev => ({ ...prev, deliveries: e.target.value }))}
                   rows={3}
                   placeholder="Filme institucional&#10;20 fotos&#10;Landing page"
                 />
               </div>
 
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="image_url">URL da imagem</Label>
                   <Input
                     id="image_url"
                     type="url"
                     value={formData.image_url}
                     onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                     placeholder="https://..."
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="video_url">URL do vídeo (YouTube)</Label>
                   <Input
                     id="video_url"
                     type="url"
                     value={formData.video_url}
                     onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                     placeholder="https://youtube.com/..."
                   />
                 </div>
               </div>
 
               <div className="flex items-center gap-2">
                 <input
                   type="checkbox"
                   id="is_featured"
                   checked={formData.is_featured}
                   onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                   className="w-4 h-4"
                 />
                 <Label htmlFor="is_featured" className="cursor-pointer">
                   Destacar na home
                 </Label>
               </div>
 
               <div className="flex gap-3 pt-4 border-t border-border">
                 <Button type="submit" className="flex-1">
                   {editingProject ? 'Salvar alterações' : 'Criar projeto'}
                 </Button>
                 <Button type="button" variant="outline" onClick={closeModal}>
                   Cancelar
                 </Button>
               </div>
             </form>
           </div>
         </div>
       )}
     </AdminLayout>
   );
 };
 
 export default AdminProjects;