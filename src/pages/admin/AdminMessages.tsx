 import { useEffect, useState } from 'react';
 import AdminLayout from '@/components/admin/AdminLayout';
import { useSearchParams } from 'react-router-dom';
 import { supabase } from '@/integrations/supabase/client';
 import { Button } from '@/components/ui/button';
 import { toast } from 'sonner';
import { Mail, MailOpen, Trash2, Clock, Building, Phone, Search, Tag } from 'lucide-react';
 
 interface Message {
   id: string;
   name: string;
   email: string;
   company: string | null;
   phone: string | null;
   service: string | null;
  segment: string | null;
  status: string;
   message: string;
   is_read: boolean;
   created_at: string;
 }
 
const STATUS_OPTIONS = [
  { value: 'novo', label: 'Novo', color: 'bg-primary/10 text-primary border-primary/30' },
  { value: 'em_atendimento', label: 'Em atendimento', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { value: 'fechado', label: 'Fechado', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
];

 const AdminMessages = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [searchParams, setSearchParams] = useSearchParams();
 
   useEffect(() => {
     fetchMessages();
   }, []);

  // Abre direto a mensagem indicada na URL (ex.: vindo do Dashboard)
  useEffect(() => {
    const id = searchParams.get('id');
    if (!id || messages.length === 0) return;
    const found = messages.find(m => m.id === id);
    if (found && selectedMessage?.id !== id) {
      setSelectedMessage(found);
      if (!found.is_read) markAsRead(found.id);
    }
  }, [searchParams, messages]);
 
   const fetchMessages = async () => {
     try {
       const { data, error } = await supabase
         .from('contact_messages')
         .select('*')
         .order('created_at', { ascending: false });
 
       if (error) throw error;
      setMessages((data ?? []) as any);
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
 
  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status } as any)
        .eq('id', id);
      if (error) throw error;
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
      if (selectedMessage?.id === id) setSelectedMessage(prev => prev ? { ...prev, status } : null);
      toast.success('Status atualizado');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao atualizar status');
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
    setSearchParams({ id: message.id }, { replace: true });
     if (!message.is_read) {
       markAsRead(message.id);
     }
   };
 
   const unreadCount = messages.filter(m => !m.is_read).length;
 
  const segments = Array.from(new Set(messages.map(m => m.segment).filter(Boolean))) as string[];

  const filteredMessages = messages.filter(m => {
    if (statusFilter !== 'all' && (m.status || 'novo') !== statusFilter) return false;
    if (segmentFilter !== 'all' && (m.segment || '') !== segmentFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const blob = `${m.name} ${m.email} ${m.company ?? ''} ${m.phone ?? ''} ${m.service ?? ''} ${m.segment ?? ''} ${m.message}`.toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });

  const statusBadge = (status: string) => {
    const opt = STATUS_OPTIONS.find(s => s.value === (status || 'novo')) || STATUS_OPTIONS[0];
    return <span className={`text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full border ${opt.color}`}>{opt.label}</span>;
  };

   return (
     <AdminLayout title="Mensagens">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[calc(100vh-180px)]">
         {/* Message List */}
        <div className="lg:col-span-1 min-w-0 glass-card p-4 overflow-y-auto max-h-[60vh] lg:max-h-none">
           <div className="flex items-center justify-between mb-4">
             <h2 className="font-semibold">
              Leads
               {unreadCount > 0 && (
                 <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                   {unreadCount}
                 </span>
               )}
             </h2>
           </div>
 
          <div className="space-y-2 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nome, email, segmento..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/40"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-xs">
                <option value="all" className="bg-background">Todos status</option>
                {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value} className="bg-background">{s.label}</option>)}
              </select>
              <select value={segmentFilter} onChange={e => setSegmentFilter(e.target.value)} className="px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-xs">
                <option value="all" className="bg-background">Todos segmentos</option>
                {segments.map(s => <option key={s} value={s} className="bg-background">{s}</option>)}
              </select>
            </div>
          </div>

           {isLoading ? (
             <p className="text-muted-foreground p-4">Carregando...</p>
          ) : filteredMessages.length === 0 ? (
             <p className="text-muted-foreground p-4">Nenhuma mensagem recebida.</p>
           ) : (
             <div className="space-y-2">
              {filteredMessages.map((message) => (
                <button
                   key={message.id}
                   onClick={() => handleSelectMessage(message)}
                  className={`w-full min-w-0 text-left p-4 rounded-lg transition-colors ${
                     selectedMessage?.id === message.id
                       ? 'bg-primary/10 border border-primary/30'
                       : message.is_read
                         ? 'bg-muted/30 hover:bg-muted/50'
                         : 'bg-primary/5 hover:bg-primary/10 border border-primary/20'
                   }`}
                 >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                     {message.is_read ? (
                       <MailOpen className="w-4 h-4 text-muted-foreground" />
                     ) : (
                       <Mail className="w-4 h-4 text-primary" />
                     )}
                     <span className={`font-medium truncate ${!message.is_read && 'text-primary'}`}>
                       {message.name}
                     </span>
                    </div>
                    {statusBadge(message.status)}
                   </div>
                   <p className="text-sm text-muted-foreground truncate">{message.email}</p>
                  {message.segment && (
                    <p className="text-[11px] text-primary/80 mt-1 flex items-center gap-1"><Tag className="w-3 h-3" /> {message.segment}</p>
                  )}
                   <p className="text-xs text-muted-foreground mt-1 truncate">{message.message}</p>
                 </button>
               ))}
             </div>
           )}
         </div>
 
         {/* Message Detail */}
        <div className="lg:col-span-2 min-w-0 glass-card p-6 overflow-y-auto">
           {selectedMessage ? (
             <div className="space-y-6">
               {/* Header */}
               <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
                 <div>
                   <h2 className="text-xl font-display font-semibold">{selectedMessage.name}</h2>
                   <p className="text-muted-foreground">{selectedMessage.email}</p>
                  <div className="mt-2">{statusBadge(selectedMessage.status)}</div>
                 </div>
                <div className="flex gap-2 items-center">
                  <select
                    value={selectedMessage.status || 'novo'}
                    onChange={(e) => updateStatus(selectedMessage.id, e.target.value)}
                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/40"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value} className="bg-background">{s.label}</option>)}
                  </select>
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
                {selectedMessage.segment && (
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedMessage.segment}</span>
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