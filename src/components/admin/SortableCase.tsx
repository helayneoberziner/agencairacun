import { type ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SortableCase({ id, title, disabled, children }: {
  id: string; title: string; disabled: boolean; children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn('relative border border-border rounded-lg bg-card overflow-hidden group', isDragging && 'z-30 opacity-60 ring-2 ring-primary')}>
      <Button type="button" variant="secondary" size="icon" disabled={disabled}
        className="absolute left-2 top-2 z-10 touch-none cursor-grab active:cursor-grabbing"
        title={`Arrastar ${title}`} aria-label={`Arrastar ${title}`} {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4" />
      </Button>
      {children}
    </div>
  );
}