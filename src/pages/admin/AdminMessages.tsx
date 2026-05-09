 import { useEffect, useState } from 'react';
 import AdminLayout from '@/components/admin/AdminLayout';
 import { supabase } from '@/integrations/supabase/client';
 import { Button } from '@/components/ui/button';
 import { toast } from 'sonner';
 import { Mail, MailOpen, Trash2, Clock, User, Building, Phone } from 'lucide-react';
 
 interface Message {
   id: string;
   name: string;
   email: string;
   company: string | null;
   phone: string | null;
   service: string | null;
   message: string;
   is_read: boolean;
   created_at: string;
 }
 
 const AdminMessages = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
 
   useEffect(() => {
     fetchMessages();
   }, []);
 
   const fetchMessages = async () => {
     try {
       const { data, error } = await supabase
         .from('contact_messages')
         .select('*')
         .order('created_at', { ascending: false });
 
       if (error) throw error;
       setMessages(data ?? []);
     } catch (error) {
       console.error('Error fetching messages:', error);
       toast.error('Erro ao carregar mensagens');
     } finally {
       setIsLoading(false);
     }
   };
 
   const markAsRead = async (id: string) => {
     try {
       const { error } = await supabase
         .from('contact_messages')
         .update({ is_read: true })
         .eq('id', id);
 
       if (error) throw error;
       
       setMessages(prev => prev.map(m => 
         m.id === id ? { ...m, is_read: true } : m
       ));
       
       if (selectedMessage?.id === id) {
         setSelectedMessage(prev => prev ? { ...prev, is_read: true } : null);
       }
     } catch (error) {
       console.error('Error marking as read:', error);
     }
   };
 
   const deleteMessage = async (id: string) => {
     if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return;
 
     try {
       const { error } = await supabase
         .from('contact_messages')
         .delete()
         .eq('id', id);
 
       if (error) throw error;
       
       setMessages(prev => prev.filter(m => m.id !== id));
       setSelectedMessage(null);
       toast.success('Mensagem excluída');
     } catch (error) {
       console.error('Error deleting message:', error);
       toast.error('Erro ao excluir mensagem');
     }
   };
 
   const formatDate = (dateStr: string) => {
     return new Date(dateStr).toLocaleDateString('pt-BR', {
       day: '2-digit',
       month: '2-digit',
       year: 'numeric',
       hour: '2-digit',
       minute: '2-digit',
     });
   };
 
   const handleSelectMessage = (message: Message) => {
     setSelectedMessage(message);
     if (!message.is_read) {
       markAsRead(message.id);
     }
   };
 
   const unreadCount = messages.filter(m => !m.is_read).length;
 
   return (
     <AdminLayout title="Mensagens">
       <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)]">
         {/* Message List */}
         <div className="lg:w-1/3 glass-card p-4 overflow-y-auto">
           <div className="flex items-center justify-between mb-4">
             <h2 className="font-semibold">
               Caixa de entrada
               {unreadCount > 0 && (
                 <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                   {unreadCount}
                 </span>
               )}
             </h2>
           </div>
 
           {isLoading ? (
             <p className="text-muted-foreground p-4">Carregando...</p>
           ) : messages.length === 0 ? (
             <p className="text-muted-foreground p-4">Nenhuma mensagem recebida.</p>
           ) : (
             <div className="space-y-2">
               {messages.map((message) => (
                 <button
                   key={message.id}
                   onClick={() => handleSelectMessage(message)}
                   className={`w-full text-left p-4 rounded-lg transition-colors ${
                     selectedMessage?.id === message.id
                       ? 'bg-primary/10 border border-primary/30'
                       : message.is_read
                         ? 'bg-muted/30 hover:bg-muted/50'
                         : 'bg-primary/5 hover:bg-primary/10 border border-primary/20'
                   }`}
                 >
                   <div className="flex items-center gap-2 mb-1">
                     {message.is_read ? (
                       <MailOpen className="w-4 h-4 text-muted-foreground" />
                     ) : (
                       <Mail className="w-4 h-4 text-primary" />
                     )}
                     <span className={`font-medium truncate ${!message.is_read && 'text-primary'}`}>
                       {message.name}
                     </span>
                   </div>
                   <p className="text-sm text-muted-foreground truncate">{message.email}</p>
                   <p className="text-xs text-muted-foreground mt-1 truncate">{message.message}</p>
                 </button>
               ))}
             </div>
           )}
         </div>
 
         {/* Message Detail */}
         <div className="lg:w-2/3 glass-card p-6 overflow-y-auto">
           {selectedMessage ? (
             <div className="space-y-6">
               {/* Header */}
               <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
                 <div>
                   <h2 className="text-xl font-display font-semibold">{selectedMessage.name}</h2>
                   <p className="text-muted-foreground">{selectedMessage.email}</p>
                 </div>
                 <div className="flex gap-2">
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => deleteMessage(selectedMessage.id)}
                     className="text-destructive hover:bg-destructive/10"
                   >
                     <Trash2 className="w-4 h-4" />
                   </Button>
                 </div>
               </div>
 
               {/* Meta */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {selectedMessage.company && (
                   <div className="flex items-center gap-2 text-sm">
                     <Building className="w-4 h-4 text-muted-foreground" />
                     <span>{selectedMessage.company}</span>
                   </div>
                 )}
                 {selectedMessage.phone && (
                   <div className="flex items-center gap-2 text-sm">
                     <Phone className="w-4 h-4 text-muted-foreground" />
                     <a 
                       href={`tel:${selectedMessage.phone}`}
                       className="text-primary hover:underline"
                     >
                       {selectedMessage.phone}
                     </a>
                   </div>
                 )}
                 {selectedMessage.service && (
                   <div className="flex items-center gap-2 text-sm">
                     <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                       {selectedMessage.service}
                     </span>
                   </div>
                 )}
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                   <Clock className="w-4 h-4" />
                   {formatDate(selectedMessage.created_at)}
                 </div>
               </div>
 
               {/* Message */}
               <div className="p-4 rounded-lg bg-muted/30">
                 <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
               </div>
 
               {/* Actions */}
               <div className="flex gap-3">
                 <Button asChild>
                   <a href={`mailto:${selectedMessage.email}`}>
                     Responder por e-mail
                   </a>
                 </Button>
                 {selectedMessage.phone && (
                   <Button variant="outline" asChild>
                     <a 
                       href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, '')}`}
                       target="_blank"
                       rel="noopener noreferrer"
                     >
                       WhatsApp
                     </a>
                   </Button>
                 )}
               </div>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
               <Mail className="w-12 h-12 mb-4 opacity-50" />
               <p>Selecione uma mensagem para visualizar</p>
             </div>
           )}
         </div>
       </div>
     </AdminLayout>
   );
 };
 
 export default AdminMessages;