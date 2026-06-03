import { useEffect, useRef, useCallback, PointerEvent } from 'react';

/**
 * Infinite, pause-on-interaction marquee. Resumes from the exact point.
 * The track must contain TWO identical groups of items so a seamless
 * loop is possible (translate by half the track width).
 */
export function useInfiniteMarquee(pxPerSecond = 40) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const dragRef = useRef<{ active: boolean; startX: number; startOffset: number } | null>(null);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    halfWidthRef.current = el.scrollWidth / 2;
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  useEffect(() => {
    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      if (!pausedRef.current && !dragRef.current?.active && halfWidthRef.current > 0) {
        offsetRef.current -= pxPerSecond * dt;
        if (offsetRef.current <= -halfWidthRef.current) {
          offsetRef.current += halfWidthRef.current;
        }
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [pxPerSecond]);

  const onPointerEnter = () => { pausedRef.current = true; };
  const onPointerLeave = () => {
    pausedRef.current = false;
    dragRef.current = null;
  };
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    pausedRef.current = true;
    dragRef.current = { active: true, startX: e.clientX, startOffset: offsetRef.current };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current?.active) return;
    const dx = e.clientX - dragRef.current.startX;
    let next = dragRef.current.startOffset + dx;
    const hw = halfWidthRef.current;
    if (hw > 0) {
      next = ((next % hw) - hw) % hw;
      if (next > 0) next -= hw;
    }
    offsetRef.current = next;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${next}px, 0, 0)`;
    }
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current) dragRef.current.active = false;
    pausedRef.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  return {
    trackRef,
    handlers: {
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  };
}