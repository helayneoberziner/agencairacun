import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Lock, User, Shield, Globe, Phone, MapPin, Instagram, Youtube, Mail, MessageCircle, Image, Trash2, Upload } from 'lucide-react';
import { useClientLogos, ClientLogo } from '@/hooks/useClientLogos';
import ImageUpload from '@/components/admin/ImageUpload';

const AdminSettings = () => {
  const { user } = useAuth();
  const { settings, isLoading, updateSettings, isUpdating } = useSiteSettings();
  const { logos, uploadLogo, deleteLogo, updateLogos, isUpdating: isLogosUpdating } = useClientLogos();

  const [siteData, setSiteData] = useState(settings);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [logoName, setLogoName] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

        {/* Client Logos */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Image className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-display font-semibold">Logos de clientes</h2>
          </div>

          {/* Current logos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {logos.map((logo) => (
              <div key={logo.id} className="relative group rounded-lg border border-white/10 bg-white/5 p-3 flex flex-col items-center gap-2">
                <img src={logo.image_url} alt={logo.name} className="h-12 object-contain" />
                <span className="text-xs text-muted-foreground truncate w-full text-center">{logo.name}</span>
                <button
                  onClick={() => deleteLogo(logo, logos)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-destructive/80 text-destructive-foreground"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Upload new logo */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="logoName">Nome do cliente</Label>
              <Input id="logoName" value={logoName} onChange={e => setLogoName(e.target.value)} placeholder="Nome do cliente" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoFile">Imagem da logo</Label>
              <Input id="logoFile" type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)} />
            </div>
            <Button
              disabled={!logoName || !logoFile || isUploading}
              onClick={async () => {
                if (!logoFile || !logoName) return;
                setIsUploading(true);
                try {
                  const newLogo = await uploadLogo(logoFile, logoName);
                  await updateLogos([...logos, newLogo]);
                  setLogoName('');
                  setLogoFile(null);
                  toast.success('Logo adicionada!');
                } catch (err) {
                  console.error(err);
                  toast.error('Erro ao fazer upload da logo');
                } finally {
                  setIsUploading(false);
                }
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? 'Enviando...' : 'Adicionar logo'}
            </Button>
          </div>
        </div>

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
