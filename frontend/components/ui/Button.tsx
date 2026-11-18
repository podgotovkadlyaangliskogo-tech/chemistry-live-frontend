import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0E1A] active:scale-[0.98] select-none cursor-pointer';

  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
    xl: 'px-8 py-4 text-base sm:text-lg',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[#4F8EF7] to-[#6366F1] hover:from-[#3b7fe9] hover:to-[#5558e6] text-white shadow-[0_0_20px_rgba(79,142,247,0.35)] hover:shadow-[0_0_28px_rgba(79,142,247,0.5)] border border-white/10 focus:ring-[#4F8EF7]',
    secondary:
      'bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10 hover:border-white/20 focus:ring-slate-400',
    outline:
      'bg-transparent hover:bg-white/[0.05] text-[#4F8EF7] border border-[#4F8EF7]/40 hover:border-[#4F8EF7] focus:ring-[#4F8EF7]',
    danger:
      'bg-gradient-to-r from-[#FF4757] to-[#e03040] hover:from-[#e03040] hover:to-[#c42030] text-white shadow-[0_0_20px_rgba(255,71,87,0.35)] border border-white/10 focus:ring-red-500',
    ghost:
      'bg-transparent hover:bg-white/[0.06] text-slate-300 hover:text-white focus:ring-slate-400',
  };

  const disabledClasses =
    disabled || isLoading
      ? 'opacity-40 cursor-not-allowed pointer-events-none'
      : '';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />
          <span>Загрузка...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
