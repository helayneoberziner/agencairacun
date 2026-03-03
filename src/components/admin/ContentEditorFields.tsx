import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}

export const Field = ({ label, value, onChange, multiline, placeholder }: FieldProps) => (
  <div className="space-y-1.5">
    <Label className="text-xs text-muted-foreground">{label}</Label>
    {multiline ? (
      <Textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={2} />
    ) : (
      <Input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    )}
  </div>
);

interface ListEditorProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, update: (field: string, value: string) => void) => React.ReactNode;
  createItem: () => T;
  label: string;
}

export function ListEditor<T>({ items, onChange, renderItem, createItem, label }: ListEditorProps<T>) {
  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...items];
    (updated[index] as Record<string, unknown>)[field] = value;
    onChange(updated);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    onChange([...items, createItem()]);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      {items.map((item, index) => (
        <div key={index} className="relative border border-border rounded-lg p-4 space-y-2">
          {renderItem(item, index, (field, value) => updateItem(index, field, value))}
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="absolute top-2 right-2 p-1 rounded text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus className="w-4 h-4 mr-1" />
        Adicionar
      </Button>
    </div>
  );
}

interface StringListEditorProps {
  items: string[];
  onChange: (items: string[]) => void;
  label: string;
}

export const StringListEditor = ({ items, onChange, label }: StringListEditorProps) => (
  <div className="space-y-3">
    <Label className="text-sm font-medium">{label}</Label>
    {items.map((item, index) => (
      <div key={index} className="flex gap-2">
        <Input
          value={item}
          onChange={e => {
            const updated = [...items];
            updated[index] = e.target.value;
            onChange(updated);
          }}
        />
        <button
          type="button"
          onClick={() => onChange(items.filter((_, i) => i !== index))}
          className="p-2 rounded text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ))}
    <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, ''])}>
      <Plus className="w-4 h-4 mr-1" />
      Adicionar
    </Button>
  </div>
);

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

export const SectionCard = ({ title, children }: SectionCardProps) => (
  <div className="glass-card p-6 space-y-4">
    <h3 className="font-display font-semibold text-lg border-b border-border pb-3">{title}</h3>
    {children}
  </div>
);
