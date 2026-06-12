import type { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'danger';
}

const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-700',
  danger: 'bg-red-600 hover:bg-red-700',
};

export default function Button({
  loading,
  children,
  disabled,
  variant = 'primary',
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors duration-150 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]}`}
      {...rest}
    >
      {loading && <Loader2 size={16} className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
