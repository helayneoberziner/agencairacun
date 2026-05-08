import { useEffect } from 'react';

export function useDocumentMeta(title?: string, description?: string) {
  useEffect(() => {
    if (title) {
      const prev = document.title;
      document.title = title;
      return () => { document.title = prev; };
    }
  }, [title]);

  useEffect(() => {
    if (!description) return;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const created = !meta;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    const prev = meta.content;
    meta.content = description;
    return () => {
      if (created) meta?.remove();
      else if (meta) meta.content = prev;
    };
  }, [description]);
}