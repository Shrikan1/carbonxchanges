import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Label } from '../ui/Label';

export default function FormField({ field, value, onChange }) {
  const { name, label, type, options, required } = field;

  if (type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(name, e.target.checked)} />
        {label}
      </label>
    );
  }

  return (
    <div>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-600"> *</span>}
      </Label>

      {type === 'textarea' && (
        <Textarea id={name} value={value} onChange={(e) => onChange(name, e.target.value)} />
      )}

      {type === 'select' && (
        <Select id={name} value={value} onChange={(e) => onChange(name, e.target.value)}>
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </Select>
      )}

      {(type === 'text' || type === 'number' || type === 'date') && (
        <Input id={name} type={type} value={value} onChange={(e) => onChange(name, e.target.value)} />
      )}
    </div>
  );
}