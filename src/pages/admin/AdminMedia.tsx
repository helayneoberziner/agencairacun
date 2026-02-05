 import { useEffect, useState, useRef } from 'react';
 import AdminLayout from '@/components/admin/AdminLayout';
 import { supabase } from '@/integrations/supabase/client';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { toast } from 'sonner';
 import { Upload, Trash2, Copy, Image, Loader2, Search, X } from 'lucide-react';
 
 interface MediaFile {
   name: string;
   url: string;
   size: number;
   created_at: string;
 }
 
 const AdminMedia = () => {
   const [files, setFiles] = useState<MediaFile[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isUploading, setIsUploading] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const fileInputRef = useRef<HTMLInputElement>(null);
 
   useEffect(() => {
     fetchFiles();
   }, []);
 
   const fetchFiles = async () => {
     try {
       const { data, error } = await supabase.storage
         .from('media')
         .list('', {
           limit: 100,
           sortBy: { column: 'created_at', order: 'desc' },
         });
 
       if (error) throw error;
 
       const filesWithUrls = (data ?? [])
         .filter(file => file.name !== '.emptyFolderPlaceholder')
         .map(file => ({
           name: file.name,
           url: supabase.storage.from('media').getPublicUrl(file.name).data.publicUrl,
           size: file.metadata?.size ?? 0,
           created_at: file.created_at ?? '',
         }));
 
       setFiles(filesWithUrls);
     } catch (error) {
       console.error('Error fetching files:', error);
       toast.error('Erro ao carregar arquivos');
     } finally {
       setIsLoading(false);
     }
   };
 
   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const selectedFiles = e.target.files;
     if (!selectedFiles || selectedFiles.length === 0) return;
 
     setIsUploading(true);
 
     try {
       for (const file of Array.from(selectedFiles)) {
         const fileExt = file.name.split('.').pop();
         const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
 
         const { error } = await supabase.storage
           .from('media')
           .upload(fileName, file);
 
         if (error) throw error;
       }
 
       toast.success(`${selectedFiles.length} arquivo(s) enviado(s)!`);
       fetchFiles();
     } catch (error) {
       console.error('Error uploading:', error);
       toast.error('Erro ao enviar arquivo');
     } finally {
       setIsUploading(false);
       if (fileInputRef.current) {
         fileInputRef.current.value = '';
       }
     }
   };
 
   const deleteFile = async (fileName: string) => {
     if (!confirm('Tem certeza que deseja excluir este arquivo?')) return;
 
     try {
       const { error } = await supabase.storage
         .from('media')
         .remove([fileName]);
 
       if (error) throw error;
       
       setFiles(prev => prev.filter(f => f.name !== fileName));
       toast.success('Arquivo excluído');
     } catch (error) {
       console.error('Error deleting file:', error);
       toast.error('Erro ao excluir arquivo');
     }
   };
 
   const copyUrl = (url: string) => {
     navigator.clipboard.writeText(url);
     toast.success('URL copiada!');
   };
 
   const formatSize = (bytes: number) => {
     if (bytes === 0) return '0 B';
     const k = 1024;
     const sizes = ['B', 'KB', 'MB', 'GB'];
     const i = Math.floor(Math.log(bytes) / Math.log(k));
     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
   };
 
   const filteredFiles = files.filter(file => 
     file.name.toLowerCase().includes(searchTerm.toLowerCase())
   );
 
   const isImage = (fileName: string) => {
     const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
     const ext = fileName.split('.').pop()?.toLowerCase();
     return ext ? imageExts.includes(ext) : false;
   };
 
   return (
     <AdminLayout title="Biblioteca de Mídia">
       <div className="space-y-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
           <p className="text-muted-foreground">
             Gerencie imagens e arquivos do site
           </p>
           <div className="flex gap-3">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <Input
                 placeholder="Buscar..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-9 w-48"
               />
             </div>
             <Button 
               onClick={() => fileInputRef.current?.click()}
               disabled={isUploading}
             >
               {isUploading ? (
                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
               ) : (
                 <Upload className="w-4 h-4 mr-2" />
               )}
               Upload
             </Button>
             <input
               ref={fileInputRef}
               type="file"
               multiple
               accept="image/*,video/*,.pdf"
               onChange={handleUpload}
               className="hidden"
             />
           </div>
         </div>
 
         {/* Files Grid */}
         {isLoading ? (
           <div className="flex items-center justify-center py-12">
             <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
           </div>
         ) : filteredFiles.length === 0 ? (
           <div className="glass-card p-12 text-center">
             <Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
             <p className="text-muted-foreground mb-4">
               {searchTerm ? 'Nenhum arquivo encontrado.' : 'Nenhum arquivo na biblioteca.'}
             </p>
             {!searchTerm && (
               <Button onClick={() => fileInputRef.current?.click()}>
                 <Upload className="w-4 h-4 mr-2" />
                 Enviar primeiro arquivo
               </Button>
             )}
           </div>
         ) : (
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
             {filteredFiles.map((file) => (
               <div key={file.name} className="glass-card overflow-hidden group">
                 {/* Thumbnail */}
                 <div className="aspect-square relative bg-muted">
                   {isImage(file.name) ? (
                     <img 
                       src={file.url} 
                       alt={file.name}
                       className="w-full h-full object-cover"
                       loading="lazy"
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center">
                       <Image className="w-8 h-8 text-muted-foreground/30" />
                     </div>
                   )}
 
                   {/* Overlay */}
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                     <button
                       onClick={() => copyUrl(file.url)}
                       className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                       title="Copiar URL"
                     >
                       <Copy className="w-4 h-4 text-white" />
                     </button>
                     <button
                       onClick={() => deleteFile(file.name)}
                       className="p-2 rounded-lg bg-destructive/50 hover:bg-destructive transition-colors"
                       title="Excluir"
                     >
                       <Trash2 className="w-4 h-4 text-white" />
                     </button>
                   </div>
                 </div>
 
                 {/* Info */}
                 <div className="p-2">
                   <p className="text-xs truncate" title={file.name}>{file.name}</p>
                   <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                 </div>
               </div>
             ))}
           </div>
         )}
       </div>
     </AdminLayout>
   );
 };
 
 export default AdminMedia;