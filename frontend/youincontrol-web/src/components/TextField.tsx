import type { InputHTMLAttributes } from 'react';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helperText?: string;
};

export function TextField({ className = '', helperText, id, label, ...props }: TextFieldProps) {
  const inputId = id ?? props.name;

  return (
    <label className="grid gap-1.5 text-sm font-medium text-stone-700" htmlFor={inputId}>
      {label}
      <input
        className={`h-11 rounded-md border border-stone-300 bg-white px-3 text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 disabled:bg-stone-100 ${className}`}
        id={inputId}
        {...props}
      />
      {helperText ? <span className="text-xs font-normal text-stone-500">{helperText}</span> : null}
    </label>
  );
}
