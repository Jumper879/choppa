import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-choppa-ink">
      {children}
    </label>
  );
}

const inputClasses =
  "w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-choppa-ink placeholder:text-choppa-ink-soft/60 outline-none transition-colors focus:border-choppa-red focus:ring-2 focus:ring-choppa-red/15 disabled:cursor-not-allowed disabled:bg-black/[0.03] disabled:text-choppa-ink-soft";

export function TextField({
  label,
  error,
  id,
  ...props
}: { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input id={id} className={inputClasses} {...props} />
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

export function TextAreaField({
  label,
  id,
  ...props
}: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <textarea id={id} className={`${inputClasses} min-h-24 resize-none`} {...props} />
    </div>
  );
}

export function SelectField({
  label,
  id,
  children,
  ...props
}: { label: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <select id={id} className={`${inputClasses} appearance-none`} {...props}>
        {children}
      </select>
    </div>
  );
}
