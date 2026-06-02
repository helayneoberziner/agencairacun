// Utilities for hybrid video handling (YouTube + uploaded files)

export function parseYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

export function getYouTubeThumb(id: string, quality: 'max' | 'hq' | 'sd' = 'max'): string {
  const q = quality === 'max' ? 'maxresdefault' : quality === 'sd' ? 'sddefault' : 'hqdefault';
  return `https://i.ytimg.com/vi/${id}/${q}.jpg`;
}

export function getYouTubeEmbedUrl(id: string, opts: { autoplay?: boolean } = {}): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    ...(opts.autoplay ? { autoplay: '1' } : {}),
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

export function isFileVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);
}

export function resolveVideoCover(opts: {
  imageUrl?: string | null;
  videoUrl?: string | null;
  youtubeId?: string | null;
}): string | null {
  if (opts.imageUrl) return opts.imageUrl;
  const id = opts.youtubeId || parseYouTubeId(opts.videoUrl);
  if (id) return getYouTubeThumb(id);
  return null;
}