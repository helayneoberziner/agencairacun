import { supabase } from '@/integrations/supabase/client';

const IMG_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'];
const VID_EXT = ['mp4', 'webm', 'mov', 'm4v'];

export const isVideoFile = (nameOrType: string) => {
  const lower = nameOrType.toLowerCase();
  if (lower.startsWith('video/')) return true;
  const ext = lower.split('.').pop() || '';
  return VID_EXT.includes(ext);
};

export const isImageFile = (nameOrType: string) => {
  const lower = nameOrType.toLowerCase();
  if (lower.startsWith('image/')) return true;
  const ext = lower.split('.').pop() || '';
  return IMG_EXT.includes(ext);
};

export async function hashFile(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export interface UploadedAsset {
  id: string;
  path: string;
  url: string;
  folder: string;
  name: string;
  size: number;
  mime_type: string | null;
  hash: string | null;
  is_video: boolean;
  deduped: boolean;
}

export async function uploadWithDedup(file: File, folder: string): Promise<UploadedAsset> {
  const hash = await hashFile(file);
  // Dedup check
  const { data: existing } = await supabase
    .from('media_assets')
    .select('*')
    .eq('hash', hash)
    .maybeSingle();
  if (existing) {
    const url = supabase.storage.from('media').getPublicUrl(existing.path).data.publicUrl;
    return {
      id: existing.id,
      path: existing.path,
      url,
      folder: existing.folder,
      name: existing.name,
      size: existing.size,
      mime_type: existing.mime_type,
      hash: existing.hash,
      is_video: existing.is_video,
      deduped: true,
    };
  }

  const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(-60);
  const path = `${folder || 'home'}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`.replace(/\.[^.]+$/, '') + '.' + ext;

  const { error: upErr } = await supabase.storage.from('media').upload(path, file, { upsert: false, contentType: file.type || undefined });
  if (upErr) throw upErr;

  const is_video = isVideoFile(file.type || file.name);
  const url = supabase.storage.from('media').getPublicUrl(path).data.publicUrl;

  const { data: row, error: insErr } = await supabase
    .from('media_assets')
    .insert({
      path, folder: folder || 'home', name: file.name, mime_type: file.type || null,
      size: file.size, hash, is_video,
    })
    .select()
    .single();
  if (insErr) {
    // Best-effort cleanup of storage if DB insert fails
    await supabase.storage.from('media').remove([path]).catch(() => {});
    throw insErr;
  }

  return {
    id: row.id, path, url, folder: row.folder, name: row.name,
    size: row.size, mime_type: row.mime_type, hash: row.hash, is_video, deduped: false,
  };
}

export function publicUrl(path: string) {
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
}