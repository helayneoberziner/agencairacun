import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Lock, User, Shield, Globe, Phone, MapPin, Mail, MessageCircle, Image, Trash2, Upload, ExternalLink, Plus, X, ArrowUp, ArrowDown } from 'lucide-react';
import { socialPlatforms, getSocialLabel, getSocialIcon } from '@/lib/socialIcons';
import { Switch } from '@/components/ui/switch';
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

  const updateSocial = (i: number, patch: Partial<{ platform: string; url: string; isActive: boolean }>) => {
    setSiteData(prev => ({
      ...prev,
      socialNetworks: prev.socialNetworks.map((s, idx) => idx === i ? { ...s, ...patch } : s),
    }));
  };
  const addSocial = () => setSiteData(prev => ({
    ...prev,
    socialNetworks: [...prev.socialNetworks, { id: crypto.randomUUID(), platform: 'instagram', url: '', isActive: true }],
  }));
  const removeSocial = (i: number) => setSiteData(prev => ({
    ...prev,
    socialNetworks: prev.socialNetworks.filter((_, idx) => idx !== i),
  }));
  const moveSocial = (i: number, dir: -1 | 1) => setSiteData(prev => {
    const arr = [...prev.socialNetworks];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return prev;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    return { ...prev, socialNetworks: arr };
  });

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
            <ImageUpload
              label="Logo do site (exibida no header)"
              value={siteData.logoUrl}
              onChange={(url) => handleSiteChange('logoUrl', url)}
              folder="branding"
            />
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

            <div className="space-y-2">
              <Label htmlFor="clientAreaUrl" className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-muted-foreground" /> Link da Área do Cliente
              </Label>
              <Input id="clientAreaUrl" value={siteData.clientAreaUrl} onChange={e => handleSiteChange('clientAreaUrl', e.target.value)} placeholder="https://app.racun.com.br" />
              <p className="text-xs text-muted-foreground">Esse link é usado no botão "Área do Cliente" do site.</p>
            </div>

            <div className="border-t border-white/10 pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">Redes sociais</p>
                <Button type="button" variant="outline" size="sm" onClick={addSocial}>
                  <Plus className="w-3 h-3 mr-1" /> Adicionar
                </Button>
              </div>
              <div className="space-y-3">
                {siteData.socialNetworks.map((s, i) => {
                  const Icon = getSocialIcon(s.platform);
                  return (
                    <div key={s.id} className="flex items-center gap-2 bg-secondary/30 border border-border rounded-lg p-2">
                      <Icon className="w-4 h-4 text-muted-foreground shrink-0 ml-1" />
                      <select
                        value={s.platform}
                        onChange={(e) => updateSocial(i, { platform: e.target.value })}
                        className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                      >
                        {socialPlatforms.map(p => <option key={p} value={p}>{getSocialLabel(p)}</option>)}
                      </select>
                      <Input
                        value={s.url}
                        onChange={(e) => updateSocial(i, { url: e.target.value })}
                        placeholder="https://..."
                        className="h-9 text-sm"
                      />
                      <Switch checked={s.isActive} onCheckedChange={(v) => updateSocial(i, { isActive: v })} />
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveSocial(i, -1)}>
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveSocial(i, 1)}>
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeSocial(i)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  );
                })}
                {siteData.socialNetworks.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
                    Nenhuma rede social cadastrada.
                  </p>
                )}
              </div>
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
