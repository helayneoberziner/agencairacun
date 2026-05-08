import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { useProposalSuggestions, SuggestionCategory } from '@/hooks/useProposalSuggestions';

interface Props {
  category: SuggestionCategory;
  values: string[];
  onChange: (values: string[]) => void;
  label?: string;
  placeholder?: string;
}

const TagAutocompleteInput = ({ category, values, onChange, label, placeholder }: Props) => {
  const { suggestions, addSuggestion } = useProposalSuggestions(category);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const filtered = suggestions
    .filter(s => s.text.toLowerCase().includes(input.toLowerCase()))
    .filter(s => !values.includes(s.text))
    .slice(0, 8);

  const addItem = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || values.includes(trimmed)) return;
    onChange([...values, trimmed]);
    if (!suggestions.some(s => s.text.toLowerCase() === trimmed.toLowerCase())) {
      addSuggestion(trimmed).catch(() => {});
    }
    setInput('');
    setOpen(false);
  };

  const removeItem = (i: number) => onChange(values.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((v, i) => (
            <span key={`${v}-${i}`} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-sm">
              {v}
              <button type="button" onClick={() => removeItem(i)} className="hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div ref={wrapperRef} className="relative">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => { setInput(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addItem(input);
              }
            }}
            placeholder={placeholder ?? 'Digite e pressione Enter ou escolha uma sugestão'}
          />
          <Button type="button" variant="outline" size="icon" onClick={() => addItem(input)} disabled={!input.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {open && filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filtered.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => addItem(s.text)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                {s.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagAutocompleteInput;