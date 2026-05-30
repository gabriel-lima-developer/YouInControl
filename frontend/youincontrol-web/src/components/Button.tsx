import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-40',
  secondary: 'border border-border bg-card text-foreground hover:bg-secondary disabled:text-muted-foreground',
  ghost: 'text-muted-foreground hover:bg-secondary disabled:text-muted-foreground',
  danger: 'text-destructive hover:bg-destructive/10 disabled:text-destructive/40',
};

export function Button({ children, className = '', variant = 'primary', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:active:scale-100 ${variants[variant]} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
