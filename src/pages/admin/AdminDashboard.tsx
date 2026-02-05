 import { useEffect, useState } from 'react';
 import AdminLayout from '@/components/admin/AdminLayout';
 import { supabase } from '@/integrations/supabase/client';
 import { FolderOpen, Mail, Image, TrendingUp, Eye, Clock } from 'lucide-react';
 import { Link } from 'react-router-dom';
 
 interface Stats {
   totalProjects: number;
   unreadMessages: number;
   totalMessages: number;
   recentMessages: Array<{
     id: string;
     name: string;
     email: string;
     service: string | null;
     created_at: string;
     is_read: boolean;
   }>;
 }
 
 const AdminDashboard = () => {
   const [stats, setStats] = useState<Stats>({
     totalProjects: 0,
     unreadMessages: 0,
     totalMessages: 0,
     recentMessages: [],
   });
   const [isLoading, setIsLoading] = useState(true);
 
   useEffect(() => {
     const fetchStats = async () => {
       try {
         // Fetch projects count
         const { count: projectsCount } = await supabase
           .from('projects')
           .select('*', { count: 'exact', head: true });
 
         // Fetch messages
         const { data: messages, count: messagesCount } = await supabase
           .from('contact_messages')
           .select('*', { count: 'exact' })
           .order('created_at', { ascending: false })
           .limit(5);
 
         // Fetch unread count
         const { count: unreadCount } = await supabase
           .from('contact_messages')
           .select('*', { count: 'exact', head: true })
           .eq('is_read', false);
 
         setStats({
           totalProjects: projectsCount ?? 0,
           totalMessages: messagesCount ?? 0,
           unreadMessages: unreadCount ?? 0,
           recentMessages: messages ?? [],
         });
       } catch (error) {
         console.error('Error fetching stats:', error);
       } finally {
         setIsLoading(false);
       }
     };
 
     fetchStats();
   }, []);
 
   const statCards = [
     {
       title: 'Projetos',
       value: stats.totalProjects,
       icon: FolderOpen,
       href: '/admin/projects',
       color: 'text-primary',
       bg: 'bg-primary/10',
     },
     {
       title: 'Mensagens não lidas',
       value: stats.unreadMessages,
       icon: Mail,
       href: '/admin/messages',
       color: 'text-orange-500',
       bg: 'bg-orange-500/10',
     },
     {
       title: 'Total de mensagens',
       value: stats.totalMessages,
       icon: TrendingUp,
       href: '/admin/messages',
       color: 'text-green-500',
       bg: 'bg-green-500/10',
     },
   ];
 
   const formatDate = (dateStr: string) => {
     return new Date(dateStr).toLocaleDateString('pt-BR', {
       day: '2-digit',
       month: '2-digit',
       year: 'numeric',
       hour: '2-digit',
       minute: '2-digit',
     });
   };
 
   return (
     <AdminLayout title="Dashboard">
       <div className="space-y-8">
         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {statCards.map((card) => (
             <Link
               key={card.title}
               to={card.href}
               className="glass-card p-6 hover:border-primary/50 transition-colors"
             >
               <div className="flex items-start justify-between">
                 <div>
                   <p className="text-muted-foreground text-sm">{card.title}</p>
                   <p className="text-3xl font-display font-bold mt-2">
                     {isLoading ? '...' : card.value}
                   </p>
                 </div>
                 <div className={`p-3 rounded-xl ${card.bg}`}>
                   <card.icon className={`w-6 h-6 ${card.color}`} />
                 </div>
               </div>
             </Link>
           ))}
         </div>
 
         {/* Recent Messages */}
         <div className="glass-card p-6">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-lg font-display font-semibold">Mensagens recentes</h2>
             <Link 
               to="/admin/messages"
               className="text-sm text-primary hover:underline"
             >
               Ver todas →
             </Link>
           </div>
 
           {isLoading ? (
             <p className="text-muted-foreground">Carregando...</p>
           ) : stats.recentMessages.length === 0 ? (
             <p className="text-muted-foreground">Nenhuma mensagem recebida ainda.</p>
           ) : (
             <div className="space-y-4">
               {stats.recentMessages.map((message) => (
                 <div
                   key={message.id}
                   className={`p-4 rounded-lg border ${
                     message.is_read 
                       ? 'bg-muted/30 border-border' 
                       : 'bg-primary/5 border-primary/20'
                   }`}
                 >
                   <div className="flex items-start justify-between gap-4">
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2">
                         <p className="font-medium truncate">{message.name}</p>
                         {!message.is_read && (
                           <span className="px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                             Nova
                           </span>
                         )}
                       </div>
                       <p className="text-sm text-muted-foreground truncate">
                         {message.email}
                       </p>
                       {message.service && (
                         <p className="text-sm text-primary mt-1">
                           {message.service}
                         </p>
                       )}
                     </div>
                     <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                       <Clock className="w-3 h-3" />
                       {formatDate(message.created_at)}
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           )}
         </div>
 
         {/* Quick Actions */}
         <div className="glass-card p-6">
           <h2 className="text-lg font-display font-semibold mb-6">Ações rápidas</h2>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <Link
               to="/admin/projects"
               className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
             >
               <FolderOpen className="w-5 h-5 text-primary" />
               <span>Adicionar projeto</span>
             </Link>
             <Link
               to="/admin/media"
               className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
             >
               <Image className="w-5 h-5 text-primary" />
               <span>Upload de mídia</span>
             </Link>
             <Link
               to="/"
               target="_blank"
               className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
             >
               <Eye className="w-5 h-5 text-primary" />
               <span>Ver site</span>
             </Link>
           </div>
         </div>
       </div>
     </AdminLayout>
   );
 };
 
 export default AdminDashboard;