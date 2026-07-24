import { supabase } from '@/integrations/supabase/client';

export async function sha256Hex(input: ArrayBuffer | string): Promise<string> {
  const data = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPassword(pw: string) { return sha256Hex(pw); }

export interface PreviewResult {
  blob: Blob;
  width: number;
  height: number;
  mime: string;
}

/** Generate a compressed preview from an image File. Optionally overlays a watermark string. */
export async function makeImagePreview(file: File, opts: { maxSize?: number; watermark?: string | null; quality?: number } = {}): Promise<PreviewResult> {
  const { maxSize = 2000, watermark = null, quality = 0.82 } = opts;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  if (watermark) {
    const fontSize = Math.max(14, Math.round(w * 0.028));
    ctx.font = `600 ${fontSize}px Inter, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 2;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    const pad = Math.round(fontSize * 0.8);
    ctx.strokeText(watermark, w - pad, h - pad);
    ctx.fillText(watermark, w - pad, h - pad);
  }
  const blob: Blob = await new Promise((resolve) => canvas.toBlob(b => resolve(b!), 'image/jpeg', quality));
  return { blob, width: w, height: h, mime: 'image/jpeg' };
}

export function isImage(file: File) { return file.type.startsWith('image/'); }
export function isVideo(file: File) { return file.type.startsWith('video/'); }

export interface UploadResult {
  original_path: string;
  preview_url: string | null;
  hash: string;
  width?: number;
  height?: number;
  size: number;
  mime_type: string;
  kind: 'image' | 'video';
  file_name: string;
}

export async function uploadGalleryFile(file: File, gallerySlug: string, opts: { watermark?: string | null } = {}): Promise<UploadResult> {
  const buf = await file.arrayBuffer();
  const hash = await sha256Hex(buf);
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
  const safe = file.name.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(-60);
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const originalPath = `${gallerySlug}/originals/${stamp}-${safe}`;
  const previewPath = `gallery-previews/${gallerySlug}/${stamp}-${hash.slice(0, 8)}.jpg`;

  // Upload original to private bucket
  const { error: upErr } = await supabase.storage
    .from('gallery-originals')
    .upload(originalPath, file, { upsert: false, contentType: file.type || undefined });
  if (upErr) throw upErr;

  const kind: 'image' | 'video' = isVideo(file) ? 'video' : 'image';
  let preview_url: string | null = null;
  let width: number | undefined;
  let height: number | undefined;

  if (kind === 'image') {
    const preview = await makeImagePreview(file, { watermark: opts.watermark, maxSize: 2000, quality: 0.82 });
    width = preview.width; height = preview.height;
    const { error: pErr } = await supabase.storage
      .from('media')
      .upload(previewPath, preview.blob, { upsert: false, contentType: 'image/jpeg' });
    if (pErr) throw pErr;
    preview_url = supabase.storage.from('media').getPublicUrl(previewPath).data.publicUrl;
  } else {
    // For videos, in the MVP we serve the same file via a "public-safe" copy in the media bucket
    // so the visitor can play it inline. Original stays private for the "download" flow.
    const publicVideoPath = `gallery-previews/${gallerySlug}/${stamp}-${safe}`;
    const { error: pErr } = await supabase.storage
      .from('media')
      .upload(publicVideoPath, file, { upsert: false, contentType: file.type || undefined });
    if (!pErr) {
      preview_url = supabase.storage.from('media').getPublicUrl(publicVideoPath).data.publicUrl;
    }
  }

  return {
    original_path: originalPath,
    preview_url,
    hash,
    width, height,
    size: file.size,
    mime_type: file.type || (kind === 'image' ? 'image/jpeg' : 'video/mp4'),
    kind,
    file_name: file.name,
  };
  void ext;
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}