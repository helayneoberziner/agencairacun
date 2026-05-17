import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Trash2, Loader2, ImageIcon, FolderOpen, Video } from 'lucide-react';
import MediaPicker from './MediaPicker';
import { uploadWithDedup, isVideoFile } from '@/lib/mediaLibrary';
import { toast } from 'sonner';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  accept?: 'image' | 'video' | 'all';
}

const ImageUpload = ({ label, value, onChange, folder = 'home', accept = 'image' }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadWithDedup(file, folder);
      if (res.deduped) toast.info('Arquivo já existia — reutilizando da biblioteca.');
      onChange(res.url);
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Erro ao enviar arquivo');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = () => onChange('');

  const valueIsVideo = value ? isVideoFile(value) : false;
  const acceptAttr = accept === 'video' ? 'video/*' : accept === 'image' ? 'image/*' : 'image/*,video/*';

  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-start gap-4">
        {value ? (
          <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-border group">
            {valueIsVideo ? (
              <video src={value} muted playsInline className="w-full h-full object-cover" />
            ) : (
              <img src={value} alt={label} className="w-full h-full object-cover" />
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 p-1 rounded bg-destructive/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-40 h-24 rounded-lg border border-dashed border-border flex items-center justify-center bg-secondary/20">
            {accept === 'video' ? <Video className="w-8 h-8 text-muted-foreground/40" /> : <ImageIcon className="w-8 h-8 text-muted-foreground/40" />}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={acceptAttr}
            onChange={handleUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-1" />
            )}
            {uploading ? 'Enviando...' : accept === 'video' ? 'Enviar vídeo' : accept === 'all' ? 'Enviar arquivo' : 'Enviar imagem'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setPickerOpen(true)}
          >
            <FolderOpen className="w-4 h-4 mr-1" />
            Escolher da biblioteca
          </Button>
        </div>
      </div>
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => onChange(url)}
        folder={folder}
        accept={accept}
      />
    </div>
  );
};

export default ImageUpload;
