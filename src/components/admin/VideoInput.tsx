import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Youtube, FolderOpen, Trash2 } from 'lucide-react';
import MediaPicker from './MediaPicker';
import { parseYouTubeId, getYouTubeThumb, isFileVideoUrl } from '@/lib/videoUtils';

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

/**
 * Hybrid video input: accepts a YouTube URL (preferred, no storage) OR
 * lets the admin pick an uploaded file from the media library.
 */
const VideoInput = ({ label, value, onChange, folder = 'cases' }: Props) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const ytId = parseYouTubeId(value);
  const isFile = isFileVideoUrl(value);

  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-start">
        <div className="flex-1 space-y-2">
          <div className="relative">
            <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Cole o link do YouTube (preferencial) — youtube.com / youtu.be / shorts"
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => setPickerOpen(true)}>
              <FolderOpen className="w-4 h-4 mr-1" /> Escolher arquivo da biblioteca
            </Button>
            {value && (
              <Button type="button" size="sm" variant="ghost" onClick={() => onChange('')}>
                <Trash2 className="w-4 h-4 mr-1" /> Limpar
              </Button>
            )}
          </div>
        </div>

        {/* Preview */}
        {(ytId || isFile) && (
          <div className="w-full md:w-48 aspect-video rounded-lg overflow-hidden border border-border bg-muted relative">
            {ytId ? (
              <>
                <img src={getYouTubeThumb(ytId, 'hq')} alt="thumb" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 bg-red-600/90 text-white text-[10px] px-1.5 py-0.5 rounded">YouTube</span>
              </>
            ) : (
              <>
                <video src={value} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 bg-background/80 text-foreground text-[10px] px-1.5 py-0.5 rounded">Arquivo</span>
              </>
            )}
          </div>
        )}
      </div>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => onChange(url)}
        folder={folder}
        accept="video"
      />
    </div>
  );
};

export default VideoInput;