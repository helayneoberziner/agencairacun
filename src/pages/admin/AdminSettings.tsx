 import { useState } from 'react';
 import AdminLayout from '@/components/admin/AdminLayout';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { toast } from 'sonner';
 import { useAuth } from '@/hooks/useAuth';
 import { supabase } from '@/integrations/supabase/client';
 import { Lock, User, Shield } from 'lucide-react';
 
 const AdminSettings = () => {
   const { user } = useAuth();
   const [passwordData, setPasswordData] = useState({
     currentPassword: '',
     newPassword: '',
     confirmPassword: '',
   });
   const [isUpdating, setIsUpdating] = useState(false);
 
   const handlePasswordChange = async (e: React.FormEvent) => {
     e.preventDefault();
 
     if (passwordData.newPassword !== passwordData.confirmPassword) {
       toast.error('As senhas não coincidem');
       return;
     }
 
     if (passwordData.newPassword.length < 6) {
       toast.error('A senha deve ter no mínimo 6 caracteres');
       return;
     }
 
     setIsUpdating(true);
 
     try {
       const { error } = await supabase.auth.updateUser({
         password: passwordData.newPassword,
       });
 
       if (error) throw error;
 
       toast.success('Senha atualizada com sucesso!');
       setPasswordData({
         currentPassword: '',
         newPassword: '',
         confirmPassword: '',
       });
     } catch (error) {
       console.error('Error updating password:', error);
       toast.error('Erro ao atualizar senha');
     } finally {
       setIsUpdating(false);
     }
   };
 
   return (
     <AdminLayout title="Configurações">
       <div className="max-w-2xl space-y-8">
         {/* Account Info */}
         <div className="glass-card p-6">
           <div className="flex items-center gap-3 mb-6">
             <div className="p-2 rounded-lg bg-primary/10">
               <User className="w-5 h-5 text-primary" />
             </div>
             <h2 className="text-lg font-display font-semibold">Conta</h2>
           </div>
 
           <div className="space-y-4">
             <div>
               <Label className="text-muted-foreground">E-mail</Label>
               <p className="font-medium">{user?.email}</p>
             </div>
             <div>
               <Label className="text-muted-foreground">ID do usuário</Label>
               <p className="text-sm text-muted-foreground font-mono">{user?.id}</p>
             </div>
           </div>
         </div>
 
         {/* Change Password */}
         <div className="glass-card p-6">
           <div className="flex items-center gap-3 mb-6">
             <div className="p-2 rounded-lg bg-primary/10">
               <Lock className="w-5 h-5 text-primary" />
             </div>
             <h2 className="text-lg font-display font-semibold">Alterar senha</h2>
           </div>
 
           <form onSubmit={handlePasswordChange} className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="newPassword">Nova senha</Label>
               <Input
                 id="newPassword"
                 type="password"
                 value={passwordData.newPassword}
                 onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                 required
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
               <Input
                 id="confirmPassword"
                 type="password"
                 value={passwordData.confirmPassword}
                 onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                 required
               />
             </div>
             <Button type="submit" disabled={isUpdating}>
               {isUpdating ? 'Atualizando...' : 'Atualizar senha'}
             </Button>
           </form>
         </div>
 
         {/* Security Info */}
         <div className="glass-card p-6">
           <div className="flex items-center gap-3 mb-6">
             <div className="p-2 rounded-lg bg-primary/10">
               <Shield className="w-5 h-5 text-primary" />
             </div>
             <h2 className="text-lg font-display font-semibold">Segurança</h2>
           </div>
 
           <div className="space-y-4 text-sm text-muted-foreground">
             <p>
               Sua conta está protegida com autenticação segura. Para adicionar novos 
               administradores, entre em contato com o suporte técnico.
             </p>
           </div>
         </div>
       </div>
     </AdminLayout>
   );
 };
 
 export default AdminSettings;