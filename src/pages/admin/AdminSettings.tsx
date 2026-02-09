import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Lock, User, Shield, Globe, Phone, MapPin, Instagram, Linkedin, Youtube, Mail, MessageCircle } from 'lucide-react';

const AdminSettings = () => {
  const { user } = useAuth();
  const { settings, isLoading, updateSettings, isUpdating } = useSiteSettings();

  const [siteData, setSiteData] = useState(settings);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  useEffect(() => {
    setSiteData(settings);
  }, [settings]);

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
    setIsPasswordUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });
      if (error) throw error;
      toast.success('Senha atualizada com sucesso!');
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Erro ao atualizar senha');
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  const handleSiteSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(siteData);
      toast.success('Configurações do site atualizadas!');
    } catch (error) {
      console.error('Error updating site settings:', error);
      toast.error('Erro ao salvar configurações');
    }
  };

  const handleSiteChange = (field: string, value: string) => {
    setSiteData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AdminLayout title="Configurações">
      <div className="max-w-2xl space-y-8">
        {/* Site Settings */}
        <form onSubmit={handleSiteSettingsSave} className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-display font-semibold">Informações do site</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" /> E-mail
              </Label>
              <Input id="email" value={siteData.email} onChange={e => handleSiteChange('email', e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" /> Telefone
              </Label>
              <Input id="phone" value={siteData.phone} onChange={e => handleSiteChange('phone', e.target.value)} placeholder="(47) 3209-6098" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-muted-foreground" /> WhatsApp (número sem formatação)
              </Label>
              <Input id="whatsapp" value={siteData.whatsapp} onChange={e => handleSiteChange('whatsapp', e.target.value)} placeholder="554732096098" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" /> Endereço
              </Label>
              <Input id="address" value={siteData.address} onChange={e => handleSiteChange('address', e.target.value)} />
            </div>

            <div className="border-t border-white/10 pt-4 mt-4">
              <p className="text-sm text-muted-foreground mb-4">Redes sociais</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-muted-foreground" /> Instagram
              </Label>
              <Input id="instagram" value={siteData.instagram} onChange={e => handleSiteChange('instagram', e.target.value)} placeholder="https://instagram.com/..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-muted-foreground" /> LinkedIn
              </Label>
              <Input id="linkedin" value={siteData.linkedin} onChange={e => handleSiteChange('linkedin', e.target.value)} placeholder="https://linkedin.com/company/..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube" className="flex items-center gap-2">
                <Youtube className="w-4 h-4 text-muted-foreground" /> YouTube
              </Label>
              <Input id="youtube" value={siteData.youtube} onChange={e => handleSiteChange('youtube', e.target.value)} placeholder="https://youtube.com/@..." />
            </div>

            <Button type="submit" disabled={isUpdating || isLoading}>
              {isUpdating ? 'Salvando...' : 'Salvar configurações'}
            </Button>
          </div>
        </form>

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
              <Input id="newPassword" type="password" value={passwordData.newPassword} onChange={e => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <Input id="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))} required />
            </div>
            <Button type="submit" disabled={isPasswordUpdating}>
              {isPasswordUpdating ? 'Atualizando...' : 'Atualizar senha'}
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
            <p>Sua conta está protegida com autenticação segura.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
